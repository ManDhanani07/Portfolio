const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const Task = require("./models/Task");

const app = express();

// Middleware
app.use(express.json());

// ================================
// MongoDB Connection
// ================================
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB Connected Successfully");
    })
    .catch((err) => {
        console.log("❌ MongoDB Connection Failed");
        console.log(err.message);
    });

// ================================
// Home Route
// ================================
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Task Management API using MongoDB & Mongoose"
    });
});

// ================================
// CREATE TASK
// POST /tasks
// ================================
app.post("/tasks", async (req, res) => {
    try {

        const task = await Task.create(req.body);

        res.status(201).json({
            success: true,
            message: "Task created successfully",
            data: task
        });

    } catch (err) {

        res.status(400).json({
            success: false,
            message: err.message
        });

    }
});

// ================================
// GET ALL TASKS
// GET /tasks
// ================================
app.get("/tasks", async (req, res) => {

    try {

        const tasks = await Task.find();

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

});

// ================================
// GET TASK BY ID
// GET /tasks/:id
// ================================
app.get("/tasks/:id", async (req, res) => {

    try {

        const task = await Task.findById(req.params.id);

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

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

});

// ================================
// UPDATE TASK
// PUT /tasks/:id
// ================================
app.put("/tasks/:id", async (req, res) => {

    try {

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!task) {

            return res.status(404).json({
                success: false,
                message: "Task not found"
            });

        }

        res.status(200).json({
            success: true,
            message: "Task updated successfully",
            data: task
        });

    } catch (err) {

        res.status(400).json({
            success: false,
            message: err.message
        });

    }

});

// ================================
// DELETE TASK
// DELETE /tasks/:id
// ================================
app.delete("/tasks/:id", async (req, res) => {

    try {

        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {

            return res.status(404).json({
                success: false,
                message: "Task not found"
            });

        }

        res.status(200).json({
            success: true,
            message: "Task deleted successfully"
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

});

// ================================
// Global Error Handler
// ================================
app.use((err, req, res, next) => {

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });

});

// ================================
// Server
// ================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});