import express from 'express';
import { createGroup, getGroups } from '../controllers/groupController.js';
import resourceController from '../controllers/resources.controller.js';

const router = express.Router();

router.post('/', createGroup);
router.get('/', getGroups);
router.post('/:groupId/resources', resourceController.addResource);
router.get('/:groupId/resources', resourceController.getGroupResources);

export default router;
