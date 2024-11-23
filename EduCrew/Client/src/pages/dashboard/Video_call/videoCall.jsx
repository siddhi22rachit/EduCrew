import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

function VideoCall() {
  const navigate = useNavigate();
  const [input, setInput] = useState("")
  const [showJoinInput, setShowJoinInput] = useState(false)
  const [joinLink, setJoinLink] = useState("")

  const handleGroupCall = () => {
    if (input.trim()) {
      navigate(`/room/${input}`);
    }
  }

  const handleJoinMeeting = () => {
    setShowJoinInput(true)
  }

  const handleEnterMeeting = () => {
    if (joinLink) {
      window.location.href = joinLink.startsWith('http') ? joinLink : `https://${joinLink}`
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-gray-900 p-8 rounded-xl shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tighter text-white">
            EduCrew Video Calling
          </h1>
          <p className="text-gray-400">
            Connect with your peers through video calls
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name-input" className="block text-sm font-medium text-gray-400">
              Enter your name
            </label>
            <input 
              id="name-input"
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              type='text' 
              placeholder='Your name'
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button
            onClick={handleGroupCall}
            disabled={!input.trim()}
            className="w-full px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 bg-[#a855f7] hover:bg-[#9333ea] text-white focus:ring-purple-500 disabled:bg-gray-700 disabled:text-gray-500 transition-colors duration-200"
          >
            Start Group Call
          </button>
          <button
            onClick={handleJoinMeeting}
            className="w-full px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 focus:ring-gray-500 transition-colors duration-200"
          >
            Join a Meeting
          </button>
        </div>

        {showJoinInput && (
          <div className="space-y-2">
            <label htmlFor="join-link" className="block text-sm font-medium text-gray-400">
              Enter meeting link
            </label>
            <input
              id="join-link"
              type="text"
              value={joinLink}
              onChange={(e) => setJoinLink(e.target.value)}
              placeholder="https://meeting-link.com"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleEnterMeeting}
              disabled={!joinLink.trim()}
              className="w-full px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 bg-[#a855f7] hover:bg-[#9333ea] text-white focus:ring-purple-500 disabled:bg-gray-700 disabled:text-gray-500 transition-colors duration-200"
            >
              Enter Meeting
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default VideoCall