import mongoose from 'mongoose';

const SubtaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  }
});

const TaskSchema = new mongoose.Schema({
  taskName: {
    type: String,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  subtasks: [SubtaskSchema],
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export const Task = mongoose.model('Task', TaskSchema);