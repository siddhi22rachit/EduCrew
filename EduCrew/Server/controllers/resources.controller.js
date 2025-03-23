import Resource from '../models/resources.model.js';
import Group from '../models/group.model.js';
import { createError } from '../utils/error.js';

const resourceController = {
    addResource: async (req, res, next) => {
        try {
            const { groupId } = req.params;
            const { title, fileUrl } = req.body;
            const userId = req.user.userId;

            // Verify group existence
            const group = await Group.findById(groupId);
            if (!group) return next(createError(404, 'Group not found'));

            console.log("Logged-in User ID:", userId);
            console.log("Group Admin ID:", group.admin.toString());


            // Check if the user is the admin
            if (group.admin.toString() !== userId) {
                return next(createError(403, 'Only the admin can upload resources'));
            }

            const resource = new Resource({
                group: groupId,
                uploadedBy: userId,
                title,
                fileUrl
            });
            await resource.save();

            res.status(201).json({
                success: true,
                message: 'Resource uploaded successfully',
                data: resource
            });
        } catch (error) {
            next(error);
        }
    },

    // Get all resources for a group
    getGroupResources: async (req, res, next) => {
        try {
            const { groupId } = req.params;
            const { sortBy = 'createdAt', order = 'desc' } = req.query;

            // Verify group existence
            const groupExists = await Group.exists({ _id: groupId });
            if (!groupExists) return next(createError(404, 'Group not found'));

            const resources = await Resource.find({ group: groupId })
                .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
                .populate('uploadedBy', 'name email');

            res.json({
                success: true,
                message: 'Resources retrieved successfully',
                data: resources
            });
        } catch (error) {
            next(error);
        }
    }
};

export default resourceController;