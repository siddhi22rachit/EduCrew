import Group from "../models/group.model.js";
import User from "../models/user.model.js";
import { sendEmail } from "../utils/emailService.js";
import { createError } from "../utils/error.js";

export const createGroup = async (req, res) => {
  try {
    // console.log("📥 Incoming request body:", req.body);
    // console.log("🔐 Authenticated user:", req.user);

    const { name, memberEmails = [] } = req.body;

    // Ensure that the authenticated user (admin) is correctly assigned
    const adminUserId = req.user?.userId;
    const adminEmail = req.user?.email;

    if (!name) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    if (!adminUserId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Admin user ID is missing" });
    }

    // Ensure admin's email is included in the memberEmails list if not already
    if (adminEmail && !memberEmails.includes(adminEmail)) {
      memberEmails.push(adminEmail);
    }

    // console.log(`📝 Creating group "${name}" with members:`, memberEmails);

    // Create the members and progress arrays
    const members = memberEmails.map((email) => ({
      email,
      accepted: email === adminEmail, // Only the admin is accepted initially
    }));

    const progressArray = memberEmails.map((email) => ({
      email,
      percentage: 0, // Initial progress set to 0 for all members
    }));

    // Create the group with the admin user
    const newGroup = new Group({
      name,
      admin: adminUserId,
      members: members,
      progress: progressArray,
    });

    // Save the group to the database
    await newGroup.save();

    // console.log("✅ Group created with ID:", newGroup._id);

    // Send invitation emails to all except admin
    for (const email of memberEmails) {
      if (email === adminEmail) continue; // Skip sending email to the admin

      const emailSent = await sendEmail({
        email,
        groupName: name,
        groupId: newGroup._id,
      });

      console.log(
        `📨 Email sent to ${email}: ${emailSent ? "Success" : "Failed"}`
      );
    }

    console.log(members);
    res.status(201).json({
      success: true,
      message: "Group created and invitations sent",
      data: newGroup,
    });
  } catch (error) {
    console.error("❌ Error creating group:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getGroupDetails = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId)
      .populate("admin", "name email")
      .populate({
        path: "members.user",
        select: "name email",
      });

    if (!group) {
      return next(createError(404, "Group not found"));
    }

    if (group.tasks && group.tasks.length > 0) {
      await group.populate({
        path: "tasks",
        populate: {
          path: "subtasks.completedBy",
          select: "name email",
        },
      });
    }

    if (group.resources && group.resources.length > 0) {
      await group.populate({
        path: "resources",
        populate: {
          path: "uploadedBy",
          select: "name email",
        },
      });
    }

    // Process members to ensure emails are properly represented
    const processedMembers = group.members.map((member) => {
      if (member.user) {
        return member;
      } else if (member.email) {
        // Create a virtual user object for unregistered users
        return {
          ...member.toObject(),
          user: {
            _id: "unregistered",
            name: member.email.split("@")[0],
            email: member.email,
          },
        };
      }
      return member;
    });

    // Replace group members with processed ones
    const result = group.toObject();
    result.members = processedMembers;

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error in getGroupDetails:", error);
    next(error);
  }
};

export const acceptInvite = async (req, res) => {
  const { groupId, userEmail } = req.body;

  if (!groupId) {
    return res.status(400).json({ message: "groupId is required" });
  }

  if (!userEmail) {
    return res.status(400).json({ message: "userEmail is required" });
  }

  console.log("📩 Received from frontend - Group ID:", groupId);
  console.log("📩 Received from frontend - User Email:", userEmail);

  try {
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // ✅ Find the member using email instead of userId
    const memberIndex = group.members.findIndex(
      (member) => member.email === userEmail && member.accepted === false
    );

    if (memberIndex === -1) {
      return res.status(400).json({ message: "Invite not found or already accepted" });
    }

    // ✅ Mark as accepted
    group.members[memberIndex].accepted = true;
    await group.save();

    return res.status(200).json({
      message: "✅ Invite accepted successfully",
      group,
    });
  } catch (error) {
    console.error("❌ Error accepting invite:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

// Accept invitation and join group
// export const inviteToGroup = async (req, res, next) => {
//   try {
//     const { groupId } = req.params;
//     const { emails } = req.body;

//     if (!req.user) {
//       return next(createError(401, "Authentication required"));
//     }

//     const userId = req.user.userId || req.user.id;
//     console.log("Current user ID:", userId);

//     if (!userId) {
//       return next(createError(401, "User ID not found in token"));
//     }

//     const group = await Group.findById(groupId);
//     if (!group) {
//       return next(createError(404, "Group not found"));
//     }

//     console.log("Group admin ID:", group.admin.toString());

//     if (group.admin.toString() !== userId.toString()) {
//       return next(createError(403, "Only admin can send invitations"));
//     }

//     const registeredUsers = await User.find({ email: { $in: emails } });
//     console.log(`✅ Found ${registeredUsers.length} registered users`);

//     const updates = [];
//     const unregisteredEmails = [];

//     for (const email of emails) {
//       const user = registeredUsers.find((u) => u.email === email);

//       if (user) {
//         // Check if user is already a member
//         const isMember = group.members.some(
//           (m) =>
//             (m.user && m.user.toString() === user._id.toString()) ||
//             m.email === email
//         );

//         if (!isMember) {
//           updates.push({
//             members: { user: user._id, accepted: false },
//             progress: { user: user._id, percentage: 0 },
//           });
//         }
//       } else {
//         // Check if email is already in members
//         const isEmailMember = group.members.some((m) => m.email === email);

//         if (!isEmailMember) {
//           // If user is not registered, add email to the group
//           unregisteredEmails.push(email);
//           updates.push({
//             members: { email, accepted: false },
//             progress: { email, percentage: 0 },
//           });
//         }
//       }

//       // Send invitation email
//       const inviteUrl = `${
//         process.env.CLIENT_URL
//       }/register?groupId=${groupId}&email=${encodeURIComponent(email)}`;
//       const emailSent = await sendEmail({
//         email,
//         subject: "EduCrew Group Invitation",
//         message: `You've been invited to join the group "${group.name}" on EduCrew.`,
//         groupId: groupId,
//       });

//       console.log(
//         `📩 Invitation email to ${email}: ${emailSent ? "sent" : "failed"}`
//       );
//     }

//     if (updates.length > 0) {
//       await Group.findByIdAndUpdate(groupId, {
//         $push: {
//           members: updates.map((u) => u.members),
//           progress: updates.map((u) => u.progress),
//         },
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Invitations sent successfully",
//       unregisteredEmails,
//     });
//   } catch (error) {
//     console.error("❌ Error sending invitations:", error);
//     next(error);
//   }
// };

// // Accept invitation endpoint
// export const acceptInvitation = async (req, res, next) => {
//   try {
//     const { groupId } = req.params;
//     const { email } = req.body;

//     const userId = req.user?.userId || req.user?.id;

//     const group = await Group.findOneAndUpdate(
//       {
//         _id: groupId,
//         'members.email': email
//       },
//       {
//         $set: {
//           'members.$.accepted': true,
//           'members.$.user': userId
//         }
//       },
//       { new: true }
//     );

//     if (!group) {
//       return next(createError(404, "User not found in this group"));
//     }

//     res.status(200).json({
//       success: true,
//       message: "Invitation accepted successfully",
//       group
//     });
//   } catch (error) {
//     console.error("Error accepting invitation:", error);
//     next(error);
//   }
// };

// // Reject invitation endpoint
// export const rejectInvitation = async (req, res, next) => {
//   try {
//     const { groupId } = req.params;
//     const { email } = req.body;

//     // Get the current user's token information
//     const userId = req.user?.userId || req.user?.id;

//     // Find the group
//     const group = await Group.findById(groupId);

//     if (!group) {
//       return next(createError(404, "Group not found"));
//     }

//     // Find the member in the group by email or user ID
//     const memberIndex = group.members.findIndex(
//       m => (m.email === email) || (m.user && m.user.toString() === userId)
//     );

//     if (memberIndex === -1) {
//       return next(createError(404, "User not found in this group"));
//     }

//     // Update the member's status
//     group.members[memberIndex].rejected = true;
//     group.members[memberIndex].accepted = false;

//     await group.save();

//     res.status(200).json({
//       success: true,
//       message: "Invitation rejected successfully"
//     });
//   } catch (error) {
//     console.error("❌ Error rejecting invitation:", error);
//     next(error);
//   }
// };

export const handleInvitation = async (req, res, next) => {
  try {
    const { action, groupId, email } = req.query;
    if (!action || !groupId || !email) {
      return next(
        createError(
          400,
          "missing required parameters whic is action groupid and email"
        )
      );
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return next(createError(404, "group not found"));
    }
    const memberIndex = group.members.findIndex((m) => m.email === email);
    if (memberIndex === -1) {
      return next(createError(404, "member not found"));
    }

    if (action === "accept") {
      group.members[memberIndex].accepted = true;
    } else {
      group.members[memberIndex].accepted = false;
    }
    await group.save();

    return res.redirect(`${process.env.CLIENT_URL}/dashboard/group/${groupId}`);
  } catch (error) {
    console.log(error);
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
        { "members.email": email, "members.accepted": false }, // Unregistered users who registered now
      ],
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
      message: "Successfully joined the group",
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
      .populate("members.user", "name email")
      .populate("progress.user", "name email")
      .select("members progress");

    if (!group) {
      return next(createError(404, "Group not found"));
    }

    res.status(200).json({
      success: true,
      data: {
        members: group.members,
        progress: group.progress,
      },
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
      return next(createError(404, "Group not found"));
    }

    // Only admin can update progress
    if (group.admin.toString() !== adminId) {
      return next(createError(403, "Only admin can update progress"));
    }

    const memberExists = group.members.some(
      (m) => m.user && m.user.toString() === userId && m.accepted
    );
    if (!memberExists) {
      return next(
        createError(404, "User is not an accepted member of this group")
      );
    }

    await Group.findOneAndUpdate(
      { _id: groupId, "progress.user": userId },
      { "progress.$.percentage": percentage }
    );

    res.status(200).json({
      success: true,
      message: "Progress updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getUserGroups = async (req, res, next) => {
  try {
    const {userId} = req.params;
    // Get the userEmail from the userId parameter
    const user = await User.findById(userId);
    if (!user) {
      return next(createError(404, "User not found"));
    }
    const userEmail = user.email;
    // console.log("User email:", userEmail);
    
    

    if (!userId  ) {
      return next(createError(401, "Authentication required"));
    } 
    
    
    const groups = await Group.find({
      $or: [
        { admin: userId },
        { 
          members: {
            $elemMatch: {
              email: userEmail,
              accepted: true 
            }
          }
        }
      ]
    }).select('_id name admin members');
    // console.log("User groups:", groups);
    

    // Populate admin info for each group
    await Group.populate(groups, {
      path: "admin",
      select: "name email",
    });

    // Format response to include only necessary data
    const formattedGroups = groups.map(group => {
      const memberCount = group.members.length;
      
      return {
        _id: group._id,
        groupName: group.name, // Using groupName to match existing frontend component
        adminName: group.admin?.name || 'Unknown',
        adminEmail: group.admin?.email || 'Unknown',
        memberCount: memberCount,
        isAdmin: group.admin?._id.toString() === userId,
      };
    });

    res.status(200).json(formattedGroups);
  } catch (error) {
    console.error("❌ Error fetching user groups:", error);
    next(error);
  }
};

export const deleteGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const userId = req.user?.userId || req.user?.id;

    const group = await Group.findById(groupId);
    if (!group) {
      return next(createError(404, "Group not found"));
    }

    if (group.admin.toString() !== userId) {
      return next(createError(403, "Only admin can delete the group"));
    }

    await Group.findByIdAndDelete(groupId);

    res.status(200).json({
      success: true,
      message: "Group deleted successfully",
    });
  } catch (error) {
    next(error);
  }
    }

