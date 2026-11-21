const express = require('express');
const Report = require('../models/Report');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// Tạo báo cáo vi phạm
router.post('/', authenticate, async (req, res) => {
  try {
    const { targetType, targetId, reason } = req.body;
    if (!targetType || !targetId || !reason) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin báo cáo' });
    }

    // Kiểm tra người dùng đã báo cáo nội dung này chưa
    const daCoBC = await Report.findOne({
      reporterId: req.user._id,
      targetType,
      targetId,
      status: 'Open'
    });
    if (daCoBC) {
      return res.status(400).json({ message: 'Bạn đã báo cáo nội dung này rồi' });
    }

    const baoCao = await Report.create({
      reporterId: req.user._id,
      targetType,
      targetId,
      reason
    });

    res.status(201).json({ message: 'Gửi báo cáo thành công', report: baoCao });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi gửi báo cáo', error: error.message });
  }
});

module.exports = router;
