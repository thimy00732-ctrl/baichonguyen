const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');
const UserProfile = require('../models/UserProfile');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Tạo JWT token
const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Đăng ký tài khoản
router.post('/register', async (req, res) => {
  try {
    const { email, password, fullName, role = 'Student' } = req.body;

    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Tìm role
    const roleDoc = await Role.findOne({ roleName: role });
    if (!roleDoc) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Tạo user mới
    const user = new User({
      email,
      password,
      roles: [roleDoc._id],
      accountStatus: 'Active'
    });

    await user.save();

    // Tạo user profile
    if (role === 'Student' || role === 'Alumni') {
      await UserProfile.create({
        userId: user._id,
        fullName
      });
    }

    const token = createToken(user._id);
    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// Đăng nhập
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findOne({ email }).select('+password').populate('roles');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.accountStatus === 'Locked') {
      return res.status(401).json({ message: 'Account is locked' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = createToken(user._id);
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        roles: user.roles.map(r => r.roleName)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Lấy thông tin user hiện tại
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('roles');
    const profile = await UserProfile.findOne({ userId: user._id });
    
    res.json({
      user,
      profile
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user info', error: error.message });
  }
});

// Đăng xuất (frontend sẽ xóa token)
router.post('/logout', authenticate, (req, res) => {
  res.json({ message: 'Logout successful' });
});

module.exports = router;
