import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    resourceType: {
        type: String,
        enum: ['link', 'document', 'video', 'other'],
        required: true
    },
    url: {
        type: String,
        required: true
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
 const Resource = mongoose.model('Resource', resourceSchema);
 export default Resource;