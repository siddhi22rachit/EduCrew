import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const TaskPage = () => {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [taskName, setTaskName] = useState('');
  const [deadline, setDeadline] = useState('');
  const [subtaskInput, setSubtaskInput] = useState('');
  const [subtasks, setSubtasks] = useState([]);

  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (!subtaskInput.trim()) return;
    
    setSubtasks([...subtasks, {
      name: subtaskInput.trim(),
      completed: false
    }]);
    setSubtaskInput('');
  };

  const handleRemoveSubtask = (index) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!taskName.trim()) {
      setError('Task name is required');
      return;
    }

    if (!deadline) {
      setError('Deadline is required');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          taskName: taskName.trim(),
          deadline,
          subtasks,
          groupId
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create task');
      }

      navigate(`/dashboard/group/${groupId}`);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-8 bg-gray-900 rounded-xl shadow-2xl border border-gray-800 text-gray-100">
      <div className="relative">
        <div className="absolute inset-0 bg-blue-500 opacity-10 blur-xl rounded-xl"></div>
        <h2 className="relative text-3xl font-bold mb-8 text-blue-400">Create New Task</h2>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-900/50 text-red-300 rounded-lg border border-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="taskName" className="block text-blue-300 font-medium mb-2">
            Task Name
          </label>
          <input
            type="text"
            id="taskName"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 text-gray-100 placeholder-gray-500 transition duration-200"
            placeholder="Enter task name"
            required
          />
        </div>

        <div>
          <label htmlFor="deadline" className="block text-blue-300 font-medium mb-2">
            Deadline
          </label>
          <input
            type="date"
            id="deadline"
            value={deadline}
            min={getMinDate()}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 text-gray-100 transition duration-200"
            required
          />
        </div>

        <div>
          <label htmlFor="subtask" className="block text-blue-300 font-medium mb-2">
            Add Subtask
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              id="subtask"
              value={subtaskInput}
              onChange={(e) => setSubtaskInput(e.target.value)}
              className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 text-gray-100 placeholder-gray-500 transition duration-200"
              placeholder="Enter subtask"
            />
            <button
              type="button"
              onClick={handleAddSubtask}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition duration-200 shadow-lg shadow-blue-500/30"
            >
              Add
            </button>
          </div>
        </div>

        {subtasks.length > 0 && (
          <div>
            <h3 className="text-blue-300 font-medium mb-3">Subtasks:</h3>
            <div className="space-y-3">
              {subtasks.map((subtask, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700 backdrop-blur-sm"
                >
                  <span className="text-gray-200">{subtask.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(index)}
                    className="text-red-400 hover:text-red-300 transition duration-200"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 py-3 px-6 rounded-lg text-white font-medium shadow-lg transition duration-200 
              ${loading 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30'}`}
          >
            {loading ? 'Creating...' : 'Create Task'}
          </button>
          
          <button
            type="button"
            onClick={() => navigate(`/group/${groupId}`)}
            className="flex-1 py-3 px-6 border border-gray-700 rounded-lg font-medium hover:bg-gray-800 transition duration-200 text-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskPage;