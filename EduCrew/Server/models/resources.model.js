import mongoose from "mongoose";

const ResourceSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { 
      type: String, 
      required: true 
    },
    fileUrl: { 
      type: String, 
      required: true 
    },
    fileType: {
      type: String,
      enum: ['document', 'image', 'video', 'audio', 'other'],
      required: true
    },
    fileSize: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Resource", ResourceSchema);