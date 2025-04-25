import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import {
  createGroup,
  getGroupDetails,
  // inviteToGroup,
  acceptInvite,
  joinGroup,
  getGroupMembers,
  updateProgress,
  // acceptInvitation,
  // rejectInvitation,
  // getUserGroups,
  handleInvitation
} from '../controllers/groupController.js';

const router = express.Router();

// // All routes require authentication
router.use(verifyToken);

router.post('/create', createGroup);
router.get('/:groupId', getGroupDetails);
// router.post('/:groupId/invite', inviteToGroup);
router.post("/invite/accept", acceptInvite);
router.put('/:groupId/join', joinGroup);
router.get('/:groupId/members', getGroupMembers);
router.put('/:groupId/progress', updateProgress);
router.get("/invite",handleInvitation);
// // Accept invitation
// router.post('/:groupId/accept', verifyToken, acceptInvitation);

// // Reject invitation
// router.post('/:groupId/reject', verifyToken,rejectInvitation);
// router.get('/', getUserGroups);
// router.post('/:groupId/accept', verifyToken, acceptInvitation);

// router.post('/:groupId/reject', verifyToken,rejectInvitation);
// router.get('/user/:userId',verifyToken, getUserGroups);

router.get('/test-auth', verifyToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Authentication successful',
    user: req.user
  });
});

export default router;