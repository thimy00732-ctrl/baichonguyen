const express = require('express');
const JobPosting = require('../models/JobPosting');
const User = require('../models/User');
const RecruiterProfile = require('../models/RecruiterProfile');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Tạo tin tuyển dụng (Recruiter hoặc Alumni có quyền)
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, position, description, requirements, jobType, location, benefits, applicationMethod, deadline } = req.body;

    // Kiểm tra user có role Recruiter
    const user = await User.findById(req.user._id).populate('roles');
    const hasRecruiterRole = user.roles.some(r => r.roleName === 'Recruiter');

    if (!hasRecruiterRole) {
      return res.status(403).json({ message: 'Only recruiters can post jobs' });
    }

    const jobPosting = new JobPosting({
      creatorId: req.user._id,
      title,
      position,
      description,
      requirements,
      jobType,
      location,
      benefits,
      applicationMethod,
      deadline,
      status: 'Pending' // Chờ admin duyệt
    });

    await jobPosting.save();

    res.status(201).json({
      message: 'Job posting created (pending approval)',
      jobPosting
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating job posting', error: error.message });
  }
});

// Lấy danh sách tin tuyển dụng đã duyệt
router.get('/', authenticate, async (req, res) => {
  try {
    const { jobType, location, search } = req.query;
    let query = { status: 'Approved' };

    if (jobType) query.jobType = jobType;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const jobs = await JobPosting.find(query)
      .populate('creatorId', 'email')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs', error: error.message });
  }
});

// Lấy chi tiết tin tuyển dụng
router.get('/:jobId', authenticate, async (req, res) => {
  try {
    const job = await JobPosting.findById(req.params.jobId)
      .populate('creatorId', 'email');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Chỉ hiển thị tin Approved hoặc nếu là creator hoặc admin
    if (job.status !== 'Approved' && 
        job.creatorId._id.toString() !== req.user._id.toString() &&
        !req.user.roles.some(r => r.roleName === 'Admin')) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching job', error: error.message });
  }
});

// Cập nhật tin tuyển dụng (Recruiter)
router.put('/:jobId', authenticate, async (req, res) => {
  try {
    const job = await JobPosting.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Chỉ creator hoặc admin mới được sửa
    if (job.creatorId.toString() !== req.user._id.toString() &&
        !req.user.roles.some(r => r.roleName === 'Admin')) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { title, position, description, requirements, jobType, location, benefits, applicationMethod, deadline, status } = req.body;

    job.title = title || job.title;
    job.position = position || job.position;
    job.description = description || job.description;
    job.requirements = requirements || job.requirements;
    job.jobType = jobType || job.jobType;
    job.location = location || job.location;
    job.benefits = benefits || job.benefits;
    job.applicationMethod = applicationMethod || job.applicationMethod;
    job.deadline = deadline || job.deadline;
    
    if (status && req.user.roles.some(r => r.roleName === 'Admin')) {
      job.status = status;
    }
    
    job.updatedAt = new Date();
    job.version += 1;

    await job.save();

    res.json({
      message: 'Job updated',
      job
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating job', error: error.message });
  }
});

// Đóng tin tuyển dụng
router.put('/:jobId/close', authenticate, async (req, res) => {
  try {
    const job = await JobPosting.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.creatorId.toString() !== req.user._id.toString() &&
        !req.user.roles.some(r => r.roleName === 'Admin')) {
      return res.status(403).json({ message: 'Access denied' });
    }

    job.status = 'Closed';
    job.updatedAt = new Date();
    await job.save();

    res.json({
      message: 'Job closed',
      job
    });
  } catch (error) {
    res.status(500).json({ message: 'Error closing job', error: error.message });
  }
});

module.exports = router;
