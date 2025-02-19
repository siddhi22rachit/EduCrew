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
    }, // Only Admin
    title: { type: String, required: true },
    fileUrl: { type: String, required: true }, // PDF stored as URL
  },
  { timestamps: true }
);

export default mongoose.model("Resource", ResourceSchema);
