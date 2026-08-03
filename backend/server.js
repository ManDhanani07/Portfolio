const express = require("express");

const app = express();
const PORT = 5000;

// ===============================
// Parse JSON
// ===============================
app.use(express.json());

// ===============================
// Logging Middleware
// ===============================
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    next();
});

// ===============================
// Content-Type Validation Middleware
// ===============================
app.use((req, res, next) => {

    if (
        (req.method === "POST" || req.method === "PUT") &&
        !req.is("application/json")
    ) {
        return res.status(400).json({
            success: false,
            message: "Content-Type must be application/json"
        });
    }

    next();
});

// ===============================
// In-Memory Tasks
// ===============================
const tasks = [
    {
        id: 1,
        title: "Complete Express Practical",
        completed: false
    },
    {
        id: 2,
        title: "Learn Middleware",
        completed: false
    }
];

// Next Task ID
let nextId = tasks.length + 1;

// ===============================
// Route-Specific Middleware
// Validate Task ID
// ===============================
function validateTaskId(req, res, next) {

    const id = Number(req.params.id);

    if (isNaN(id) || id <= 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid Task ID"
        });
    }

    next();
}

// ===============================
// Home Route
// ===============================
app.get("/", (req, res) => {

    res.status(200).json({
        success: true,
        message: "Welcome to Task Manager REST API"
    });

});

// ===============================
// GET All Tasks
// ===============================
app.get("/tasks", (req, res) => {

    res.status(200).json({
        success: true,
        count: tasks.length,
        data: tasks
    });

});

// ===============================
// GET Task By ID
// ===============================
app.get("/tasks/:id", validateTaskId, (req, res) => {

    const id = Number(req.params.id);

    const task = tasks.find(task => task.id === id);

    if (!task) {
        return res.status(404).json({
            success: false,
            message: "Task not found"
        });
    }

    res.status(200).json({
        success: true,
        data: task
    });

});

// ===============================
// CREATE Task
// ===============================
app.post("/tasks", (req, res) => {

    const { title, completed } = req.body;

    if (!title) {
        return res.status(400).json({
            success: false,
            message: "Task title is required"
        });
    }

    const newTask = {
        id: nextId++,
        title,
        completed: completed ?? false
    };

    tasks.push(newTask);

    res.status(201).json({
        success: true,
        message: "Task created successfully",
        data: newTask
    });

});

// ===============================
// UPDATE Task
// ===============================
app.put("/tasks/:id", validateTaskId, (req, res) => {

    const id = Number(req.params.id);

    const task = tasks.find(task => task.id === id);

    if (!task) {
        return res.status(404).json({
            success: false,
            message: "Task not found"
        });
    }

    const { title, completed } = req.body;

    if (title !== undefined)
        task.title = title;

    if (completed !== undefined)
        task.completed = completed;

    res.status(200).json({
        success: true,
        message: "Task updated successfully",
        data: task
    });

});

// ===============================
// DELETE Task
// ===============================
app.delete("/tasks/:id", validateTaskId, (req, res) => {

    const id = Number(req.params.id);

    const index = tasks.findIndex(task => task.id === id);

    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: "Task not found"
        });
    }

    // Delete task
    const deletedTask = tasks.splice(index, 1)[0];

    // Renumber IDs
    tasks.forEach((task, index) => {
        task.id = index + 1;
    });

    // Reset next ID
    nextId = tasks.length + 1;

    res.status(200).json({
        success: true,
        message: "Task deleted successfully",
        deletedTask,
        remainingTasks: tasks
    });

});

// ===============================
// Test Error Route
// ===============================
app.get("/error", (req, res, next) => {

    next(new Error("This is a test error"));

});

// ===============================
// 404 Middleware
// ===============================
app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "Route not found"
    });

});

// ===============================
// Global Error Handler
// ===============================
app.use((err, req, res, next) => {

    console.error(err.stack);

    res.status(500).json({
        success: false,
        message: "Something went wrong"
    });

});

// ===============================
// Start Server
// ===============================
app.listen(PORT, () => {

    console.log(`Server running on http://localhost:${PORT}`);

});