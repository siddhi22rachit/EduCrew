import express from 'express';
import resourceController from '../controllers/resources.controller.js';
import { verifyToken } from '../middleware/authMiddleware.js';



import { 
  createGroup, 
  getAllGroups, 
  getGroupById ,
  deleteGroup,
  updateGroup,
  getUserId
} from '../controllers/groupController.js';

const router = express.Router();


router.post('/',verifyToken, createGroup);
router.get('/user-id', verifyToken, getUserId);

router.get('/', getAllGroups);
router.get('/:id', getGroupById);
router.put('/:id',updateGroup );

router.delete('/:id',deleteGroup);

export default router;