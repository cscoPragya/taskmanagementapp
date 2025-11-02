"use client"

import { useState } from "react"
import { PencilIcon, TrashIcon, CalendarIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline"

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100 border-red-200"
      case "medium":
        return "text-yellow-600 bg-yellow-100 border-yellow-200"
      case "low":
        return "text-green-600 bg-green-100 border-green-200"
      default:
        return "text-gray-600 bg-gray-100 border-gray-200"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-700 bg-yellow-100"
      case "in-progress":
        return "text-blue-700 bg-blue-100"
      case "completed":
        return "text-green-700 bg-green-100"
      default:
        return "text-gray-700 bg-gray-100"
    }
  }

  const formatStatus = (status) => {
    return status
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const formatDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const isOverdue = (dueDate) => {
    if (!dueDate) return false
    const today = new Date()
    const due = new Date(dueDate)
    today.setHours(0, 0, 0, 0)
    due.setHours(0, 0, 0, 0)
    return due < today && task.status !== "completed"
  }

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return

    setIsDeleting(true)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${import.meta.VITE_BACKEND_URL}/api/tasks/${task._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.message || "Failed to delete task")
      }

      onDelete(task._id) // inform parent to remove from list
    } catch (error) {
      alert(error.message)
      setIsDeleting(false)
    }
  }

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${import.meta.VITE_BACKEND_URL}/api/tasks/${task._id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.message || "Failed to update status")
      }

      const data = await response.json()
      onStatusChange(task._id, data.status || newStatus) // update parent state
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 ${isDeleting ? "opacity-50 scale-95" : ""
        }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{task.title}</h3>
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
            {isOverdue(task.dueDate) && (
              <span className="flex items-center text-red-600 text-xs">
                <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                Overdue
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
            title="Edit task"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
            title="Delete task"
            disabled={isDeleting}
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{task.description}</p>

      {/* Due Date */}
      {task.dueDate && (
        <div className={`flex items-center text-sm mb-4 ${isOverdue(task.dueDate) ? "text-red-600" : "text-gray-500"}`}>
          <CalendarIcon className="h-4 w-4 mr-2" />
          Due: {formatDate(task.dueDate)}
        </div>
      )}

      {/* Status Selector */}
      <div className="flex items-center justify-between">
        <select
          value={task.status}
          onChange={handleStatusChange}
          className={`px-3 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-blue-500 ${getStatusColor(task.status)}`}
          disabled={isDeleting}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <div className="text-xs text-gray-400">{formatDate(task.updatedAt)}</div>
      </div>
    </div>
  )
}

export default TaskCard
