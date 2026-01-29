#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function step(number, message) {
  log(`\n[${number}] ${message}`, 'blue');
}

function success(message) {
  log(`✓ ${message}`, 'green');
}

function error(message) {
  log(`✗ ${message}`, 'red');
}

function warn(message) {
  log(`⚠ ${message}`, 'yellow');
}

async function setup() {
  try {
    log('\n╔═══════════════════════════════════════════════════════════╗', 'blue');
    log('║     Web App Starter - Complete Setup & Initialization      ║', 'blue');
    log('╚═══════════════════════════════════════════════════════════╝\n', 'blue');

    // Step 1: Check Node version
    step(1, 'Checking Node.js version');
    try {
      const nodeVersion = execSync('node --version', { encoding: 'utf-8' }).trim();
      const majorVersion = parseInt(nodeVersion.split('.')[0].slice(1));
      if (majorVersion >= 18) {
        success(`Node.js ${nodeVersion} installed`);
      } else {
        error(`Node.js 18+ required, found ${nodeVersion}`);
        process.exit(1);
      }
    } catch (err) {
      error('Node.js not found');
      process.exit(1);
    }

    // Step 2: Check .env file
    step(2, 'Checking environment configuration');
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
      success('.env file exists');
    } else {
      error('.env file not found, creating default...');
      const envContent = `# Database Configuration
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=ecommerce

# Redis Configuration
REDIS_HOST=redis
REDIS_PORT=6379

# Node Environment
NODE_ENV=development
`;
      fs.writeFileSync(envPath, envContent);
      success('.env file created');
    }

    // Step 3: Install dependencies
    step(3, 'Installing npm dependencies');
    log('This may take a few minutes...\n');
    try {
      execSync('npm install', { cwd: __dirname, stdio: 'inherit' });
      success('Dependencies installed');
    } catch (err) {
      error('Failed to install dependencies');
      warn('If this is due to OneDrive path issues, try moving the project to a local drive');
      process.exit(1);
    }

    // Step 4: Build packages
    step(4, 'Building packages and services');
    try {
      execSync('npm run build', { cwd: __dirname, stdio: 'inherit' });
      success('Build completed');
    } catch (err) {
      error('Build failed - some files may have errors, continuing...');
    }

    // Step 5: Database setup instructions
    step(5, 'Database setup instructions');
    log(`
You have two options:

Option A: Docker (Recommended)
────────────────────────────
  npm install -g docker
  docker-compose up --build

  This will:
  - Start PostgreSQL on localhost:5432
  - Start Redis on localhost:6379
  - Run all three services in containers
  - Run migrations automatically

Option B: Local Database
────────────────────────
  1. Install and start PostgreSQL (port 5432)
  2. Create database 'ecommerce':
     
     psql -U postgres -c "CREATE DATABASE ecommerce;"
  
  3. Run migrations:
     
     npm run db:migrate
  
  4. Seed initial data:
     
     npm run db:seed
  
  5. Start services:
     
     npm run dev

`, 'reset');

    // Step 6: Service information
    step(6, 'Services will be available at');
    log(`
  Auth Service:      http://localhost:3001
  Category Service:  http://localhost:3002
  User Service:      http://localhost:3003
  PostgreSQL:        localhost:5432
  Redis:             localhost:6379
`, 'reset');

    // Step 7: Next steps
    step(7, 'Next steps');
    log(`
1. Start with Docker:
   docker-compose up --build

2. Or start locally:
   npm run dev

3. Test the services:
   curl http://localhost:3001/health

4. Check the documentation:
   - Main README: ./README.md
   - Auth Service: ./apps/auth/README.md
   - Category Service: ./apps/category/README.md
   - User Service: ./apps/user/README.md
   - Setup Guide: ./SETUP_GUIDE.md

5. Database:
   npm run db:migrate        # Run migrations
   npm run db:seed          # Seed initial data
   npm run db:migrate:undo  # Rollback migrations

`, 'reset');

    log('\n╔═══════════════════════════════════════════════════════════╗', 'blue');
    success('   Setup completed successfully! 🎉');
    log('╚═══════════════════════════════════════════════════════════╝\n', 'blue');

  } catch (err) {
    error(`Setup failed: ${err.message}`);
    process.exit(1);
  }
}

setup();
