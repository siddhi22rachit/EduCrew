import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Shield, CheckCircle, Circle } from "lucide-react";

const Dashboard = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const response = await fetch(`/api/groups/${groupId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!response.ok) throw new Error("Failed to fetch group");
        const data = await response.json();
        setGroup(data);

        if (data.userId) {
          const userResponse = await fetch(`/api/user/user/${data.userId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          if (!userResponse.ok) throw new Error("Failed to fetch user details");
          const userData = await userResponse.json();
          setUserEmail(userData.email);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchGroup();
  }, [groupId]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`/api/tasks/${groupId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!response.ok) throw new Error("Failed to fetch tasks");
        const taskData = await response.json();
        setTasks(taskData);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    if (groupId) fetchTasks();
  }, [groupId]);

  const handleSubtaskToggle = async (taskId, subtaskIndex, currentStatus) => {
    try {
      // Update UI optimistically
      const newTasks = [...tasks];
      const taskIndex = newTasks.findIndex(t => t._id === taskId);
      newTasks[taskIndex].subtasks[subtaskIndex].completed = !currentStatus;
      setTasks(newTasks);

      // API call to update the subtask
      await fetch(`/api/tasks/${taskId}/subtasks/${subtaskIndex}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ completed: !currentStatus }),
      });
    } catch (error) {
      console.error('Error updating subtask:', error);
    }
  };

  if (!group) return <p className="p-4 text-white">Loading group details...</p>;

  const calculateProgress = (task) => {
    if (!task.subtasks?.length) return 0;
    const completed = task.subtasks.filter(st => st.completed).length;
    return (completed / task.subtasks.length) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-blue-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-800 via-indigo-900 to-purple-800 p-8 shadow-xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{group.groupName}</h1>
              
            </div>
            <button
              onClick={() => navigate(`/dashboard/update-group/${group._id}`)}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg transform hover:scale-105 transition-all duration-300 hover:bg-blue-500 shadow-lg hover:shadow-blue-500/50 font-semibold"
            >
              Update Group
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left Column - Tasks */}
        <div className="space-y-8">
          <h2 className="text-3xl font-semibold text-blue-300 mb-6">Tasks Progress</h2>
          {tasks.map((task) => (
            <div key={task._id} className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-blue-500/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-medium text-white">{task.taskName}</h3>
                <span className="text-blue-300 text-lg">{Math.round(calculateProgress(task))}%</span>
              </div>
              
              <div className="flex space-x-8">
                <div className="flex-1">
                  {task.subtasks?.length > 0 && (
                    <ul className="space-y-4">
                      {task.subtasks.map((subtask, index) => (
                        <li 
                          key={index}
                          onClick={() => handleSubtaskToggle(task._id, index, subtask.completed)}
                          className="flex items-center p-3 bg-gray-700/30 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-all duration-200"
                        >
                          {subtask.completed ? 
                            <CheckCircle className="w-6 h-6 text-green-400 mr-3" /> :
                            <Circle className="w-6 h-6 text-gray-400 mr-3" />
                          }
                          <span className={`text-lg ${subtask.completed ? 'text-green-300' : 'text-gray-300'}`}>
                            {subtask.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                
                <div className="w-8 h-48 bg-gray-700/50 rounded-full p-1">
                  <div className="relative w-full h-full bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500 to-blue-400 transition-all duration-500 ease-out rounded-full"
                      style={{ height: `${calculateProgress(task)}%` }}
                    >
                      <div className="absolute top-0 left-0 right-0 h-1 bg-blue-300/50 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column - Members */}
        <div>
          <h2 className="text-3xl font-semibold text-blue-300 mb-6">Team Members</h2>
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-blue-500/20">
            <div className="flex items-center mb-6 p-4 bg-blue-600/20 rounded-lg transform hover:scale-102 transition-all duration-200">
              <span className="text-xl text-white">{userEmail}</span>
              <Shield className="w-6 h-6 text-blue-400 ml-4" />
              <span className="text-lg text-blue-300 ml-2">Admin</span>
            </div>
            {group.members?.filter(member => member !== userEmail).map((member, index) => (
              <div
                key={index}
                className="mb-4 p-4 bg-gray-700/30 rounded-lg transform hover:translate-x-2 transition-all duration-200"
              >
                <span className="text-lg text-gray-300">{member}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;