'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Save, X, Calendar as CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { baseUrl } from '../../config/config'

export default function TaskPage() {
  const [groups, setGroups] = useState([])
  const [newTask, setNewTask] = useState('')
  const [selectedGroup, setSelectedGroup] = useState('')
  const [editingTask, setEditingTask] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [showCalendar, setShowCalendar] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchGroups()
  }, [])

  const fetchGroups = async () => {
    try {
      const response = await axios.get(`${baseUrl}/groups`)
      if (response.data && Array.isArray(response.data.data)) {
        setGroups(response.data.data)
      } else {
        console.error('Unexpected response format:', response.data)
        setGroups([])
      }
    } catch (error) {
      console.error('Error fetching groups:', error)
      toast.error('Failed to load groups')
      setGroups([])
    }
  }

  const handleAddTask = async (e) => {
    e.preventDefault()
    if (!selectedGroup || !newTask.trim()) {
      toast.warning('Please select a group and enter a task')
      return
    }

    setLoading(true)
    try {
      const response = await axios.post(`${baseUrl}/tasks/add`, {
        title: newTask.trim(),
        groupId: selectedGroup
      })

      if (response.data) {
        toast.success('Task added successfully')
        setNewTask('')
        setSelectedGroup('')
        await fetchGroups() // Refresh the groups to show the new task
      }
    } catch (error) {
      console.error('Error adding task:', error)
      toast.error('Failed to add task')
    } finally {
      setLoading(false)
    }
  }

  const handleEditTask = async (groupId, taskId, newText) => {
    try {
      await axios.put(`${baseUrl}/tasks/update/${taskId}`, { title: newText })
      toast.success('Task updated successfully')
      await fetchGroups() // Refresh the groups to show the updated task
    } catch (error) {
      console.error('Error updating task:', error)
      toast.error('Failed to update task')
    }
    setEditingTask(null)
  }

  const handleRemoveTask = async (groupId, taskId) => {
    try {
      await axios.delete(`${baseUrl}/tasks/delete/${taskId}`)
      toast.success('Task removed successfully')
      await fetchGroups() // Refresh the groups to remove the deleted task
    } catch (error) {
      console.error('Error removing task:', error)
      toast.error('Failed to remove task')
    }
  }

  const handleSetCompletionDate = async (groupId, taskId, date) => {
    try {
      await axios.put(`${baseUrl}/tasks/update/${taskId}`, { completionDate: date })
      toast.success('Task deadline updated successfully')
      await fetchGroups() // Refresh the groups to show the updated deadline
    } catch (error) {
      console.error('Error updating task deadline:', error)
      toast.error('Failed to update task deadline')
    }
    setShowCalendar(false)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">
        Tasks
      </h1>

      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Plus className="w-6 h-6" />
          <h2 className="text-xl font-semibold">Add New Task</h2>
        </div>
        
        <form onSubmit={handleAddTask} className="space-y-4">
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="w-full bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent p-3 text-white appearance-none"
            required
          >
            <option value="">Select a group</option>
            {groups.map((group) => (
              <option key={group._id} value={group._id}>
                {group.groupName || group.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter new task"
            className="w-full bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent p-3 text-white"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-white font-medium py-3 px-4 rounded-lg hover:from-fuchsia-600 hover:to-cyan-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Adding Task...' : 'Add Task'}
          </button>
        </form>
      </div>

      {/* Groups and Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <div key={group._id} className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">{group.groupName || group.name}</h2>
            <ul className="space-y-2">
              {group.tasks && group.tasks.map((task) => (
                <li key={task._id} className="flex items-center justify-between bg-gray-700 rounded-lg p-2">
                  <div className="flex-1">
                    {editingTask === task._id ? (
                      <input
                        type="text"
                        defaultValue={task.title}
                        onBlur={(e) => handleEditTask(group._id, task._id, e.target.value)}
                        className="w-full bg-gray-600 rounded p-1 mr-2 text-white"
                        autoFocus
                      />
                    ) : (
                      <span>{task.title}</span>
                    )}
                    {task.completionDate && (
                      <p className="text-xs text-gray-400 mt-1">
                        Deadline: {format(new Date(task.completionDate), 'PP')}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingTask(editingTask === task._id ? null : task._id)}
                      className="text-yellow-400 hover:text-yellow-300"
                      aria-label={editingTask === task._id ? "Save task" : "Edit task"}
                    >
                      {editingTask === task._id ? <Save size={16} /> : <Edit2 size={16} />}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedDate(task.completionDate)
                        setShowCalendar(task._id)
                      }}
                      className="text-blue-400 hover:text-blue-300"
                      aria-label="Set completion date"
                    >
                      <CalendarIcon size={16} />
                    </button>
                    <button
                      onClick={() => handleRemoveTask(group._id, task._id)}
                      className="text-red-400 hover:text-red-300"
                      aria-label="Delete task"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  {showCalendar === task._id && (
                    <div className="absolute z-10 mt-2 bg-gray-800 rounded-lg shadow-lg p-2">
                      <DayPicker
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => handleSetCompletionDate(group._id, task._id, date)}
                        footer={
                          <button
                            onClick={() => setShowCalendar(false)}
                            className="w-full mt-2 bg-gray-700 text-white rounded-lg py-1 hover:bg-gray-600 transition-colors"
                          >
                            Close
                          </button>
                        }
                      />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}