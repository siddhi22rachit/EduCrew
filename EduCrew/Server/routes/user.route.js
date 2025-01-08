import express from 'express';
import {
  test,
  updateUser,
  deleteUser,
  getUserDetailsById,
  getCurrentUser
} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/', test);
router.get('/current-user', verifyToken, getCurrentUser);

router.get('/user/:userId', verifyToken, getUserDetailsById);
router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);

export default router;