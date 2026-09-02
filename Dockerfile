# Production Dockerfile for MediSync AI Healthcare SaaS Platform

FROM node:20-alpine AS base
WORKDIR /app

# Copy dependency definitions
COPY package.json ./
COPY prisma ./prisma

# Install dependencies and generate Prisma Client
RUN npm install
RUN npx prisma generate

# Copy source files
COPY . .

# Expose HTTP port
EXPOSE 3000

# Start production application server
CMD ["npm", "run", "dev"]
