import express from 'express';
import { addTask, getCalendar } from '../controllers/calendar.controller.js';

const router = express.Router();

// Add Task API
router.post('/task', addTask);

// Get Calendar API
router.get('/:groupId', getCalendar);

export default router;
