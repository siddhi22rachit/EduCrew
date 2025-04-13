import Resource from '../models/resources.model.js';
import Group from '../models/group.model.js';
import { createError } from '../utils/error.js';
import cloudinary from '../lib/cloudinary.js';
import fs from 'fs';

const resourceController = {
    addResource: async (req, res, next) => {
        try {
            const { groupId } = req.params;
            const { title } = req.body;
            const file = req.file; // From multer middleware
            const userId = req.user.userId;
    
            if (!file) return next(createError(400, 'No file uploaded'));
    
            const group = await Group.findById(groupId);
            if (!group) return next(createError(404, 'Group not found'));
    
            console.log("Logged-in User ID:", userId);
            console.log("Group Admin ID:", group.admin.toString());
    
            if (group.admin.toString() !== userId) {
                return next(createError(403, 'Only the admin can upload resources'));
            }
    
            // Upload file to Cloudinary
            const cloudinaryResult = await cloudinary.uploader.upload(file.path, {
                folder: `group-resources/${groupId}`,
                resource_type: 'auto', // Automatically detect file type
                use_filename: true,    // Use original filename
                unique_filename: true  // Ensure unique names
            });

            // Get file extension to determine file type
            const fileExtension = file.originalname.split('.').pop().toLowerCase();
            const fileType = getFileType(fileExtension);
    
            // Create and save resource with Cloudinary URL and the required fields
            const resource = new Resource({
                group: groupId,
                uploadedBy: userId,
                title: title || file.originalname,
                fileUrl: cloudinaryResult.secure_url,
                filePublicId: cloudinaryResult.public_id,
                originalFileName: file.originalname, // Store original filename
                fileSize: file.size,
                fileType: fileType
            });
            
            await resource.save();
    
            // If using multer with local storage, clean up the temp file
            if (file.path) {
                fs.unlinkSync(file.path);
            }
    
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
    },

    // Delete a resource
    deleteResource: async (req, res, next) => {
        try {
            const { resourceId } = req.params;
            const userId = req.user.userId;

            const resource = await Resource.findById(resourceId);
            if (!resource) return next(createError(404, 'Resource not found'));

            const group = await Group.findById(resource.group);
            if (!group) return next(createError(404, 'Group not found'));
            
            // Check if user is admin or the person who uploaded
            if (group.admin.toString() !== userId && resource.uploadedBy.toString() !== userId) {
                return next(createError(403, 'You do not have permission to delete this resource'));
            }

            // Delete from Cloudinary if public ID exists
            if (resource.filePublicId) {
                try {
                    await cloudinary.uploader.destroy(resource.filePublicId);
                } catch (cloudinaryError) {
                    console.error('Error deleting from Cloudinary:', cloudinaryError);
                    // Continue with database deletion even if Cloudinary deletion fails
                }
            }

            // Delete from database
            await Resource.findByIdAndDelete(resourceId);

            res.status(200).json({
                success: true,
                message: 'Resource deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    },

    // Download a resource
    downloadResource: async (req, res, next) => {
        try {
            const { resourceId } = req.params;
            
            const resource = await Resource.findById(resourceId);
            if (!resource) return next(createError(404, 'Resource not found'));

            // Redirect to the Cloudinary URL with proper filename
            res.redirect(resource.fileUrl);
        } catch (error) {
            next(error);
        }
    }
};

// Helper function to determine file type based on extension
function getFileType(extension) {
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'];
    const documentTypes = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'];
    const spreadsheetTypes = ['xls', 'xlsx', 'csv', 'ods'];
    const presentationTypes = ['ppt', 'pptx', 'odp'];
    const archiveTypes = ['zip', 'rar', '7z', 'tar', 'gz'];
    const audioTypes = ['mp3', 'wav', 'ogg', 'flac', 'aac'];
    const videoTypes = ['mp4', 'avi', 'mov', 'wmv', 'mkv', 'webm'];

    if (imageTypes.includes(extension)) return 'image';
    if (documentTypes.includes(extension)) return 'document';
    if (spreadsheetTypes.includes(extension)) return 'spreadsheet';
    if (presentationTypes.includes(extension)) return 'presentation';
    if (archiveTypes.includes(extension)) return 'archive';
    if (audioTypes.includes(extension)) return 'audio';
    if (videoTypes.includes(extension)) return 'video';
    
    return 'other'; // Default file type
}

export default resourceController;