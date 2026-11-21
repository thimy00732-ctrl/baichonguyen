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
  { id: '1', email: 'admin@university.edu.vn', role: 'Admin', name: 'Admin' },
  { id: '2', email: 'student1@university.edu.vn', role: 'Student', name: 'Nguyễn Văn An' },
  { id: '3', email: 'alumni1@company.com', role: 'Alumni', name: 'Phạm Hoàng Dũng' },
  { id: '4', email: 'hr@fpt.com.vn', role: 'Recruiter', name: 'FPT HR' }
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
    status: 'Approved'
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
    status: 'Approved'
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
    status: 'Approved'
  }
];

const mockPosts = [
  {
    _id: '1',
    title: 'Kinh nghiệm 5 năm làm Software Engineer',
    content: 'Chia sẻ kinh nghiệm làm việc tại FPT Software...',
    category: 'Experience',
    authorId: { email: 'alumni1@company.com' },
    likeCount: 15,
    commentCount: 8,
    status: 'Approved',
    createdAt: new Date()
  },
  {
    _id: '2',
    title: 'Con đường trở thành AI Engineer',
    content: 'Roadmap học AI từ cơ bản đến nâng cao...',
    category: 'CareerAdvice',
    authorId: { email: 'alumni2@vng.com.vn' },
    likeCount: 23,
    commentCount: 12,
    status: 'Approved',
    createdAt: new Date()
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
      user: { id: user.id, email: user.email, roles: [user.role] }
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
  res.json({
    user: mockUsers[1],
    profile: {
      fullName: 'Nguyễn Văn An',
      major: 'Công nghệ thông tin',
      graduationYear: 2024
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
    totalUsers: 150,
    totalJobs: 45,
    totalPosts: 89,
    pendingJobs: 5,
    pendingPosts: 3
  });
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
  console.log('🔑 Test Accounts:');
  console.log('   Email: student1@university.edu.vn');
  console.log('   Password: anything');
  console.log('');
});
