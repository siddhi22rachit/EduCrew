"use client"

import { useState, useEffect } from "react"
import { PlusCircle, X, CheckCircle2, Calendar, Trash2 } from "lucide-react"
import { axiosInstance } from "../../../lib/axios"

const TaskBox = ({ groupId }) => {
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false)
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState({
    title: "",
    deadline: "",
    subtasks: [],
  })
  const [editingTask, setEditingTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userProgress, setUserProgress] = useState(0)

  useEffect(() => {
    if (groupId) {
      fetchTasks()
      fetchUserProgress()
    }
  }, [groupId])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      // Get all tasks for the group in a single request
      const response = await axiosInstance.get(`/tasks/group/${groupId}`)
      setTasks(response.data)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching tasks:", err)
      setError("Failed to load tasks")
      setLoading(false)
    }
  }

  const fetchUserProgress = async () => {
    try {
      const response = await axiosInstance.get(`/tasks/${groupId}/progress`)
      setUserProgress(response.data.progress)
    } catch (err) {
      console.error("Error fetching user progress:", err)
    }
  }

  // Function to notify other components that progress has been updated
  const notifyProgressUpdated = () => {
    // Create and dispatch a custom event
    const event = new CustomEvent('progressUpdated')
    window.dispatchEvent(event)
  }

  const handleAddTask = async () => {
    if (!newTask.title) {
      alert("Please enter a task title")
      return
    }

    try {
      // Format subtasks as expected by the backend
      const formattedSubtasks = newTask.subtasks.map((subtask) => ({
        title: subtask.title,
        completedBy: [],
      }))

      const response = await axiosInstance.post("/tasks/create", {
        group: groupId,
        title: newTask.title,
        deadline: newTask.deadline,
        subtasks: formattedSubtasks,
      })

      // Refresh tasks after adding a new one
      fetchTasks()
      fetchUserProgress()
      notifyProgressUpdated() // Notify progress components
      resetTaskState()
    } catch (err) {
      console.error("Error creating task:", err)
      alert(err.response?.data?.message || "Failed to create task")
    }
  }

  const handleUpdateTask = async () => {
    if (!newTask.title) {
      alert("Please enter a task title")
      return
    }

    try {
      // Format subtasks as expected by the backend
      const formattedSubtasks = newTask.subtasks.map((subtask) => ({
        title: subtask.title || subtask, // Assuming you want to reset completedBy on update
      }))

      const response = await axiosInstance.put(`/tasks/${editingTask._id}`, {
        title: newTask.title,
        deadline: newTask.deadline,
        subtasks: formattedSubtasks,
      })

      // Refresh tasks after updating
      fetchTasks()
      fetchUserProgress()
      notifyProgressUpdated() // Notify progress components
      resetTaskState()
    } catch (err) {
      console.error("Error updating task:", err)
      alert(err.response?.data?.message || "Failed to update task")
    }
  }

  const handleDeleteTask = async (taskId) => {
    try {
      await axiosInstance.delete(`/tasks/${taskId}`)

      // Remove the task from local state
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId))
      fetchUserProgress()
      notifyProgressUpdated() // Notify progress components
    } catch (err) {
      console.error("Error deleting task:", err)
      alert(err.response?.data?.message || "Failed to delete task")
    }
  }

  const resetTaskState = () => {
    setNewTask({
      title: "",
      deadline: "",
      subtasks: [],
    })
    setEditingTask(null)
    setIsAddTaskModalOpen(false)
  }

  const addSubtask = () => {
    setNewTask((prev) => ({
      ...prev,
      subtasks: [...prev.subtasks, { title: "", completed: false }],
    }))
  }

  const removeSubtask = (index) => {
    setNewTask((prev) => ({
      ...prev,
      subtasks: prev.subtasks.filter((_, i) => i !== index),
    }))
  }

  const handleSubtaskChange = (index, value) => {
    const updatedSubtasks = [...newTask.subtasks]
    updatedSubtasks[index] = {
      title: value,
      completed: false,
    }
    setNewTask((prev) => ({
      ...prev,
      subtasks: updatedSubtasks,
    }))
  }

  const toggleSubtaskCompletion = async (taskId, subtaskIndex) => {
    try {
      const response = await axiosInstance.post("/tasks/subtask/complete", {
        taskId,
        subtaskIndex,
      })

      // Update progress directly from response if available
      if (response.data && response.data.progress !== undefined) {
        setUserProgress(response.data.progress)
      } else {
        // Otherwise, fetch the latest progress
        fetchUserProgress()
      }

      // Refresh tasks to get updated completion status
      fetchTasks()
      notifyProgressUpdated() // Notify progress components
    } catch (err) {
      console.error("Error completing subtask:", err)
      alert(err.response?.data?.message || "Failed to complete subtask")
    }
  }

  const openEditModal = (task) => {
    // Format the task data for editing
    const formattedTask = {
      ...task,
      subtasks: task.subtasks.map((subtask) => ({
        title: subtask.title,
        completed: isSubtaskCompleted(subtask),
      })),
    }

    setNewTask(formattedTask)
    setEditingTask(task)
    setIsAddTaskModalOpen(true)
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "No deadline"
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  // Check if current user has completed a subtask
  const isSubtaskCompleted = (subtask) => {
    // Get current user ID from localStorage or auth context
    const currentUserId = localStorage.getItem("userId") // Adjust based on your auth implementation
    return subtask.completedBy?.some((id) => id === currentUserId)
  }

  // Render the task and subtask list UI
  return (
    <div className="bg-[#0A1128] rounded-lg shadow-md p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-blue-400">Tasks</h2>
        <button
          onClick={() => setIsAddTaskModalOpen(true)}
          className="bg-blue-600 text-white rounded-full p-1 hover:bg-blue-700 transition-colors"
        >
          <PlusCircle size={24} />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-8">{error}</div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-400 mb-4">No tasks created yet</p>
          <button
            onClick={() => setIsAddTaskModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Task
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {tasks.map((task) => (
            <div key={task._id} className="bg-gray-800 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-medium text-white">{task.title}</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openEditModal(task)}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {task.deadline && (
                <div className="flex items-center text-gray-400 text-sm mb-3">
                  <Calendar size={14} className="mr-1" />
                  <span>{formatDate(task.deadline)}</span>
                </div>
              )}

              <div className="space-y-2 mt-4">
                {task.subtasks.map((subtask, index) => (
                  <div
                    key={`${task._id}-subtask-${index}`}
                    className="flex items-center justify-between bg-gray-700 p-2 rounded-md"
                  >
                    <div className="flex items-center">
                      <button
                        onClick={() => toggleSubtaskCompletion(task._id, index)}
                        className={`mr-2 ${
                          isSubtaskCompleted(subtask)
                            ? "text-green-500"
                            : "text-gray-400"
                        }`}
                      >
                        <CheckCircle2 size={18} />
                      </button>
                      <span
                        className={`${
                          isSubtaskCompleted(subtask)
                            ? "line-through text-gray-400"
                            : "text-white"
                        }`}
                      >
                        {subtask.title}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {subtask.completedBy?.length || 0} completed
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Task Modal */}
      {isAddTaskModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">
                {editingTask ? "Edit Task" : "Add New Task"}
              </h3>
              <button
                onClick={resetTaskState}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-1">Task Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter task title"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Deadline</label>
                <input
                  type="date"
                  value={newTask.deadline?.split("T")[0] || ""}
                  onChange={(e) =>
                    setNewTask((prev) => ({ ...prev, deadline: e.target.value }))
                  }
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-gray-300">Subtasks</label>
                  <button
                    onClick={addSubtask}
                    className="text-blue-400 hover:text-blue-300 flex items-center text-sm"
                  >
                    <PlusCircle size={16} className="mr-1" /> Add Subtask
                  </button>
                </div>

                <div className="space-y-2">
                  {newTask.subtasks.map((subtask, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="text"
                        value={subtask.title}
                        onChange={(e) =>
                          handleSubtaskChange(index, e.target.value)
                        }
                        className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter subtask"
                      />
                      <button
                        onClick={() => removeSubtask(index)}
                        className="ml-2 text-red-400 hover:text-red-300"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={resetTaskState}
                  className="mr-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingTask ? handleUpdateTask : handleAddTask}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors"
                >
                  {editingTask ? "Update Task" : "Add Task"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Indicator */}
      <div className="mt-6 pt-4 border-t border-blue-900/50">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-300">Your progress</span>
          <span className="text-blue-400 font-medium">
            {Math.round(userProgress)}%
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${userProgress}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default TaskBox