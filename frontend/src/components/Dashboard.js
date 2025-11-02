"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ClockIcon,
  PlayIcon,
  CheckCircleIcon,
  PlusIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const Dashboard = ({ user }) => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    pending: 0,
    inProgress: 0,
    completed: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(false);

  // ✅ 1. Fetch tasks initially
  useEffect(() => {
    fetchTasks();
  }, []);

  // ✅ 2. Recalculate stats on tasks change
  useEffect(() => {
    calculateStats(tasks);
  }, [tasks]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch tasks");

      const data = await res.json();
      setTasks(data);
      localStorage.setItem("tasks", JSON.stringify(data));
    } catch (err) {
      console.error("Dashboard Fetch Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (taskList) => {
    const pending = taskList.filter((task) => task.status === "pending").length;
    const inProgress = taskList.filter((task) => task.status === "in-progress").length;
    const completed = taskList.filter((task) => task.status === "completed").length;

    setStats({
      pending,
      inProgress,
      completed,
      total: taskList.length,
    });
  };

  // ✅ 3. Delete task (Instant UI Update)
  const handleDeleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete task");

      // Instant remove from UI
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      console.error("Delete Error:", err.message);
    }
  };

  // ✅ 4. Add new task (Instant UI Update)
  //   const handleAddTask = async (newTask) => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     const res = await fetch("http://localhost:5000/api/tasks", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify(newTask),
  //     });

  //     if (!res.ok) throw new Error("Failed to create task");

  //     await res.json();

  //     // ✅ API se fresh data reload
  //     fetchTasks();
  //   } catch (err) {
  //     console.error("Add Error:", err.message);
  //   }
  // };

  const handleAddTask = () => {
    fetchTasks(); // Bas updated tasks ko reload kar lega
  };


  const getRecentTasks = () => {
    return [...tasks]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "in-progress":
        return "text-blue-600 bg-blue-100";
      case "completed":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const formatStatus = (status) => {
    return status
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-2">Here's an overview of your tasks</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<ClockIcon className="h-6 w-6 text-yellow-600" />}
          title="Pending"
          value={stats.pending}
          bg="bg-yellow-100"
        />
        <StatCard
          icon={<PlayIcon className="h-6 w-6 text-blue-600" />}
          title="In Progress"
          value={stats.inProgress}
          bg="bg-blue-100"
        />
        <StatCard
          icon={<CheckCircleIcon className="h-6 w-6 text-green-600" />}
          title="Completed"
          value={stats.completed}
          bg="bg-green-100"
        />
        <StatCard
          icon={<ChartBarIcon className="h-6 w-6 text-purple-600" />}
          title="Total Tasks"
          value={stats.total}
          bg="bg-purple-100"
        />
      </div>

      {/* Recent Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Tasks</h2>
            <Link
              to="/tasks"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View all
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-6 text-gray-500">Loading...</div>
          ) : getRecentTasks().length > 0 ? (
            <div className="space-y-4">
              {getRecentTasks().map((task) => (
                <div
                  key={task._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{task.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      task.status
                    )}`}
                  >
                    {formatStatus(task.status)}
                  </span>

                  {/* ❌ Delete Button */}
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="ml-3 text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No tasks yet</p>
              <Link
                to="/tasks"
                className="inline-flex items-center mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Create your first task
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <QuickActions />
      </div>
    </div>
  );
};

// ✅ Stat Card
const StatCard = ({ icon, title, value, bg }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md">
    <div className="flex items-center">
      <div className={`p-3 rounded-full ${bg}`}>{icon}</div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

// ✅ Quick Actions
const QuickActions = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
    <div className="space-y-4">
      <Link
        to="/tasks"
        className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100"
      >
        <div className="p-2 bg-blue-600 rounded-lg">
          <PlusIcon className="h-5 w-5 text-white" />
        </div>
        <div className="ml-4">
          <h3 className="font-medium text-gray-900">  Task</h3>
          <p className="text-sm text-gray-600">Add a new task to your list</p>
        </div>
      </Link>
    </div>
  </div>
);

export default Dashboard;
