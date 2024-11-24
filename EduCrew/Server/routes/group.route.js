import express from 'express';
import { createGroup, getGroups } from '../controllers/groupController.js';
import resourceController from '../controllers/resources.controller.js';

import { 
  createGroup, 
  getAllGroups, 
  getGroupById 
} from '../controllers/groupController.js';

const router = express.Router();

router.post('/', createGroup);
router.get('/', getGroups);
router.post('/:groupId/resources', resourceController.addResource);
router.get('/:groupId/resources', resourceController.getGroupResources);
router.get('/', getAllGroups);
router.get('/:id', getGroupById);

export default router;