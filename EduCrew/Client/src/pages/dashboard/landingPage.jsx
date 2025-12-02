"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { PlusCircle, ChevronDown } from "lucide-react"
import { useAuthStore } from "../../store/useAuthStore"
import { axiosInstance } from "../../lib/axios"
import toast from "react-hot-toast"

const Dashboard = () => {
  const studyFacts = [
  "Did you know? Reading out loud can improve your memory retention.",
  "Fun fact: Studying in shorter sessions (25–30 mins) boosts focus and learning.",
  "Did you know? Teaching someone else is one of the best ways to learn.",
  "Fun fact: Your brain retains information better when you use multiple senses.",
  "Did you know? Taking notes by hand can improve comprehension more than typing.",
  "Fun fact: Studying in a tidy, organized space improves concentration.",
  "Did you know? Listening to classical music may enhance your focus during study.",
  "Fun fact: Taking short breaks between study sessions improves long-term retention.",
  "Did you know? Rewriting key concepts in your own words strengthens memory.",
  "Fun fact: Using visual aids like diagrams or charts makes studying more effective."
];


  const navigate = useNavigate()
  const { authUser, logout, isUserValid } = useAuthStore()
  const [shapes, setShapes] = useState([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const [randomFact, setRandomFact] = useState("");

useEffect(() => {
  const index = Math.floor(Math.random() * studyFacts.length);
  setRandomFact(studyFacts[index]);
}, []); 
 

  useEffect(() => {
    if (!isUserValid()) {
      navigate("/sign-in")
      return
    }

   

   

    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    // Background animation shapes - enhanced with more blue theme
    const newShapes = Array(8)
      .fill(null)
      .map((_, i) => ({
        id: i,
        width: Math.floor(Math.random() * 500 + 300),
        height: Math.floor(Math.random() * 500 + 300),
        left: Math.floor(Math.random() * 100),
        top: Math.floor(Math.random() * 100),
        delay: i * 1.5,
        duration: Math.floor(Math.random() * 15 + 15),
        opacity: Math.random() * 0.04 + 0.02,
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
    <div className="min-h-screen bg-black text-blue-50 flex relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 z-0 bg-black">
        {shapes.map((shape) => (
          <div
            key={shape.id}
            className="absolute rounded-full mix-blend-screen filter blur-3xl"
            style={{
              background: shape.id % 3 === 0 
                ? "rgba(59, 130, 246, 0.07)" 
                : shape.id % 3 === 1 
                  ? "rgba(14, 165, 233, 0.05)" 
                  : "rgba(6, 182, 212, 0.03)",
              width: `${shape.width}px`,
              height: `${shape.height}px`,
              left: `${shape.left}%`,
              top: `${shape.top}%`,
              animationDelay: `${shape.delay}s`,
              animationDuration: `${shape.duration}s`,
              opacity: shape.opacity,
              animation: "pulse 15s infinite ease-in-out",
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col z-10 w-full">
        {/* Header - Upgraded */}
        <header className="h-16 border-b border-blue-900/40 flex items-center justify-between px-6 bg-black shadow-lg shadow-blue-900/5">
          <div className="flex items-center">
            
            <h1 className="text-xl font-semibold text-blue-100">Dashboard</h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-sm text-blue-200 hidden md:block">{formattedTime}</div>
            <div className="relative">
              <button
                className="flex items-center gap-3 hover:bg-blue-800/20 p-2 px-3 rounded-full transition-all duration-300"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <img
                  src={authUser.profilePic || "/placeholder.svg?height=32&width=32"}
                  alt={authUser.fullName}
                  className="w-8 h-8 rounded-full border-2 border-blue-500 shadow-md shadow-blue-500/20 object-contain"
                />
                <span className="text-sm font-medium text-blue-100">{authUser.fullName}</span>
                <ChevronDown className="w-4 h-4 text-blue-300" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-black border border-blue-900/50 rounded-lg shadow-xl py-1 shadow-blue-900/20 z-50">
                  <button
                    onClick={() => navigate("/profile")}
                    className="block w-full text-left px-4 py-2 text-sm text-blue-100 hover:bg-blue-800/30 transition-colors"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => navigate("/settings")}
                    className="block w-full text-left px-4 py-2 text-sm text-blue-100 hover:bg-blue-800/30 transition-colors"
                  >
                    Notifications
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-5xl mx-auto">
            {/* Welcome Banner with Enhanced Glow Effect */}
            <div className="relative bg-gradient-to-r from-blue-950/40 to-black rounded-xl p-8 mb-8 overflow-hidden group hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-500 border border-blue-900/30">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-400/5 blur-3xl scale-150 opacity-30 group-hover:opacity-40 transition-opacity duration-500" />
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 via-transparent to-cyan-400/10 blur opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative text-center">
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-3">
                  Welcome back, {authUser.fullName}!
                </h2>
                <p className="text-blue-200 text-lg">Join the next generation of collaborative learning</p>
              </div>
            </div>

            {/* Create New Group Button - Enhanced */}
            <button
              onClick={handleNavigate}
              className="w-full bg-gradient-to-r from-blue-950/40 to-black hover:from-blue-900/40 hover:to-blue-950/40 border border-blue-700/30 rounded-xl p-5 mb-8 flex items-center justify-center gap-3 transition-all duration-300 transform hover:scale-[1.01] group shadow-lg shadow-blue-900/5 hover:shadow-blue-800/10"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-blue-500/20 transition-all duration-300 transform group-hover:scale-110">
                <PlusCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-base font-medium text-blue-100">Create New Study Group</span>
            </button>

            {/* Study Groups Grid - Enhanced */}
            {randomFact && (
  <div className="mb-8 p-4 rounded-lg bg-blue-900/20 border border-blue-700/30 text-blue-200 text-center animate-fadeIn">
    {randomFact}
  </div>
)}

            
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard