const Task = require("../models/Tasks");

//  Create Task
exports.createTask = async (req, res) => {

  try {
    const { title, description, status, priority, dueDate } = req.body;

    const task = new Task({
      user: req.user.id, // user id from JWT middleware
      title,
      description,
      status,
      priority,
      dueDate: dueDate || null,
    });

    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error creating task", error: error.message });
  }
};

// ✅ Get All Tasks (User specific)
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error: error.message });
  }
};

// ✅ Update Task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { $set: req.body },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found or unauthorized" });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error: error.message });
  }
};

// ✅ Delete Task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findOneAndDelete({ _id: id, user: req.user.id });

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found or unauthorized" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error: error.message });
  }
};
