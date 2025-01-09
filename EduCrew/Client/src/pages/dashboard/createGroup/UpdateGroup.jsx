import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateGroup = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [groupName, setGroupName] = useState('');
  const [members, setMembers] = useState('');
  const [totalMembers, setTotalMembers] = useState(0);
  const [error, setError] = useState(null);

  // Fetch logic remains the same as your original code
  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const response = await fetch(`/api/groups/${groupId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (!response.ok) throw new Error('Failed to fetch group');
        const data = await response.json();
        setGroup(data);
        setGroupName(data.groupName);
        setMembers(data.members?.join(', ') || '');
        setTotalMembers(data.totalMembers || 0);

        if (data.userId) {
          const userResponse = await fetch(`/api/user/user/${data.userId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          if (!userResponse.ok) throw new Error('Failed to fetch user details');
          const userData = await userResponse.json();
          setUserEmail(userData.email);
        }
      } catch (error) {
        setError('Error fetching group details.');
      }
    };
    fetchGroup();
  }, [groupId]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`/api/tasks/${groupId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (!response.ok) throw new Error('Failed to fetch tasks');
        const taskData = await response.json();
        setTasks(taskData);
      } catch (error) {
        setError('Error fetching tasks.');
      }
    };
    if (groupId) fetchTasks();
  }, [groupId]);

  const handleSaveGroupChanges = async () => {
    try {
      await fetch(`/api/groups/${groupId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          groupName,
          members: members.split(',').map((member) => member.trim()),
          totalMembers,
        }),
      });
      navigate('/dashboard/group');
    } catch (err) {
      setError('Error updating group.');
    }
  };

  const handleSaveTaskChanges = async (taskId, updatedTask) => {
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updatedTask),
      });
      setTasks(prevTasks =>
        prevTasks.map(task => (task._id === taskId ? { ...task, ...updatedTask } : task))
      );
    } catch (err) {
      setError('Error updating task.');
    }
  };

  if (!group) return <p className="text-white p-4">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 text-white p-8">
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-8">
        Update Group
      </h1>
      
      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Group Details */}
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-blue-500/20 shadow-xl">
          <h2 className="text-2xl font-semibold text-blue-300 mb-6">Group Information</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-blue-200 mb-2">Group Name</label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full bg-gray-700/50 border border-blue-500/30 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-blue-200 mb-2">Members</label>
              <input
                type="text"
                value={members}
                onChange={(e) => setMembers(e.target.value)}
                className="w-full bg-gray-700/50 border border-blue-500/30 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter emails, separated by commas"
              />
            </div>

            <div>
              <label className="block text-blue-200 mb-2">Total Members</label>
              <input
                type="number"
                value={totalMembers}
                onChange={(e) => setTotalMembers(e.target.value)}
                className="w-full bg-gray-700/50 border border-blue-500/30 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="pt-4 border-t border-gray-600">
              <p className="text-blue-200 mb-2">Group Creator:</p>
              <p className="text-gray-300">{userEmail}</p>
            </div>

            <button
              onClick={handleSaveGroupChanges}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
            >
              Save Group Changes
            </button>
          </div>
        </div>

        {/* Right Column - Tasks */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-blue-300">Tasks</h2>
          
          {tasks.map((task) => (
            <div key={task._id} className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-blue-500/20 shadow-xl">
              <div className="space-y-4">
                <div>
                  <label className="block text-blue-200 mb-2">Task Name</label>
                  <input
                    type="text"
                    value={task.taskName}
                    onChange={(e) => setTasks(prevTasks =>
                      prevTasks.map(t => t._id === task._id ? { ...t, taskName: e.target.value } : t)
                    )}
                    className="w-full bg-gray-700/50 border border-blue-500/30 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-blue-200 mb-2">Deadline</label>
                  <input
                    type="date"
                    value={new Date(task.deadline).toISOString().split('T')[0]}
                    onChange={(e) => setTasks(prevTasks =>
                      prevTasks.map(t => t._id === task._id ? { ...t, deadline: e.target.value } : t)
                    )}
                    className="w-full bg-gray-700/50 border border-blue-500/30 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl text-blue-300">Subtasks</h3>
                  {task.subtasks?.map((subtask, index) => (
                    <div key={index} className="flex items-center gap-4 bg-gray-700/30 p-4 rounded-lg">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={subtask.name}
                          onChange={(e) => {
                            const updatedSubtasks = task.subtasks.map((st, i) =>
                              i === index ? { ...st, name: e.target.value } : st
                            );
                            setTasks(prevTasks =>
                              prevTasks.map(t =>
                                t._id === task._id ? { ...t, subtasks: updatedSubtasks } : t
                              )
                            );
                          }}
                          className="w-full bg-gray-700/50 border border-blue-500/30 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <label className="flex items-center gap-2 text-blue-200">
                        <input
                          type="checkbox"
                          checked={subtask.completed}
                          onChange={(e) => {
                            const updatedSubtasks = task.subtasks.map((st, i) =>
                              i === index ? { ...st, completed: e.target.checked } : st
                            );
                            setTasks(prevTasks =>
                              prevTasks.map(t =>
                                t._id === task._id ? { ...t, subtasks: updatedSubtasks } : t
                              )
                            );
                          }}
                          className="w-5 h-5 rounded border-blue-500/30 text-blue-500 focus:ring-blue-500"
                        />
                        Complete
                      </label>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleSaveTaskChanges(task._id, task)}
                  className="w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-green-500/25 mt-4"
                >
                  Save Task Changes
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpdateGroup;