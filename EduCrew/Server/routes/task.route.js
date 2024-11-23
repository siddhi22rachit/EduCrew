import express from 'express';
import { 
  createTask, 
  getAllTasksForGroup, 
  updateTask, 
  deleteTask 
} from '../controllers/task.controller.js';

const router = express.Router();

router.post('/', createTask);
router.get('/group/:groupId', getAllTasksForGroup);
router.put('/:taskId', updateTask);
router.delete('/:taskId/group/:groupId', deleteTask);

export default router;