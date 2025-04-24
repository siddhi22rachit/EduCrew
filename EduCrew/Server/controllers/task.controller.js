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
    
            // Find the group to verify access
            const group = await Group.findById(groupId);
            if (!group) return res.status(404).json({ message: "Group not found" });
    
            // Verify the user is a member or admin of this group
            const isAdmin = group.admin.toString() === userId;
            const isMember = group.members.some(member => 
                member.user && member.user.toString() === userId && member.accepted
            );
    
            if (!isAdmin && !isMember) {
                return res.status(403).json({ message: "Access denied" });
            }
    
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
                name: subtask,
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
 * Mark subtask as completed by user
 */
export const completeSubtask = async (req, res) => {
    try {
        const { taskId, subtaskIndex } = req.body;
        const userId = req.user.id;

        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ message: "Task not found" });

        if (subtaskIndex < 0 || subtaskIndex >= task.subtasks.length) {
            return res.status(400).json({ message: "Invalid subtask index" });
        }

        if (!task.subtasks[subtaskIndex].completedBy.includes(userId)) {
            task.subtasks[subtaskIndex].completedBy.push(userId);
            await task.save();
        }

        res.status(200).json({ message: "Subtask marked as completed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Fetch user progress in the group
 */
export const getUserProgress = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user.id;

        const group = await Group.findById(groupId).populate("tasks");
        if (!group) return res.status(404).json({ message: "Group not found" });

        let totalSubtasks = 0;
        let completedSubtasks = 0;

        group.tasks.forEach(task => {
            task.subtasks.forEach(subtask => {
                totalSubtasks++;
                if (subtask.completedBy.includes(userId)) {
                    completedSubtasks++;
                }
            });
        });

        let progressPercentage = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

        res.status(200).json({ progress: progressPercentage });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
