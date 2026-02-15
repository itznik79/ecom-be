# HTTP API Gateway

The single entry point for all client requests, orchestrating communication between microservices.

## Overview
The API Gateway handles routing, CORS, and cookie parsing, acting as a proxy to individual microservices (`Auth`, `User`, `Category`, `Product`).

## Key Responsibilities
1. **Reverse Proxying**: Routes requests to the correct service internal URL.
2. **CORS Enforcement**: Sanitizes cross-origin requests for the frontend.
3. **Cookie Centralization**: Parses `HttpOnly` cookies for token management.
4. **Load Balancing**: (Future-ready) Can be scaled independently.

## Connectivity
The gateway maps hostnames/ports to internal microservice URLs using `http-proxy-middleware`.

### Port Mapping
- **Local Development**: `http://localhost:4000`
- **Internal Routes**:
  - `/auth/*` -> `auth-service:3001`
  - `/users/*` -> `user-service:3001`
  - `/products/*` -> `product-service:3004`

## Multi-Service Flow (Example: Login)
1. User sends request to Gateway `:4000/auth/login`.
2. Gateway proxies to `Auth Service`.
3. `Auth Service` validates credentials and calls `User Service` via Gateway internal URL to sync state.
4. `Auth Service` sends response back through Gateway.

## Configuration
Controlled via `apps/api-gateway/src/main.ts` and `docker-compose.yml`.
