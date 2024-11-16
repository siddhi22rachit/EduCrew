import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  groupName: { type: String, required: true },
  members: [
    {
      name: { type: String, required: true },
      email: { type: String, required: true },
    },
  ],
  totalMembers: { type: Number, required: true },
});

export default mongoose.model('Group', groupSchema);
