import express from 'express';
import { 
  createGroup, 
  getAllGroups, 
  getGroupById 
} from '../controllers/groupController.js';

const router = express.Router();

router.post('/', createGroup);
router.get('/', getAllGroups);
router.get('/:id', getGroupById);

export default router;