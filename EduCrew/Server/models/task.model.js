// models/task.model.js
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  taskName: { type: String, required: true },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  subtasks: [{
    name: { type: String, required: true },
    completed: { type: Boolean, default: false }
  }]
}, { timestamps: true });

export const Task = mongoose.model('Task', taskSchema);