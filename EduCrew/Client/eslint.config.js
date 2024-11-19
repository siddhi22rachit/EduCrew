import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '../config/config';

export default function Tasks({ groupId }) {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [subtasks, setSubtasks] = useState(['']);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${baseUrl}/tasks/${groupId}`);
      setTasks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddSubtask = () => setSubtasks([...subtasks, '']);
  const handleRemoveSubtask = (index) => setSubtasks(subtasks.filter((_, i) => i !== index));
  const handleSubtaskChange = (index, value) => {
    const updated = [...subtasks];
    updated[index] = value;
    setSubtasks(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${baseUrl}/tasks/add`, { groupId, taskName, subtasks });
      alert('Task added successfully!');
      fetchTasks();
    } catch (error) {
      console.error(error);
      alert('Failed to add task.');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [groupId]);

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center">
      <h1 className="text-3xl mb-4">Tasks</h1>
      
      <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded space-y-4 w-3/4 max-w-xl">
        <input
          type="text"
          placeholder="Task Name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          required
          className="w-full p-2 bg-gray-700 rounded"
        />
        
        {subtasks.map((subtask, index) => (
          <div key={index} className="space-y-2">
            <input
              type="text"
              placeholder="Subtask Name"
              value={subtask}
              onChange={(e) => handleSubtaskChange(index, e.target.value)}
              className="w-full p-2 bg-gray-700 rounded"
              required
            />
            <button
              type="button"
              onClick={() => handleRemoveSubtask(index)}
              className="text-red-500 hover:text-red-700"
            >
              Remove Subtask
            </button>
          </div>
        ))}
        
        <button
          type="button"
          onClick={handleAddSubtask}
          className="bg-green-500 px-4 py-2 rounded text-white"
        >
          + Add Subtask
        </button>
        
        <button
          type="submit"
          className="bg-blue-500 px-4 py-2 rounded text-white mt-4"
        >
          Submit Task
        </button>
      </form>
      
      <div className="mt-8 w-3/4 max-w-xl">
        <h2 className="text-2xl mb-4">Existing Tasks</h2>
        <ul className="space-y-4">
          {tasks.length > 0 ? (
            tasks.map((task, index) => (
              <li key={index} className="bg-gray-800 p-4 rounded">
                <h3 className="text-xl">{task.name}</h3>
                <ul className="ml-4 space-y-2">
                  {task.subtasks.map((subtask, idx) => (
                    <li key={idx} className="text-sm">{subtask.name}</li>
                  ))}
                </ul>
              </li>
            ))
          ) : (
            <p>No tasks found for this group.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
