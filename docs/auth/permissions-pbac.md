# Permission-Based Access Control (PBAC)

Granular, high-performance authorization system using Redis caching.

## Why PBAC?
Instead of checking for roles (like `ADMIN`), we check for specific permissions (like `product.update`). This allows for dynamic roles where "Catalog Manager" and "Super Admin" can share permissions without code changes.

## Architecture
1. **Source of Truth**: Permissions are stored in Postgres (`permissions` and `role_permissions` tables).
2. **Aggregation**: On login, `AuthService` calls `UserService` to get all unique permission keys for the user.
3. **Caching**: Permissions are stored in Redis (`perms:{userId}`) for the duration of the session.
4. **Enforcement**: The `PermissionsGuard` checks Redis on every request instead of querying Postgres.

## Usage
Add the decorator to any controller method:

```typescript
import { RequirePermissions } from '@app/common';

@Post()
@RequirePermissions('product.create')
async createProduct(...) { ... }
```

## Guard Requirements
To use `PermissionsGuard`, ensure the user is authenticated via `AuthGuard`:

```typescript
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
```

## Key Files
- **Decorator**: `packages/common/src/decorators/permissions.decorator.ts`
- **Guard**: `apps/auth/src/guards/permissions.guard.ts`
- **Logic**: `apps/user/src/modules/user/user.dao.ts`
