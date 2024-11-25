import { Task } from '../models/task.model.js';
import  Group  from '../models/group.model.js';
import mongoose from 'mongoose';

// controllers/task.controller.js

export const createTask = async (req, res) => {
  try {
    const { groupId, taskName, subtasks, deadline } = req.body;

    if (!groupId || !taskName || !subtasks || !deadline) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newTask = new Task({
      taskName,
      group: groupId,
      subtasks: subtasks.map(st => ({ name: st.name })),
      deadline
    });

    await newTask.save();

    await Group.findByIdAndUpdate(
      groupId,
      { $push: { tasks: newTask._id } },
      { new: true }
    );

    res.status(201).json({
      message: 'Task created successfully',
      task: newTask
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating task',
      error: error.message
    });
  }
};


export const getAllTasksForGroup = async (req, res) => {
  try {
    // Validate ID format first
    if (!mongoose.Types.ObjectId.isValid(req.params.groupId)) {
      return res.status(400).json({ message: 'Invalid Group ID' });
    }

    const tasks = await Task.find({ group: req.params.groupId });
    
    if (!tasks) {
      return res.status(404).json({ message: 'No tasks found for this group' });
    }

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching tasks',
      error: error.message
    });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { taskName, subtasks, deadline } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { taskName, subtasks, deadline },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({
      message: 'Task updated successfully',
      task: updatedTask
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error updating task',
      error: error.message
    });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { taskId, groupId } = req.params;

    const task = await Task.findByIdAndDelete(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Group.findByIdAndUpdate(
      groupId,
      { $pull: { tasks: taskId } }
    );

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting task',
      error: error.message
    });
  }
};