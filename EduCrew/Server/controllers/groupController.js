import mongoose from 'mongoose';
import { Group } from '../models/group.model.js';
import { Task } from '../models/task.model.js';
import {Group} from '../models/group.model.js';

export const createGroup = async (req, res) => {
  try {
    const { groupName, members, totalMembers } = req.body;

    if (!groupName) {
      return res.status(400).json({ message: 'Group name is required' });
    }

    const newGroup = new Group({
      groupName: groupName.trim(),
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
    const groups = await Group.find().populate('tasks');
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Group ID' });
    }

    const group = await Group.findById(id).populate({
      path: 'tasks',
      select: 'taskName subtasks' // Select specific task details
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

    const updatedGroup = await Group.findByIdAndUpdate(
      id,
      { 
        groupName: groupName?.trim(), 
        members, 
        totalMembers 
      },
      { new: true, runValidators: true }
    );

    if (!updatedGroup) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.status(200).json({
      message: 'Group updated successfully',
      group: updatedGroup
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating group',
      error: error.message
    });
  }
};

export const deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Group ID' });
    }

    const group = await Group.findByIdAndDelete(id);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Optional: Delete all tasks associated with this group
    await Task.deleteMany({ group: id });

    res.status(200).json({ message: 'Group deleted successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting group',
      error: error.message
    });
  }
};