# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the app (assumes using Vite)
RUN npm run build

# Stage 2: Run production
FROM node:18-alpine
WORKDIR /app

# Install only production dependencies (optional, for minimal image)
COPY package*.json ./
RUN npm install --omit=dev

# Copy build artifacts from builder
COPY --from=builder /app/dist ./dist

# Nếu bạn dùng static server (serve) để run React/Vite build
RUN npm install -g serve

EXPOSE 3000

# Serve static build folder
CMD ["serve", "-s", "dist", "-l", "3000"]
