
import Group from '../models/group.model.js';
import User from '../models/user.model.js';
import { sendEmail } from '../utils/emailService.js';
import { createError } from '../utils/error.js';

export const createGroup = async (req, res) => {
  try {
    console.log("🔹 Incoming request body:", req.body);
    console.log("🔹 req.user:", req.user);

    const { name } = req.body;
    const adminUserId = req.user?.userId; // Ensure correct admin ID extraction

    if (!name) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    if (!adminUserId) {
      return res.status(401).json({ error: "Unauthorized: Admin user ID is missing" });
    }

    const newGroup = new Group({
      name,
      admin: adminUserId, // Admin is the only member initially
      members: [{ user: adminUserId, accepted: true }], // Admin is automatically added as a member
      progress: [{ user: adminUserId, percentage: 0 }]
    });

    await newGroup.save();
    res.status(201).json(newGroup);
  } catch (error) {
    console.error("❌ Error in createGroup:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Get group details
export const getGroupDetails = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId)
      .populate('admin', 'name email')
      .populate({
        path: 'members.user',
        select: 'name email'
      });

    // Conditionally populate tasks if they exist
    if (group.tasks && group.tasks.length > 0) {
      await group.populate({
        path: 'tasks',
        populate: {
          path: 'subtasks.completedBy',
          select: 'name email'
        }
      });
    }

    // Conditionally populate resources if they exist
    if (group.resources && group.resources.length > 0) {
      await group.populate({
        path: 'resources',
        populate: {
          path: 'uploadedBy',
          select: 'name email'
        }
      });
    }

    if (!group) {
      return next(createError(404, 'Group not found'));
    }

    res.status(200).json({
      success: true,
      data: group
    });
  } catch (error) {
    console.error('Error in getGroupDetails:', error);
    
    // More detailed error logging
    if (error.name === 'MissingSchemaError') {
      console.error('Missing Schema for Model:', error.message);
    }
    
    next(error);
  }
};

// Accept invitation and join group
export const inviteToGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { emails } = req.body;
    
    if (!req.user) {
      return next(createError(401, "Authentication required"));
    }
    
    const userId = req.user.userId || req.user.id;
    console.log("Current user ID:", userId);
    
    if (!userId) {
      return next(createError(401, "User ID not found in token"));
    }
    
    const group = await Group.findById(groupId);
    if (!group) {
      return next(createError(404, "Group not found"));
    }
    
    console.log("Group admin ID:", group.admin.toString());

    // Ensure only the admin can send invitations
    if (group.admin.toString() !== userId.toString()) {
      return next(createError(403, "Only admin can send invitations"));
    }

    const registeredUsers = await User.find({ email: { $in: emails } });
    console.log(`✅ Found ${registeredUsers.length} registered users`);

    const updates = [];
    const unregisteredEmails = [];

    for (const email of emails) {
      const user = registeredUsers.find((u) => u.email === email);

      if (user) {
        // Check if user is already a member
        const isMember = group.members.some(m => m.user.toString() === user._id.toString());
        
        if (!isMember) {
          updates.push({
            members: { user: user._id, accepted: false },
            progress: { user: user._id, percentage: 0 }
          });
        }
      } else {
        // If user is not registered, send an invite and add email to the group
        unregisteredEmails.push(email);
        updates.push({
          members: { email, accepted: false }, // Store email directly for unregistered users
          progress: { email, percentage: 0 }
        });
      }

      // Send invitation email
      const inviteUrl = `${process.env.CLIENT_URL}/register?groupId=${groupId}&email=${encodeURIComponent(email)}`;
      const emailSent = await sendEmail({
        email,
        subject: "EduCrew Group Invitation",
        message: `You've been invited to join the group "${group.name}" on EduCrew. Click here to accept: ${inviteUrl}`
      });

      console.log(`📩 Invitation email to ${email}: ${emailSent ? "sent" : "failed"}`);
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
      message: "Invitations sent successfully",
      unregisteredEmails
    });
  } catch (error) {
    console.error("❌ Error sending invitations:", error);
    next(error);
  }
};

export const joinGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;
    const email = req.user.email; // Get email from registered user

    // Find group and check if user was invited
    const group = await Group.findOne({
      _id: groupId,
      $or: [
        { "members.user": userId, "members.accepted": false }, // Registered users
        { "members.email": email, "members.accepted": false } // Unregistered users who registered now
      ]
    });

    if (!group) {
      return next(createError(404, "Invalid invitation or already joined"));
    }

    // Update the group: replace email with user ID
    await Group.findOneAndUpdate(
      { _id: groupId },
      {
        $pull: { members: { email } }, // Remove email-based entry
        $push: { members: { user: userId, accepted: true } }, // Add user with ID
      }
    );

    res.status(200).json({
      success: true,
      message: "Successfully joined the group"
    });
  } catch (error) {
    console.error("❌ Error joining group:", error);
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
    const adminId = req.user.userId;
    // console.log("Admin ID:", adminId);

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