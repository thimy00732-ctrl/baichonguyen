const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware xác thực JWT
exports.authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).populate('roles');
    
    if (!user || user.accountStatus === 'Locked') {
      return res.status(401).json({ message: 'User not found or account locked' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token', error: error.message });
  }
};

// Middleware kiểm tra vai trò
exports.authorize = (requiredRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const userRoleNames = req.user.roles.map(role => role.roleName);
    const hasRole = requiredRoles.some(role => userRoleNames.includes(role));
    
    if (!hasRole) {
      return res.status(403).json({ message: 'Forbidden - Insufficient permissions' });
    }
    
    next();
  };
};

// Middleware kiểm tra xem người dùng có vai trò Recruiter được xác thực không
exports.verifiedRecruiter = async (req, res, next) => {
  try {
    const recruiterId = req.params.recruiterId || req.user._id;
    const user = await User.findById(recruiterId).populate('roles');
    
    const recruiterRole = user.roles.find(r => r.roleName === 'Recruiter');
    if (!recruiterRole || !recruiterRole.isVerified) {
      return res.status(403).json({ message: 'Recruiter account not verified' });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error checking recruiter status', error: error.message });
  }
};
