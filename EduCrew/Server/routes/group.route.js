import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import {
  createGroup,
  getGroupDetails,
  inviteToGroup,
  joinGroup,
  getGroupMembers,
  updateProgress,
  acceptInvitation,
  rejectInvitation,
  getUserGroups
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
router.post('/:groupId/accept', verifyToken, acceptInvitation);

router.post('/:groupId/reject', verifyToken,rejectInvitation);
router.get('/user/:userId',verifyToken, getUserGroups);

router.get('/test-auth', verifyToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Authentication successful',
    user: req.user
  });
});

export default router;