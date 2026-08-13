const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Task = require("./models/Task");

const app = express();

const PORT = 5000;

// ======================================
// MIDDLEWARE
// ======================================

// Allow React frontend to access backend
app.use(cors());

// Read JSON request body
app.use(express.json());

// ======================================
// MONGODB CONNECTION
// ======================================

mongoose
  .connect("mongodb://localhost:27017/tasks")
  .then(() => {
    console.log("MongoDB Connected Successfully");
  })
  .catch((error) => {
    console.error("MongoDB Connection Error:");
    console.error(error);
  });

// ======================================
// HOME ROUTE
// ======================================

app.get("/", (req, res) => {
  res.json({
    message: "Task Management API is running",
  });
});

// ======================================
// GET ALL TASKS
// GET /tasks
// ======================================

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({
      createdAt: -1,
    });

    res.status(200).json(tasks);
  } catch (error) {
    console.error("GET /tasks Error:", error);

    res.status(500).json({
      message: "Failed to fetch tasks",
      error: error.message,
    });
  }
});

// ======================================
// GET SINGLE TASK
// GET /tasks/:id
// ======================================

app.get("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error("GET /tasks/:id Error:", error);

    res.status(500).json({
      message: "Failed to fetch task",
      error: error.message,
    });
  }
});

// ======================================
// CREATE TASK
// POST /tasks
// ======================================

app.post("/tasks", async (req, res) => {
  try {
    const { title, description, status, priority, completed } = req.body;

    // Validation
    if (!title || title.trim() === "") {
      return res.status(400).json({
        message: "Task title is required",
      });
    }

    const task = new Task({
      title: title.trim(),
      description: description ? description.trim() : "",
      status: status || "Pending",
      priority: priority || "Medium",
      completed: completed || false,
    });

    const savedTask = await task.save();

    res.status(201).json(savedTask);
  } catch (error) {
    console.error("POST /tasks Error:", error);

    res.status(500).json({
      message: "Failed to create task",
      error: error.message,
    });
  }
});

// ======================================
// UPDATE TASK
// PUT /tasks/:id
// ======================================

app.put("/tasks/:id", async (req, res) => {
  try {
    const { title, description, status, priority, completed } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({
        message: "Task title is required",
      });
    }

    const isCompleted = status === "Completed" || Boolean(completed);

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        message: "Invalid Task ID format",
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title: title.trim(),
        description: description ? description.trim() : "",
        status: status || "Pending",
        priority: priority || "Medium",
        completed: isCompleted,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("PUT /tasks/:id Error:", error);

    res.status(500).json({
      message: "Failed to update task",
      error: error.message,
    });
  }
});

// ======================================
// DELETE TASK
// DELETE /tasks/:id
// ======================================

app.delete("/tasks/:id", async (req, res) => {
  try {
    const deletedTask =
      await Task.findByIdAndDelete(
        req.params.id
      );

    if (!deletedTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task deleted successfully",
      task: deletedTask,
    });
  } catch (error) {
    console.error(
      "DELETE /tasks/:id Error:",
      error
    );

    res.status(500).json({
      message: "Failed to delete task",
      error: error.message,
    });
  }
});

// ======================================
// 404 ROUTE
// ======================================

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// ======================================
// START SERVER
// ======================================

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});