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
        credentials: 'include', // for cookies
        body: JSON.stringify({
          taskName: taskName.trim(),
          deadline,
          subtasks,
          groupId // Include the group ID from URL params
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create task');
      }

      // Navigate back to group view with the group ID
      navigate(`/dashboard/group/${groupId}`);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (today) for deadline input
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create New Task</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Task Name Input */}
        <div className="mb-4">
          <label 
            htmlFor="taskName" 
            className="block text-gray-700 font-medium mb-2"
          >
            Task Name
          </label>
          <input
            type="text"
            id="taskName"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Enter task name"
            required
          />
        </div>

        {/* Deadline Input */}
        <div className="mb-4">
          <label 
            htmlFor="deadline" 
            className="block text-gray-700 font-medium mb-2"
          >
            Deadline
          </label>
          <input
            type="date"
            id="deadline"
            value={deadline}
            min={getMinDate()}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Subtasks Input */}
        <div className="mb-4">
          <label 
            htmlFor="subtask" 
            className="block text-gray-700 font-medium mb-2"
          >
            Add Subtask
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="subtask"
              value={subtaskInput}
              onChange={(e) => setSubtaskInput(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Enter subtask"
            />
            <button
              type="button"
              onClick={handleAddSubtask}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
            >
              Add
            </button>
          </div>
        </div>

        {/* Subtasks List */}
        {subtasks.length > 0 && (
          <div className="mb-6">
            <h3 className="text-gray-700 font-medium mb-2">Subtasks:</h3>
            <div className="space-y-2">
              {subtasks.map((subtask, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <span>{subtask.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 py-2 px-4 rounded-lg text-white font-medium 
              ${loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {loading ? 'Creating...' : 'Create Task'}
          </button>
          
          <button
            type="button"
            onClick={() => navigate(`/group/${groupId}`)}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskPage;