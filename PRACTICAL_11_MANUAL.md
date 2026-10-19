# Practical 11: Containerization with Docker and Docker Compose

**Course / Outcomes:** CO5 / PO3, PO5  
**Domain:** DevOps / Full-Stack Containerization  
**Technology Stack:** Docker, Docker Compose, Node.js (Alpine), React + Vite, MongoDB official image.

---

## 1. Objective
To containerize the full-stack Task Management application (React Frontend, Node.js/Express Backend, MongoDB Database) using individual Dockerfiles and orchestrate the multi-container stack seamlessly using Docker Compose with inter-service networking and volume persistence.

---

## 2. Architecture & Networking Diagram

```
                              Host Machine (User / Browser)
                     ┌──────────────────────┬──────────────────────┐
                     │ Port 5173            │ Port 5000            │ Port 27017
                     ▼                      ▼                      ▼
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │                           docker-compose.yml                                │
  │                                                                             │
  │   User-Defined Bridge Network: app-network (Docker Embedded DNS: 127.0.0.11) │
  │                                                                             │
  │   ┌─────────────────────┐        ┌─────────────────────┐                    │
  │   │   frontend service  │        │   backend service   │                    │
  │   │  (task-frontend)    │        │   (task-backend)    │                    │
  │   │  React + Vite       │        │   Node.js + Express │                    │
  │   │  Multi-stage Alpine │        │   Port: 5000        │                    │
  │   │  Port: 5173         │        │                     │                    │
  │   └──────────┬──────────┘        └──────────┬──────────┘                    │
  │              │                              │                               │
  │              │ HTTP calls (client browser)  │ Mongoose:                     │
  │              └─────────────────────────────►│ mongodb://mongodb:27017/tasks │
  │                                             │                               │
  │                                             ▼                               │
  │                                  ┌─────────────────────┐                    │
  │                                  │   mongodb service   │                    │
  │                                  │   (task-mongodb)    │                    │
  │                                  │   Official mongo:6  │                    │
  │                                  │   Port: 27017       │                    │
  │                                  └──────────┬──────────┘                    │
  │                                             │                               │
  │                                             ▼                               │
  │                              ┌─────────────────────────────┐                │
  │                              │ Named Volume: mongo-data    │                │
  │                              │ Path: /data/db              │                │
  │                              │ (Data persists on restart)  │                │
  │                              └─────────────────────────────┘                │
  └─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Analysis & Key Questions (Viva / Theory)

### Q1: Why does the backend container need to reference the MongoDB container by its service name (e.g., `mongodb`) rather than `localhost`?
**Answer:**  
In Docker, each container operates in its own isolated network namespace with its own private loopback interface (`127.0.0.1` / `localhost`). If the backend container attempts to connect to `localhost:27017`, it searches for MongoDB *inside the backend container itself*, which fails. When services are attached to a user-defined bridge network (`app-network`), Docker runs an embedded DNS server (at `127.0.0.11`) that automatically resolves service names (e.g., `mongodb`) to the specific container's internal IP address. Therefore, the connection string must be `mongodb://mongodb:27017/tasks`.

### Q2: What is the difference between `EXPOSE` in a Dockerfile and the `ports` mapping in `docker-compose.yml`?
**Answer:**  
- **`EXPOSE` (Dockerfile):** Serves solely as documentation and metadata between the image creator and user indicating which port the containerized process listens on. It **does not** publish the port or make it reachable from the host operating system.
- **`ports` (docker-compose.yml):** Actively publishes and binds container ports to host network interfaces (e.g., `"5000:5000"` or `HOST_PORT:CONTAINER_PORT`) using network address translation (NAT/iptables). It allows external host clients and web browsers to access services inside the container.

### Q3: Why is it considered bad practice to copy `node_modules` into a Docker image instead of running `npm install` inside the container?
**Answer:**  
1. **Operating System & Architecture Incompatibilities:** Packages with native C/C++ bindings (e.g., `bcrypt`, `sharp`, `node-gyp`) compiled on a Windows or macOS host system will crash when copied into a Linux/Alpine container. Running `npm install` inside the container ensures native binaries are compiled specifically for the container's OS and architecture.
2. **Build Context Bloat:** The `node_modules` directory typically contains tens of thousands of files totaling several hundred megabytes. Copying it drastically slows down Docker daemon context transfers.
3. **Invalidating Layer Caching:** Copying local `node_modules` prevents Docker from leveraging efficient cached layer states for dependencies.

---

## 4. Configuration & Dockerfile Reference

### 4.1 Backend Dockerfile (`backend/Dockerfile`)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

### 4.2 Backend `.dockerignore` (`backend/.dockerignore`)
```dockerignore
node_modules
npm-debug.log*
.env
.env.*
.git
.gitignore
```

### 4.3 Frontend Multi-Stage Dockerfile (`frontend/Dockerfile`)
```dockerfile
# Stage 1: Build the React Application
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production Serving Stage (Multi-stage optimization)
FROM node:18-alpine AS runner
WORKDIR /app
COPY package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
EXPOSE 5173
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
```

### 4.4 Frontend `.dockerignore` (`frontend/.dockerignore`)
```dockerignore
node_modules
dist
npm-debug.log*
.env
.env.*
.git
.gitignore
```

### 4.5 Orchestration (`docker-compose.yml`)
```yaml
version: "3.8"

services:
  mongodb:
    image: mongo:6
    container_name: task-mongodb
    restart: unless-stopped
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    networks:
      - app-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: task-backend
    restart: unless-stopped
    ports:
      - "5000:5000"
    environment:
      - PORT=5000
      - MONGO_URI=mongodb://mongodb:27017/tasks
      - JWT_SECRET=supersecret_jwt_key_practical_7_key_12345
      - NODE_ENV=production
    depends_on:
      - mongodb
    networks:
      - app-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: task-frontend
    restart: unless-stopped
    ports:
      - "5173:5173"
    environment:
      - VITE_API_URL=http://localhost:5000
    depends_on:
      - backend
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  mongo-data:
    driver: local
```

---

## 5. Lab Practical File Screenshot Guide

Capture these **5 screenshots** for your Practical 11 journal/report:

### Screenshot 1: Docker Compose Build & Startup Command
- **Title:** `Fig 11.1: Building and Launching Multi-Container Stack via Docker Compose`
- **Command executed in Terminal:**
  ```powershell
  docker-compose up --build -d
  ```
- **What to show in the screenshot:**
  - Building of `task-backend` and multi-stage build of `task-frontend`.
  - Creation of network: `awdf_app-network`.
  - Creation of named volume: `awdf_mongo-data`.
  - Containers starting: `task-mongodb`, `task-backend`, `task-frontend` status `Started`.

---

### Screenshot 2: Active Container Verification (`docker ps`)
- **Title:** `Fig 11.2: Verifying Active Running Containers and Port Mappings`
- **Command executed in Terminal:**
  ```powershell
  docker ps
  ```
- **What to highlight in the screenshot:**
  - `task-frontend` running with port `0.0.0.0:5173->5173/tcp`.
  - `task-backend` running with port `0.0.0.0:5000->5000/tcp`.
  - `task-mongodb` running with port `0.0.0.0:27017->27017/tcp`.
  - Status: `Up (healthy/running)`.

---

### Screenshot 3: Browser Frontend Access (React UI on Port 5173)
- **Title:** `Fig 11.3: Accessing Containerized React Frontend on http://localhost:5173`
- **URL in browser:** `http://localhost:5173`
- **What to show in the screenshot:**
  - Browser address bar clearly displaying `http://localhost:5173`.
  - The Task Manager / Portfolio application UI loaded from the container.
  - Browser DevTools (Network tab) showing successful API requests responding from `http://localhost:5000/api/tasks`.

---

### Screenshot 4: Backend Health Check & Container Metadata (Postman / Browser)
- **Title:** `Fig 11.4: Containerized Backend Health Check API Response`
- **URL in Postman or Browser:** `GET http://localhost:5000/`
- **What to show in the screenshot:**
  - Status: `200 OK`.
  - JSON response confirming:
    ```json
    {
      "success": true,
      "message": "Practical 7-11 Task Management API (JWT Auth, Caching, EventEmitter & Docker Containerization) is running",
      "containerization": {
        "dockerized": true,
        "nodeEnv": "production",
        "mongoHost": "mongodb://mongodb:27017/tasks"
      }
    }
    ```

---

### Screenshot 5: Named Volume Data Persistence Verification
- **Title:** `Fig 11.5: Verifying Persistent MongoDB Named Volume Across Container Restarts`
- **Commands executed in Terminal:**
  ```powershell
  # 1. View Docker volumes
  docker volume ls

  # 2. Inspect the persistent mongo volume
  docker volume inspect awdf_mongo-data
  ```
- **What to show in the screenshot:**
  - `awdf_mongo-data` listed under local volumes.
  - Inspect output showing the mountpoint on the Docker host system (e.g., `/var/lib/docker/volumes/awdf_mongo-data/_data`).
