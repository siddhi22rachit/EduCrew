import Group from "../models/group.model.js";
import Resource from "../models/resources.model.js";

const resourceController = {
    // Add new resource
    addResource: async (req, res) => {
        try {   
            const { groupId } = req.params;
            const { title, description, resourceType, url, memberId } = req.body;


            // Verify if group exists
            const group = await Group.findById(groupId);
            if (!group) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Group not found' 
                });
            }
            console.log('Group Members:', group.members);
            console.log('Provided Member ID:', memberId);


            // Verify if member belongs to group
            const isMember = group.members.some(member => member._id.equals(memberId));

            
            if (!isMember) {
                return res.status(403).json({ 
                    success: false,
                    message: 'Only group members can add resources' 
                });
            }

            // Create new resource
            const resource = new Resource({
                groupId,
                title,
                description,
                resourceType,
                url,
                addedBy: memberId
            });

            await resource.save();

            res.status(201).json({
                success: true,
                message: 'Resource added successfully',
                data: resource
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error adding resource',
                error: error.message
            });
        }
    },

    getGroupResources: async (req, res) => {
        try {
            const { groupId } = req.params;
            const { resourceType, sortBy = 'createdAt', order = 'desc' } = req.query;

            // Validate group exists
            const groupExists = await Group.exists({ _id: groupId });
            if (!groupExists) {
                return res.status(404).json({
                    success: false,
                    message: 'Group not found'
                });
            }

            // Build query
            let query = { groupId };
            if (resourceType) {
                query.resourceType = resourceType;
            }

            // Fetch resources with sorting
            const resources = await Resource.find(query)
                .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
                .populate('addedBy', 'name email')
                .exec();

            res.json({
                success: true,
                message: 'Resources retrieved successfully',
                data: {
                    count: resources.length,
                    resources
                }
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching resources',
                error: error.message
            });
        }
    },
}

export default resourceController;
