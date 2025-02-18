import express from 'express';
import { 
  createTask, 
  getAllTasksForGroup, 
  updateTask, 
  deleteTask ,
  getTasks
} from '../controllers/task.controller.js';
// import { verifyToken } from '../middleware/authMiddleware.js';


const router = express.Router();
// router.use(verifyToken);


router.post('/tasks', createTask);
router.get('/group/:groupId', getAllTasksForGroup);
router.get('/tasks/:groupId',  getTasks);

router.put('/tasks/:taskId', updateTask);
router.delete('/tasks/:taskId/group/:groupId', deleteTask);

export default router;