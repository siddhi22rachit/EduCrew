import mongoose from 'mongoose';
import { Group } from '../models/group.model.js';
import { Task } from '../models/task.model.js';

export const createGroup = async (req, res) => {
  try {
    const { groupName, members, totalMembers } = req.body;
    const userId = req.user.id; // Get userId from authenticated user

    if (!groupName) {
      return res.status(400).json({ message: 'Group name is required' });
    }

    const newGroup = new Group({
      groupName: groupName.trim(),
      userId, // Automatically add the authenticated user's ID
      members: members || [],
      totalMembers: totalMembers || 1
    });

    await newGroup.save();

    res.status(201).json({
      message: 'Group created successfully',
      group: newGroup
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating group',
      error: error.message
    });
  }
};

export const getAllGroups = async (req, res) => {
  try {
    const { userId } = req.query; // Add query parameter for userId

    let query = {};
    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid User ID' });
      }
      query.userId = userId;
    }

    const groups = await Group.find(query).populate('tasks');
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching groups',
      error: error.message
    });
  }
};

export const getGroupById = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query; // Optional: Add userId check

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Group ID' });
    }

    const query = { _id: id };
    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid User ID' });
      }
      query.userId = userId;
    }

    const group = await Group.findOne(query).populate({
      path: 'tasks',
      select: 'taskName subtasks'
    });
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching group',
      error: error.message
    });
  }
};

export const updateGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { groupName, members, totalMembers } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Group ID' });
    }

    // Find the group by ID
    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Prepare the update data
    const updateData = {
      ...(groupName && { groupName: groupName.trim() }),
      ...(members && { members }),
      ...(totalMembers && { totalMembers })
    };

    // Update the group
    const updatedGroup = await Group.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    res.status(200).json({
      message: 'Group updated successfully',
      group: updatedGroup
    });
  } catch (error) {
    console.error('Error updating group:', error);
    res.status(500).json({ message: 'Error updating group', error: error.message });
  }
};

export const getUserId = async (req, res) => {
  try {
    console.log('Request user:', req.user); // Debugging step
    const userId = req.user?.id; // Get userId from the authenticated user
    if (!userId) {
      return res.status(404).json({ message: 'User ID not found' });
    }

    console.log('User ID:', userId); // Debugging step

    res.status(200).json({
      message: 'User ID retrieved successfully',
      userId, // Send the user ID in the response
    });
  } catch (error) {
    console.error('Error retrieving user ID:', error.message); // Debugging step
    res.status(500).json({
      message: 'Error retrieving user ID',
      error: error.message,
    });
  }
};

export const deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the group by ID
    const group = await Group.findByIdAndDelete(id);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.status(200).json({ message: 'Group deleted successfully' });
  } catch (err) {
    console.error('Error deleting group:', err);
    res.status(500).json({ message: 'Error deleting group', error: err.message });
  }
};


