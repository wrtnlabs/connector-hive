# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies for node-gyp
RUN apk add --no-cache python3 make g++ git

# Copy package files
COPY package*.json ./
COPY packages/api/package*.json ./packages/api/

# Install ALL dependencies (including devDependencies)
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the application using webpack
RUN npm run webpack

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy only the bundled files from dist
COPY --from=builder /app/dist/. ./

# Set user to non-root
USER node

# Start the bundled application
CMD ["node", "server.js"]
