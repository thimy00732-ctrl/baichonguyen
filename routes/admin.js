const express = require('express');
const User = require('../models/User');
const JobPosting = require('../models/JobPosting');
const Post = require('../models/Post');
const Report = require('../models/Report');
const AuditLog = require('../models/AuditLog');
const Notification = require('../models/Notification');
const RecruiterProfile = require('../models/RecruiterProfile');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Middleware kiểm tra admin
const isAdmin = async (req, res, next) => {
  const user = await User.findById(req.user._id).populate('roles');
  if (!user.roles.some(r => r.roleName === 'Admin')) {
    return res.status(403).json({ message: 'Admin only' });
  }
  next();
};

// Log audit action
const logAudit = async (actorId, action, targetTable, targetId, details) => {
  await AuditLog.create({
    actorId,
    action,
    targetTable,
    targetId,
    details
  });
};

// Duyệt tin tuyển dụng
router.put('/jobs/:jobId/approve', authenticate, isAdmin, async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    const job = await JobPosting.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const oldStatus = job.status;
    job.status = status;
    job.approvedBy = req.user._id;

    if (status === 'Rejected') {
      job.rejectionReason = rejectionReason;
    }

    await job.save();

    // Log audit
    await logAudit(req.user._id, `${status}_JOB`, 'JobPosting', job._id, {
      oldStatus,
      newStatus: status,
      rejectionReason
    });

    // Notify creator
    await Notification.create({
      userId: job.creatorId,
      title: `Job Posting ${status}`,
      content: `Your job posting "${job.title}" has been ${status}${rejectionReason ? ': ' + rejectionReason : ''}`,
      relatedId: job._id,
      relatedType: 'JobPosting'
    });

    res.json({
      message: `Job ${status}`,
      job
    });
  } catch (error) {
    res.status(500).json({ message: 'Error approving job', error: error.message });
  }
});

// Duyệt bài viết
router.put('/posts/:postId/approve', authenticate, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const oldStatus = post.status;
    post.status = status;
    await post.save();

    // Log audit
    await logAudit(req.user._id, `${status}_POST`, 'Post', post._id, {
      oldStatus,
      newStatus: status
    });

    res.json({
      message: `Post ${status}`,
      post
    });
  } catch (error) {
    res.status(500).json({ message: 'Error approving post', error: error.message });
  }
});

// Xác thực Recruiter
router.put('/recruiters/:recruiterId/verify', authenticate, isAdmin, async (req, res) => {
  try {
    const { isVerified } = req.body;

    const recruiterProfile = await RecruiterProfile.findOne({
      userId: req.params.recruiterId
    });

    if (!recruiterProfile) {
      return res.status(404).json({ message: 'Recruiter not found' });
    }

    recruiterProfile.isVerified = isVerified;
    recruiterProfile.verifiedAt = new Date();
    recruiterProfile.verifiedBy = req.user._id;

    await recruiterProfile.save();

    // Log audit
    await logAudit(req.user._id, 'VERIFY_RECRUITER', 'RecruiterProfile', recruiterProfile._id, {
      isVerified
    });

    // Notify recruiter
    await Notification.create({
      userId: req.params.recruiterId,
      title: isVerified ? 'Account Verified' : 'Account Unverified',
      content: `Your recruiter account has been ${isVerified ? 'verified' : 'unverified'}`,
      relatedId: recruiterProfile._id,
      relatedType: 'RecruiterProfile'
    });

    res.json({
      message: `Recruiter ${isVerified ? 'verified' : 'unverified'}`,
      recruiterProfile
    });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying recruiter', error: error.message });
  }
});

// Khóa/Mở khóa tài khoản
router.put('/users/:userId/lock', authenticate, isAdmin, async (req, res) => {
  try {
    const { accountStatus } = req.body;
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const oldStatus = user.accountStatus;
    user.accountStatus = accountStatus;
    await user.save();

    // Log audit
    await logAudit(req.user._id, 'LOCK_USER', 'User', user._id, {
      oldStatus,
      newStatus: accountStatus
    });

    res.json({
      message: `User account ${accountStatus}`,
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
});

// Xử lý báo cáo vi phạm
router.put('/reports/:reportId/resolve', authenticate, isAdmin, async (req, res) => {
  try {
    const { status, resolutionNote } = req.body;
    const report = await Report.findById(req.params.reportId);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    report.status = status;
    report.resolutionNote = resolutionNote;
    report.resolvedBy = req.user._id;
    await report.save();

    // Log audit
    await logAudit(req.user._id, 'RESOLVE_REPORT', 'Report', report._id, {
      status,
      resolutionNote
    });

    // Notify reporter
    await Notification.create({
      userId: report.reporterId,
      title: 'Report Resolved',
      content: `Your report has been ${status}: ${resolutionNote}`,
      relatedId: report._id,
      relatedType: 'Report'
    });

    res.json({
      message: 'Report resolved',
      report
    });
  } catch (error) {
    res.status(500).json({ message: 'Error resolving report', error: error.message });
  }
});

// Lấy danh sách báo cáo chưa xử lý
router.get('/reports', authenticate, isAdmin, async (req, res) => {
  try {
    const reports = await Report.find({ status: 'Open' })
      .populate('reporterId', 'email')
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reports', error: error.message });
  }
});

// Lấy danh sách jobs chờ duyệt
router.get('/jobs/pending', authenticate, isAdmin, async (req, res) => {
  try {
    const jobs = await JobPosting.find({ status: 'Pending' })
      .populate('creatorId', 'email')
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending jobs', error: error.message });
  }
});

// Lấy danh sách posts chờ duyệt
router.get('/posts/pending', authenticate, isAdmin, async (req, res) => {
  try {
    const Post = require('../models/Post');
    const posts = await Post.find({ status: 'Pending' })
      .populate('authorId', 'email')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending posts', error: error.message });
  }
});

// Lấy danh sách tất cả users
router.get('/users', authenticate, isAdmin, async (req, res) => {
  try {
    const users = await User.find()
      .populate('roles', 'roleName')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Lấy audit logs
router.get('/audit-logs', authenticate, isAdmin, async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate('actorId', 'email')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching audit logs', error: error.message });
  }
});

// Thống kê hệ thống
router.get('/statistics', authenticate, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalJobs = await JobPosting.countDocuments();
    const totalPosts = await Post.countDocuments();
    const pendingJobs = await JobPosting.countDocuments({ status: 'Pending' });
    const pendingPosts = await Post.countDocuments({ status: 'Pending' });

    res.json({
      totalUsers,
      totalJobs,
      totalPosts,
      pendingJobs,
      pendingPosts
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
});

module.exports = router;
