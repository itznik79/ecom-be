# Microservices Monorepo Starter

A scalable Monorepo setup using **NestJS**, **Turborepo**, and **Sequelize**.

## 🏗 Project Structure

This repository is organized as a monorepo using `npm workspaces` and `Turborepo`.

*   **apps/**: Contains independent microservices.
    *   `auth`: Authentication Service (JWT, Login, Register).
    *   `user`: User Management Service (Profiles, Roles, Permissions).
    *   `category`: Category Service (Product Taxonomy).
*   **packages/**: Shared libraries used across services.
    *   `database`: Shared database connection logic.
    *   `common`: Shared utilities (Response Wrappers, Constants, Logger).
*   **scripts/**: Utility scripts for setup and maintenance.

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+)
*   Docker & Docker Compose (for Postgres/Redis)

### Installation

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Setup**
    Copy `.env.example` (if exists) or create `.env` in the root (see `env.example` content below).

3.  **Start Infrastructure**
    ```bash
    docker-compose up -d
    ```

4.  **Run Migrations**
    Initialize the database tables for all services.
    ```bash
    # Run inside each app directory (TEMPORARY: automation script coming soon)
    # cd apps/auth && npx sequelize-cli db:migrate
    # cd apps/user && npx sequelize-cli db:migrate
    # cd apps/category && npx sequelize-cli db:migrate
    ```

5.  **Start Development**
    Run all apps in parallel using Turborepo.
    ```bash
    npm run dev
    ```

## 🛠 Features

*   **Microservices Architecture**: Modular and independently scalable services.
*   **Shared Code**: `packages/common` ensures strict typing (`ApiResponse`, `MESSAGES`) consistency across all APIs.
*   **Database**: PostgreSQL with Sequelize ORM.
*   **Type Safety**: All models use TypeScript Interfaces for compile-time validation.
*   **Repo Tooling**: Turborepo for efficient builds and caching.

## 📝 Recent Updates
*   **Refactored Models**: Services now use Interface-based models (`User extends Model<IUser>`).
*   **Centralized Utilities**: Response formats and Error messages moved to `@app/common`.
