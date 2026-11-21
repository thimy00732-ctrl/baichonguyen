const express = require('express');
const MentorshipRequest = require('../models/MentorshipRequest');
const UserProfile = require('../models/UserProfile');
const Notification = require('../models/Notification');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Lấy danh sách mentor có sẵn
router.get('/', authenticate, async (req, res) => {
  try {
    const { major, skills, search } = req.query;
    let query = { isMentorAvailable: true };

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

    const mentors = await UserProfile.find(query)
      .populate('userId', 'email accountStatus');

    res.json(mentors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching mentors', error: error.message });
  }
});

// Gửi yêu cầu mentor
router.post('/request', authenticate, async (req, res) => {
  try {
    const { alumniId, topic, message } = req.body;

    // Kiểm tra alumni tồn tại và có sẵn làm mentor
    const mentorProfile = await UserProfile.findOne({
      userId: alumniId,
      isMentorAvailable: true
    });

    if (!mentorProfile) {
      return res.status(404).json({ message: 'Mentor not available' });
    }

    // Kiểm tra đã gửi yêu cầu chưa
    const existingRequest = await MentorshipRequest.findOne({
      studentId: req.user._id,
      alumniId,
      status: { $in: ['Pending', 'Accepted'] }
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Already sent request to this mentor' });
    }

    const mentorshipRequest = new MentorshipRequest({
      studentId: req.user._id,
      alumniId,
      topic,
      message
    });

    await mentorshipRequest.save();

    // Notify mentor
    await Notification.create({
      userId: alumniId,
      title: 'New Mentorship Request',
      content: `Someone requested mentorship: ${topic}`,
      relatedId: mentorshipRequest._id,
      relatedType: 'MentorshipRequest'
    });

    res.status(201).json({
      message: 'Mentorship request sent',
      mentorshipRequest
    });
  } catch (error) {
    res.status(500).json({ message: 'Error sending request', error: error.message });
  }
});

// Lấy danh sách yêu cầu mentor nhận được
router.get('/received-requests', authenticate, async (req, res) => {
  try {
    const requests = await MentorshipRequest.find({ alumniId: req.user._id })
      .populate('studentId', 'email')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requests', error: error.message });
  }
});

// Lấy danh sách yêu cầu mentor đã gửi
router.get('/sent-requests', authenticate, async (req, res) => {
  try {
    const requests = await MentorshipRequest.find({ studentId: req.user._id })
      .populate('alumniId', 'email')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requests', error: error.message });
  }
});

// Phản hồi yêu cầu mentor
router.put('/request/:requestId/respond', authenticate, async (req, res) => {
  try {
    const { status } = req.body; // Accepted hoặc Rejected

    const mentorshipRequest = await MentorshipRequest.findById(req.params.requestId);

    if (!mentorshipRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Chỉ mentor nhận được yêu cầu mới được phản hồi
    if (mentorshipRequest.alumniId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    mentorshipRequest.status = status;
    mentorshipRequest.updatedAt = new Date();
    await mentorshipRequest.save();

    // Notify student
    await Notification.create({
      userId: mentorshipRequest.studentId,
      title: `Mentorship Request ${status}`,
      content: `Your mentorship request has been ${status}`,
      relatedId: mentorshipRequest._id,
      relatedType: 'MentorshipRequest'
    });

    res.json({
      message: `Request ${status}`,
      mentorshipRequest
    });
  } catch (error) {
    res.status(500).json({ message: 'Error responding to request', error: error.message });
  }
});

module.exports = router;
