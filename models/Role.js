const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  roleName: {
    type: String,
    enum: ['Student', 'Alumni', 'Recruiter', 'Admin'],
    required: true,
    unique: true
  },
  permissions: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Role', roleSchema);
