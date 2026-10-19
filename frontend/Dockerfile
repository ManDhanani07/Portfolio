# =============================================================================
# Practical 11: Multi-Stage Dockerfile for React Frontend
# Stage 1: Build Stage (Compiles React + Vite into static assets)
# Stage 2: Production Serving Stage (Lightweight multi-stage runner)
# =============================================================================

# Stage 1: Build the React Application
FROM node:18-alpine AS build

WORKDIR /app

# Copy dependency manifests first for Docker layer caching
COPY package*.json ./

# Install dependencies needed for compiling React bundle
RUN npm install

# Copy application source code and compile production build
COPY . .
RUN npm run build

# =============================================================================
# Stage 2: Production Serving Stage (Multi-stage build to reduce final image size)
# =============================================================================
FROM node:18-alpine AS runner

WORKDIR /app

# Copy package manifests
COPY package*.json ./

# Copy compiled static assets and node_modules from build stage
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

# Expose default Vite preview port
EXPOSE 5173

# Run preview server bound to 0.0.0.0 so it is accessible from host machine
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
