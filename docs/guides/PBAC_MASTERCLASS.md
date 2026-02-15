# Masterclass: Permission-Based Access Control (PBAC)

This guide details the implementation of a high-performance, enterprise-grade authorization system using Redis caching.

---

## 1. The Strategy: Action over Roles
Instead of checking if a user is an "ADMIN", we check if they have a specific permission like `product.create`. This makes the system flexible and scalable.

## 2. Core Components

### A. The Decorator (`@RequirePermissions`)
We use a decorator to attach required permission keys to controller methods.
**Location**: `packages/common/src/decorators/permissions.decorator.ts`

```typescript
export const PERMISSIONS_KEY = 'permissions';
export const RequirePermissions = (...permissions: string[]) => 
    SetMetadata(PERMISSIONS_KEY, permissions);
```

### B. Accessing Permissions (DAO)
The `UserDao` is responsible for aggregating all permissions from all roles assigned to a user.
**Location**: `apps/user/src/modules/user/user.dao.ts`

```typescript
async getUserPermissions(id: string) {
    const user = await this.userModel.findByPk(id, {
        include: [{ 
            model: Role, 
            include: [{ model: Permission }] 
        }]
    });
    // Flattening deeply nested permissions into a unique key set
    const keys = user.roles.flatMap(role => role.permissions.map(p => p.key));
    return Array.from(new Set(keys));
}
```

### C. Redis Caching (Auth Service)
To avoid hitting the database on every request, we cache these permissions in Redis during login or token refresh.
**Location**: `apps/auth/src/modules/auth/auth.service.ts`

```typescript
private async cachePermissions(userId: string) {
    const response = await this.userService.getUserPermissions(userId);
    const permissions = response.data;
    await this.redisService.set(`perms:${userId}`, JSON.stringify(permissions), 3600);
}
```

### D. The Enforcement (Guard)
The `PermissionsGuard` checks the Redis cache for every protected request.
**Location**: `apps/auth/src/guards/permissions.guard.ts`

```typescript
async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.get(PERMISSIONS_KEY, ...);
    const userId = context.switchToHttp().getRequest().user.id;
    
    const cached = await this.redisService.get(`perms:${userId}`);
    const userPerms = JSON.parse(cached);
    
    return required.every(p => userPerms.includes(p));
}
```

## 3. How to Use
Simply apply the decorator and the guard to your controllers.

```typescript
@Post()
@RequirePermissions('product.create')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
async createProduct() { ... }
```

---
**Next Step**: Learn how these services connect in the [API Gateway Masterclass](./API_GATEWAY_MASTERCLASS.md).
