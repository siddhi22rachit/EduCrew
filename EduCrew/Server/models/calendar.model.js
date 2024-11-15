import mongoose from 'mongoose';

const calendarSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  tasks: [
    {
      taskName: { type: String, required: true },
      deadline: { type: Date, required: true },
    },
  ],
});

export default mongoose.model('Calendar', calendarSchema);
