import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      accepted: { type: Boolean, default: false },
    },
  ],
  tasks: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Task",
    default: [] 
  }],
  resources: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Resource",
    default: [] 
  }],
  progress: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      percentage: { type: Number, default: 0 },
    },
  ],
}, { timestamps: true });

export default mongoose.model("Group", GroupSchema);