import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateGroup = () => {
  const { groupId } = useParams(); // Assuming groupId is passed via route
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [userEmail, setUserEmail] = useState(''); // State for user email
  const [groupName, setGroupName] = useState('');
  const [members, setMembers] = useState('');
  const [totalMembers, setTotalMembers] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch group details and user email
  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const response = await fetch(`/api/groups/${groupId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` // Add auth token if required
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch group');
        }
        const data = await response.json();
        setGroup(data);
        setGroupName(data.groupName);
        setMembers(data.members?.join(', ') || '');
        setTotalMembers(data.totalMembers || 0);

        // Fetch user details based on userId from the group data
        const fetchUser = async (userId) => {
          try {
            const userResponse = await fetch(`/api/user/user/${userId}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            });
            if (!userResponse.ok) {
              throw new Error('Failed to fetch user details');
            }
            const userData = await userResponse.json();
            setUserEmail(userData.email); // Set the email in the state
          } catch (error) {
            console.error('Error fetching user details:', error);
          }
        };

        if (data.userId) {
          fetchUser(data.userId); // Fetch user details when group data is fetched
        }
      } catch (error) {
        setError('Error fetching group details.');
        console.error('Error fetching group:', error);
      }
    };

    fetchGroup();
  }, [groupId]);

  // Fetch tasks for the group
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`/api/tasks/${groupId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` // Add auth token if required
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const taskData = await response.json();
        setTasks(taskData);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    if (groupId) {
      fetchTasks();
    }
  }, [groupId]);

  // Handle saving changes to the group
  const handleSaveGroupChanges = async () => {
    try {
      await fetch(`/api/groups/${groupId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Add auth token if required
        },
        body: JSON.stringify({
          groupName,
          members: members.split(',').map((member) => member.trim()),
          totalMembers,
        }),
      });
      navigate('/dashboard/group'); // Navigate back to the group list page after updating
    } catch (err) {
      setError('Error updating group.');
      console.error('Error updating group:', err);
    }
  };

  // Handle saving changes to a task
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
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === taskId ? { ...task, ...updatedTask } : task))
      );
    } catch (err) {
      setError('Error updating task.');
      console.error('Error updating task:', err);
    }
  };

  if (!group) {
    return <p>Loading group details...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
     <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
             Updated Groups
          </h1>
      {error && <p className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">{error}</p>}

      <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Group Name</label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Members (comma separated)</label>
            <input
              type="text"
              value={members}
              onChange={(e) => setMembers(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Total Members</label>
            <input
              type="number"
              value={totalMembers}
              onChange={(e) => setTotalMembers(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Group Creator Email:</h3>
          <p className="text-gray-600">{userEmail || 'Email not available'}</p>
        </div>

        <div className="pt-6 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Tasks</h2>
          <div className="space-y-6">
            {tasks?.map((task) => (
              <div key={task._id} className="bg-gray-50 p-4 rounded-lg space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Task Name</label>
                  <input
                    type="text"
                    value={task.taskName}
                    onChange={(e) =>
                      setTasks((prevTasks) =>
                        prevTasks.map((t) =>
                          t._id === task._id ? { ...t, taskName: e.target.value } : t
                        )
                      )
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Deadline</label>
                  <input
                    type="date"
                    value={new Date(task.deadline).toISOString().split('T')[0]}
                    onChange={(e) =>
                      setTasks((prevTasks) =>
                        prevTasks.map((t) =>
                          t._id === task._id ? { ...t, deadline: e.target.value } : t
                        )
                      )
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  />
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Subtasks</h3>
                  <div className="space-y-3">
                    {task.subtasks?.map((subtask, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 bg-white rounded-md">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Subtask Name</label>
                          <input
                            type="text"
                            value={subtask.name}
                            onChange={(e) => {
                              const updatedSubtasks = task.subtasks.map((st, i) =>
                                i === index ? { ...st, name: e.target.value } : st
                              );
                              setTasks((prevTasks) =>
                                prevTasks.map((t) =>
                                  t._id === task._id ? { ...t, subtasks: updatedSubtasks } : t
                                )
                              );
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium text-gray-700">Status</label>
                          <input
                            type="checkbox"
                            checked={subtask.completed}
                            onChange={(e) => {
                              const updatedSubtasks = task.subtasks.map((st, i) =>
                                i === index ? { ...st, completed: e.target.checked } : st
                              );
                              setTasks((prevTasks) =>
                                prevTasks.map((t) =>
                                  t._id === task._id ? { ...t, subtasks: updatedSubtasks } : t
                                )
                              );
                            }}
                            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4 pt-6">
          <button
            onClick={handleSaveGroupChanges}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save Group Changes
          </button>
          <button
            onClick={() => tasks.forEach((task) => handleSaveTaskChanges(task._id, task))}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Save All Task Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateGroup;
