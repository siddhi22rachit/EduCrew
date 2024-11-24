'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Minus, Trash2 } from 'lucide-react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useParams, useNavigate } from 'react-router-dom'

const BASE_URL = 'http://localhost:5000/api'

export default function TaskPage() {
  const { groupId } = useParams()
  const navigate = useNavigate()
  
  // State for task creation
  const [taskName, setTaskName] = useState('')
  const [subtasks, setSubtasks] = useState([{ name: '' }])
  
  // State for existing tasks and group details
  const [existingTasks, setExistingTasks] = useState([])
  const [groupDetails, setGroupDetails] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch group details and existing tasks when component mounts
  useEffect(() => {
    const fetchGroupDetails = async () => {
      if (!groupId) {
        toast.error('Invalid Group ID')
        navigate('/dashboard')
        return
      }

      try {
        setIsLoading(true)
        
        // Fetch group details
        const groupResponse = await axios.get(`${BASE_URL}/groups/${groupId}`)
        
        // Fetch existing tasks for this group
        const tasksResponse = await axios.get(`${BASE_URL}/tasks/group/${groupId}`)
        
        setGroupDetails(groupResponse.data)
        setExistingTasks(tasksResponse.data || [])
      } catch (error) {
        console.error('Error fetching group details:', error)
        toast.error(error.response?.data?.message || 'Failed to load group details')
        navigate('/dashboard')
      } finally {
        setIsLoading(false)
      }
    }

    fetchGroupDetails()
  }, [groupId, navigate])

  // Handle subtask input changes
  const handleSubtaskChange = (index, value) => {
    const newSubtasks = [...subtasks]
    newSubtasks[index].name = value
    setSubtasks(newSubtasks)
  }

  // Add a new subtask
  const handleAddSubtask = () => {
    if (subtasks.length < 10) {
      setSubtasks([...subtasks, { name: '' }])
    } else {
      toast.warning('Maximum 10 subtasks allowed')
    }
  }

  // Remove a subtask
  const handleRemoveSubtask = (index) => {
    if (subtasks.length > 1) {
      const newSubtasks = subtasks.filter((_, i) => i !== index)
      setSubtasks(newSubtasks)
    }
  }

  // Submit task creation
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate task name
    if (!taskName.trim()) {
      toast.error('Task name is required')
      return
    }

    // Validate subtasks
    if (subtasks.some(task => !task.name.trim())) {
      toast.error('All subtasks must have a name')
      return
    }

    try {
      // POST request to create task
      const response = await axios.post(`${BASE_URL}/tasks`, {
        groupId,
        taskName: taskName.trim(),
        subtasks: subtasks.map(st => ({ name: st.name.trim() }))
      })

      if (response.status === 201) {
        toast.success('Task added successfully!')
        
        // Refresh tasks list
        const updatedTasksResponse = await axios.get(`${BASE_URL}/tasks/group/${groupId}`)
        setExistingTasks(updatedTasksResponse.data)
        
        // Reset form
        setTaskName('')
        setSubtasks([{ name: '' }])
      }
    } catch (error) {
      console.error('Error adding task:', error)
      toast.error(error.response?.data?.message || 'Failed to add task')
    }
  }

  // Delete a task
  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`${BASE_URL}/tasks/${taskId}/group/${groupId}`)
      setExistingTasks(prev => prev.filter(task => task._id !== taskId))
      toast.success('Task deleted successfully!')
    } catch (error) {
      console.error('Error deleting task:', error)
      toast.error('Failed to delete task')
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-900 items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-900 p-6">
      <ToastContainer />
      <div className="w-full max-w-4xl mx-auto space-y-6">
        {/* Group Header */}
        {groupDetails && (
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-purple-500 to-blue-400 bg-clip-text text-transparent">
              {groupDetails.groupName}
            </h2>
            <p className="text-center text-gray-400 mt-2">
              Members: {groupDetails.totalMembers}
            </p>
          </div>
        )}

        {/* Task Creation Form */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4 text-white">Create New Task</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Task Name"
              className="w-full bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-purple-500 p-2 text-white"
              required
            />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-300">Subtasks</h4>
                <button
                  type="button"
                  onClick={handleAddSubtask}
                  className="flex items-center space-x-1 text-purple-400 hover:text-purple-300"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Subtask</span>
                </button>
              </div>

              {subtasks.map((subtask, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={subtask.name}
                    onChange={(e) => handleSubtaskChange(index, e.target.value)}
                    placeholder={`Subtask ${index + 1}`}
                    className="flex-1 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-purple-500 p-2 text-white"
                    required
                  />
                  {subtasks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-blue-400 text-white font-medium py-2 px-4 rounded-lg hover:from-purple-600 hover:to-blue-500 transition-all duration-300"
            >
              Create Task
            </button>
          </form>
        </div>

        {/* Existing Tasks */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4 text-white">Tasks</h3>
          {existingTasks.length === 0 ? (
            <p className="text-center text-gray-400">No tasks created yet</p>
          ) : (
            <div className="space-y-4">
              {existingTasks.map((task) => (
                <div 
                  key={task._id} 
                  className="bg-gray-700 rounded-lg p-4 flex justify-between items-start"
                >
                  <div className="space-y-2">
                    <h4 className="text-white font-medium">{task.taskName}</h4>
                    <ul className="space-y-1">
                      {task.subtasks.map((subtask, index) => (
                        <li 
                          key={index}
                          className="text-gray-300 text-sm flex items-center space-x-2"
                        >
                          <span>• {subtask.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="text-red-400 hover:text-red-300 p-1"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}