import express from 'express';
import {
  addTask,
  updateTask,
  deleteTask,
  getTasks,
} from '../controllers/task.controller.js';

const router = express.Router();

// Add a Task
router.post('/add', addTask);

// Update a Task
router.put('/update/:taskId', updateTask);

// Delete a Task
router.delete('/delete/:taskId', deleteTask);

// Get All Tasks for a Group
router.get('/:groupId', getTasks);

export default router;
