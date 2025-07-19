"use client"
import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline"

const TaskFilters = ({ filters, onFiltersChange }) => {
  const handleStatusChange = (status) => {
    onFiltersChange((prev) => ({
      ...prev,
      status,
    }))
  }

  const handleSearchChange = (e) => {
    onFiltersChange((prev) => ({
      ...prev,
      search: e.target.value,
    }))
  }

  const statusOptions = [
    { value: "all", label: "All Tasks", count: null },
    { value: "pending", label: "Pending", count: null },
    { value: "in-progress", label: "In Progress", count: null },
    { value: "completed", label: "Completed", count: null },
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={filters.search}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2">
          <FunnelIcon className="h-5 w-5 text-gray-400" />
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleStatusChange(option.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filters.status === option.value
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {(filters.search || filters.status !== "all") && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Active filters:</span>
            {filters.status !== "all" && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                Status: {statusOptions.find((opt) => opt.value === filters.status)?.label}
              </span>
            )}
            {filters.search && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                Search: "{filters.search}"
              </span>
            )}
            <button
              onClick={() => onFiltersChange({ status: "all", search: "" })}
              className="text-blue-600 hover:text-blue-700 text-xs underline ml-2"
            >
              Clear all
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TaskFilters
