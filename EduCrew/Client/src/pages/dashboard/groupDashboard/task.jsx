import React, { useState, useEffect } from 'react';
import { PlusCircle, X, CheckCircle2, Calendar, Trash2 } from 'lucide-react';
import { axiosInstance } from '../../../lib/axios'; 

const TaskBox = ({ groupId }) => {
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    deadline: '',
    subtasks: []
  });
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProgress, setUserProgress] = useState(0);

  useEffect(() => {
    if (groupId) {
      fetchTasks();
      // fetchUserProgress();
    }
  }, [groupId]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      // Get all tasks for the group in a single request
      const response = await axiosInstance.get(`/tasks/group/${groupId}`);
      setTasks(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to load tasks");
      setLoading(false);
    }
  };

  // const fetchUserProgress = async () => {
  //   try {
  //     const response = await axiosInstance.get(`/task/${groupId}/progress`);
  //     setUserProgress(response.data.progress);
  //   } catch (err) {
  //     console.error("Error fetching user progress:", err);
  //   }
  // };

  const handleAddTask = async () => {
    if (!newTask.title) {
      alert('Please enter a task title');
      return;
    }

    try {
      // Format subtasks as expected by the backend
      const formattedSubtasks = newTask.subtasks.map(subtask => ({
        title: subtask.title,
        completedBy: []
      }));
      
      const response = await axiosInstance.post('/tasks/create', {
        group: groupId,
        title: newTask.title,
        deadline: newTask.deadline,
        subtasks: formattedSubtasks
      });

      // Refresh tasks after adding a new one
      fetchTasks();
      resetTaskState();
    } catch (err) {
      console.error("Error creating task:", err);
      alert(err.response?.data?.message || "Failed to create task");
    }
  };

  const handleUpdateTask = async () => {
    if (!newTask.title) {
      alert('Please enter a task title');
      return;
    }

    try {
      // Format subtasks as expected by the backend
      const formattedSubtasks = newTask.subtasks.map(subtask => subtask.title);
      
      const response = await axiosInstance.put(`/task/${editingTask._id}`, {
        title: newTask.title,
        deadline: newTask.deadline,
        subtasks: formattedSubtasks
      });

      // Refresh tasks after updating
      fetchTasks();
      resetTaskState();
    } catch (err) {
      console.error("Error updating task:", err);
      alert(err.response?.data?.message || "Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axiosInstance.delete(`/tasks/${taskId}`);
      
      // Remove the task from local state
      setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
    } catch (err) {
      console.error("Error deleting task:", err);
      alert(err.response?.data?.message || "Failed to delete task");
    }
  };

  const resetTaskState = () => {
    setNewTask({
      title: '',
      deadline: '',
      subtasks: []
    });
    setEditingTask(null);
    setIsAddTaskModalOpen(false);
  };

  const addSubtask = () => {
    setNewTask(prev => ({
      ...prev,
      subtasks: [...prev.subtasks, { title: '', completed: false }]
    }));
  };

  const removeSubtask = (index) => {
    setNewTask(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter((_, i) => i !== index)
    }));
  };

  const handleSubtaskChange = (index, value) => {
    const updatedSubtasks = [...newTask.subtasks];
    updatedSubtasks[index] = { 
      title: value, 
      completed: false 
    };
    setNewTask(prev => ({
      ...prev,
      subtasks: updatedSubtasks
    }));
  };

  const toggleSubtaskCompletion = async (taskId, subtaskIndex) => {
    try {
      await axiosInstance.post('/tasks/subtask/complete', {
        taskId,
        subtaskIndex
      });
      
      // Refresh tasks to get updated completion status
      fetchTasks();
      // fetchUserProgress();
    } catch (err) {
      console.error("Error completing subtask:", err);
      alert(err.response?.data?.message || "Failed to complete subtask");
    }
  };

  const openEditModal = (task) => {
    // Format the task data for editing
    const formattedTask = {
      ...task,
      subtasks: task.subtasks.map(subtask => ({
        title: subtask.title,
        completed: isSubtaskCompleted(subtask)
      }))
    };
    
    setNewTask(formattedTask);
    setEditingTask(task);
    setIsAddTaskModalOpen(true);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Check if current user has completed a subtask
  const isSubtaskCompleted = (subtask) => {
    // Get current user ID from localStorage or auth context
    const currentUserId = localStorage.getItem('userId'); // Adjust based on your auth implementation
    return subtask.completedBy?.some(id => id === currentUserId);
  };

  if (loading) return <div className="flex justify-center items-center h-full">Loading tasks...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="relative h-full">
      {userProgress > 0 && (
        <div className="mb-4">
          <p className="text-blue-300">Your Progress: {Math.round(userProgress)}%</p>
          <div className="w-full bg-blue-900/30 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${userProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="bg-[#0A1128] rounded-lg shadow-xl h-full text-white flex flex-col">
        {tasks.length === 0 ? (
          <div 
            onClick={() => setIsAddTaskModalOpen(true)}
            className="flex flex-col items-center justify-center h-full cursor-pointer hover:bg-blue-900/20 transition-colors"
          >
            <PlusCircle 
              size={100} 
              className="text-blue-500 mb-4 opacity-70 hover:opacity-100 transition-opacity"
            />
            <h2 className="text-2xl text-blue-300 text-center">
              Create Your Next Amazing Task
            </h2>
            <p className="text-blue-400 text-center mt-2 px-4">
              Every big achievement starts with a single step. Let's turn your goals into reality.
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-4 overflow-y-auto flex-grow">
            {tasks.map((task) => (
              <div 
                key={task._id} 
                className="bg-blue-900/30 rounded-lg p-4 relative"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-3xl text-white font-semibold flex-grow">
                    {task.title}
                  </h3>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => openEditModal(task)}
                      className="text-blue-400 hover:text-blue-600"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteTask(task._id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center text-blue-400 text-sm mb-3">
                  <Calendar className="mr-2" size={16} />
                  {formatDate(task.deadline)}
                </div>

                <div className="space-y-2">
                  {task.subtasks.map((subtask, index) => (
                    <div 
                      key={index} 
                      className="flex items-center space-x-2"
                    >
                      <button 
                        onClick={() => toggleSubtaskCompletion(task._id, index)}
                        className="focus:outline-none"
                      >
                        {isSubtaskCompleted(subtask) ? (
                          <CheckCircle2 className="text-blue-500" size={30} />
                        ) : (
                          <div className="w-5 h-5 border-2 border-blue-400 rounded-full" />
                        )}
                      </button>
                      <span 
                        className={`text-grey-300 text-xl flex-grow ${isSubtaskCompleted(subtask) ? 'line-through' : ''}`}
                      >
                        {subtask.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Task Button */}
        {tasks.length > 0 && (
          <div className="p-4 border-t border-blue-800">
            <button 
              onClick={() => setIsAddTaskModalOpen(true)}
              className="w-full bg-blue-600 text-white hover:bg-blue-700 py-2 rounded-lg flex items-center justify-center"
            >
              <PlusCircle size={20} className="mr-2" /> Add New Task
            </button>
          </div>
        )}

        {/* Add/Edit Task Modal */}
        {isAddTaskModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#0A1128] rounded-lg p-6 w-full max-w-md border border-blue-800">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl text-blue-300">
                  {editingTask ? 'Update Task' : 'Create New Task'}
                </h2>
                <button 
                  onClick={() => setIsAddTaskModalOpen(false)}
                  className="text-blue-400 hover:text-blue-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-blue-300 mb-2">Task Title</label>
                  <input 
                    value={newTask.title}
                    onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter task title"
                    className="w-full bg-blue-900/50 border border-blue-800 rounded p-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-blue-300 mb-2">Deadline</label>
                  <input 
                    type="date"
                    value={newTask.deadline ? new Date(newTask.deadline).toISOString().split('T')[0] : ''}
                    onChange={(e) => setNewTask(prev => ({ ...prev, deadline: e.target.value }))}
                    className="w-full bg-blue-900/50 border border-blue-800 rounded p-2 text-white"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-blue-300">Subtasks</label>
                    <button 
                      onClick={addSubtask}
                      className="text-blue-400 hover:text-blue-600 text-sm flex items-center"
                    >
                      <PlusCircle size={16} className="mr-1" /> Add Subtask
                    </button>
                  </div>
                  {newTask.subtasks.map((subtask, index) => (
                    <div key={index} className="flex items-center space-x-2 mt-2">
                      <input 
                        value={subtask.title}
                        onChange={(e) => handleSubtaskChange(index, e.target.value)}
                        placeholder={`Subtask ${index + 1}`}
                        className="flex-grow bg-blue-900/50 border border-blue-800 rounded p-2 text-white"
                      />
                      <button 
                        onClick={() => removeSubtask(index)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end space-x-2 mt-4">
                  <button 
                    onClick={() => setIsAddTaskModalOpen(false)}
                    className="bg-blue-900/50 text-blue-300 border border-blue-800 hover:bg-blue-900/70 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={editingTask ? handleUpdateTask : handleAddTask}
                    className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded"
                  >
                    {editingTask ? 'Update Task' : 'Create Task'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskBox;