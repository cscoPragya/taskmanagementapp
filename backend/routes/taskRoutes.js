const express = require("express");
const router = express.Router();
const { createTask, getTasks, updateTask, deleteTask } = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware"); // JWT middleware

// ✅ Create a new task
router.post("/tasks", authMiddleware, createTask);

// ✅ Get all tasks of logged-in user
router.get("/tasks", authMiddleware, getTasks);

// ✅ Update a specific task
router.put("/tasks/:id", authMiddleware, updateTask);

// ✅ Delete a task
router.delete("/tasks/:id", authMiddleware, deleteTask);

module.exports = router;
