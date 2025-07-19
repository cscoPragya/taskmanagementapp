import TaskCard from "./TaskCard"

const TaskList = ({ tasks, onEdit, onDelete, onStatusChange }) => {
  const groupTasksByStatus = () => {
    const grouped = {
      pending: [],
      "in-progress": [],
      completed: [],
    }

    tasks.forEach((task) => {
      if (grouped[task.status]) {
        grouped[task.status].push(task)
      }
    })

    return grouped
  }

  const groupedTasks = groupTasksByStatus()

  const getStatusTitle = (status) => {
    switch (status) {
      case "pending":
        return "Pending"
      case "in-progress":
        return "In Progress"
      case "completed":
        return "Completed"
      default:
        return status
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "border-yellow-200 bg-yellow-50"
      case "in-progress":
        return "border-blue-200 bg-blue-50"
      case "completed":
        return "border-green-200 bg-green-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  if (tasks.length === 0) {
    return null
  }

  return (
    <div className="space-y-8">
      {Object.entries(groupedTasks).map(
        ([status, statusTasks]) =>
          statusTasks.length > 0 && (
            <div key={status} className={`rounded-xl border-2 p-6 ${getStatusColor(status)}`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">{getStatusTitle(status)}</h2>
                <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-600 shadow-sm">
                  {statusTasks.length} {statusTasks.length === 1 ? "task" : "tasks"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statusTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onStatusChange={onStatusChange}
                  />
                ))}
              </div>
            </div>
          ),
      )}
    </div>
  )
}

export default TaskList
