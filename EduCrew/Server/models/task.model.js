import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  taskName: { type: String, required: true },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  subtasks: [
    {
      name: { type: String, required: true },
      completed: { type: Boolean, default: false },
    },
  ],
  deadline: { type: Date, required: true }, // Added deadline field
}, { timestamps: true });

export const Task = mongoose.model('Task', taskSchema);
