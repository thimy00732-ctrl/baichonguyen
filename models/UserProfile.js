const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: true
  },
  studentCode: {
    type: String,
    unique: true,
    sparse: true
  },
  major: String,
  graduationYear: Number,
  currentCompany: String,
  jobTitle: String,
  skills: [String],
  isMentorAvailable: {
    type: Boolean,
    default: false
  },
  phone: String,
  defaultCvUrl: String,
  bio: String,
  privacySettings: {
    showEmail: { type: Boolean, default: false },
    showPhone: { type: Boolean, default: false },
    showCv: { type: Boolean, default: false },
    showCurrentCompany: { type: Boolean, default: true }
  },
  profilePicture: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('UserProfile', userProfileSchema);
