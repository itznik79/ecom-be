# System Architecture

## Overview
This project is a **Monorepo** following a Microservices architecture, built with **NestJS**, **Sequelize**, and **PostgreSQL**. It uses **Turborepo** for build orchestration.

## Key Components

### 1. Services (Applications)
| Service | Path | Port | Description | DB Name |
|---------|------|------|-------------|---------|
| **Auth** | `apps/auth` | 3001 | Handles authentication, sessions, and user identity. | `auth_db` |
| **User** | `apps/user` | 3002 | Manages user profiles and data. | `user_db` |
| **Category** | `apps/category` | 3003 | Manages product categories. | `category_db` |

### 2. Shared Packages (`packages/`)
- **@app/common**: Shared utilities, logging, exceptions, and DTOs.
- **@app/database**: Centralized database configuration, entities, and migrations.
- **@app/tsconfig**: Shared TypeScript configuration bases.

### 3. Infrastructure
The project runs on a local Dockerized infrastructure (`docker-compose.infra.yml`).

- **PostgreSQL 16**:
  - **Port**: `5435`
  - **Databases**: `auth_db`, `user_db`, `category_db`, `ecommerce` (legacy).
  - **Initialization**: Automated via `scripts/init-db.sh`.
- **Redis 7**:
  - **Port**: `6379`
  - Used for caching and session management.

## Data Flow
1.  Requests hit the individual services (Auth/User/Category).
2.  Each service connects to its **own dedicated database** within the Postgres cluster.
3.  Services use shared logging (Winston) and database entities (Sequelize Models) from the shared packages.

## Build System
- **Turborepo** manages dependencies and tasks.
- Shared packages must be built (`npm run build`) before applications can compile.
- Applications run in `dev` mode with `npm run dev` (NestJS CLI).
