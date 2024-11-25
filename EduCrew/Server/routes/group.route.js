import express from 'express';

import resourceController from '../controllers/resources.controller.js';

import { 
  createGroup, 
  getAllGroups, 
  getGroupById 
} from '../controllers/groupController.js';

const router = express.Router();

router.post('/', createGroup);

router.post('/:groupId/resources', resourceController.addResource);
router.get('/:groupId/resources', resourceController.getGroupResources);
router.get('/', getAllGroups);
router.get('/:id', getGroupById);

export default router;