import Task from "../models/task.model.js";
import Group from "../models/group.model.js";

/**
 * Create a new task (Only admin can create)
 */
export const createTask = async (req, res) => {
    try {
        const { group, title, description, deadline, subtasks } = req.body;
        const userId = req.user.id;
       
        
        const groupID = await Group.findById(group);
        
        if (!groupID) return res.status(404).json({ message: "Group not found" });

        if (groupID.admin.toString() !== userId) {
            return res.status(403).json({ message: "Only admin can create tasks" });
        }

        const task = new Task({
            group: groupID,
            title,
            description,
            deadline,
            subtasks: subtasks.map(subtask => ({
                 title: subtask.title,
                completedBy: subtask.completedBy || []
                })),
        });

        await task.save();
        groupID.tasks.push(task._id);
        await groupID.save();

        res.status(201).json({ message: "Task created successfully", task });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get task details
 */
export const getTaskDetails = async (req, res) => {
    try {
        const { taskId } = req.params;
        const task = await Task.findById(taskId).populate("group");

        if (!task) return res.status(404).json({ message: "Task not found" });

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTasksByGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user.id;

        // Fetch all tasks for this group
        const tasks = await Task.find({ group: groupId });
        
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Update task details (Only admin)
 */
export const updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { title, description, deadline, subtasks } = req.body;
        const userId = req.user.id;

        const task = await Task.findById(taskId).populate("group");
        if (!task) return res.status(404).json({ message: "Task not found" });

        if (task.group.admin.toString() !== userId) {
            return res.status(403).json({ message: "Only admin can update tasks" });
        }

        task.title = title || task.title;
        task.description = description || task.description;
        task.deadline = deadline || task.deadline;
        if (subtasks) {
            task.subtasks = subtasks.map(subtask => ({
                title: subtask.title,
                completedBy: [],
            }));
        }

        await task.save();
        res.status(200).json({ message: "Task updated successfully", task });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Delete task (Only admin)
 */
export const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const userId = req.user.id;

        const task = await Task.findById(taskId).populate("group");
        if (!task) return res.status(404).json({ message: "Task not found" });

        if (task.group.admin.toString() !== userId) {
            return res.status(403).json({ message: "Only admin can delete tasks" });
        }

        await Task.findByIdAndDelete(taskId);
        task.group.tasks = task.group.tasks.filter(id => id.toString() !== taskId);
        await task.group.save();

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Mark subtask as completed by user and update progress
 */
export const completeSubtask = async (req, res) => {
    try {
        const { taskId, subtaskIndex } = req.body;
        const userId = req.user.id;
        const userEmail = req.user.email;

        const task = await Task.findById(taskId).populate("group");
        if (!task) return res.status(404).json({ message: "Task not found" });

        if (subtaskIndex < 0 || subtaskIndex >= task.subtasks.length) {
            return res.status(400).json({ message: "Invalid subtask index" });
        }

        if (!task.subtasks[subtaskIndex].completedBy.includes(userId)) {
            task.subtasks[subtaskIndex].completedBy.push(userId);
            await task.save();
        }

        // Calculate and update user progress in the group
        await updateUserProgressInGroup(task.group._id, userId, userEmail);

        res.status(200).json({ 
            message: "Subtask marked as completed",
            progress: await getUserProgressPercentage(task.group._id, userId)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Helper function to calculate and update user progress
 */
async function updateUserProgressInGroup(groupId, userId, userEmail) {
    try {
        const group = await Group.findById(groupId).populate("tasks");
        if (!group) throw new Error("Group not found");

        let totalSubtasks = 0;
        let completedSubtasks = 0;

        group.tasks.forEach((task) => {
            task.subtasks.forEach((subtask) => {
                totalSubtasks++;
                if (subtask.completedBy && subtask.completedBy.some(id => id.toString() === userId.toString())) {
                    completedSubtasks++;
                }
            });
        });

        const progressPercentage = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

        // Update progress in group model
        const progressEntry = group.progress.find(p => 
            (p.user && p.user.toString() === userId.toString()) || 
            (p.email === userEmail)
        );

        if (progressEntry) {
            progressEntry.percentage = progressPercentage;
        } else {
            group.progress.push({
                user: userId,
                email: userEmail,
                percentage: progressPercentage
            });
        }

        await group.save();
        return progressPercentage;
    } catch (error) {
        console.error("Error updating user progress:", error);
        throw error;
    }
}

/**
 * Helper function to get user progress percentage
 */
async function getUserProgressPercentage(groupId, userId) {
    try {
        const group = await Group.findById(groupId).populate("tasks");
        if (!group) throw new Error("Group not found");

        let totalSubtasks = 0;
        let completedSubtasks = 0;

        group.tasks.forEach((task) => {
            task.subtasks.forEach((subtask) => {
                totalSubtasks++;
                if (subtask.completedBy && subtask.completedBy.some(id => id.toString() === userId.toString())) {
                    completedSubtasks++;
                }
            });
        });

        return totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;
    } catch (error) {
        console.error("Error calculating user progress:", error);
        throw error;
    }
}

/**
 * Fetch user progress in the group
 */
export const getUserProgress = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user.id;
        const userEmail = req.user.email;

        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ message: "Group not found" });

        // First check if progress is already in the group model
        const progressEntry = group.progress.find(p => 
            (p.user && p.user.toString() === userId.toString()) || 
            (p.email === userEmail)
        );

        if (progressEntry && progressEntry.percentage !== undefined) {
            // Return stored progress
            return res.status(200).json({ progress: progressEntry.percentage });
        }

        // If not found or not up-to-date, calculate and update
        const progressPercentage = await updateUserProgressInGroup(groupId, userId, userEmail);
        
        res.status(200).json({ progress: progressPercentage });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get progress for all members in a group
 */
export const getAllMembersProgress = async (req, res) => {
    try {
        const { groupId } = req.params;
        
        const group = await Group.findById(groupId)
            .populate("tasks")
            .populate("members.user", "_id email")
            .populate("progress.user", "_id email");

        if (!group) return res.status(404).json({ message: "Group not found" });

        const membersProgress = {};

        // First use progress data from group model if available
        for (const progressEntry of group.progress) {
            const userId = progressEntry.user ? progressEntry.user._id.toString() : 
                           `email-${progressEntry.email}`;
            
            membersProgress[userId] = progressEntry.percentage || 0;
        }

        // For any member without progress entry, calculate it
        for (const member of group.members) {
            const userId = member.user ? member.user._id.toString() : 
                          `email-${member.email}`;
            
            // Skip if already calculated
            if (membersProgress[userId] !== undefined) continue;

            let totalSubtasks = 0;
            let completedSubtasks = 0;

            if (group.tasks && group.tasks.length > 0) {
                group.tasks.forEach((task) => {
                    if (task.subtasks && task.subtasks.length > 0) {
                        task.subtasks.forEach((subtask) => {
                            totalSubtasks++;
                            if (member.user && subtask.completedBy && 
                                subtask.completedBy.some((id) => id.toString() === member.user._id.toString())) {
                                completedSubtasks++;
                            }
                        });
                    }
                });
            }

            const progressPercentage = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;
            membersProgress[userId] = progressPercentage;
        }

        res.status(200).json({ membersProgress });
    } catch (error) {
        console.error("Error in getAllMembersProgress:", error);
        res.status(500).json({
            message: "Server error while calculating progress",
            error: error.message,
        });
    }
};

/**
 * Update user progress manually (new endpoint)
 */
export const updateUserProgressManually = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user.id;
        const userEmail = req.user.email;

        await updateUserProgressInGroup(groupId, userId, userEmail);
        const progressPercentage = await getUserProgressPercentage(groupId, userId);
        
        res.status(200).json({ 
            success: true,
            message: "Progress updated successfully",
            progress: progressPercentage
        });
    } catch (error) {
        console.error("Error updating progress manually:", error);
        res.status(500).json({
            message: "Server error while updating progress",
            error: error.message,
        });
    }
};

// Add this function to the existing task.controller.js file

/**
 * Get all tasks from all groups that the user is a member of
 * This is used for the calendar view
 */
export const getUserAllTasks = async (req, res) => {
  try {
      const userId = req.user.id;
      const userEmail = req.user.email;

      // Find all groups where the user is either an admin or an accepted member
      const groups = await Group.find({
          $or: [
              { admin: userId },
              { 
                  members: {
                      $elemMatch: {
                          $or: [
                              { user: userId, accepted: true },
                              { email: userEmail, accepted: true }
                          ]
                      }
                  }
              }
          ]
      }).select('_id name');

      if (!groups.length) {
          return res.status(200).json({ tasks: [] });
      }

      // Get all group IDs
      const groupIds = groups.map(group => group._id);

      // Get all tasks from these groups
      const tasks = await Task.find({
          group: { $in: groupIds }
      }).populate('group', 'name');

      // Format tasks for calendar display
      const calendarTasks = tasks.map(task => ({
          _id: task._id,
          title: task.title,
          groupId: task.group._id,
          groupName: task.group.name,
          deadline: task.deadline,
          subtasks: task.subtasks.length
      }));

      res.status(200).json({ tasks: calendarTasks });
  } catch (error) {
      console.error("Error fetching calendar tasks:", error);
      res.status(500).json({ 
          message: "Error fetching calendar tasks", 
          error: error.message 
      });
  }
};