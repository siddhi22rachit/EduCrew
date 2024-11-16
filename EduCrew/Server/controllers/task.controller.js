import Task from '../models/task.model.js';

// Add a Task
export const addTask = async (req, res, next) => {
  try {
    const { title, steps, groupId } = req.body;

    if (!title || !groupId) {
      return res.status(400).json({ success: false, message: 'Task title and group ID are required.' });
    }

    const task = new Task({ title, steps, groupId });
    await task.save();

    res.status(201).json({ success: true, message: 'Task added successfully', data: task });
  } catch (error) {
    next(error);
  }
};

// Update a Task
export const updateTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { title, steps } = req.body;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (title) task.title = title;
    if (steps) task.steps = steps;

    await task.save();

    res.status(200).json({ success: true, message: 'Task updated successfully', data: task });
  } catch (error) {
    next(error);
  }
};

// Delete a Task
export const deleteTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findByIdAndDelete(taskId);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Get All Tasks for a Group
export const getTasks = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    const tasks = await Task.find({ groupId });

    if (!tasks.length) {
      return res.status(404).json({ success: false, message: 'No tasks found for this group' });
    }

    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    next(error);
  }
};
