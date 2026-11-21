const express = require('express');
const Notification = require('../models/Notification');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// Lấy danh sách thông báo của người dùng hiện tại
router.get('/', authenticate, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy thông báo', error: error.message });
  }
});

// Đánh dấu đã đọc một thông báo
router.put('/:id/doc', authenticate, async (req, res) => {
  try {
    const tb = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isRead: true },
      { new: true }
    );
    if (!tb) return res.status(404).json({ message: 'Không tìm thấy thông báo' });
    res.json(tb);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật thông báo', error: error.message });
  }
});

// Đánh dấu tất cả đã đọc
router.put('/doc-tat-ca', authenticate, async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
    res.json({ message: 'Đã đánh dấu tất cả là đã đọc' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật thông báo', error: error.message });
  }
});

module.exports = router;
