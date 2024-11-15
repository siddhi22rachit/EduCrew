'use client'

import React, { useState } from 'react'
import { Plus, Minus } from 'lucide-react'


export default function CreateStudyGroupForm() {
  const [groupName, setGroupName] = useState('')
  const [memberCount, setMemberCount] = useState(2)
  const [members, setMembers] = useState([
    { name: '', email: '' },
    { name: '', email: '' },
  ])

  const handleMemberChange = (index, field, value) => {
    const newMembers = [...members]
    newMembers[index][field] = value
    setMembers(newMembers)
  }

  const handleMemberCountChange = (increment) => {
    const newCount = memberCount + increment
    if (newCount >= 2 && newCount <= 10) {
      setMemberCount(newCount)
      if (increment > 0) {
        setMembers([...members, { name: '', email: '' }])
      } else {
        setMembers(members.slice(0, -1))
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission here
    console.log({ groupName, members })
  }

  return (
    <div className="flex h-screen bg-gray-900">
     
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto bg-black bg-opacity-70 flex items-center justify-center">
          <div className="bg-gray-900 bg-opacity-90 rounded-xl p-6 w-full max-w-4xl m-4">
            <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">
              Create New Study Group
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  id="groupName"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Group Name"
                  className="w-full bg-gray-800 rounded-lg border border-gray-700 focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent p-2 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Number of Members
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleMemberCountChange(-1)}
                    className="bg-gray-800 rounded-full p-1 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-white">{memberCount}</span>
                  <button
                    type="button"
                    onClick={() => handleMemberCountChange(1)}
                    className="bg-gray-800 rounded-full p-1 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[50vh] overflow-y-auto">
                {members.map((member, index) => (
                  <div key={index} className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-300">Member {index + 1}</h3>
                    <input
                      type="text"
                      placeholder="Name"
                      value={member.name}
                      onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                      className="w-full bg-gray-800 rounded-lg border border-gray-700 focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent p-2 text-white"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={member.email}
                      onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                      className="w-full bg-gray-800 rounded-lg border border-gray-700 focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent p-2 text-white"
                      required
                    />
                  </div>
                ))}
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-white font-medium py-2 px-4 rounded-lg hover:from-fuchsia-600 hover:to-cyan-500 transition-all duration-300"
              >
                Create Group
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}