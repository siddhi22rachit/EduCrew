import Group from '../models/group.model.js';
import User from '../models/user.model.js';
import { sendEmail } from '../utils/emailService.js';
import { createError } from '../utils/error.js';

// Create a new group
export const createGroup = async (req, res, next) => {
  try {
    const { name, members } = req.body;
    const userId = req.user.id;

    if (!name) {
      return next(createError(400, 'Group name is required'));
    }

    // Create new group with current user as admin
    const newGroup = new Group({
      name: name.trim(),
      admin: userId,
      members: [{ user: userId, accepted: true }], // Admin is automatically accepted
      tasks: [],
      resources: [],
      progress: [{ user: userId, percentage: 0 }]
    });

    // Add invited members
    if (members && Array.isArray(members)) {
      const users = await User.find({ email: { $in: members } });
      for (const user of users) {
        if (user._id.toString() !== userId) {
          newGroup.members.push({ user: user._id, accepted: false });
          newGroup.progress.push({ user: user._id, percentage: 0 });
          
          // Send invitation email
          await sendEmail({
            email: user.email,
            subject: 'Group Invitation',
            message: `You've been invited to join ${name}. Click here to accept: ${process.env.CLIENT_URL}/groups/${newGroup._id}/join`
          });
        }
      }
    }

    await newGroup.save();

    res.status(201).json({
      success: true,
      message: 'Group created successfully',
      data: newGroup
    });
  } catch (error) {
    next(error);
  }
};

// Get group details
export const getGroupDetails = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId)
      .populate('admin', 'name email')
      .populate('members.user', 'name email')
      .populate('tasks')
      .populate('resources');

    if (!group) {
      return next(createError(404, 'Group not found'));
    }

    res.status(200).json({
      success: true,
      data: group
    });
  } catch (error) {
    next(error);
  }
};

// Send invitation to users
export const inviteToGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { emails } = req.body;
    const userId = req.user.id;

    const group = await Group.findById(groupId);
    if (!group) {
      return next(createError(404, 'Group not found'));
    }

    // Check if user is admin
    if (group.admin.toString() !== userId) {
      return next(createError(403, 'Only admin can send invitations'));
    }

    const users = await User.find({ email: { $in: emails } });
    const updates = [];
    
    for (const user of users) {
      if (!group.members.some(m => m.user.toString() === user._id.toString())) {
        updates.push({
          members: { user: user._id, accepted: false },
          progress: { user: user._id, percentage: 0 }
        });

        // Send invitation email
        await sendEmail({
          email: user.email,
          subject: 'Group Invitation',
          message: `You've been invited to join ${group.name}. Click here to accept: ${process.env.CLIENT_URL}/groups/${groupId}/join`
        });
      }
    }

    if (updates.length > 0) {
      await Group.findByIdAndUpdate(groupId, {
        $push: {
          members: updates.map(u => u.members),
          progress: updates.map(u => u.progress)
        }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Invitations sent successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Accept invitation and join group
export const joinGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;

    const group = await Group.findOne({
      _id: groupId,
      'members.user': userId,
      'members.accepted': false
    });

    if (!group) {
      return next(createError(404, 'Invalid invitation or already accepted'));
    }

    await Group.findOneAndUpdate(
      { _id: groupId, 'members.user': userId },
      { 'members.$.accepted': true }
    );

    res.status(200).json({
      success: true,
      message: 'Successfully joined the group'
    });
  } catch (error) {
    next(error);
  }
};

// Get all members and their progress
export const getGroupMembers = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId)
      .populate('members.user', 'name email')
      .populate('progress.user', 'name email')
      .select('members progress');

    if (!group) {
      return next(createError(404, 'Group not found'));
    }

    res.status(200).json({
      success: true,
      data: {
        members: group.members,
        progress: group.progress
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update member progress
export const updateProgress = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { userId, percentage } = req.body;
    const adminId = req.user.id;

    const group = await Group.findById(groupId);
    if (!group) {
      return next(createError(404, 'Group not found'));
    }

    // Only admin can update progress
    if (group.admin.toString() !== adminId) {
      return next(createError(403, 'Only admin can update progress'));
    }

    const memberExists = group.members.some(
      m => m.user.toString() === userId && m.accepted
    );
    if (!memberExists) {
      return next(createError(404, 'User is not an accepted member of this group'));
    }

    await Group.findOneAndUpdate(
      { _id: groupId, 'progress.user': userId },
      { 'progress.$.percentage': percentage }
    );

    res.status(200).json({
      success: true,
      message: 'Progress updated successfully'
    });
  } catch (error) {
    next(error);
  }
};