# =============================================================================
# Practical 11: Backend Dockerfile
# Containerizes the Node.js / Express Task Management API
# =============================================================================

# Base Image: Lightweight Node 18 Alpine runtime
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy dependency manifests first to leverage Docker layer caching
COPY package*.json ./

# Install application dependencies inside the container
RUN npm install

# Copy application source code (node_modules and .env excluded via .dockerignore)
COPY . .

# Expose backend port
EXPOSE 5000

# Start the Express server
CMD ["node", "server.js"]
