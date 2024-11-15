'use client'

import React, { useState } from 'react'
import { Plus, Edit2, Save, X, Calendar as CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

export default function TaskPage() {
  const [groups, setGroups] = useState([])
  const [newGroupName, setNewGroupName] = useState('')
  const [newTask, setNewTask] = useState('')
  const [selectedGroup, setSelectedGroup] = useState('')
  const [editingTask, setEditingTask] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [showCalendar, setShowCalendar] = useState(false)

  const handleAddGroup = (e) => {
    e.preventDefault()
    if (newGroupName.trim() !== '') {
      setGroups([...groups, { id: Date.now(), name: newGroupName.trim(), tasks: [] }])
      setNewGroupName('')
    }
  }

  const handleAddTask = (e) => {
    e.preventDefault()
    if (newTask.trim() !== '' && selectedGroup !== '') {
      setGroups(groups.map(group => 
        group.id === parseInt(selectedGroup)
          ? { ...group, tasks: [...group.tasks, { id: Date.now(), text: newTask.trim(), completionDate: null }] }
          : group
      ))
      setNewTask('')
      setSelectedGroup('')
    }
  }

  const handleEditTask = (groupId, taskId, newText) => {
    setGroups(groups.map(group => 
      group.id === groupId
        ? { ...group, tasks: group.tasks.map(task => 
            task.id === taskId ? { ...task, text: newText } : task
          )}
        : group
    ))
  }

  const handleRemoveTask = (groupId, taskId) => {
    setGroups(groups.map(group => 
      group.id === groupId 
        ? { ...group, tasks: group.tasks.filter(task => task.id !== taskId) }
        : group
    ))
  }

  const handleSetCompletionDate = (groupId, taskId, date) => {
    setGroups(groups.map(group => 
      group.id === groupId
        ? { ...group, tasks: group.tasks.map(task => 
            task.id === taskId ? { ...task, completionDate: date } : task
          )}
        : group
    ))
    setShowCalendar(false)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">
        Tasks
      </h1>

      {/* Add New Group Form */}
      <form onSubmit={handleAddGroup} className="mb-8 bg-gray-800 rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Add New Group</h2>
        <div className="flex space-x-2">
          <input
            type="text"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            placeholder="Enter new group name"
            className="flex-1 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent p-2 text-white"
            required
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-fuchsia-500 to-cyan-400 hover:from-fuchsia-600 hover:to-cyan-500 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300"
          >
            Add Group
          </button>
        </div>
      </form>

      {/* Add New Task Form */}
      <form onSubmit={handleAddTask} className="mb-8 bg-gray-800 rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
        <div className="flex flex-col space-y-4">
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent p-2 text-white"
            required
          >
            <option value="">Select a group</option>
            {groups.map(group => (
              <option key={group.id} value={group.id}>{group.name}</option>
            ))}
          </select>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter new task"
            className="bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent p-2 text-white"
            required
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-fuchsia-500 to-cyan-400 hover:from-fuchsia-600 hover:to-cyan-500 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300"
          >
            Add Task
          </button>
        </div>
      </form>

      {/* Groups and Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map(group => (
          <div key={group.id} className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">{group.name}</h2>
            <ul className="space-y-2">
              {group.tasks.map(task => (
                <li key={task.id} className="flex items-center justify-between bg-gray-700 rounded-lg p-2">
                  <div className="flex-1">
                    {editingTask === task.id ? (
                      <input
                        type="text"
                        value={task.text}
                        onChange={(e) => handleEditTask(group.id, task.id, e.target.value)}
                        className="w-full bg-gray-600 rounded p-1 mr-2 text-white"
                        autoFocus
                      />
                    ) : (
                      <span>{task.text}</span>
                    )}
                    {task.completionDate && (
                      <p className="text-xs text-gray-400 mt-1">
                        Deadline: {format(new Date(task.completionDate), 'PP')}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    {editingTask === task.id ? (
                      <button
                        onClick={() => setEditingTask(null)}
                        className="text-green-400 hover:text-green-300"
                        aria-label="Save task"
                      >
                        <Save size={16} />
                      </button>
                    ) : (
                      <button
                        onClick={() => setEditingTask(task.id)}
                        className="text-yellow-400 hover:text-yellow-300"
                        aria-label="Edit task"
                      >
                        <Edit2 size={16} />
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        setSelectedDate(task.completionDate)
                        setShowCalendar(task.id)
                      }}
                      className="text-blue-400 hover:text-blue-300"
                      aria-label="Set completion date"
                    >
                      <CalendarIcon size={16} />
                    </button>
                    <button 
                      onClick={() => handleRemoveTask(group.id, task.id)}
                      className="text-red-400 hover:text-red-300"
                      aria-label="Delete task"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  {showCalendar === task.id && (
                    <div className="absolute z-10 mt-2 bg-gray-800 rounded-lg shadow-lg p-2">
                      <DayPicker
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => handleSetCompletionDate(group.id, task.id, date)}
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