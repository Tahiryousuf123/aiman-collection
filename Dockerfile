# Production Dockerfile for Aiman Collection Haute Couture E-Commerce Platform

FROM node:20-alpine AS base
WORKDIR /app

# Copy dependency definitions
COPY package.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Expose HTTP port
EXPOSE 5000

# Start production application server
CMD ["npm", "run", "server"]
