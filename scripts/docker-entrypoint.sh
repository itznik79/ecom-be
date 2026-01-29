#!/bin/sh

echo "🚀 Starting service..."

# Wait for database to be ready
echo "⏳ Waiting for PostgreSQL..."
until pg_isready -h postgres -p 5432 > /dev/null 2>&1; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done
echo "✓ PostgreSQL is ready"

# Wait for Redis
echo "⏳ Waiting for Redis..."
until redis-cli -h redis -p 6379 ping > /dev/null 2>&1; do
  echo "Redis is unavailable - sleeping"
  sleep 1
done
echo "✓ Redis is ready"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build
echo "🔨 Building..."
npm run build

# Run migrations (from root level)
echo "🗄️ Running database migrations..."
cd /app/..
npm run db:migrate || echo "⚠️ Migrations may have already been run"

# Start the service
echo "▶️ Starting application..."
cd /app
npm run start:dev
