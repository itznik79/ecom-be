# Microservices Monorepo Starter

A scalable Monorepo setup using **NestJS**, **Turborepo**, and **Sequelize**.

## 🏗 Project Structure

This repository is organized as a monorepo using `npm workspaces` and `Turborepo`.

*   **apps/**: Contains independent microservices.
    *   `auth`: Authentication Service.
    *   `user`: User Management Service.
    *   `category`: Category Service.
*   **packages/**: Shared libraries used across services.
    *   `database`: Shared database connection logic.
    *   `common`: Shared utilities (Response Wrappers, Constants, Logger).

## 📚 Masterclass Implementation Guides
For a "perfect" step-by-step walkthrough of our enterprise systems:
- **[Masterclass: Google Social Login](docs/guides/GOOGLE_LOGIN_MASTERCLASS.md)**
- **[Masterclass: PBAC Authorization](docs/guides/PBAC_MASTERCLASS.md)**
- **[Masterclass: Stateful Session Management](docs/guides/STATEFUL_SESSION_MASTERCLASS.md)**
- **[Masterclass: API Gateway & Microservices](docs/guides/API_GATEWAY_MASTERCLASS.md)**

## 🏗 System Architecture
- **[Social Login Flow (Google)](docs/architecture/social-login.md)**
- **[Token & Session Management](docs/architecture/token-management.md)**
- **[API Gateway Architecture](docs/gateway/api-gateway.md)**

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites
*   Node.js (v18+)
*   Docker & Docker Compose

### Fast Track Setup

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Setup**
    Ensure `.env` exists in the root with the following configuration (updated for custom ports):
    ```env
    # Database Configuration
    DB_HOST=localhost
    DB_PORT=5436
    DB_USER=postgres
    DB_PASSWORD=password
    DB_NAME=ecommerce
    AUTH_DB_NAME=auth_db
    USER_DB_NAME=user_db
    CATEGORY_DB_NAME=category_db

    # Redis Configuration
    REDIS_HOST=localhost
    REDIS_PORT=6380

    # Node Environment
    NODE_ENV=development
    ```

3.  **Start Infrastructure (Postgres & Redis)**
    This will start `ecom-be-postgres` (port 5436) and `ecom-be-redis` (port 6380).
    ```bash
    npm run infra:up
    ```

4.  **Build Shared Packages**
    **Critical Step:** You must build the shared libraries before starting the apps.
    ```bash
    npm run build
    ```

5.  **Run Migrations**
    Initialize the database schemas for each service.
    ```bash
    # Run in parallel (future improvement) or sequentially in separate terminals
    cd apps/auth && npm run migrate
    cd apps/user && npm run migrate
    cd apps/category && npm run migrate
    ```

6.  **Start All Services**
    This starts `auth`, `user`, and `category` services in parallel.
    ```bash
    npm run start
    ```

## 🛠 Troubleshooting

### Missing Databases
If services fail with `database "auth_db" does not exist`, the initialization script might have been skipped.
**Fix:** Manually create the databases:
```bash
docker exec -i ecom-be-postgres psql -U postgres -d ecommerce -c "CREATE DATABASE auth_db; CREATE DATABASE user_db; CREATE DATABASE category_db;"
```

### Port Conflicts
*   **Postgres** runs on **5436** (mapped to 5432 internally).
*   **Redis** runs on **6380** (mapped to 6379 internally).
Ensure these ports are free on your machine.
