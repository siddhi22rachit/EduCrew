import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    title: { type: String, required: true },
    deadline: { type: Date, required: true },
   
    subtasks: [
      {
        title: { type: String, required: true },
        completedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Task", TaskSchema);
