import React, { useState, useEffect } from 'react';
import {
  Plus,
  Check,
  X,
  MessageCircle,
  FileText,
  Video,
  Send,
  ChevronRight,
  Edit2,
  Trash2,
  Download
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BASE_URL = 'http://localhost:5000/api';

const ResourceCard = ({ resource }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-400" />;
      case 'video':
        return <Video className="w-5 h-5 text-blue-400" />;
      default:
        return <FileText className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors">
      <div className="flex items-center gap-3">
        {getIcon(resource.type)}
        <div>
          <h3 className="text-sm font-medium">{resource.name}</h3>
          <p className="text-xs text-gray-400">
            Added by {resource.author} on {new Date(resource.date).toLocaleDateString()}
          </p>
        </div>
      </div>
      <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
        <Download className="w-4 h-4" />
      </button>
    </div>
  );
};

const StudyGroupDashboard = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [currentTask, setCurrentTask] = useState(null);
  const [groupDetails, setGroupDetails] = useState(null);
  const [members, setMembers] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resources] = useState([
    {
      type: "pdf",
      name: "Quantum States Guide",
      author: "John Doe",
      date: "2024-03-15",
    },
    {
      type: "video",
      name: "Wave Functions Explained",
      author: "Sarah Smith",
      date: "2024-03-14",
    },
    {
      type: "pdf",
      name: "Practice Problems Set",
      author: "Mike Johnson",
      date: "2024-03-13",
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const groupResponse = await axios.get(`${BASE_URL}/groups/${groupId}`);
        setGroupDetails(groupResponse.data);

        const storedTask = localStorage.getItem('currentTask');
        if (storedTask) {
          const taskData = JSON.parse(storedTask);
          setCurrentTask({
            ...taskData,
            steps: taskData.subtasks.map((subtask, index) => ({
              id: index + 1,
              text: subtask.name,
              completed: subtask.completed || false
            }))
          });
        }

        if (groupResponse.data.members) {
          const memberData = groupResponse.data.members.map(member => ({
            name: member.split('@')[0],
            progress: Math.floor(Math.random() * 100),
            tasksCompleted: Math.floor(Math.random() * 15),
            online: Math.random() < 0.5
          }));
          setMembers(memberData);
        }
      } catch (error) {
        toast.error('Failed to load group data');
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (groupId) {
      fetchData();
    }
  }, [groupId]);

  const calculateProgress = () => {
    if (!currentTask?.steps?.length) return 0;
    const completed = currentTask.steps.filter(step => step.completed).length;
    return Math.round((completed / currentTask.steps.length) * 100);
  };

  const toggleStep = async (stepId) => {
    if (!currentTask) return;

    try {
      const updatedSteps = currentTask.steps.map(step =>
        step.id === stepId ? { ...step, completed: !step.completed } : step
      );

      setCurrentTask(prev => ({
        ...prev,
        steps: updatedSteps
      }));

      await axios.patch(`${BASE_URL}/tasks/${currentTask._id}/subtask/${stepId}`, {
        completed: !currentTask.steps.find(s => s.id === stepId).completed
      });

      const progress = calculateProgress();
      const updatedMembers = members.map(member =>
        member.name === 'You' ? { ...member, progress } : member
      );
      setMembers(updatedMembers);

      toast.success('Progress updated');
    } catch (error) {
      toast.error('Failed to update progress');
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        author: 'You',
        text: message.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, newMessage]);
      setMessage("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      <ToastContainer />
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-gray-900/50 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <h1 className="text-lg font-semibold">{groupDetails?.groupName || 'Loading...'}</h1>
          </div>
          <button
            onClick={() => setShowChat(!showChat)}
            className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Group Chat
          </button>
        </header>

        <div className="flex-1 p-6 space-y-6 overflow-auto">
          {/* Current Task Section */}
          {currentTask && (
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between pb-4">
                <h2 className="text-lg font-semibold">{currentTask.taskName}</h2>
                <span className="text-sm text-gray-400">
                  Due: {new Date(currentTask.deadline).toLocaleDateString()}
                </span>
              </div>
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-400">Progress</span>
                  <span className="text-sm font-medium">{calculateProgress()}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 transition-all duration-300"
                    style={{ width: `${calculateProgress()}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                {currentTask.steps.map((step) => (
                  <div
                    key={step.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700/50 transition-colors"
                  >
                    <button
                      onClick={() => toggleStep(step.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        step.completed
                          ? "bg-fuchsia-500 text-white"
                          : "bg-gray-700 hover:bg-gray-600"
                      }`}
                    >
                      {step.completed && <Check className="w-4 h-4" />}
                    </button>
                    <span
                      className={`flex-1 text-sm ${
                        step.completed ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {step.text}
                    </span>
                    <button
                      className="p-2 text-red-400 hover:bg-gray-700 rounded-lg"
                      onClick={() => toast.error('Remove action coming soon')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

         {/* Member Progress */}
<div className="bg-gray-800 rounded-lg p-6">
  <h2 className="text-lg font-semibold">Member Progress</h2>
  <ResponsiveContainer width="100%" height={250}>
    <BarChart data={members}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="progress" fill="#f3b1c8" />
    </BarChart>
  </ResponsiveContainer>
</div>

{/* Members Section */}
<div className="bg-gray-800 rounded-lg p-6">
  <h2 className="text-lg font-semibold">Members</h2>
  <div className="space-y-4 mt-4">
    {members.map((member, index) => (
      <div
        key={index}
        className="flex items-center justify-between bg-gray-700/50 p-4 rounded-lg hover:bg-gray-600 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-3 h-3 rounded-full ${
              member.online ? "bg-green-500" : "bg-gray-400"
            }`}
          />
          <div>
            <h3 className="text-sm font-medium">{member.name}</h3>
            <p className="text-xs text-gray-400">
              Tasks Completed: {member.tasksCompleted}
            </p>
          </div>
        </div>
        <span
          className={`text-sm font-medium ${
            member.progress > 50 ? "text-green-400" : "text-yellow-400"
          }`}
        >
          {member.progress}%
        </span>
      </div>
    ))}
  </div>
</div>

          {/* Study Resources */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold">Study Resources</h2>
            <div className="space-y-4">
              {resources.map((resource, index) => (
                <ResourceCard key={index} resource={resource} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Group Chat */}
      {showChat && (
        <div className="w-80 bg-gray-800 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-700 pb-4">
            <h3 className="text-lg font-semibold">Group Chat</h3>
            <button onClick={() => setShowChat(false)} className="text-gray-400">
              <X />
            </button>
          </div>
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className="flex gap-3">
                <span className="font-semibold">{msg.author}:</span>
                <p className="text-sm text-gray-400">{msg.text}</p>
                <span className="text-xs text-gray-500">{msg.time}</span>
              </div>
            ))}
          </div>
          <form
            onSubmit={handleSendMessage}
            className="flex gap-3 items-center pt-4 border-t border-gray-700"
          >
            <input
              type="text"
              className="flex-1 p-2 bg-gray-700 rounded-lg text-sm text-white"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message"
            />
            <button
              type="submit"
              className="p-2 bg-fuchsia-500 hover:bg-fuchsia-600 rounded-lg text-white"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default StudyGroupDashboard;