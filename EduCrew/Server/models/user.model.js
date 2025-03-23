import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  username: {
    type: String,
    unique: true,
    sparse: true  // This allows null values to not be considered for uniqueness
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profilePic: {
    type: String,
    default: ""
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);