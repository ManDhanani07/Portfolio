// =============================================================================
// Practical 7: JWT Authentication & Middleware Pipeline
// Full-Stack Task Management System with Express.js, MongoDB, & JWT
// =============================================================================

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import Route Handlers
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/tasks";

// =============================================================================
// 1. GLOBAL MIDDLEWARES (Pipeline Setup)
// =============================================================================

// Cross-Origin Resource Sharing (CORS) - Allows frontend to communicate with API
app.use(cors());

// Express Built-in JSON Parser Middleware
app.use(express.json());

// URL Sanitizer Middleware (Strips accidental trailing newlines / %0A / spaces)
app.use((req, res, next) => {
  if (req.url) {
    req.url = decodeURIComponent(req.url).trim();
  }
  next();
});

// Request Logger Middleware (Tracks incoming requests for debugging/monitoring)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// =============================================================================
// 2. MONGODB DATABASE CONNECTION
// =============================================================================

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(" MongoDB Connected Successfully to:", MONGO_URI);
  })
  .catch((error) => {
    console.error("❌ MongoDB Connection Error:", error.message);
  });

// =============================================================================
// 3. API ROUTES
// =============================================================================

// Root Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Practical 7 Task Management API with JWT Authentication is running",
    endpoints: {
      auth: {
        register: "POST /api/auth/register",
        login: "POST /api/auth/login",
        me: "GET /api/auth/me (Protected)",
      },
      tasks: {
        getAll: "GET /api/tasks (Protected)",
        getOne: "GET /api/tasks/:id (Protected)",
        create: "POST /api/tasks (Protected + Validated)",
        update: "PUT /api/tasks/:id (Protected + Validated)",
        delete: "DELETE /api/tasks/:id (Protected)",
      },
    },
  });
});

// Authentication Routes (Register, Login, /me)
app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes); // Fallback alias

// Protected Task Management Routes (CRUD with Auth & Validation Middlewares)
app.use("/api/tasks", taskRoutes);
app.use("/tasks", taskRoutes); // Fallback alias for Practical 6 compatibility

// =============================================================================
// 4. 404 NOT FOUND HANDLER
// =============================================================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// =============================================================================
// 5. GLOBAL 500 ERROR HANDLER
// =============================================================================
app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "production" ? undefined : err.message,
  });
});

// =============================================================================
// 6. SERVER START
// =============================================================================
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app;