const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// =========================================================================
// Protect ALL Report Routes with Authentication AND Admin Authorization
// Pipeline: Request -> authMiddleware -> adminMiddleware -> handler
// =========================================================================
router.use(authMiddleware);
router.use(adminMiddleware);

/**
 * Helper to escape CSV cell contents
 */
const escapeCsvCell = (value) => {
  if (value === null || value === undefined) return '""';
  const str = String(value).replace(/"/g, '""');
  return `"${str}"`;
};

/**
 * Generate CSV text representation from task array
 */
const generateTasksCsv = (tasks, metrics, dateRange) => {
  const metaLines = [
    `"Task Activity Report - Portfolio Workspace"`,
    `"Date Range:","${dateRange.start.toISOString().split("T")[0]} to ${dateRange.end.toISOString().split("T")[0]}"`,
    `"Total Tasks:","${metrics.totalTasks}"`,
    `"Completed:","${metrics.completedTasks}"`,
    `"In Progress:","${metrics.inProgressTasks}"`,
    `"Pending:","${metrics.pendingTasks}"`,
    `"Completion Rate:","${metrics.completionRate}"`,
    ``,
    `"Task ID","Title","Description","Status","Priority","Completed","Created At","Updated At"`
  ];

  const rowLines = tasks.map((task) => {
    return [
      escapeCsvCell(task._id),
      escapeCsvCell(task.title),
      escapeCsvCell(task.description || ""),
      escapeCsvCell(task.status || (task.completed ? "Completed" : "Pending")),
      escapeCsvCell(task.priority || "Medium"),
      escapeCsvCell(task.completed ? "Yes" : "No"),
      escapeCsvCell(task.createdAt ? new Date(task.createdAt).toISOString() : ""),
      escapeCsvCell(task.updatedAt ? new Date(task.updatedAt).toISOString() : ""),
    ].join(",");
  });

  return [...metaLines, ...rowLines].join("\r\n");
};

/**
 * Core Report Generator Controller
 * Accessible via GET /api/reports/tasks and POST /api/reports/tasks
 */
const handleGenerateReport = async (req, res) => {
  try {
    const startDateParam = req.query?.startDate || req.body?.startDate;
    const endDateParam = req.query?.endDate || req.body?.endDate;
    const format = (req.query?.format || req.body?.format || "json").toLowerCase();

    if (!startDateParam || !endDateParam) {
      return res.status(400).json({
        success: false,
        message: "Both startDate and endDate are required parameters (e.g. YYYY-MM-DD).",
      });
    }

    const start = new Date(startDateParam);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDateParam);
    end.setHours(23, 59, 59, 999);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format. Please provide valid dates (e.g. YYYY-MM-DD or ISO 8601).",
      });
    }

    if (start > end) {
      return res.status(400).json({
        success: false,
        message: "startDate cannot be later than endDate.",
      });
    }

    // Query MongoDB for all tasks created within specified date boundaries
    const tasks = await Task.find({
      createdAt: {
        $gte: start,
        $lte: end,
      },
    }).sort({ createdAt: -1 });

    // Aggregate statistics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(
      (t) => t.status === "Completed" || (!t.status && t.completed)
    ).length;
    const inProgressTasks = tasks.filter((t) => t.status === "In Progress").length;
    const pendingTasks = tasks.filter(
      (t) => t.status === "Pending" || (!t.status && !t.completed)
    ).length;

    const highPriority = tasks.filter((t) => (t.priority || "").toLowerCase() === "high").length;
    const mediumPriority = tasks.filter((t) => (t.priority || "medium").toLowerCase() === "medium").length;
    const lowPriority = tasks.filter((t) => (t.priority || "").toLowerCase() === "low").length;

    const completionRate = totalTasks > 0
      ? `${((completedTasks / totalTasks) * 100).toFixed(1)}%`
      : "0.0%";

    const metrics = {
      totalTasks,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      completionRate,
      byPriority: {
        high: highPriority,
        medium: mediumPriority,
        low: lowPriority,
      },
    };

    // Return as CSV attachment if requested
    if (format === "csv") {
      const csvContent = generateTasksCsv(tasks, metrics, { start, end });
      const filename = `Task_Report_${start.toISOString().split("T")[0]}_to_${end.toISOString().split("T")[0]}.csv`;

      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      return res.status(200).send(csvContent);
    }

    // Otherwise return detailed JSON report
    return res.status(200).json({
      success: true,
      reportTitle: "Admin Task Activity & Performance Report",
      dateRange: {
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      },
      generatedAt: new Date().toISOString(),
      generatedBy: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
      },
      metrics,
      tasksCount: tasks.length,
      tasks,
    });
  } catch (error) {
    console.error("Report Generation Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error generating task report",
      error: error.message,
    });
  }
};

// Mount route handlers
router.get("/tasks", handleGenerateReport);
router.post("/tasks", handleGenerateReport);

module.exports = router;
