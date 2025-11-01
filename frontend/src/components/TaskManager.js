"use client"

import { useState, useEffect } from "react"
import TaskForm from "./TaskForm"
import TaskList from "./TaskList"
import TaskFilters from "./TaskFilters"
import { PlusIcon } from "@heroicons/react/24/outline"

const TaskManager = ({ user }) => {
  const [tasks, setTasks] = useState([])
  const [filteredTasks, setFilteredTasks] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
  })
  const [loading, setLoading] = useState(false)



  //just for debugging


  // Fetch tasks from backend on mount
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem("token")
        const response = await fetch("http://localhost:5000/api/tasks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!response.ok) {
          throw new Error("Failed to fetch tasks")
        }
        const data = await response.json()
        setTasks(data)
      } catch (error) {
        alert(error.message)
      } finally {
        setLoading(false)
      }
    }
    fetchTasks()
  }, [])

  useEffect(() => {
    // Apply filters whenever tasks or filters change
    let filtered = tasks

    if (filters.status !== "all") {
      filtered = filtered.filter((task) => task.status === filters.status)
    }

    if (filters.search) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          task.description.toLowerCase().includes(filters.search.toLowerCase()),
      )
    }

    setFilteredTasks(filtered)
  }, [tasks, filters])

  // Create new task via API
  const handleCreateTask = async (taskData) => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")

      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      })

      // parse only once
      const data = await response.json()
      // const temp={
      //   title:
      // }

      if (!response.ok) {
        throw new Error(data.message || "Failed to create task")
      }

      // ✅ Add new task to list
      setTasks((prev) => [...prev, data])

      // Automatically update filtered list
      setFilteredTasks((prev) => [...prev, data])

      setShowForm(false)
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }


  // Update existing task via API
  const handleUpdateTask = async (taskData) => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:5000/api/tasks/${editingTask._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      })
      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.message || "Failed to update task")
      }
      const updatedTask = await response.json()
      setTasks((prev) =>
        prev.map((task) => (task._id === editingTask._id ? updatedTask : task)),
      )
      setEditingTask(null)

      setFilteredTasks((prev) =>
        prev.map((task) => (task._id === editingTask._id ? updatedTask : task)),)
      setShowForm(false)

    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Delete task from backend
  const handleDeleteTask = async (taskId) => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.message || "Failed to delete task")
      }
      setTasks((prev) => prev.filter((task) => task._id !== taskId))
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Status change handled in TaskCard, but update here state accordingly
  const handleStatusChange = (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((task) =>
        task._id === taskId ? { ...task, status: newStatus, updatedAt: new Date().toISOString() } : task,
      ),
    )
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingTask(null)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
          <p className="text-gray-600 mt-2">Organize and track your tasks efficiently</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          disabled={loading}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Task
        </button>
      </div>

      {/* Filters */}
      <TaskFilters filters={filters} onFiltersChange={setFilters} />

      {/* Task Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <TaskForm
              task={editingTask}
              onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
              onCancel={handleCloseForm}
            />
          </div>
        </div>
      )}

      {/* Task List */}
      <TaskList
        tasks={filteredTasks}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
        onStatusChange={handleStatusChange}
      />

      {/* Loading state */}
      {loading && (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      )}

      {/* Empty State */}
      {filteredTasks.length === 0 && tasks.length > 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks match your filters</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {filteredTasks.length === 0 && tasks.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
          <p className="text-gray-600 mb-4">Get started by creating your first task</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Task
          </button>
        </div>
      )}
    </div>
  )
}

export default TaskManager
