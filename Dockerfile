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

# Install Prisma CLI and required dependencies
RUN apk add --no-cache openssl
RUN npm install prisma

# Copy prisma files for migrations
COPY --from=builder /app/prisma ./prisma

# Copy only the bundled files from dist
COPY --from=builder /app/dist/. ./

# Set environment for Prisma
ENV PRISMA_CLI_BINARY_TARGETS=linux-musl

# Start the bundled application
CMD ["node", "server.js"]
