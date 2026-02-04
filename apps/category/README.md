# Category Service

Category management service for the web-app-starter monorepo.

## 📋 Overview

The Category Service handles:
- Category creation and management
- Category hierarchy and organization
- Category listing and filtering
- Category validation and business logic

## 🚀 Quick Start

### Start Development Server

```bash
cd apps/category
npm install
npm run start:dev
```

The service will run on **http://localhost:3002**

### Using Docker

```bash
# From root directory
docker-compose up category-service
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
│   └── category/
│       ├── category.module.ts
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
- **PostgreSQL**: Category data storage

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

### Categories

**GET /categories**
- Retrieve all categories
- Query parameters: `page`, `limit`, `search`

**GET /categories/:id**
- Retrieve a specific category

**POST /categories**
- Create a new category
- Requires authentication

**PUT /categories/:id**
- Update a category
- Requires authentication

**DELETE /categories/:id**
- Delete a category
- Requires authentication

## 🛠️ Configuration

See [src/config/app.config.ts](src/config/app.config.ts) for service configuration options.

## 🔄 Database Migrations

Run migrations for the category service:

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
PORT=3012 npm run start:dev
```

### Service Not Starting
Check logs for errors:
```bash
npm run start:dev 2>&1 | head -50
```

## 📚 Related Services

- [Auth Service](../auth/README.md)
- [User Service](../user/README.md)

## 📝 License

This project is private.
