"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { PlusCircle, ChevronDown } from "lucide-react"
import { useAuthStore } from "../../store/useAuthStore"
import { axiosInstance } from "../../lib/axios"
import toast from "react-hot-toast"

const Dashboard = () => {
  const navigate = useNavigate()
  const { authUser, logout, isUserValid } = useAuthStore()
  const [shapes, setShapes] = useState([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [studyGroups, setStudyGroups] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isUserValid()) {
      navigate("/sign-in")
      return
    }

    const fetchStudyGroups = async () => {
      try {
        setIsLoading(true)
        const response = await axiosInstance.get("/study-groups")
        setStudyGroups(response.data)
      } catch (error) {
        console.error("Error fetching study groups:", error)
        toast.error("Failed to load study groups")
      } finally {
        setIsLoading(false)
      }
    }

    fetchStudyGroups()

    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    // Background animation shapes
    const newShapes = Array(5)
      .fill(null)
      .map((_, i) => ({
        id: i,
        width: Math.floor(Math.random() * 400 + 200),
        height: Math.floor(Math.random() * 400 + 200),
        left: Math.floor(Math.random() * 100),
        top: Math.floor(Math.random() * 100),
        delay: i * 2,
        duration: Math.floor(Math.random() * 10 + 10),
      }))
    setShapes(newShapes)

    return () => clearInterval(timer)
  }, [navigate, isUserValid])

  const handleLogout = async () => {
    await logout()
    navigate("/sign-in")
  }

  const handleNavigate = () => {
    navigate("/dashboard/group-form")
  }

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })

  if (!authUser) {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white flex relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        {shapes.map((shape) => (
          <div
            key={shape.id}
            className="absolute rounded-full mix-blend-screen filter blur-3xl animate-pulse"
            style={{
              background: shape.id % 2 ? "rgba(236, 72, 153, 0.05)" : "rgba(34, 211, 238, 0.05)",
              width: `${shape.width}px`,
              height: `${shape.height}px`,
              left: `${shape.left}%`,
              top: `${shape.top}%`,
              animationDelay: `${shape.delay}s`,
              animationDuration: `${shape.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col z-10">
        {/* Header */}
        <header className="h-14 border-b border-gray-800 flex items-center justify-between px-4 bg-gray-900/50 backdrop-blur-xl">
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                className="flex items-center gap-2 hover:bg-gray-800/50 p-1 rounded-lg transition-colors"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <img
                  src={authUser.profilePicture || "/placeholder.svg?height=32&width=32"}
                  alt={authUser.username}
                  className="w-8 h-8 rounded-full border-2 border-fuchsia-500"
                />
                <span className="text-sm font-medium">{authUser.username}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-xl border border-gray-800 rounded-lg shadow-xl py-1">
                  <button
                    onClick={() => navigate("/profile")}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-fuchsia-500/10 transition-colors"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => navigate("/settings")}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-fuchsia-500/10 transition-colors"
                  >
                    Notifications
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 overflow-auto">
          <div className="max-w-5xl mx-auto">
            {/* Website Tagline with Glow Effect */}
            <div className="relative bg-gradient-to-r from-fuchsia-500/5 to-cyan-400/5 rounded-xl p-6 mb-6 overflow-hidden group hover:from-fuchsia-500/10 hover:to-cyan-400/10 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/20 to-cyan-400/20 blur-2xl scale-150 animate-pulse" />
              <div className="relative text-center">
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-fuchsia-500 to-cyan-400 bg-clip-text text-transparent mb-2 animate-pulse">
                  Welcome back, {authUser.username}!
                </h2>
                <p className="text-gray-300 text-lg">Join the next generation of collaborative learning</p>
              </div>
            </div>

            {/* Create New Group Button */}
            <button
              onClick={handleNavigate}
              className="w-full bg-gradient-to-r from-fuchsia-500/10 to-cyan-400/10 hover:from-fuchsia-500/20 hover:to-cyan-400/20 border border-fuchsia-500/30 rounded-xl p-4 mb-6 flex items-center justify-center gap-3 transition-all duration-300 transform hover:scale-[1.01] group"
            >
              <PlusCircle className="w-5 h-5 text-fuchsia-500 group-hover:rotate-90 transition-transform duration-300" />
              <span className="text-base font-medium">Create New Study Group</span>
            </button>

            {/* Study Groups Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoading ? (
                <div className="col-span-full text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-fuchsia-500 border-t-transparent rounded-full mx-auto mb-4" />
                  <p className="text-gray-400">Loading study groups...</p>
                </div>
              ) : studyGroups.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-400">No study groups found. Create one to get started!</p>
                </div>
              ) : (
                studyGroups.map((group) => (
                  <div
                    key={group.id}
                    className="group bg-gray-900/30 backdrop-blur-xl p-4 rounded-xl border border-gray-800 hover:border-fuchsia-500 transition-all duration-300 hover:transform hover:scale-[1.02]"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <h3 className="font-medium">{group.name}</h3>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">
                      Currently discussing: {group.currentTopic || "No active discussion"}
                    </p>
                    <div className="flex -space-x-2">
                      {group.members.slice(0, 3).map((member, i) => (
                        <div
                          key={i}
                          className="w-6 h-6 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 border-2 border-black"
                        />
                      ))}
                      {group.members.length > 3 && (
                        <div className="w-6 h-6 rounded-full bg-gray-800 border-2 border-black flex items-center justify-center text-xs">
                          +{group.members.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard