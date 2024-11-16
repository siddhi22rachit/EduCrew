import Calendar from '../models/calendar.model.js';

// Add Task to Calendar
export const addTask = async (req, res, next) => {
  try {
    const { groupId, taskName, deadline } = req.body;

    if (!groupId || !taskName || !deadline) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    let calendar = await Calendar.findOne({ groupId });

    // If no calendar exists for the group, create one
    if (!calendar) {
      calendar = new Calendar({ groupId, tasks: [] });
    }

    // Add the new task
    calendar.tasks.push({ taskName, deadline });
    await calendar.save();

    res.status(201).json({ success: true, message: 'Task added successfully', data: calendar });
  } catch (error) {
    next(error);
  }
};

// Get Calendar for a Group
export const getCalendar = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    if (!groupId) {
      return res.status(400).json({ success: false, message: 'Group ID is required' });
    }

    const calendar = await Calendar.findOne({ groupId }).populate('groupId');

    if (!calendar) {
      return res.status(404).json({ success: false, message: 'Calendar not found for this group' });
    }

    res.status(200).json({ success: true, data: calendar });
  } catch (error) {
    next(error);
  }
};
