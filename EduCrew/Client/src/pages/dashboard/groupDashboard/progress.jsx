"use client"

import { useState, useEffect } from "react"
import { TrendingUp, RefreshCw, AlertCircle } from "lucide-react"
import { axiosInstance } from "../../../lib/axios"

const ProgressBox = ({ groupId, members }) => {
  const [membersProgress, setMembersProgress] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(Date.now())

  // Trigger progress fetch when the component mounts or groupId changes
  useEffect(() => {
    if (groupId) {
      fetchMembersProgress()
      
      // Set an interval to periodically refresh progress data
      const intervalId = setInterval(() => {
        fetchMembersProgress()
      }, 30000) // Refresh every 30 seconds
      
      return () => clearInterval(intervalId) // Clean up on unmount
    }
  }, [groupId])

  // Listen for lastUpdate changes to trigger a refresh
  useEffect(() => {
    if (groupId) {
      fetchMembersProgress()
    }
  }, [lastUpdate])

  // Subscribe to a custom event for progress updates from TaskBox
  useEffect(() => {
    const handleProgressUpdate = () => {
      setLastUpdate(Date.now())
    }

    window.addEventListener('progressUpdated', handleProgressUpdate)
    
    return () => {
      window.removeEventListener('progressUpdated', handleProgressUpdate)
    }
  }, [])

  const fetchMembersProgress = async () => {
    try {
      setLoading(true)
      setError(null)

      // First, manually trigger a progress update on the server
      if (groupId) {
        try {
          await axiosInstance.post(`/tasks/${groupId}/update-progress`)
        } catch (updateErr) {
          console.log("Progress update endpoint not called:", updateErr)
          // Continue even if this fails - might be using an older API
        }
      }

      // Try to fetch from the members-progress endpoint
      try {
        const response = await axiosInstance.get(`/tasks/${groupId}/members-progress`)
        setMembersProgress(response.data.membersProgress || {})
      } catch (err) {
        console.error("Error fetching members progress:", err)

        // Fallback: Calculate progress from tasks directly
        try {
          const tasksResponse = await axiosInstance.get(`/tasks/group/${groupId}`)
          const tasks = tasksResponse.data

          // Calculate progress manually
          const progressMap = calculateProgressFromTasks(tasks, members)
          setMembersProgress(progressMap)
        } catch (fallbackErr) {
          console.error("Fallback also failed:", fallbackErr)
          setError("Failed to load progress data")
        }
      }

      setLoading(false)
    } catch (err) {
      console.error("Error in progress calculation:", err)
      setError("Failed to load progress data")
      setLoading(false)
    }
  }

  // Calculate progress manually from tasks
  const calculateProgressFromTasks = (tasks, members) => {
    const progressMap = {}

    // Initialize progress for all members
    if (members && members.length > 0) {
      members.forEach((member) => {
        const userId = member?.user?._id || member?._id || `member-${Math.random().toString(36).substr(2, 9)}`
        progressMap[userId] = 0
      })
    }

    if (!tasks || tasks.length === 0) return progressMap

    // For each member, calculate their progress
    Object.keys(progressMap).forEach((userId) => {
      let totalSubtasks = 0
      let completedSubtasks = 0

      tasks.forEach((task) => {
        if (task.subtasks && task.subtasks.length > 0) {
          task.subtasks.forEach((subtask) => {
            totalSubtasks++
            if (subtask.completedBy && subtask.completedBy.includes(userId)) {
              completedSubtasks++
            }
          })
        }
      })

      progressMap[userId] = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0
    })

    return progressMap
  }

  const getInitials = (email) => {
    if (!email) return "UN"
    return email.split("@")[0].substring(0, 2).toUpperCase()
  }

  const getDisplayName = (email) => {
    if (!email) return "Unknown"
    return email.split("@")[0]
  }

  // Generate a unique key for each member
  const getMemberKey = (member, index) => {
    const user = member?.user || {}
    // Use a combination of values to ensure uniqueness
    return user._id || member._id || `member-${index}-${Math.random().toString(36).substr(2, 9)}`
  }

  // Try to find member's progress using different ID formats
  const getMemberProgress = (member) => {
    const user = member?.user || {}
    const userId = user._id || member._id
    const email = user.email || member.email
    
    // Check for progress with userId
    if (userId && membersProgress[userId]) {
      return membersProgress[userId]
    }
    
    // Check for progress with email-based ID
    if (email && membersProgress[`email-${email}`]) {
      return membersProgress[`email-${email}`]
    }
    
    // Check other possible formats
    const possibleKeys = Object.keys(membersProgress)
    const emailKey = possibleKeys.find(key => key.includes(email))
    if (emailKey) {
      return membersProgress[emailKey]
    }
    
    return 0 // Default to 0% progress
  }

  return (
    <div className="bg-[#0A1128] rounded-lg shadow-md p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <TrendingUp className="text-blue-500 mr-3" size={24} />
          <h2 className="text-xl font-semibold text-blue-400">Team Progress</h2>
        </div>
        <button
          onClick={fetchMembersProgress}
          className="text-blue-400 hover:text-blue-600 transition-colors"
          disabled={loading}
        >
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {error && (
        <div className="text-red-500 text-center mb-4 flex items-center justify-center">
          <AlertCircle size={16} className="mr-2" />
          {error}
        </div>
      )}

      <div className="space-y-6">
        {members && members.length > 0 ? (
          members.map((member, index) => {
            const memberKey = getMemberKey(member, index)
            const user = member?.user || {}
            const email = user.email || member.email
            const progress = getMemberProgress(member)

            return (
              <div key={memberKey} className="w-full">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium mr-3">
                      {getInitials(email)}
                    </div>
                    <span className="text-white">{getDisplayName(email)}</span>
                  </div>
                  <span className="text-gray-400 text-sm font-medium">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-gray-500 text-center py-8">
            <p>No members found</p>
          </div>
        )}
      </div>

      {members && members.length > 0 && (
        <div className="mt-6 pt-4 border-t border-blue-900/50">
          <div className="text-sm text-blue-400">
            <p>Progress is calculated based on completed subtasks.</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProgressBox