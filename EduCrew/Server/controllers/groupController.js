import Group from '../models/group.model.js';

export const createGroup = async (req, res, next) => {
  try {
    const { groupName, members, totalMembers } = req.body;
    if (!groupName || !members || !totalMembers) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const newGroup = new Group({ groupName, members, totalMembers });
    await newGroup.save();

    res.status(201).json({ success: true, message: 'Group created successfully', data: newGroup });
  } catch (error) {
    next(error);
  }
};

// Get All Groups
export const getGroups = async (req, res, next) => {
  try {
    const groups = await Group.find();
    res.status(200).json({ success: true, data: groups });
  } catch (error) {
    next(error);
  }
};
