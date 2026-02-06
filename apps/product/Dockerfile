FROM node:18-alpine

WORKDIR /app

# Copy root package files
COPY ../../package.json ../../package-lock.json ./

# Copy workspace packages
COPY ../../packages ./packages

# Copy scripts
COPY ../../scripts ./scripts

# Copy product service
COPY . .

# Install dependencies with npm
RUN npm install

# Build the application
RUN npm run build

EXPOSE 3004

# Make entrypoint executable
RUN chmod +x /app/scripts/docker-entrypoint.sh

CMD ["/app/scripts/docker-entrypoint.sh"]
