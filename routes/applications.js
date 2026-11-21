const express = require('express');
const Application = require('../models/Application');
const JobPosting = require('../models/JobPosting');
const Notification = require('../models/Notification');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Nộp hồ sơ ứng tuyển
router.post('/', authenticate, async (req, res) => {
  try {
    const { jobId, cvUrl, coverLetter } = req.body;

    // Kiểm tra tin tuyển dụng tồn tại và Approved
    const job = await JobPosting.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.status !== 'Approved') {
      return res.status(400).json({ message: 'Job is not available' });
    }

    if (new Date() > job.deadline) {
      return res.status(400).json({ message: 'Application deadline passed' });
    }

    // Kiểm tra đã ứng tuyển chưa
    const existingApplication = await Application.findOne({
      jobId,
      studentId: req.user._id
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'Already applied to this job' });
    }

    const application = new Application({
      jobId,
      studentId: req.user._id,
      cvUrl,
      coverLetter,
      status: 'Submitted'
    });

    await application.save();

    // Cập nhật số lượng ứng tuyển
    job.applicationCount += 1;
    await job.save();

    // Tạo notification cho recruiter
    await Notification.create({
      userId: job.creatorId,
      title: 'New Application',
      content: `Someone applied to your job: ${job.title}`,
      relatedId: application._id,
      relatedType: 'Application'
    });

    res.status(201).json({
      message: 'Application submitted',
      application
    });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting application', error: error.message });
  }
});

// Lấy danh sách ứng tuyển của sinh viên
router.get('/my-applications', authenticate, async (req, res) => {
  try {
    const applications = await Application.find({ studentId: req.user._id })
      .populate('jobId');

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
});

// Lấy danh sách ứng tuyển cho tin (Recruiter)
router.get('/job/:jobId', authenticate, async (req, res) => {
  try {
    const job = await JobPosting.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Chỉ recruiter hoặc admin mới được xem
    if (job.creatorId.toString() !== req.user._id.toString() &&
        !req.user.roles.some(r => r.roleName === 'Admin')) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const applications = await Application.find({ jobId: req.params.jobId })
      .populate('studentId', 'email');

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
});

// Cập nhật trạng thái ứng tuyển
router.put('/:applicationId/status', authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    
    const application = await Application.findById(req.params.applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const job = await JobPosting.findById(application.jobId);

    // Chỉ recruiter hoặc admin mới được cập nhật
    if (job.creatorId.toString() !== req.user._id.toString() &&
        !req.user.roles.some(r => r.roleName === 'Admin')) {
      return res.status(403).json({ message: 'Access denied' });
    }

    application.status = status;
    application.updatedAt = new Date();
    await application.save();

    // Tạo notification cho sinh viên
    await Notification.create({
      userId: application.studentId,
      title: `Application Status: ${status}`,
      content: `Your application for ${job.title} is now ${status}`,
      relatedId: application._id,
      relatedType: 'Application'
    });

    res.json({
      message: 'Application status updated',
      application
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating application', error: error.message });
  }
});

// Rút hồ sơ ứng tuyển
router.put('/:applicationId/withdraw', authenticate, async (req, res) => {
  try {
    const application = await Application.findById(req.params.applicationId);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Chỉ sinh viên nộp hồ sơ mới được rút
    if (application.studentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    application.status = 'Withdrawn';
    application.updatedAt = new Date();
    await application.save();

    res.json({
      message: 'Application withdrawn',
      application
    });
  } catch (error) {
    res.status(500).json({ message: 'Error withdrawing application', error: error.message });
  }
});

module.exports = router;
