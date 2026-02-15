# Masterclass: API Gateway & Microservices Connectivity

This guide explains how the API Gateway orchestrates traffic and enables secure communication between your frontend and microservices.

---

## 1. The Gateway as a Reverse Proxy
The gateway uses `http-proxy-middleware` to map public endpoints to internal microservice URLs.

**Location**: `apps/api-gateway/src/app.module.ts`

```typescript
// Example Proxy Mapping
{
  path: '/auth',
  target: 'http://auth-service:3001',
}
```

## 2. Production Ready Setup (`main.ts`)
The Gateway must be configured correctly for cross-microservice token management.
**Location**: `apps/api-gateway/src/main.ts`

### A. CORS Configuration
To allow a separate frontend to send secure cookies (like `refreshToken`), the `credentials: true` flag is mandatory.

```typescript
app.enableCors({
    origin: ['http://localhost:3000'], // Your Frontend URL
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
});
```

### B. Cookie Parsing
The Gateway acts as the entry point for parsing `HttpOnly` cookies.
```typescript
import cookieParser from 'cookie-parser';
app.use(cookieParser());
```

## 3. Inter-Service Communication
When services need to talk to each other (e.g., Auth calling User to create a profile), they use internal Docker network URLs.

**Example Service Call**:
```typescript
// In AuthService
const userServiceUrl = this.configService.get('USER_SERVICE_URL'); 
// Resolves to http://user-service:3001
await firstValueFrom(this.httpService.post(userServiceUrl, payload));
```

## 4. Port Architecture
- **API Gateway**: `4000` (Public Entry)
- **Auth Service**: `3001` (Internal)
- **User Service**: `3001` (Internal, mapped to `3003` externally)
- **Redis**: `6380` (External) / `6379` (Internal)

---
**Next Step**: Understand how sessions are managed in the [Stateful Session Masterclass](./STATEFUL_SESSION_MASTERCLASS.md).
