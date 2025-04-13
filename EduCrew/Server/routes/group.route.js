import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import {
  createGroup,
  getGroupDetails,
  inviteToGroup,
  joinGroup,
  getGroupMembers,
  updateProgress
} from '../controllers/groupController.js';

const router = express.Router();

// // All routes require authentication
router.use(verifyToken);

router.post('/create', createGroup);
router.get('/:groupId', getGroupDetails);
router.post('/:groupId/invite', inviteToGroup);
router.put('/:groupId/join', joinGroup);
router.get('/:groupId/members', getGroupMembers);
router.put('/:groupId/progress', updateProgress);

// Add this route to your group routes
router.get('/test-auth', verifyToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Authentication successful',
    user: req.user
  });
});

export default router;