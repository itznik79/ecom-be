# User Service

User management and profile service for the web-app-starter monorepo.

## 📋 Overview

The User Service handles:
- User profile management
- User information updates
- User listing and search
- User validation and business logic
- Account management

## 🚀 Quick Start

### Start Development Server

```bash
cd apps/user
npm install
npm run start:dev
```

The service will run on **http://localhost:3003**

### Using Docker

```bash
# From root directory
docker-compose up user-service
```

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run start` | Start the service |
| `npm run start:dev` | Start in watch mode (auto-reload) |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |

## 📁 Project Structure

```
src/
├── app.module.ts           # Root module
├── main.ts                 # Entry point
├── config/
│   └── app.config.ts       # Service configuration
├── infrastructure/
│   └── database/
│       └── database.module.ts
├── modules/
│   └── user/
│       ├── user.module.ts
│       ├── controllers/     # API endpoints
│       ├── services/        # Business logic
│       ├── dao/             # Data access layer
│       ├── dto/             # Data transfer objects
│       ├── exceptions/      # Custom exceptions
│       ├── guards/          # Route guards
│       ├── interfaces/      # TypeScript interfaces
│       ├── types/           # Type definitions
│       └── validators/      # Input validation
└── common/                  # Shared utilities
    └── constants/
```

## 🔌 Dependencies

### External Services
- **PostgreSQL**: User data storage

### npm Packages
- `@nestjs/*`: NestJS framework
- `@app/common`: Shared workspace package
- `@app/database`: Database configuration

## 📝 Environment Variables

Ensure these variables are set in `.env`:

```env
# Database
DB_HOST=localhost
DB_PORT=5436
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=ecommerce

# Service
NODE_ENV=development
PORT=3001
```

## 📡 API Endpoints

### Users

**GET /users**
- Retrieve all users
- Query parameters: `page`, `limit`, `search`
- Requires authentication

**GET /users/:id**
- Retrieve a specific user profile
- Requires authentication

**PUT /users/:id**
- Update user profile
- Requires authentication

**DELETE /users/:id**
- Delete user account
- Requires authentication and authorization

**GET /users/:id/profile**
- Retrieve detailed user profile
- Requires authentication

**PUT /users/:id/profile**
- Update detailed user profile
- Requires authentication

## 🛠️ Configuration

See [src/config/app.config.ts](src/config/app.config.ts) for service configuration options.

## 🔄 Database Migrations

Run migrations for the user service:

```bash
npm run migrate
```

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:cov
```

## 🐛 Troubleshooting

### Connection Refused
- Ensure PostgreSQL is running on port 5436 (mapped in docker-compose)
- Check `.env` database credentials
- Verify `DB_HOST` is correct (localhost for local, postgres in Docker)

### Port Already in Use
If port 3001 is in use, you can change it:
```bash
PORT=3013 npm run start:dev
```

### Service Not Starting
Check logs for errors:
```bash
npm run start:dev 2>&1 | head -50
```

## 🔐 Authentication

All endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <jwt-token>
```

Obtain a token by authenticating with the Auth Service.

## 📚 Related Services

- [Auth Service](../auth/README.md)
- [Category Service](../category/README.md)

## 📝 License

This project is private.
