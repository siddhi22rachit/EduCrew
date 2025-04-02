import React, { useState } from 'react';
import { PlusCircle, X, CheckCircle2, Calendar, Trash2 } from 'lucide-react';

const TaskBox = ({ groupId }) => {
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    deadline: '',
    subtasks: []
  });
  const [editingTask, setEditingTask] = useState(null);

  const handleAddTask = () => {
    if (!newTask.title) {
      alert('Please enter a task title');
      return;
    }

    const taskToAdd = {
      ...newTask,
      id: Date.now(),
      createdAt: new Date(),
      completed: false
    };

    setTasks([...tasks, taskToAdd]);
    resetTaskState();
  };

  const handleUpdateTask = () => {
    if (!newTask.title) {
      alert('Please enter a task title');
      return;
    }

    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === editingTask.id 
          ? { ...newTask, id: task.id } 
          : task
      )
    );

    resetTaskState();
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

  const toggleSubtaskCompletion = (taskId, subtaskIndex) => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === taskId) {
          const updatedSubtasks = [...task.subtasks];
          updatedSubtasks[subtaskIndex] = {
            ...updatedSubtasks[subtaskIndex],
            completed: !updatedSubtasks[subtaskIndex].completed
          };
          return { ...task, subtasks: updatedSubtasks };
        }
        return task;
      })
    );
  };

  const openEditModal = (task) => {
    setNewTask({ ...task });
    setEditingTask(task);
    setIsAddTaskModalOpen(true);
  };

  return (
    <div className="relative h-full">
     

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
                key={task.id} 
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
                  </div>
                </div>

                <div className="flex items-center text-blue-400 text-sm mb-3">
                  <Calendar className="mr-2" size={16} />
                  {task.deadline 
                    ? new Date(task.deadline).toLocaleDateString() 
                    : 'No deadline'}
                </div>

                <div className="space-y-2">
                  {task.subtasks.map((subtask, index) => (
                    <div 
                      key={index} 
                      className="flex items-center space-x-2"
                    >
                      <button 
                        onClick={() => toggleSubtaskCompletion(task.id, index)}
                        className="focus:outline-none"
                      >
                        {subtask.completed ? (
                          <CheckCircle2 className="text-blue-500" size={30} />
                        ) : (
                          <div className="w-5 h-5 border-2 border-blue-400 rounded-full" />
                        )}
                      </button>
                      <span 
                        className={`text-grey-300 text-xl flex-grow ${subtask.completed ? 'line-through' : ''}`}
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
                    value={newTask.deadline}
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