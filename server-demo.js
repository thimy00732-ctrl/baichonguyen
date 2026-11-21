const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

console.log('🎨 Running in DEMO MODE (No MongoDB required)');
console.log('📝 Using mock data for demonstration');

// Mock data
const mockUsers = [
  { 
    _id: '1', 
    email: 'admin@university.edu.vn', 
    roles: [{ roleName: 'Admin' }], 
    accountStatus: 'Active',
    createdAt: new Date('2024-01-01')
  },
  { 
    _id: '2', 
    email: 'student1@university.edu.vn', 
    roles: [{ roleName: 'Student' }], 
    accountStatus: 'Active',
    createdAt: new Date('2024-03-15')
  },
  { 
    _id: '3', 
    email: 'alumni1@company.com', 
    roles: [{ roleName: 'Alumni' }], 
    accountStatus: 'Active',
    createdAt: new Date('2023-06-20')
  },
  { 
    _id: '4', 
    email: 'hr@fpt.com.vn', 
    roles: [{ roleName: 'Recruiter' }], 
    accountStatus: 'Active',
    createdAt: new Date('2024-02-10')
  },
  { 
    _id: '5', 
    email: 'student2@university.edu.vn', 
    roles: [{ roleName: 'Student' }], 
    accountStatus: 'Locked',
    createdAt: new Date('2024-04-01')
  }
];

const mockJobs = [
  {
    _id: '1',
    title: 'Thực Tập Sinh Lập Trình Web',
    position: 'Web Development Intern',
    description: 'Tìm kiếm thực tập sinh có đam mê lập trình web',
    requirements: 'JavaScript, HTML/CSS, React',
    jobType: 'Internship',
    location: 'Hà Nội',
    benefits: 'Lương 5-7 triệu',
    applicationMethod: 'hr@fpt.com.vn',
    deadline: '2027-01-30',
    status: 'Approved',
    creatorId: { _id: '4', email: 'hr@fpt.com.vn' }
  },
  {
    _id: '2',
    title: 'AI Engineer - Fresher',
    position: 'AI Engineer',
    description: 'VNG tìm kiếm AI Engineer fresher',
    requirements: 'Python, TensorFlow, Machine Learning',
    jobType: 'Full-time',
    location: 'TP. Hồ Chí Minh',
    benefits: 'Lương 15-20 triệu',
    applicationMethod: 'careers@vng.com.vn',
    deadline: '2027-02-15',
    status: 'Approved',
    creatorId: { _id: '4', email: 'hr@fpt.com.vn' }
  },
  {
    _id: '3',
    title: 'Backend Developer - Junior',
    position: 'Backend Developer',
    description: 'Tiki tuyển Backend Developer',
    requirements: 'Java, Spring Boot, MySQL',
    jobType: 'Full-time',
    location: 'TP. Hồ Chí Minh',
    benefits: 'Lương 12-18 triệu',
    applicationMethod: 'careers@tiki.vn',
    deadline: '2027-02-28',
    status: 'Approved',
    creatorId: { _id: '4', email: 'hr@fpt.com.vn' }
  }
];

// Pending jobs for admin approval
const mockPendingJobs = [
  {
    _id: 'pending-1',
    title: 'Frontend Developer Intern',
    position: 'Frontend Developer',
    description: 'Looking for passionate frontend developer intern to join our team',
    requirements: 'React, TypeScript, Tailwind CSS',
    jobType: 'Internship',
    location: 'Đà Nẵng',
    benefits: 'Competitive salary, flexible hours',
    applicationMethod: 'apply@startup.vn',
    deadline: '2027-03-15',
    status: 'Pending',
    creatorId: { _id: '6', email: 'hr@startup.vn' }
  },
  {
    _id: 'pending-2',
    title: 'Mobile Developer - React Native',
    position: 'Mobile Developer',
    description: 'Build mobile apps with React Native',
    requirements: 'React Native, JavaScript, REST API',
    jobType: 'Full-time',
    location: 'Hà Nội',
    benefits: 'Lương 18-25 triệu, bonus',
    applicationMethod: 'careers@mobile.vn',
    deadline: '2027-02-28',
    status: 'Pending',
    creatorId: { _id: '7', email: 'hr@mobile.vn' }
  }
];

const mockPosts = [
  {
    _id: '1',
    title: 'Kinh nghiệm 5 năm làm Software Engineer',
    content: 'Chia sẻ kinh nghiệm làm việc tại FPT Software. Trong 5 năm qua, tôi đã trải qua nhiều dự án lớn nhỏ...',
    category: 'Experience',
    authorId: { _id: '3', email: 'alumni1@company.com' },
    likeCount: 15,
    commentCount: 8,
    status: 'Approved',
    createdAt: new Date('2024-11-01')
  },
  {
    _id: '2',
    title: 'Con đường trở thành AI Engineer',
    content: 'Roadmap học AI từ cơ bản đến nâng cao. Bắt đầu với Python, sau đó học Machine Learning...',
    category: 'CareerAdvice',
    authorId: { _id: '8', email: 'alumni2@vng.com.vn' },
    likeCount: 23,
    commentCount: 12,
    status: 'Approved',
    createdAt: new Date('2024-10-15')
  }
];

// Pending posts for admin approval
const mockPendingPosts = [
  {
    _id: 'pending-post-1',
    title: 'Cách chuẩn bị phỏng vấn Tech Interview',
    content: 'Chia sẻ kinh nghiệm chuẩn bị và vượt qua vòng phỏng vấn kỹ thuật tại các công ty lớn...',
    category: 'CareerAdvice',
    authorId: { _id: '2', email: 'student1@university.edu.vn' },
    likeCount: 0,
    commentCount: 0,
    status: 'Pending',
    createdAt: new Date()
  },
  {
    _id: 'pending-post-2',
    title: 'Review khóa học AWS trên Udemy',
    content: 'Vừa hoàn thành khóa AWS Solutions Architect, đây là những điều tôi học được...',
    category: 'Experience',
    authorId: { _id: '2', email: 'student1@university.edu.vn' },
    likeCount: 0,
    commentCount: 0,
    status: 'Pending',
    createdAt: new Date()
  },
  {
    _id: 'pending-post-3',
    title: 'Tìm bạn cùng học lập trình',
    content: 'Mình đang học Web Development, ai có hứng thú cùng học không?',
    category: 'Discussion',
    authorId: { _id: '5', email: 'student2@university.edu.vn' },
    likeCount: 0,
    commentCount: 0,
    status: 'Pending',
    createdAt: new Date()
  }
];

// Mock reports
const mockReports = [
  {
    _id: 'report-1',
    reporterId: { _id: '2', email: 'student1@university.edu.vn' },
    targetType: 'Post',
    targetId: '1',
    reason: 'Nội dung không phù hợp với mục đích của cộng đồng',
    status: 'Pending',
    createdAt: new Date('2024-11-20')
  },
  {
    _id: 'report-2',
    reporterId: { _id: '3', email: 'alumni1@company.com' },
    targetType: 'Comment',
    targetId: 'comment-123',
    reason: 'Spam quảng cáo',
    status: 'Pending',
    createdAt: new Date('2024-11-19')
  }
];

// Mock audit logs
const mockAuditLogs = [
  {
    _id: 'log-1',
    actorId: { _id: '1', email: 'admin@university.edu.vn' },
    action: 'APPROVE_JOB',
    targetTable: 'JobPosting',
    targetId: '1',
    createdAt: new Date('2024-11-20T10:30:00')
  },
  {
    _id: 'log-2',
    actorId: { _id: '1', email: 'admin@university.edu.vn' },
    action: 'APPROVE_POST',
    targetTable: 'Post',
    targetId: '2',
    createdAt: new Date('2024-11-20T09:15:00')
  },
  {
    _id: 'log-3',
    actorId: { _id: '1', email: 'admin@university.edu.vn' },
    action: 'LOCK_USER',
    targetTable: 'User',
    targetId: '5',
    createdAt: new Date('2024-11-19T14:20:00')
  },
  {
    _id: 'log-4',
    actorId: { _id: '4', email: 'hr@fpt.com.vn' },
    action: 'CREATE_JOB',
    targetTable: 'JobPosting',
    targetId: '3',
    createdAt: new Date('2024-11-18T16:00:00')
  }
];

const mockMentors = [
  {
    fullName: 'Phạm Hoàng Dũng',
    major: 'Công nghệ thông tin',
    currentCompany: 'FPT Software',
    jobTitle: 'Senior Software Engineer',
    skills: ['React', 'Node.js', 'AWS', 'Docker'],
    userId: '3'
  },
  {
    fullName: 'Võ Thị Hương',
    major: 'Khoa học máy tính',
    currentCompany: 'VNG Corporation',
    jobTitle: 'AI Engineer',
    skills: ['Python', 'TensorFlow', 'Computer Vision'],
    userId: '5'
  }
];

// Routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = mockUsers.find(u => u.email === email);
  
  if (user && password) {
    res.json({
      message: 'Login successful (DEMO MODE)',
      token: 'demo-token-12345',
      user: { 
        _id: user._id, 
        email: user.email, 
        roles: user.roles,
        accountStatus: user.accountStatus
      }
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.post('/api/auth/register', (req, res) => {
  res.json({
    message: 'Registration successful (DEMO MODE)',
    token: 'demo-token-12345',
    user: { id: '999', email: req.body.email, role: req.body.role }
  });
});

app.get('/api/auth/me', (req, res) => {
  // Return admin by default for demo
  const user = mockUsers[0]; // Admin user
  res.json({
    user: {
      _id: user._id,
      email: user.email,
      roles: user.roles,
      accountStatus: user.accountStatus
    },
    profile: {
      fullName: 'Admin User',
      major: 'System Administration',
      graduationYear: 2020
    }
  });
});

app.get('/api/jobs', (req, res) => {
  res.json(mockJobs);
});

app.get('/api/jobs/:id', (req, res) => {
  const job = mockJobs.find(j => j._id === req.params.id);
  res.json(job || {});
});

app.post('/api/jobs', (req, res) => {
  res.json({
    message: 'Job created (DEMO MODE)',
    jobPosting: { ...req.body, _id: 'new-job-id', status: 'Pending' }
  });
});

app.get('/api/posts', (req, res) => {
  res.json(mockPosts);
});

app.post('/api/posts', (req, res) => {
  res.json({
    message: 'Post created (DEMO MODE)',
    post: { ...req.body, _id: 'new-post-id', status: 'Pending' }
  });
});

app.get('/api/mentors', (req, res) => {
  res.json(mockMentors);
});

app.post('/api/mentors/request', (req, res) => {
  res.json({
    message: 'Mentor request sent (DEMO MODE)',
    mentorshipRequest: { ...req.body, _id: 'new-request-id', status: 'Pending' }
  });
});

app.get('/api/admin/statistics', (req, res) => {
  res.json({
    totalUsers: mockUsers.length,
    totalJobs: mockJobs.length,
    totalPosts: mockPosts.length,
    pendingJobs: mockPendingJobs.length,
    pendingPosts: mockPendingPosts.length,
    totalReports: mockReports.length,
    activeUsers: mockUsers.filter(u => u.accountStatus === 'Active').length
  });
});

// Admin: Get pending jobs
app.get('/api/admin/jobs/pending', (req, res) => {
  res.json(mockPendingJobs);
});

// Admin: Get pending posts
app.get('/api/admin/posts/pending', (req, res) => {
  res.json(mockPendingPosts);
});

// Admin: Approve/reject job
app.put('/api/admin/jobs/:id/approve', (req, res) => {
  const { status } = req.body;
  res.json({
    message: `Job ${status} (DEMO MODE)`,
    job: { _id: req.params.id, status }
  });
});

// Admin: Approve/hide post
app.put('/api/admin/posts/:id/approve', (req, res) => {
  const { status } = req.body;
  res.json({
    message: `Post ${status} (DEMO MODE)`,
    post: { _id: req.params.id, status }
  });
});

// Admin: Get all reports
app.get('/api/admin/reports', (req, res) => {
  res.json(mockReports);
});

// Admin: Resolve report
app.put('/api/admin/reports/:id/resolve', (req, res) => {
  const { status, resolutionNote } = req.body;
  res.json({
    message: 'Report resolved (DEMO MODE)',
    report: { _id: req.params.id, status, resolutionNote }
  });
});

// Admin: Get all users
app.get('/api/admin/users', (req, res) => {
  res.json(mockUsers);
});

// Admin: Lock/unlock user
app.put('/api/admin/users/:id/lock', (req, res) => {
  const { accountStatus } = req.body;
  res.json({
    message: `User ${accountStatus === 'Locked' ? 'locked' : 'unlocked'} (DEMO MODE)`,
    user: { _id: req.params.id, accountStatus }
  });
});

// Admin: Get audit logs
app.get('/api/admin/audit-logs', (req, res) => {
  res.json(mockAuditLogs);
});

app.post('/api/applications', (req, res) => {
  res.json({
    message: 'Application submitted (DEMO MODE)',
    application: { ...req.body, _id: 'new-app-id', status: 'Submitted' }
  });
});

// Catch all other routes
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    res.status(404).json({ message: 'API endpoint not found (DEMO MODE)' });
  } else {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('');
  console.log('🎉 ================================');
  console.log('🚀 DEMO SERVER IS RUNNING!');
  console.log('🌐 http://localhost:' + PORT);
  console.log('🎨 Mode: DEMO (No Database)');
  console.log('📝 Using mock data');
  console.log('================================');
  console.log('');
  console.log('🔑 TEST ACCOUNTS:');
  console.log('');
  console.log('👑 ADMIN (Full access to Admin Dashboard):');
  console.log('   📧 Email: admin@university.edu.vn');
  console.log('   🔒 Password: (bất kỳ)');
  console.log('');
  console.log('🎓 STUDENT:');
  console.log('   📧 Email: student1@university.edu.vn');
  console.log('   🔒 Password: (bất kỳ)');
  console.log('');
  console.log('🎖️  ALUMNI (Mentor available):');
  console.log('   📧 Email: alumni1@company.com');
  console.log('   🔒 Password: (bất kỳ)');
  console.log('');
  console.log('💼 RECRUITER:');
  console.log('   📧 Email: hr@fpt.com.vn');
  console.log('   🔒 Password: (bất kỳ)');
  console.log('');
  console.log('📊 DEMO DATA AVAILABLE:');
  console.log('   • ' + mockPendingJobs.length + ' Pending Jobs (chờ duyệt)');
  console.log('   • ' + mockPendingPosts.length + ' Pending Posts (chờ duyệt)');
  console.log('   • ' + mockReports.length + ' Reports (chờ xử lý)');
  console.log('   • ' + mockUsers.length + ' Users (1 locked)');
  console.log('   • ' + mockAuditLogs.length + ' Audit Logs');
  console.log('');
});
