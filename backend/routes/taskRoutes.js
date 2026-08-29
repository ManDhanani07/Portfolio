const express = require("express");
const mongoose = require("mongoose");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");
const { validateTask } = require("../middleware/validationMiddleware");

const router = express.Router();

// =========================================================================
// Protect ALL Task Routes with Authentication Middleware
// =========================================================================
router.use(authMiddleware);

// =========================================================================
// GET /api/tasks — Get all tasks (Protected)
// =========================================================================
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    return res.status(200).json(tasks);
  } catch (error) {
    console.error("GET /tasks Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
      error: error.message,
    });
  }
});

// =========================================================================
// GET /api/tasks/:id — Get single task by ID (Protected)
// =========================================================================
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: "Invalid Task ID format",
      });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json(task);
  } catch (error) {
    console.error("GET /tasks/:id Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch task",
      error: error.message,
    });
  }
});

// =========================================================================
// POST /api/tasks — Create Task (Protected + Validated)
// Pipeline: Request -> authMiddleware -> validateTask -> handler -> MongoDB
// =========================================================================
router.post("/", validateTask, async (req, res) => {
  try {
    const { title, description, status, priority, completed } = req.body;

    const task = new Task({
      title: title.trim(),
      description: description ? description.trim() : "",
      status: status || "Pending",
      priority: priority || "Medium",
      completed: status === "Completed" || Boolean(completed),
    });

    const savedTask = await task.save();
    return res.status(201).json(savedTask);
  } catch (error) {
    console.error("POST /tasks Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create task",
      error: error.message,
    });
  }
});

// =========================================================================
// PUT /api/tasks/:id — Update Task (Protected + Validated)
// Pipeline: Request -> authMiddleware -> validateTask -> handler -> MongoDB
// =========================================================================
router.put("/:id", validateTask, async (req, res) => {
  try {
    const { title, description, status, priority, completed } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: "Invalid Task ID format",
      });
    }

    const isCompleted = status === "Completed" || Boolean(completed);

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title: title.trim(),
        description: description !== undefined ? description.trim() : "",
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
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json(updatedTask);
  } catch (error) {
    console.error("PUT /tasks/:id Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update task",
      error: error.message,
    });
  }
});

// =========================================================================
// DELETE /api/tasks/:id — Delete Task (Protected)
// =========================================================================
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: "Invalid Task ID format",
      });
    }

    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      task: deletedTask,
    });
  } catch (error) {
    console.error("DELETE /tasks/:id Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete task",
      error: error.message,
    });
  }
});

module.exports = router;
