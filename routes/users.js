const express = require('express');
const User = require('../models/User');
const UserProfile = require('../models/UserProfile');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Lấy danh sách cựu sinh viên (với bộ lọc)
router.get('/alumni', authenticate, async (req, res) => {
  try {
    const { major, skills, search } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { currentCompany: { $regex: search, $options: 'i' } }
      ];
    }

    if (major) query.major = major;
    if (skills) {
      query.skills = { $in: Array.isArray(skills) ? skills : [skills] };
    }

    const alumni = await UserProfile.find(query)
      .populate('userId', 'email accountStatus');

    res.json(alumni);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching alumni', error: error.message });
  }
});

// Lấy hồ sơ cá nhân
router.get('/profile/:userId', authenticate, async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.params.userId });
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Kiểm tra quyền hiển thị dữ liệu nhạy cảm
    if (req.user._id.toString() !== req.params.userId) {
      if (!profile.privacySettings.showEmail) {
        profile.email = undefined;
      }
      if (!profile.privacySettings.showPhone) {
        profile.phone = undefined;
      }
      if (!profile.privacySettings.showCv) {
        profile.defaultCvUrl = undefined;
      }
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

// Cập nhật hồ sơ cá nhân
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { fullName, major, graduationYear, currentCompany, jobTitle, skills, bio, privacySettings } = req.body;

    let profile = await UserProfile.findOne({ userId: req.user._id });

    if (!profile) {
      profile = new UserProfile({ userId: req.user._id });
    }

    profile.fullName = fullName || profile.fullName;
    profile.major = major || profile.major;
    profile.graduationYear = graduationYear || profile.graduationYear;
    profile.currentCompany = currentCompany || profile.currentCompany;
    profile.jobTitle = jobTitle || profile.jobTitle;
    profile.skills = skills || profile.skills;
    profile.bio = bio || profile.bio;
    profile.privacySettings = { ...profile.privacySettings, ...privacySettings };
    profile.updatedAt = new Date();

    await profile.save();

    res.json({
      message: 'Profile updated successfully',
      profile
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

// Cập nhật trạng thái mentor
router.put('/mentor-status', authenticate, async (req, res) => {
  try {
    const { isMentorAvailable } = req.body;

    const profile = await UserProfile.findOneAndUpdate(
      { userId: req.user._id },
      { isMentorAvailable },
      { new: true }
    );

    res.json({
      message: 'Mentor status updated',
      profile
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating mentor status', error: error.message });
  }
});

module.exports = router;
