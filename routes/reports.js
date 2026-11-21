const express = require('express');
const Report = require('../models/Report');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Tạo báo cáo mới
router.post('/', authenticate, async (req, res) => {
  try {
    const { targetType, targetId, reason } = req.body;

    if (!targetType || !targetId || !reason) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Kiểm tra user đã báo cáo cùng nội dung này chưa
    const existingReport = await Report.findOne({
      reporterId: req.user._id,
      targetType,
      targetId,
      status: 'Open'
    });

    if (existingReport) {
      return res.status(400).json({ message: 'You have already reported this content' });
    }

    const report = new Report({
      reporterId: req.user._id,
      targetType,
      targetId,
      reason
    });

    await report.save();

    res.status(201).json({
      message: 'Report submitted successfully',
      report
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating report', error: error.message });
  }
});

// Lấy danh sách báo cáo của user (báo cáo đã gửi)
router.get('/my-reports', authenticate, async (req, res) => {
  try {
    const reports = await Report.find({ reporterId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('resolvedBy', 'email');

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reports', error: error.message });
  }
});

// Xóa báo cáo (chỉ nếu chưa xử lý)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const report = await Report.findOne({
      _id: req.params.id,
      reporterId: req.user._id,
      status: 'Open'
    });

    if (!report) {
      return res.status(404).json({ message: 'Report not found or cannot be deleted' });
    }

    await report.deleteOne();

    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting report', error: error.message });
  }
});

module.exports = router;
