import mongoose from 'mongoose';

const subtaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  steps: [subtaskSchema],
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
});

export default mongoose.model('Task', taskSchema);
