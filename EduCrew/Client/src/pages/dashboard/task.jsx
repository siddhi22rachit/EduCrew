'use client'

import React, { useState, useEffect } from 'react';
import { Plus, Minus, Trash2, Edit3 } from 'lucide-react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams, useNavigate } from 'react-router-dom';
import CustomCalendar from './calender';

const BASE_URL = 'http://localhost:5000/api';

export default function TaskPage() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [taskName, setTaskName] = useState('');
  const [subtasks, setSubtasks] = useState([{ name: '' }]);
  const [deadline, setDeadline] = useState('');
  const [existingTasks, setExistingTasks] = useState([]);
  const [groupDetails, setGroupDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [editMode, setEditMode] = useState(false);
  const [taskIdToEdit, setTaskIdToEdit] = useState(null);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      if (!groupId) {
        toast.error('Invalid Group ID');
        navigate('/dashboard');
        return;
      }

      try {
        setIsLoading(true);

        const groupResponse = await axios.get(`${BASE_URL}/groups/${groupId}`);
        const tasksResponse = await axios.get(`${BASE_URL}/tasks/group/${groupId}`);

        setGroupDetails(groupResponse.data);
        setExistingTasks(tasksResponse.data || []);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load group details');
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroupDetails();
  }, [groupId, navigate]);

  const handleSubtaskChange = (index, value) => {
    const newSubtasks = [...subtasks];
    newSubtasks[index].name = value;
    setSubtasks(newSubtasks);
  };

  const handleAddSubtask = () => {
    if (subtasks.length < 10) {
      setSubtasks([...subtasks, { name: '' }]);
    } else {
      toast.warning('Maximum 10 subtasks allowed');
    }
  };

  const handleRemoveSubtask = (index) => {
    if (subtasks.length > 1) {
      const newSubtasks = subtasks.filter((_, i) => i !== index);
      setSubtasks(newSubtasks);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!taskName.trim()) {
      toast.error('Task name is required');
      return;
    }
  
    if (subtasks.some((task) => !task.name.trim())) {
      toast.error('All subtasks must have a name');
      return;
    }
  
    if (!deadline) {
      toast.error('Deadline is required');
      return;
    }
  
    try {
      const taskData = {
        groupId,
        groupName: groupDetails.groupName,
        taskName: taskName.trim(),
        subtasks: subtasks.map((st) => ({ 
          name: st.name.trim(), 
          completed: false 
        })),
        deadline,
        status: 'active' // Add a status field
      };


   

      if (editMode) {
        response = await axios.put(`${BASE_URL}/tasks/${taskIdToEdit}`, taskData);
        toast.success('Task updated successfully!');
      } else {
        response = await axios.post(`${BASE_URL}/tasks`, taskData);
        toast.success('Task added successfully!');
      }

      const newTaskId = response.data._id;

      const updatedTasksResponse = await axios.get(`${BASE_URL}/tasks/group/${groupId}`);
      setExistingTasks(updatedTasksResponse.data);

      setTaskName('');
      setSubtasks([{ name: '' }]);
      setDeadline('');
      setEditMode(false);
      setTaskIdToEdit(null);

      // Navigate to the calendar page with the new task ID
      navigate(`/calendar?taskId=${newTaskId}`);

  
      const response = await axios.post(`${BASE_URL}/tasks`, taskData);
      
      // Store group and task details in localStorage for navigation
      localStorage.setItem('currentGroupId', groupId);
      localStorage.setItem('currentTask', JSON.stringify({
        taskName: taskData.taskName,
        subtasks: taskData.subtasks,
        deadline: taskData.deadline
      }));
  
      toast.success('Task added successfully!');
      navigate(`/dashboard/group/${groupId}`); // Navigate to GroupView with groupId

    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to process task');
    }
  };

  const handleEditTask = (task) => {
    setTaskName(task.taskName);
    setSubtasks(task.subtasks.map((st) => ({ name: st.name })));
    setDeadline(task.deadline);
    setTaskIdToEdit(task._id);
    setEditMode(true);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`${BASE_URL}/tasks/${taskId}/group/${groupId}`);
      setExistingTasks((prev) => prev.filter((task) => task._id !== taskId));
      toast.success('Task deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-900 items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-900 p-6">
      <ToastContainer />
      <div className="w-full max-w-7xl mx-auto space-y-6">
        {groupDetails && (
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-purple-500 to-blue-400 bg-clip-text text-transparent">
              {groupDetails.groupName}
            </h2>
            <p className="text-center text-gray-400 mt-2">Members: {groupDetails.totalMembers}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 text-white">
              {editMode ? 'Edit Task' : 'Create New Task'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Task Name"
                className="w-full bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-purple-500 p-2 text-white"
                required
              />
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-purple-500 p-2 text-white"
                required
              />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-300">Subtasks</h4>
                  <button
                    type="button"
                    onClick={handleAddSubtask}
                    className="flex items-center space-x-1 text-purple-400 hover:text-purple-300"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Subtask</span>
                  </button>
                </div>

                {subtasks.map((subtask, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={subtask.name}
                      onChange={(e) => handleSubtaskChange(index, e.target.value)}
                      placeholder={`Subtask ${index + 1}`}
                      className="flex-1 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-purple-500 p-2 text-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 rounded-lg"
              >
                {editMode ? 'Update Task' : 'Create Task'}
              </button>
            </form>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 text-white">Existing Tasks</h3>
            {existingTasks.length > 0 ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {existingTasks.map((task) => (
                  <div
                    key={task._id}
                    className="bg-gray-700 rounded-lg p-4 flex items-center justify-between space-x-4"
                  >
                    <div>
                      <h4 className="text-white font-medium">{task.taskName}</h4>
                      <p className="text-gray-400 text-sm">Deadline: {task.deadline}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditTask(task)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No tasks found for this group.</p>
            )}
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4 text-white">Calendar View</h3>
          <CustomCalendar tasks={existingTasks} />
        </div>
      </div>
    </div>
  );
}

