FROM oven/bun:1.0.30 AS builder

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY bun.lockb ./

# Install dependencies
RUN bun install

# Copy source files
COPY . .

# Build the application
RUN bun run build

# Production stage
FROM oven/bun:1.0.30-slim AS production

WORKDIR /app

# Set NODE_ENV to production
ENV NODE_ENV=production

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/server ./server

# Expose port for client and server
EXPOSE 3000

# Start both the server and client in production mode
CMD ["bun", "run-server"] 
