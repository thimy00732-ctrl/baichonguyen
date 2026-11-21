const express = require('express');
const RecruiterProfile = require('../models/RecruiterProfile');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Tạo hoặc cập nhật recruiter profile
router.post('/', authenticate, authorize(['Recruiter', 'Admin']), async (req, res) => {
  try {
    const {
      companyName,
      taxCodeOrLicense,
      companyWebsite,
      companyDescription,
      companyLogo,
      phone,
      address
    } = req.body;

    if (!companyName || !taxCodeOrLicense) {
      return res.status(400).json({ message: 'Company name and tax code are required' });
    }

    // Kiểm tra profile đã tồn tại chưa
    let profile = await RecruiterProfile.findOne({ userId: req.user._id });

    if (profile) {
      // Update existing profile
      profile.companyName = companyName;
      profile.taxCodeOrLicense = taxCodeOrLicense;
      profile.companyWebsite = companyWebsite;
      profile.companyDescription = companyDescription;
      profile.companyLogo = companyLogo;
      profile.phone = phone;
      profile.address = address;
      profile.updatedAt = Date.now();
      
      await profile.save();

      return res.json({
        message: 'Recruiter profile updated successfully',
        profile
      });
    }

    // Tạo profile mới
    profile = new RecruiterProfile({
      userId: req.user._id,
      companyName,
      taxCodeOrLicense,
      companyWebsite,
      companyDescription,
      companyLogo,
      phone,
      address
    });

    await profile.save();

    res.status(201).json({
      message: 'Recruiter profile created successfully. Waiting for admin verification.',
      profile
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Tax code already registered' });
    }
    res.status(500).json({ message: 'Error creating profile', error: error.message });
  }
});

// Lấy thông tin recruiter profile của user hiện tại
router.get('/me', authenticate, authorize(['Recruiter', 'Admin']), async (req, res) => {
  try {
    const profile = await RecruiterProfile.findOne({ userId: req.user._id })
      .populate('verifiedBy', 'email');

    if (!profile) {
      return res.status(404).json({ message: 'Recruiter profile not found. Please create one.' });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

// Lấy thông tin recruiter profile theo ID (public)
router.get('/:id', async (req, res) => {
  try {
    const profile = await RecruiterProfile.findById(req.params.id)
      .populate('userId', 'email');

    if (!profile) {
      return res.status(404).json({ message: 'Recruiter profile not found' });
    }

    // Chỉ trả về thông tin công khai
    res.json({
      companyName: profile.companyName,
      companyWebsite: profile.companyWebsite,
      companyDescription: profile.companyDescription,
      companyLogo: profile.companyLogo,
      isVerified: profile.isVerified,
      address: profile.address
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

// Lấy danh sách tất cả recruiter profiles (với pagination)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, verified } = req.query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (verified !== undefined) {
      filter.isVerified = verified === 'true';
    }

    const profiles = await RecruiterProfile.find(filter)
      .populate('userId', 'email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await RecruiterProfile.countDocuments(filter);

    res.json({
      profiles,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profiles', error: error.message });
  }
});

// Xóa recruiter profile
router.delete('/me', authenticate, authorize(['Recruiter', 'Admin']), async (req, res) => {
  try {
    const profile = await RecruiterProfile.findOneAndDelete({ userId: req.user._id });

    if (!profile) {
      return res.status(404).json({ message: 'Recruiter profile not found' });
    }

    res.json({ message: 'Recruiter profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting profile', error: error.message });
  }
});

module.exports = router;
