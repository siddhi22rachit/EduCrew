'use client'

import React, { useState } from 'react'
import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, Share, MoreVertical, Users, X } from 'lucide-react'

export default function VideoCallPage() {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [showParticipants, setShowParticipants] = useState(false)

  const participants = [
    { id: 1, name: 'You', isSpeaking: true },
    { id: 2, name: 'Alice', isSpeaking: false },
    { id: 3, name: 'Bob', isSpeaking: false },
    { id: 4, name: 'Charlie', isSpeaking: false },
  ]

  const toggleMute = () => setIsMuted(!isMuted)
  const toggleVideo = () => setIsVideoOff(!isVideoOff)
  const toggleScreenShare = () => setIsScreenSharing(!isScreenSharing)
  const toggleChat = () => setShowChat(!showChat)
  const toggleParticipants = () => setShowParticipants(!showParticipants)

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <header className="bg-gray-800 p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold bg-gradient-to-r from-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">
          Physics Study Group 1
        </h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleParticipants}
            className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-full transition-colors"
          >
            <Users className="w-4 h-4" />
            <span>{participants.length}</span>
          </button>
          <button className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-full transition-colors">
            Leave Call
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 flex">
        <div className="flex-1 grid grid-cols-2 gap-4">
          {participants.map((participant) => (
            <div
              key={participant.id}
              className={`relative rounded-lg overflow-hidden ${
                participant.isSpeaking ? 'ring-2 ring-fuchsia-500' : ''
              }`}
            >
              <img
                src={`/placeholder.svg?height=180&width=320&text=${participant.name}`}
                alt={participant.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-sm">
                {participant.name}
              </div>
            </div>
          ))}
        </div>

        {showChat && (
          <div className="w-80 bg-gray-800 p-4 rounded-lg ml-4">
            <h2 className="text-lg font-semibold mb-4">Chat</h2>
            <div className="space-y-4 h-[calc(100vh-200px)] overflow-y-auto">
              <div className="bg-gray-700 p-2 rounded-lg">
                <p className="font-semibold">Alice</p>
                <p>Hey everyone, how's it going?</p>
              </div>
              <div className="bg-gray-700 p-2 rounded-lg">
                <p className="font-semibold">Bob</p>
                <p>Great! Ready to dive into quantum mechanics?</p>
              </div>
            </div>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Type a message..."
                className="w-full bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent p-2 text-white"
              />
            </div>
          </div>
        )}

        {showParticipants && (
          <div className="w-80 bg-gray-800 p-4 rounded-lg ml-4">
            <h2 className="text-lg font-semibold mb-4">Participants</h2>
            <ul className="space-y-2">
              {participants.map((participant) => (
                <li key={participant.id} className="flex items-center justify-between">
                  <span>{participant.name}</span>
                  {participant.isSpeaking && (
                    <span className="bg-fuchsia-500 text-xs px-2 py-1 rounded-full">
                      Speaking
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>

      <footer className="bg-gray-800 p-4">
        <div className="flex justify-center space-x-4">
          <button
            onClick={toggleMute}
            className={`p-3 rounded-full ${
              isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
            } transition-colors`}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>
          <button
            onClick={toggleVideo}
            className={`p-3 rounded-full ${
              isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
            } transition-colors`}
          >
            {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
          </button>
          <button
            onClick={toggleScreenShare}
            className={`p-3 rounded-full ${
              isScreenSharing ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-700 hover:bg-gray-600'
            } transition-colors`}
          >
            <Share className="w-6 h-6" />
          </button>
          <button
            onClick={toggleChat}
            className={`p-3 rounded-full ${
              showChat ? 'bg-fuchsia-500 hover:bg-fuchsia-600' : 'bg-gray-700 hover:bg-gray-600'
            } transition-colors`}
          >
            <MessageSquare className="w-6 h-6" />
          </button>
          <button className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors">
            <MoreVertical className="w-6 h-6" />
          </button>
          <button className="p-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors">
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      </footer>
    </div>
  )
}