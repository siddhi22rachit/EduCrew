import mongoose from 'mongoose';

const GroupSchema = new mongoose.Schema({
  groupName: { 
    type: String, 
    required: true 
  },
  members: [{ 
    type: String 
  }],
  totalMembers: { 
    type: Number, 
    default: 1 
  },
  tasks: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Task' 
  }]
});

export const Group = mongoose.model('Group', GroupSchema);