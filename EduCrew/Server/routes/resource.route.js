import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import resourceController from '../controllers/resources.controller.js';
// import resourceController from './../controllers/resource.controller.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

router.post('/:groupId/add', resourceController.addResource);
router.get('/:groupId', resourceController.getGroupResources);

export default router;