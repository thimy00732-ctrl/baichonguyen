# 🎓 Alumni Student Network - Hệ Thống Kết Nối Cựu Sinh Viên & Sinh Viên

[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-5.0+-success.svg)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4.18-blue.svg)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> Một nền tảng web kết nối cựu sinh viên - sinh viên, chia sẻ kinh nghiệm và cơ hội thực tập, việc làm.

## 📸 Demo

🌐 **Live Demo:** [Coming soon...]

![Screenshot](https://via.placeholder.com/800x400?text=Alumni+Network+Screenshot)

## 🚀 Công Nghệ Sử Dụng

- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Frontend**: HTML5, CSS3, JavaScript
- **Authentication**: JWT (JSON Web Tokens)
- **Authorization**: RBAC (Role-Based Access Control)

## 📋 Các Vai Trò & Quyền

### 1. **Sinh Viên (Student)**
- Xem bảng tin và tin tuyển dụng
- Tìm kiếm cựu sinh viên làm mentor
- Tạo/cập nhật hồ sơ cá nhân
- Đăng bài cộng đồng
- Nộp hồ sơ ứng tuyển

### 2. **Cựu Sinh Viên (Alumni)**
- Quản lý hồ sơ nghề nghiệp
- Đăng bài chia sẻ kinh nghiệm
- Làm mentor hỗ trợ sinh viên
- Có thể đăng tin tuyển dụng (nếu được xác thực)

### 3. **Nhà Tuyển Dụng (Recruiter)**
- Tạo & quản lý tin tuyển dụng
- Xem & quản lý hồ sơ ứng tuyển
- Cập nhật trạng thái tuyển dụng

### 4. **Quản Trị Viên (Admin)**
- Duyệt tin tuyển dụng
- Duyệt bài viết cộng đồng
- Xác thực tài khoản nhà tuyển dụng
- Xử lý báo cáo vi phạm
- Khóa/mở khóa tài khoản
- Xem thống kê & audit log

## 📦 Cài Đặt & Chạy

### 1. Cài Đặt MongoDB
**Nếu chưa có MongoDB**, tải và cài đặt từ: https://www.mongodb.com/try/download/community

Sau khi cài đặt, chạy MongoDB:
```powershell
# Windows
mongod

# hoặc nếu cài như service
net start MongoDB
```

### 2. Cài Đặt Node.js Dependencies

```powershell
cd d:\Baichonguyen
npm install
```

### 3. Cấu Hình Biến Môi Trường

File `.env` đã được tạo sẵn. Nếu cần sửa:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/alumni-student-network
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

### 4. Chạy Server

**Mode Development:**
```powershell
npm run dev
```

**Mode Production:**
```powershell
npm start
```

Server sẽ chạy tại: `http://localhost:5000`

### 5. Truy Cập Ứng Dụng

Mở trình duyệt và truy cập: http://localhost:5000

## 🎯 Hướng Dùng

### Đăng Ký Tài Khoản
1. Nhấp vào "Đăng Ký"
2. Nhập email, mật khẩu, họ tên
3. Chọn vai trò (Sinh Viên, Cựu Sinh Viên, Nhà Tuyển Dụng)
4. Nhấp "Đăng Ký"

### Tìm Việc Làm
1. Truy cập tab "Việc Làm"
2. Tìm kiếm hoặc lọc theo loại công việc
3. Nhấp "Ứng Tuyển" để nộp hồ sơ

### Đăng Tin Tuyển Dụng (Recruiter)
1. Truy cập tab "Việc Làm"
2. Nhấp "+ Đăng Tin"
3. Nhập thông tin tin tuyển dụng
4. Nhấp "Đăng Tin" (chờ admin duyệt)

### Tìm Mentor
1. Truy cập tab "Mentor"
2. Tìm kiếm mentor theo kỹ năng
3. Nhấp "Yêu Cầu Mentor" để gửi yêu cầu

### Chia Sẻ Bài Viết
1. Truy cập tab "Cộng Đồng"
2. Nhấp "+ Viết Bài"
3. Chọn danh mục, nhập tiêu đề & nội dung
4. Nhấp "Đăng Bài" (chờ admin duyệt)

## 📊 Cấu Trúc Dữ Liệu

### Collections MongoDB:
- **Users** - Tài khoản người dùng
- **Roles** - Danh mục vai trò
- **UserProfiles** - Hồ sơ cá nhân
- **RecruiterProfiles** - Hồ sơ công ty
- **JobPostings** - Tin tuyển dụng
- **Applications** - Hồ sơ ứng tuyển
- **Posts** - Bài viết cộng đồng
- **Comments** - Bình luận
- **PostLikes** - Lượt thích
- **Connections** - Kết nối người dùng
- **MentorshipRequests** - Yêu cầu mentor
- **Reports** - Báo cáo vi phạm
- **Notifications** - Thông báo
- **AuditLogs** - Nhật ký kiểm toán

## 🔒 Bảo Mật

- ✅ Mật khẩu được mã hóa bcrypt
- ✅ JWT token cho authentication
- ✅ RBAC cho phân quyền
- ✅ Kiểm tra quyền truy cập dữ liệu cá nhân
- ✅ Audit log cho các thao tác admin
- ✅ Validation dữ liệu đầu vào

## 📁 Cấu Trúc Thư Mục

```
alumni-student-network/
├── models/              # MongoDB Schemas
│   ├── User.js
│   ├── UserProfile.js
│   ├── JobPosting.js
│   ├── Application.js
│   ├── Post.js
│   ├── Comment.js
│   ├── MentorshipRequest.js
│   ├── Notification.js
│   ├── Report.js
│   └── AuditLog.js
├── routes/              # API Routes
│   ├── auth.js
│   ├── users.js
│   ├── jobs.js
│   ├── applications.js
│   ├── posts.js
│   ├── mentors.js
│   └── admin.js
├── middleware/
│   └── auth.js          # JWT & RBAC middleware
├── public/              # Frontend
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── api.js
│       └── app.js
├── server.js            # Entry point
├── .env                 # Environment variables
├── package.json         # Dependencies
└── README.md
```

## 🚀 Các Tính Năng Chính

### ✅ Đã Hoàn Thành:
- Đăng ký & Đăng nhập
- Quản lý hồ sơ cá nhân
- Đăng & tìm kiếm tin tuyển dụng
- Ứng tuyển vào công việc
- Bảng tin cộng đồng
- Bình luận & thích bài viết
- Tìm kiếm & yêu cầu mentor
- Duyệt tin tuyển dụng (Admin)
- Duyệt bài viết (Admin)
- Xác thực recruiter (Admin)
- Báo cáo vi phạm
- Thống kê hệ thống

### 🔄 Có Thể Mở Rộng:
- Nhắn tin real-time (WebSocket)
- Gợi ý công việc tự động
- Ghép nối mentor tự động
- Dashboard analytics nâng cao
- Mobile app
- Email notifications
- Integration với LinkedIn, GitHub

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Đảm bảo MongoDB đang chạy:
mongod --version
```

### Port 5000 Already In Use
```
Thay đổi PORT trong .env hoặc:
lsof -i :5000  (macOS/Linux)
netstat -ano | findstr :5000  (Windows)
```

### JWT Token Invalid
```
Xóa localStorage:
localStorage.clear()
```

## 📧 Hỗ Trợ
Nếu gặp vấn đề, vui lòng kiểm tra:
1. MongoDB có chạy không?
2. Dependencies đã cài chưa? (`npm install`)
3. Biến môi trường (.env) có đúng không?
4. Port 5000 có bị chiếm không?

## 📝 License
MIT

---
**Phiên bản**: 1.0.0  
**Cập nhật lần cuối**: Tháng 11, 2026
