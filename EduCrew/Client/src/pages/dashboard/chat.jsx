'use client';

import React, { useState } from 'react';
import { Send } from 'lucide-react';

const members = [
  { id: 1, name: 'Alice Cooper', avatar: '/placeholder.svg?height=40&width=40' },
  { id: 2, name: 'Bob Dylan', avatar: '/placeholder.svg?height=40&width=40' },
  { id: 3, name: 'Charlie Puth', avatar: '/placeholder.svg?height=40&width=40' },
  { id: 4, name: 'David Bowie', avatar: '/placeholder.svg?height=40&width=40' },
];

const initialMessages = [
  { id: 1, senderId: 2, text: 'Hey everyone! How\'s the study going?', timestamp: '10:00 AM' },
  { id: 2, senderId: 3, text: 'Pretty good! Just finished the quantum mechanics chapter.', timestamp: '10:05 AM' },
  { id: 3, senderId: 4, text: 'I\'m struggling a bit with thermodynamics. Any tips?', timestamp: '10:10 AM' },
  { id: 4, senderId: 1, text: 'Sure, I can help you with that. Let\'s set up a call later?', timestamp: '10:15 AM' },
];

export default function ChatPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const currentUser = 1; // Assuming Alice is the current user

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        senderId: currentUser,
        text: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-900 text-white">
      {/* Chat header */}
      <div className="bg-gray-800 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">
          Physics Study Group
        </h1>
      </div>

      {/* Messages section */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isCurrentUser = message.senderId === currentUser;
          const sender = members.find((m) => m.id === message.senderId);

          return (
            <div
              key={message.id}
              className={`flex items-start space-x-2 ${isCurrentUser ? 'justify-end' : ''}`}
            >
              {!isCurrentUser && (
                <img src={sender.avatar} alt={sender.name} className="w-8 h-8 rounded-full" />
              )}
              <div
                className={`p-3 rounded-lg ${isCurrentUser ? 'bg-fuchsia-500 text-white' : 'bg-gray-800'}`}
                style={{ maxWidth: '70%' }}
              >
                {!isCurrentUser && <p className="font-semibold">{sender.name}</p>}
                <p>{message.text}</p>
                <p className="text-xs text-gray-400 mt-1 text-right">{message.timestamp}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Message input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-gray-800 flex space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-gray-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-fuchsia-500"
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-fuchsia-500 to-cyan-400 hover:from-fuchsia-600 hover:to-cyan-500 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
