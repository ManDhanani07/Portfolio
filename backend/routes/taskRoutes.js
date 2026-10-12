const express = require("express");
const mongoose = require("mongoose");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");
const { validateTask } = require("../middleware/validationMiddleware");
const cache = require("../utils/cache");

const router = express.Router();

// Helper to calculate high-resolution response duration in ms
const getDurationMs = (startBigInt) => {
  return (Number(process.hrtime.bigint() - startBigInt) / 1e6).toFixed(2);
};

// =========================================================================
// Practical 9: Debug & Cache Stats Endpoints (Publicly accessible for easy verification)
// =========================================================================

// GET /api/tasks/cache/stats — Expose cache-hit/cache-miss counters and keys
router.get("/cache/stats", (req, res) => {
  const stats = cache.getStats();
  const keys = cache.keys();

  return res.status(200).json({
    success: true,
    message: "In-memory cache statistics (node-cache)",
    ttlSeconds: 60,
    stats: {
      hits: stats.hits,
      misses: stats.misses,
      keysCount: keys.length,
      ksize: stats.ksize,
      vsize: stats.vsize,
    },
    cachedKeys: keys,
  });
});

// POST /api/tasks/cache/clear — Manually clear cache for testing
router.post("/cache/clear", (req, res) => {
  cache.flushAll();
  return res.status(200).json({
    success: true,
    message: "Cache cleared successfully",
  });
});

// =========================================================================
// Protect remaining Task Routes with Authentication Middleware
// =========================================================================
router.use(authMiddleware);

// =========================================================================
// GET /api/tasks — Get all tasks with In-Memory Caching (Practical 9)
// Diagram:
// GET /tasks -> Cache check -> HIT: return immediately
//                           -> MISS: MongoDB query -> cache.set -> return
// =========================================================================
router.get("/", async (req, res) => {
  const start = process.hrtime.bigint();

  try {
    const bypassCache = req.query.nocache === "true";

    // 1. Check cache first (unless ?nocache=true is requested)
    if (!bypassCache) {
      const cachedTasks = cache.get(cache.KEYS.ALL_TASKS);
      if (cachedTasks) {
        const duration = getDurationMs(start);
        res.setHeader("X-Cache", "HIT");
        res.setHeader("X-Response-Time-Ms", `${duration}ms`);
        return res.status(200).json(cachedTasks);
      }
    }

    // 2. Cache MISS — Query MongoDB
    const tasks = await Task.find().sort({ createdAt: -1 });

    // 3. Store result in cache (stdTTL: 60 seconds)
    if (!bypassCache) {
      cache.set(cache.KEYS.ALL_TASKS, tasks);
    }

    const duration = getDurationMs(start);
    res.setHeader("X-Cache", bypassCache ? "BYPASS" : "MISS");
    res.setHeader("X-Response-Time-Ms", `${duration}ms`);
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
// GET /api/tasks/:id — Get single task by ID with In-Memory Caching
// =========================================================================
router.get("/:id", async (req, res) => {
  const start = process.hrtime.bigint();

  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: "Invalid Task ID format",
      });
    }

    const cacheKey = cache.KEYS.taskKey(req.params.id);

    // 1. Check cache first
    const cachedTask = cache.get(cacheKey);
    if (cachedTask) {
      const duration = getDurationMs(start);
      res.setHeader("X-Cache", "HIT");
      res.setHeader("X-Response-Time-Ms", `${duration}ms`);
      return res.status(200).json(cachedTask);
    }

    // 2. Cache MISS — Query MongoDB
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // 3. Store single task in cache
    cache.set(cacheKey, task);

    const duration = getDurationMs(start);
    res.setHeader("X-Cache", "MISS");
    res.setHeader("X-Response-Time-Ms", `${duration}ms`);
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
// POST /api/tasks — Create Task (Invalidate 'all_tasks' Cache)
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

    // Cache Invalidation: invalidate 'all_tasks' so fresh list is queried next time
    cache.del(cache.KEYS.ALL_TASKS);

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
// PUT /api/tasks/:id — Update Task (Invalidate 'all_tasks' & 'task_:id')
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

    // Cache Invalidation: invalidate 'all_tasks' and the specific task key
    cache.del(cache.KEYS.ALL_TASKS);
    cache.del(cache.KEYS.taskKey(req.params.id));

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
// DELETE /api/tasks/:id — Delete Task (Invalidate 'all_tasks' & 'task_:id')
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

    // Cache Invalidation: invalidate 'all_tasks' and the specific task key
    cache.del(cache.KEYS.ALL_TASKS);
    cache.del(cache.KEYS.taskKey(req.params.id));

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
