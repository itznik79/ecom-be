# Auth Service

Authentication and authorization service for the web-app-starter monorepo.

## 📋 Overview

The Auth Service handles:
- User authentication (login/signup)
- JWT token generation and validation
- Password hashing and verification
- Authentication guards and strategies
- Session management

## 🚀 Quick Start

### Start Development Server

```bash
cd apps/auth
npm install
npm run start:dev
```

The service will run on **http://localhost:3001**

### Using Docker

```bash
# From root directory
docker-compose up auth-service
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
│   ├── cache/
│   │   └── redis.module.ts # Redis setup
│   └── database/
│       └── database.module.ts
├── modules/
│   └── auth/
│       ├── auth.module.ts
│       ├── controllers/
│       │   └── auth.controller.ts
│       ├── services/
│       │   └── auth.service.ts
│       ├── guards/
│       │   └── auth.guard.ts
│       ├── strategies/
│       │   └── local.strategy.ts
│       ├── dto/
│       │   └── login.dto.ts
│       ├── dao/
│       │   └── auth.dao.ts
│       ├── exceptions/
│       │   └── auth.exception.ts
│       ├── interfaces/
│       │   └── auth.interface.ts
│       ├── types/
│       └── validators/
└── common/                 # Shared utilities
    ├── decorators/
    ├── guards/
    ├── interceptors/
    ├── exceptions/
    ├── interfaces/
    └── utils/
```

## 🔌 Dependencies

### External Services
- **PostgreSQL**: User credentials storage
- **Redis**: Session and token caching

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

# Redis
REDIS_HOST=localhost
REDIS_PORT=6380

# Service
NODE_ENV=development
PORT=3001
```

## 🔐 API Endpoints

### Authentication

**POST /auth/login**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**POST /auth/signup**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name"
}
```

**GET /auth/profile**
- Requires JWT token in Authorization header

## 🛠️ Configuration

See [src/config/app.config.ts](src/config/app.config.ts) for service configuration options.

## 🔄 Database Migrations

Run migrations for the auth service:

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

### Redis Connection Error
- Ensure Redis is running on port 6380 (mapped in docker-compose)
- Check `REDIS_HOST` in `.env`

### Port Already in Use
If port 3001 is in use, you can change it:
```bash
PORT=3011 npm run start:dev
```

## 📚 Related Services

- [Category Service](../category/README.md)
- [User Service](../user/README.md)

## 📝 License

This project is private.
