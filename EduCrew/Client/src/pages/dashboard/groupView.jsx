"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Loader2, Trash2, Eye, Search } from "lucide-react"
import { isAuthenticated} from "../../utils/auth.js"

const GroupView = () => {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()

  const fetchGroups = async () => {
    try {
      setLoading(true)
      // Get the token from localStorage
      const token = localStorage.getItem("authToken")

      // Log the token to verify it exists (for debugging)
      console.log("🔹 Sending token:", token ? "Token exists" : "No token found")

      if (!token) {
        throw new Error("No authentication token found. Please log in again.")
      }

      const response = await axios.get("http://localhost:5000/api/groups/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("Groups data received:", response.data)
      setGroups(response.data)
      setError(null) // Clear any previous errors
    } catch (err) {
      console.error("Error fetching groups:", err)

      // Provide more specific error messages based on the error
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (err.response.status === 401 || err.response.status === 403) {
          setError("Authentication error. Please log in again.")
          // Redirect to login after a short delay
          setTimeout(() => {
            navigate("/sign-in")
          }, 3000)
        } else {
          setError(`Server error: ${err.response.data.message || "Failed to fetch groups"}`)
        }
      } else if (err.request) {
        // The request was made but no response was received
        setError("No response from server. Please check your connection.")
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(err.message || "Failed to fetch groups. Please try again later.")
      }
    } finally {
      setLoading(false)
    }
  }

  const filteredGroups = groups.filter((group) => group.groupName.toLowerCase().includes(searchTerm.toLowerCase()))

  const deleteGroup = async (groupId) => {
    try {
      if (!window.confirm("Are you sure you want to delete this group?")) {
        return
      }

      const token = localStorage.getItem("authToken")

      if (!token) {
        throw new Error("No authentication token found. Please log in again.")
      }

      await axios.delete(`http://localhost:5000/api/groups/${groupId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setGroups(groups.filter((group) => group._id !== groupId))
    } catch (err) {
      console.error("Error deleting group:", err)

      if (err.response && err.response.status === 403) {
        alert("You do not have permission to delete this group.")
      } else {
        alert("Error deleting group: " + (err.response?.data?.message || err.message))
      }
    }
  }

  // Check authentication and fetch groups on component mount
  useEffect(() => {
    if (!isAuthenticated()) {
      setError("You need to be logged in to view groups")
      setTimeout(() => {
        navigate("/sign-in")
      }, 2000)
      return
    }

    fetchGroups()
  }, [navigate])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="animate-spin-slow">
          <Loader2 className="w-12 h-12 text-blue-400" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 space-y-4 md:space-y-0">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            My Groups
          </h1>

          <div className="flex space-x-4">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 outline-none transition-all duration-300"
              />
            </div>

            <button
              onClick={() => navigate("/dashboard/group-form")}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300"
            >
              Create Group
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 animate-fadeIn">
            {error}
            <button onClick={fetchGroups} className="ml-4 underline hover:text-red-300">
              Try Again
            </button>
          </div>
        )}

        {filteredGroups.length === 0 && !error ? (
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-8 text-center animate-fadeIn">
            <p className="text-gray-400 text-lg">No groups found</p>
            <button
              onClick={() => navigate("/dashboard/group-form")}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300"
            >
              Create Your First Group
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredGroups.map((group) => (
              <div
                key={group._id}
                className="group bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 hover:bg-gray-700/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 animate-fadeIn"
              >
                <h2 className="text-2xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">
                  {group.groupName}
                </h2>
                <p className="text-gray-400 mb-4">
                  {group.memberCount} {group.memberCount === 1 ? "member" : "members"}
                </p>
                {group.isAdmin && (
                  <span className="inline-block bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full mb-4">
                    Admin
                  </span>
                )}
                <div className="flex space-x-4">
                  <div
                    onClick={() => navigate(`/dashboard/group/${group._id}`)}
                    className="flex items-center cursor-pointer text-gray-400 hover:text-blue-400 transition-colors duration-300"
                  >
                    <Eye className="w-5 h-5 mr-2" />
                    <span>View</span>
                  </div>
                  {group.isAdmin && (
                    <div
                      onClick={() => deleteGroup(group._id)}
                      className="flex items-center cursor-pointer text-gray-400 hover:text-red-400 transition-colors duration-300"
                    >
                      <Trash2 className="w-5 h-5 mr-2" />
                      <span>Delete</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default GroupView
