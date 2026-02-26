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

# Run migrations (from repo root)
echo "🗄️ Running database migrations..."
cd /app || exit 1
npm run db:migrate || echo "⚠️ Migrations may have already been run"

# Start the service: if root package.json doesn't expose start:dev,
# find the first workspace under /app/apps that provides it and run there.
echo "▶️ Starting application..."
SERVICE_DIR="/app"
if npm run | grep -q "start:dev"; then
  SERVICE_DIR="/app"
else
  for d in /app/apps/*; do
    if [ -f "$d/package.json" ] && grep -q '"start:dev"' "$d/package.json"; then
      SERVICE_DIR="$d"
      break
    fi
  done
fi

echo "Starting service from $SERVICE_DIR"
cd "$SERVICE_DIR" || exit 1
npm run start:dev
