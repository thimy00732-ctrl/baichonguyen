const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Role = require('./models/Role');
const UserProfile = require('./models/UserProfile');
const RecruiterProfile = require('./models/RecruiterProfile');
const JobPosting = require('./models/JobPosting');
const Application = require('./models/Application');
const Post = require('./models/Post');
const Comment = require('./models/Comment');
const PostLike = require('./models/PostLike');
const MentorshipRequest = require('./models/MentorshipRequest');
const Notification = require('./models/Notification');

// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

async function seedData() {
  try {
    // Xóa dữ liệu cũ
    console.log('🗑️ Clearing old data...');
    await User.deleteMany({});
    await Role.deleteMany({});
    await UserProfile.deleteMany({});
    await RecruiterProfile.deleteMany({});
    await JobPosting.deleteMany({});
    await Application.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    await PostLike.deleteMany({});
    await MentorshipRequest.deleteMany({});
    await Notification.deleteMany({});

    // 1. Tạo Roles
    console.log('📝 Creating roles...');
    const studentRole = await Role.create({ roleName: 'Student' });
    const alumniRole = await Role.create({ roleName: 'Alumni' });
    const recruiterRole = await Role.create({ roleName: 'Recruiter' });
    const adminRole = await Role.create({ roleName: 'Admin' });

    // 2. Tạo Admin
    console.log('👤 Creating admin...');
    const admin = await User.create({
      email: 'admin@university.edu.vn',
      password: 'admin123',
      accountStatus: 'Active',
      roles: [adminRole._id]
    });

    await UserProfile.create({
      userId: admin._id,
      fullName: 'Quản Trị Viên',
      studentCode: 'ADMIN001'
    });

    // 3. Tạo Sinh viên
    console.log('👨‍🎓 Creating students...');
    const student1 = await User.create({
      email: 'student1@university.edu.vn',
      password: 'student123',
      accountStatus: 'Active',
      roles: [studentRole._id]
    });

    await UserProfile.create({
      userId: student1._id,
      fullName: 'Nguyễn Văn An',
      studentCode: 'SV001',
      major: 'Công nghệ thông tin',
      graduationYear: 2024,
      skills: ['JavaScript', 'React', 'Node.js'],
      bio: 'Sinh viên năm 4, đam mê lập trình web'
    });

    const student2 = await User.create({
      email: 'student2@university.edu.vn',
      password: 'student123',
      accountStatus: 'Active',
      roles: [studentRole._id]
    });

    await UserProfile.create({
      userId: student2._id,
      fullName: 'Trần Thị Bình',
      studentCode: 'SV002',
      major: 'Khoa học máy tính',
      graduationYear: 2025,
      skills: ['Python', 'Machine Learning', 'Data Science'],
      bio: 'Quan tâm đến AI và Machine Learning'
    });

    const student3 = await User.create({
      email: 'student3@university.edu.vn',
      password: 'student123',
      accountStatus: 'Active',
      roles: [studentRole._id]
    });

    await UserProfile.create({
      userId: student3._id,
      fullName: 'Lê Minh Châu',
      studentCode: 'SV003',
      major: 'Hệ thống thông tin',
      graduationYear: 2024,
      skills: ['Java', 'Spring Boot', 'MySQL'],
      bio: 'Thích làm backend developer'
    });

    // 4. Tạo Cựu sinh viên (Alumni)
    console.log('🎓 Creating alumni...');
    const alumni1 = await User.create({
      email: 'alumni1@company.com',
      password: 'alumni123',
      accountStatus: 'Active',
      roles: [alumniRole._id]
    });

    await UserProfile.create({
      userId: alumni1._id,
      fullName: 'Phạm Hoàng Dũng',
      studentCode: 'SV2018001',
      major: 'Công nghệ thông tin',
      graduationYear: 2022,
      currentCompany: 'FPT Software',
      jobTitle: 'Senior Software Engineer',
      skills: ['React', 'Node.js', 'AWS', 'Docker'],
      isMentorAvailable: true,
      bio: '5 năm kinh nghiệm phát triển web, sẵn sàng hỗ trợ sinh viên'
    });

    const alumni2 = await User.create({
      email: 'alumni2@vng.com.vn',
      password: 'alumni123',
      accountStatus: 'Active',
      roles: [alumniRole._id]
    });

    await UserProfile.create({
      userId: alumni2._id,
      fullName: 'Võ Thị Hương',
      studentCode: 'SV2017002',
      major: 'Khoa học máy tính',
      graduationYear: 2021,
      currentCompany: 'VNG Corporation',
      jobTitle: 'AI Engineer',
      skills: ['Python', 'TensorFlow', 'Computer Vision', 'NLP'],
      isMentorAvailable: true,
      bio: 'Chuyên gia AI, yêu thích chia sẻ kiến thức'
    });

    const alumni3 = await User.create({
      email: 'alumni3@tiki.vn',
      password: 'alumni123',
      accountStatus: 'Active',
      roles: [alumniRole._id]
    });

    await UserProfile.create({
      userId: alumni3._id,
      fullName: 'Đặng Quốc Khánh',
      studentCode: 'SV2019003',
      major: 'Hệ thống thông tin',
      graduationYear: 2023,
      currentCompany: 'Tiki',
      jobTitle: 'Backend Developer',
      skills: ['Java', 'Spring Boot', 'Microservices', 'Kafka'],
      isMentorAvailable: true,
      bio: 'Backend developer, thích kiến trúc hệ thống phân tán'
    });

    // 5. Tạo Nhà tuyển dụng
    console.log('🏢 Creating recruiters...');
    const recruiter1 = await User.create({
      email: 'hr@fpt.com.vn',
      password: 'recruiter123',
      accountStatus: 'Active',
      roles: [recruiterRole._id]
    });

    await RecruiterProfile.create({
      userId: recruiter1._id,
      companyName: 'FPT Software',
      taxCodeOrLicense: '0123456789',
      companyWebsite: 'https://fptsoftware.com',
      companyDescription: 'Công ty phần mềm hàng đầu Việt Nam',
      isVerified: true,
      verifiedAt: new Date(),
      verifiedBy: admin._id
    });

    const recruiter2 = await User.create({
      email: 'hr@vng.com.vn',
      password: 'recruiter123',
      accountStatus: 'Active',
      roles: [recruiterRole._id]
    });

    await RecruiterProfile.create({
      userId: recruiter2._id,
      companyName: 'VNG Corporation',
      taxCodeOrLicense: '9876543210',
      companyWebsite: 'https://vng.com.vn',
      companyDescription: 'Tập đoàn công nghệ và giải trí trực tuyến',
      isVerified: true,
      verifiedAt: new Date(),
      verifiedBy: admin._id
    });

    const recruiter3 = await User.create({
      email: 'hr@tiki.vn',
      password: 'recruiter123',
      accountStatus: 'Active',
      roles: [recruiterRole._id]
    });

    await RecruiterProfile.create({
      userId: recruiter3._id,
      companyName: 'Tiki Corporation',
      taxCodeOrLicense: '1122334455',
      companyWebsite: 'https://tiki.vn',
      companyDescription: 'Sàn thương mại điện tử hàng đầu Việt Nam',
      isVerified: true,
      verifiedAt: new Date(),
      verifiedBy: admin._id
    });

    // 6. Tạo Tin tuyển dụng
    console.log('💼 Creating job postings...');
    const job1 = await JobPosting.create({
      creatorId: recruiter1._id,
      title: 'Thực Tập Sinh Lập Trình Web',
      position: 'Web Development Intern',
      description: 'Tìm kiếm thực tập sinh có đam mê với lập trình web, được đào tạo về React, Node.js và các công nghệ hiện đại.',
      requirements: 'Sinh viên năm 3-4 ngành CNTT, biết JavaScript, HTML/CSS. Ưu tiên có kinh nghiệm với React.',
      jobType: 'Internship',
      location: 'Hà Nội',
      benefits: 'Lương 5-7 triệu, học hỏi từ senior engineers, cơ hội chính thức hóa sau 3 tháng',
      applicationMethod: 'Gửi CV qua email: hr@fpt.com.vn',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'Approved',
      approvedBy: admin._id
    });

    const job2 = await JobPosting.create({
      creatorId: recruiter2._id,
      title: 'AI Engineer - Fresher',
      position: 'AI Engineer',
      description: 'VNG đang tìm kiếm AI Engineer fresher để tham gia các dự án về Computer Vision và NLP.',
      requirements: 'Tốt nghiệp ngành KHMT hoặc CNTT, có kiến thức về Machine Learning, Python, TensorFlow/PyTorch.',
      jobType: 'Full-time',
      location: 'TP. Hồ Chí Minh',
      benefits: 'Lương thỏa thuận (15-20 triệu), Bảo hiểm đầy đủ, Training chuyên sâu về AI',
      applicationMethod: 'Apply tại: https://careers.vng.com.vn',
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      status: 'Approved',
      approvedBy: admin._id
    });

    const job3 = await JobPosting.create({
      creatorId: recruiter3._id,
      title: 'Backend Developer - Junior',
      position: 'Backend Developer',
      description: 'Tiki tuyển dụng Backend Developer để phát triển các microservices cho hệ thống thương mại điện tử.',
      requirements: 'Có từ 6 tháng - 1 năm kinh nghiệm Java/Spring Boot. Biết về Database, REST API.',
      jobType: 'Full-time',
      location: 'TP. Hồ Chí Minh',
      benefits: 'Lương 12-18 triệu, Review lương 6 tháng/lần, Laptop + màn hình phụ',
      applicationMethod: 'Gửi CV qua email: careers@tiki.vn',
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      status: 'Approved',
      approvedBy: admin._id
    });

    const job4 = await JobPosting.create({
      creatorId: recruiter1._id,
      title: 'Frontend Developer - Remote',
      position: 'Frontend Developer',
      description: 'Vị trí làm việc remote, phát triển giao diện web cho các dự án quốc tế.',
      requirements: 'React, TypeScript, responsive design. Tiếng Anh giao tiếp tốt.',
      jobType: 'Full-time',
      location: 'Remote',
      benefits: 'Lương 18-25 triệu, WFH 100%, Flexible working hours',
      applicationMethod: 'Apply: https://fpt-careers.com/frontend-remote',
      deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      status: 'Approved',
      approvedBy: admin._id
    });

    const job5 = await JobPosting.create({
      creatorId: recruiter2._id,
      title: 'DevOps Engineer',
      position: 'DevOps Engineer',
      description: 'Quản lý infrastructure, CI/CD pipeline cho các dự án lớn.',
      requirements: 'Kinh nghiệm Docker, Kubernetes, AWS/GCP, Jenkins',
      jobType: 'Full-time',
      location: 'Hà Nội',
      benefits: 'Lương 20-30 triệu, Premium healthcare',
      applicationMethod: 'Email: devops@vng.com.vn',
      deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
      status: 'Pending'
    });

    // 7. Tạo Applications
    console.log('📄 Creating applications...');
    await Application.create({
      jobId: job1._id,
      studentId: student1._id,
      cvUrl: 'https://drive.google.com/cv-nguyenvanan.pdf',
      coverLetter: 'Em rất quan tâm đến vị trí thực tập này và mong muốn được học hỏi.',
      status: 'Submitted'
    });

    await Application.create({
      jobId: job2._id,
      studentId: student2._id,
      cvUrl: 'https://drive.google.com/cv-tranthibinh.pdf',
      coverLetter: 'Em có đam mê với AI và đã làm một số project về ML.',
      status: 'Reviewing'
    });

    await Application.create({
      jobId: job3._id,
      studentId: student3._id,
      cvUrl: 'https://drive.google.com/cv-leminhchau.pdf',
      coverLetter: 'Em có 6 tháng kinh nghiệm thực tập backend tại startup.',
      status: 'Accepted'
    });

    // 8. Tạo Posts
    console.log('📝 Creating posts...');
    const post1 = await Post.create({
      authorId: alumni1._id,
      category: 'Experience',
      title: 'Kinh nghiệm 5 năm làm Software Engineer tại FPT',
      content: 'Mình xin chia sẻ một số kinh nghiệm trong 5 năm làm việc tại FPT Software. Đầu tiên, các bạn cần nắm vững kiến thức nền tảng về lập trình, đặc biệt là thuật toán và cấu trúc dữ liệu. Thứ hai, hãy luôn học hỏi công nghệ mới. Thứ ba, teamwork rất quan trọng trong môi trường công ty.',
      status: 'Approved',
      likeCount: 15,
      commentCount: 8
    });

    const post2 = await Post.create({
      authorId: alumni2._id,
      category: 'CareerAdvice',
      title: 'Con đường trở thành AI Engineer',
      content: 'Nhiều bạn hỏi mình về cách học AI. Mình khuyên các bạn nên bắt đầu từ Python, sau đó học Machine Learning cơ bản với scikit-learn, rồi chuyển sang Deep Learning với TensorFlow hoặc PyTorch. Đừng quên làm project thực tế!',
      status: 'Approved',
      likeCount: 23,
      commentCount: 12
    });

    const post3 = await Post.create({
      authorId: student1._id,
      category: 'Question',
      title: 'Hỏi về React hooks và state management',
      content: 'Mình đang học React và hơi bị confused về việc sử dụng hooks như useState, useEffect. Các anh chị có thể giải thích giúp em không? Và khi nào thì nên dùng Redux để quản lý state?',
      status: 'Approved',
      likeCount: 5,
      commentCount: 7
    });

    const post4 = await Post.create({
      authorId: alumni3._id,
      category: 'JobShare',
      title: 'Tiki đang tuyển Backend Developer - Junior',
      content: 'Team mình đang cần thêm người làm backend với Java Spring Boot. Các bạn quan tâm có thể apply nhé. Môi trường làm việc rất tốt, được học hỏi nhiều về microservices và system design!',
      status: 'Approved',
      likeCount: 10,
      commentCount: 3
    });

    const post5 = await Post.create({
      authorId: student2._id,
      category: 'Question',
      title: 'Học Machine Learning nên bắt đầu từ đâu?',
      content: 'Em đang muốn học ML nhưng không biết bắt đầu từ đâu. Các anh chị có thể tư vấn cho em một roadmap cụ thể không ạ? Em đang học năm 3 ngành CNTT.',
      status: 'Pending'
    });

    // 9. Tạo Comments
    console.log('💬 Creating comments...');
    await Comment.create({
      postId: post1._id,
      userId: student1._id,
      content: 'Cảm ơn anh đã chia sẻ! Rất bổ ích cho em.'
    });

    await Comment.create({
      postId: post1._id,
      userId: student2._id,
      content: 'Em cũng muốn vào FPT, anh có thể tư vấn thêm về quá trình phỏng vấn không ạ?'
    });

    await Comment.create({
      postId: post2._id,
      userId: student2._id,
      content: 'Em đang theo roadmap này của chị, rất hữu ích! Em cảm ơn chị nhiều.'
    });

    await Comment.create({
      postId: post3._id,
      userId: alumni1._id,
      content: 'Em có thể tham khảo docs của React về hooks. Về Redux thì chỉ nên dùng khi state phức tạp, share nhiều giữa các component.'
    });

    // 10. Tạo Post Likes
    console.log('❤️ Creating likes...');
    await PostLike.create({ postId: post1._id, userId: student1._id });
    await PostLike.create({ postId: post1._id, userId: student2._id });
    await PostLike.create({ postId: post2._id, userId: student1._id });
    await PostLike.create({ postId: post2._id, userId: student3._id });
    await PostLike.create({ postId: post3._id, userId: alumni1._id });

    // 11. Tạo Mentorship Requests
    console.log('🤝 Creating mentorship requests...');
    await MentorshipRequest.create({
      studentId: student1._id,
      alumniId: alumni1._id,
      topic: 'Tư vấn về career path trong lĩnh vực Web Development',
      message: 'Anh có thể tư vấn cho em về việc chọn công ty đầu tiên và phát triển sự nghiệp không ạ?',
      status: 'Accepted'
    });

    await MentorshipRequest.create({
      studentId: student2._id,
      alumniId: alumni2._id,
      topic: 'Hướng dẫn học Machine Learning',
      message: 'Em muốn học AI, chị có thể mentor cho em được không ạ? Em cần roadmap cụ thể.',
      status: 'Pending'
    });

    await MentorshipRequest.create({
      studentId: student3._id,
      alumniId: alumni3._id,
      topic: 'Review CV và chuẩn bị phỏng vấn Backend',
      message: 'Anh có thể giúp em review CV và chuẩn bị cho phỏng vấn backend developer không ạ?',
      status: 'Accepted'
    });

    // 12. Tạo Notifications
    console.log('🔔 Creating notifications...');
    await Notification.create({
      userId: student1._id,
      title: 'Hồ sơ đã được xem',
      content: 'FPT Software đã xem hồ sơ ứng tuyển của bạn',
      isRead: false
    });

    await Notification.create({
      userId: student2._id,
      title: 'Hồ sơ đang được xét duyệt',
      content: 'Hồ sơ ứng tuyển AI Engineer tại VNG đang được xem xét',
      isRead: false
    });

    await Notification.create({
      userId: student3._id,
      title: 'Chúc mừng! Hồ sơ được chấp nhận',
      content: 'Bạn đã được chấp nhận cho vị trí Backend Developer tại Tiki',
      isRead: true
    });

    await Notification.create({
      userId: alumni1._id,
      title: 'Có yêu cầu mentor mới',
      content: 'Nguyễn Văn An đã gửi yêu cầu mentor về Web Development',
      isRead: false
    });

    await Notification.create({
      userId: recruiter1._id,
      title: 'Có ứng viên mới',
      content: 'Nguyễn Văn An đã ứng tuyển vào vị trí Thực Tập Sinh Lập Trình Web',
      isRead: false
    });

    console.log('\n✅ Seed data completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Roles: 4`);
    console.log(`- Users: ${await User.countDocuments()}`);
    console.log(`- Profiles: ${await UserProfile.countDocuments()}`);
    console.log(`- Job Postings: ${await JobPosting.countDocuments()}`);
    console.log(`- Applications: ${await Application.countDocuments()}`);
    console.log(`- Posts: ${await Post.countDocuments()}`);
    console.log(`- Comments: ${await Comment.countDocuments()}`);
    console.log(`- Mentorship Requests: ${await MentorshipRequest.countDocuments()}`);
    console.log(`- Notifications: ${await Notification.countDocuments()}`);

    console.log('\n🔑 Tài khoản test:');
    console.log('\n📌 Admin:');
    console.log('  Email: admin@university.edu.vn');
    console.log('  Password: admin123');
    console.log('\n📌 Sinh viên:');
    console.log('  Email: student1@university.edu.vn');
    console.log('  Password: student123');
    console.log('\n📌 Cựu sinh viên:');
    console.log('  Email: alumni1@company.com');
    console.log('  Password: alumni123');
    console.log('\n📌 Nhà tuyển dụng:');
    console.log('  Email: hr@fpt.com.vn');
    console.log('  Password: recruiter123');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Chạy seed
seedData();
