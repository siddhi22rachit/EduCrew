import React, { useState } from 'react';
import {
  Clock, MessageCircle, FileText, CheckSquare, 
  Users, Plus, Home, Check, Send, X,
  ChevronRight, ChevronLeft, Edit2, Trash2,
  Video
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const GroupView = () => {
  const [showChat, setShowChat] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [message, setMessage] = useState('');
  const [editingTask, setEditingTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState("Quantum Mechanics Chapter 5");
  const [showAddNote, setShowAddNote] = useState(false);
  const [showAddResource, setShowAddResource] = useState(false);
  
  const members = [
    { name: 'John Doe', progress: 85, online: true, tasksCompleted: 12 },
    { name: 'Sarah Smith', progress: 92, online: true, tasksCompleted: 15 },
    { name: 'Mike Johnson', progress: 78, online: false, tasksCompleted: 10 },
    { name: 'Amy Wilson', progress: 65, online: true, tasksCompleted: 8 },
  ];

  const resources = [
    { type: 'pdf', name: 'Quantum States Guide', author: 'John Doe', date: '2024-03-15' },
    { type: 'video', name: 'Wave Functions Explained', author: 'Sarah Smith', date: '2024-03-14' },
    { type: 'pdf', name: 'Practice Problems Set', author: 'Mike Johnson', date: '2024-03-13' }
  ];

  const notes = [
    { title: 'Wave Function Notes', author: 'Sarah Smith', date: '2024-03-15' },
    { title: 'Key Quantum Concepts', author: 'John Doe', date: '2024-03-14' },
    { title: 'Chapter 5 Summary', author: 'Amy Wilson', date: '2024-03-13' }
  ];

  const [steps, setSteps] = useState([
    { id: 1, text: "Read pages 120-135", completed: true },
    { id: 2, text: "Complete practice problems", completed: true },
    { id: 3, text: "Review key concepts", completed: false },
    { id: 4, text: "Submit summary notes", completed: false }
  ]);

  const messages = [
    { author: 'John Doe', text: 'Has everyone reviewed the wave functions?', time: '10:30 AM' },
    { author: 'Sarah Smith', text: 'Yes, I have some questions about the practice problems', time: '10:32 AM' },
    { author: 'Mike Johnson', text: 'I can help explain those', time: '10:35 AM' },
  ];

  const Modal = ({ show, onClose, title, children }) => {
    if (!show) return null;
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  };

  const toggleStep = (id) => {
    setSteps(steps.map(step =>
      step.id === id ? { ...step, completed: !step.completed } : step
    ));
  };

  const calculateProgress = () => {
    const completed = steps.filter(step => step.completed).length;
    return Math.round((completed / steps.length) * 100);
  };

  const deleteTask = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      setSteps([]);
      setTaskTitle('');
    }
  };

  const memberStats = members.map(member => ({
    name: member.name.split(' ')[0],
    completion: member.progress
  }));

  const handleAddResource = (e) => {
    e.preventDefault();
    setShowAddResource(false);
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    setShowAddNote(false);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-12 border-b border-gray-800 flex items-center justify-between px-4 bg-gray-900/50 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <h1 className="text-base font-semibold">Physics Study Group 1</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowMembers(!showMembers)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-sm rounded-lg bg-gray-800 hover:bg-gray-700"
            >
              <Users className="w-3.5 h-3.5" />
              Members
            </button>
            <button
              onClick={() => setShowChat(!showChat)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-sm rounded-lg bg-gray-800 hover:bg-gray-700"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Chat
            </button>
          </div>
        </header>

        <div className="flex-1 p-4 space-y-4 overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Task Management */}
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                {editingTask ? (
                  <input
                    type="text"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    className="bg-gray-700 px-3 py-1.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                    onBlur={() => setEditingTask(false)}
                    autoFocus
                  />
                ) : (
                  <h2 className="text-base font-semibold">{taskTitle}</h2>
                )}
                <div className="flex gap-1">
                  <button
                    onClick={() => setEditingTask(true)}
                    className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={deleteTask}
                    className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs text-gray-400">Progress</span>
                  <span className="text-xs font-medium">{calculateProgress()}%</span>
                </div>
                <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 transition-all duration-300"
                    style={{ width: `${calculateProgress()}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
                  >
                    <button
                      onClick={() => toggleStep(step.id)}
                      className={`w-4 h-4 rounded border ${
                        step.completed
                          ? 'bg-fuchsia-500 border-fuchsia-500'
                          : 'border-gray-600 hover:border-fuchsia-500'
                      } flex items-center justify-center transition-colors`}
                    >
                      {step.completed && <Check className="w-3 h-3 text-white" />}
                    </button>
                    <span className={`flex-1 text-sm ${step.completed ? 'text-gray-400 line-through' : ''}`}>
                      {step.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Member Progress Graph */}
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <h2 className="text-base font-semibold mb-4">Member Progress</h2>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={memberStats} margin={{ top: 0, right: 0, bottom: 0, left: -15 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '0.5rem',
                        fontSize: '12px'
                      }}
                    />
                    <Bar
                      dataKey="completion"
                      fill="url(#colorGradient)"
                      radius={[4, 4, 0, 0]}
                    />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#D946EF" />
                        <stop offset="100%" stopColor="#22D3EE" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Resources and Notes Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Resources */}
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold">Resources</h2>
                <button 
                  onClick={() => setShowAddResource(true)}
                  className="px-2.5 py-1 text-xs bg-fuchsia-500 hover:bg-fuchsia-600 rounded-lg flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Resource
                </button>
              </div>
              <div className="space-y-1.5">
                {resources.map((resource) => (
                  <div key={resource.name} className="flex items-center gap-2 p-2 hover:bg-gray-700/50 rounded-lg transition-colors">
                    {resource.type === 'pdf' ? (
                      <FileText className="w-3.5 h-3.5 text-fuchsia-500" />
                    ) : (
                      <Video className="w-3.5 h-3.5 text-cyan-400" />
                    )}
                    <div className="flex-1">
                      <div className="text-sm">{resource.name}</div>
                      <div className="text-xs text-gray-400">By {resource.author}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold">Notes</h2>
                <button 
                  onClick={() => setShowAddNote(true)}
                  className="px-2.5 py-1 text-xs bg-fuchsia-500 hover:bg-fuchsia-600 rounded-lg flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Note
                </button>
              </div>
              <div className="space-y-1.5">
                {notes.map((note) => (
                  <div key={note.title} className="flex items-center gap-2 p-2 hover:bg-gray-700/50 rounded-lg transition-colors">
                    <FileText className="w-3.5 h-3.5 text-fuchsia-500" />
                    <div className="flex-1">
                      <div className="text-sm">{note.title}</div>
                      <div className="text-xs text-gray-400">By {note.author}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slideover Panels */}
      {showMembers && (
        <div className="w-64 border-l border-gray-800 bg-gray-900/30 backdrop-blur-sm p-3">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-medium">Members</h2>
            <button onClick={() => setShowMembers(false)} className="text-gray-400 hover:text-white">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            {members.map((member) => (
              <div key={member.name} className="bg-gray-800/50 rounded-lg p-2">
                <div className="flex items-center gap-2 mb-1.5">
                <div className="relative">
                    <img src="/api/placeholder/24/24" alt={member.name} className="w-6 h-6 rounded-full" />
                    {member.online && (
                      <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-green-500 rounded-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm">{member.name}</div>
                    <div className="text-xs text-gray-400">{member.tasksCompleted} tasks completed</div>
                  </div>
                </div>
                <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-fuchsia-500 to-cyan-400"
                    style={{ width: `${member.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chat Panel */}
      {showChat && (
        <div className="w-80 border-l border-gray-800 bg-gray-900/30 backdrop-blur-sm flex flex-col">
          <div className="flex items-center justify-between p-3 border-b border-gray-800">
            <h2 className="text-sm font-medium">Group Chat</h2>
            <button onClick={() => setShowChat(false)} className="text-gray-400 hover:text-white">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1 p-3 space-y-3 overflow-auto">
            {messages.map((msg, index) => (
              <div key={index} className="bg-gray-800/50 rounded-lg p-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{msg.author}</span>
                  <span className="text-xs text-gray-400">{msg.time}</span>
                </div>
                <p className="text-sm text-gray-300">{msg.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              />
              <button
                type="submit"
                className="p-2 bg-fuchsia-500 hover:bg-fuchsia-600 rounded-lg"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Resource Modal */}
      <Modal show={showAddResource} onClose={() => setShowAddResource(false)} title="Add Resource">
        <form onSubmit={handleAddResource} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Resource Type</label>
            <select className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500">
              <option value="pdf">PDF Document</option>
              <option value="video">Video</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              placeholder="Enter resource title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 h-24 resize-none"
              placeholder="Enter resource description"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddResource(false)}
              className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-fuchsia-500 hover:bg-fuchsia-600 rounded-lg"
            >
              Add Resource
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Note Modal */}
      <Modal show={showAddNote} onClose={() => setShowAddNote(false)} title="Add Note">
        <form onSubmit={handleAddNote} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              placeholder="Enter note title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Content</label>
            <textarea
              className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 h-32 resize-none"
              placeholder="Enter note content"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddNote(false)}
              className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-fuchsia-500 hover:bg-fuchsia-600 rounded-lg"
            >
              Add Note
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default GroupView;