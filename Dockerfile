# Multi-stage build for Node.js backend
FROM node:18-alpine as builder

WORKDIR /app/backend

# Copy package files
COPY backend/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Production stage
FROM node:18-alpine

WORKDIR /app/backend

# Copy node modules from builder
COPY --from=builder /app/backend/node_modules ./node_modules

# Copy application code
COPY backend/ .

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js || exit 1

# Expose port
EXPOSE 5000

# Start the application
CMD ["node", "server.js"]
