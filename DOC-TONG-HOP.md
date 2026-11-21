# 📚 TÀI LIỆU TỔNG HỢP - ALUMNET

## 🎯 TỔNG QUAN DỰ ÁN

**AlumniNet** là hệ thống mạng xã hội nghề nghiệp dành cho sinh viên và cựu sinh viên, kết nối với nhà tuyển dụng và cố vấn nghề nghiệp.

### Thông tin dự án
- **Tên dự án:** AlumniNet - Alumni Student Network
- **Phiên bản:** 1.0.0
- **Ngôn ngữ giao diện:** Tiếng Việt
- **Công nghệ:** MEVN Stack (MongoDB, Express.js, Vanilla JavaScript, Node.js)

---

## 🏗️ CẤU TRÚC THƯ MỤC

```
d:\Baichonguyen/
│
├── middleware/              # Middleware xác thực và phân quyền
│   └── auth.js             # JWT authentication & role-based access
│
├── models/                 # Mongoose Models (Database Schema)
│   ├── User.js            # Model người dùng (email, password, role)
│   ├── Role.js            # Model vai trò (Student, Alumni, Recruiter, Admin)
│   ├── UserProfile.js     # Hồ sơ sinh viên/cựu sinh viên
│   ├── RecruiterProfile.js # Hồ sơ nhà tuyển dụng
│   ├── JobPosting.js      # Tin tuyển dụng
│   ├── Application.js     # Đơn ứng tuyển
│   ├── Post.js            # Bài viết cộng đồng
│   ├── Comment.js         # Bình luận
│   ├── PostLike.js        # Like bài viết
│   ├── MentorshipRequest.js # Yêu cầu cố vấn
│   ├── Notification.js    # Thông báo
│   ├── Connection.js      # Kết nối giữa users
│   ├── Report.js          # Báo cáo vi phạm
│   └── AuditLog.js        # Nhật ký hoạt động (Admin)
│
├── routes/                 # API Routes (Endpoints)
│   ├── auth.js            # POST /api/auth/register, /login, /me
│   ├── users.js           # GET /api/users, /mentors, PUT /profile
│   ├── jobs.js            # CRUD tin tuyển dụng
│   ├── applications.js    # CRUD đơn ứng tuyển
│   ├── posts.js           # CRUD bài viết, comments, likes
│   ├── mentors.js         # Quản lý mentor requests
│   ├── notifications.js   # Lấy và đánh dấu thông báo
│   ├── reports.js         # Báo cáo vi phạm
│   ├── admin.js           # Quản trị: duyệt jobs/posts, users, audit logs
│   └── recruiterProfile.js # CRUD hồ sơ công ty
│
├── public/                 # Frontend (Single Page Application)
│   ├── index.html         # Giao diện chính (tiếng Việt)
│   ├── index-handshake.html # Backup giao diện
│   ├── index-original.html  # Giao diện cũ
│   │
│   ├── css/
│   │   ├── handshake-style.css # CSS chính (Handshake-inspired)
│   │   ├── style.css          # CSS phụ
│   │   └── style-original.css # CSS cũ
│   │
│   └── js/
│       ├── app.js              # Logic chính (1400+ dòng)
│       ├── api.js              # API wrappers (fetch calls)
│       └── handshake-render.js # Render dynamic cards
│
├── .env                    # Environment variables (MongoDB URI, JWT Secret)
├── .env.example           # Template cho .env
├── .gitignore             # Git ignore rules
├── package.json           # Dependencies và scripts
├── server.js              # Server chính (MongoDB thật)
└── README.md              # Hướng dẫn cơ bản
```

---

## 👥 HỆ THỐNG VAI TRÒ (ROLES)

### 1. 🎓 **Student (Sinh viên)**
**Quyền:**
- ✅ Xem danh sách việc làm
- ✅ Ứng tuyển công việc
- ✅ Đăng bài viết, bình luận, like
- ✅ Yêu cầu mentor từ Alumni
- ✅ Xem và chỉnh sửa hồ sơ cá nhân
- ❌ KHÔNG được đăng tin tuyển dụng

**Trang có quyền truy cập:**
- Trang chủ
- Việc làm (xem và ứng tuyển)
- Cộng đồng (đọc, viết, comment)
- Cố vấn (xem danh sách mentor, gửi yêu cầu)
- Hồ sơ (xem applications, mentor requests, edit profile)

---

### 2. 🎖️ **Alumni (Cựu sinh viên)**
**Quyền:** (Kế thừa tất cả quyền Student) +
- ✅ Đăng ký làm Mentor (toggle on/off)
- ✅ Nhận và phản hồi yêu cầu mentor từ Student
- ✅ Hiển thị trong danh sách Mentors khi bật trạng thái
- ❌ KHÔNG được đăng tin tuyển dụng

**Trang có quyền truy cập:**
- Tất cả trang của Student +
- Tab "Yêu cầu nhận được" trong Hồ sơ (mentor requests)

---

### 3. 💼 **Recruiter (Nhà tuyển dụng)**
**Quyền:** (Một số quyền Student) +
- ✅ Đăng tin tuyển dụng mới
- ✅ Quản lý tin tuyển dụng của mình (edit, close, delete)
- ✅ Xem danh sách ứng viên đã apply
- ✅ Cập nhật trạng thái đơn (Pending → Accepted/Rejected)
- ✅ Quản lý hồ sơ công ty
- ❌ KHÔNG thể ứng tuyển
- ❌ KHÔNG thể yêu cầu mentor

**Trang có quyền truy cập:**
- Trang chủ
- Việc làm (xem và đăng tin)
- Cộng đồng (đọc, viết, comment)
- **Tuyển dụng** (trang riêng với 3 tabs):
  - My Jobs
  - Applications
  - Company Profile

---

### 4. ⚙️ **Admin (Quản trị viên)**
**Quyền:** (Full access) +
- ✅ Duyệt/Từ chối tin tuyển dụng (Pending Jobs)
- ✅ Duyệt/Ẩn bài viết (Pending Posts)
- ✅ Xử lý báo cáo vi phạm (Reports)
- ✅ Quản lý người dùng (đổi role, khóa/mở khóa tài khoản)
- ✅ Xem nhật ký hoạt động (Audit Logs)

**Trang có quyền truy cập:**
- Tất cả trang +
- **Quản trị** (trang riêng với 5 tabs):
  - Pending Jobs
  - Pending Posts
  - Reports
  - User Management
  - Audit Logs

---

## 🔧 CHỨC NĂNG CHI TIẾT

### 📌 **1. Authentication & Authorization**

#### Đăng ký (Register)
- **Endpoint:** `POST /api/auth/register`
- **Input:** email, password, fullName, role
- **Output:** JWT token, user info
- **Logic:**
  - Mã hóa password bằng bcrypt (10 rounds)
  - Tạo User + UserProfile/RecruiterProfile
  - Tạo JWT token với userId + roleId

#### Đăng nhập (Login)
- **Endpoint:** `POST /api/auth/login`
- **Input:** email, password
- **Output:** JWT token, user info
- **Logic:**
  - Kiểm tra email tồn tại
  - So sánh password với bcrypt
  - Kiểm tra account status (active/suspended)
  - Tạo JWT token

#### Xác thực token
- **Endpoint:** `GET /api/auth/me`
- **Headers:** Authorization: Bearer {token}
- **Output:** user info + profile
- **Logic:**
  - Verify JWT token
  - Lấy user + populate role
  - Lấy profile tương ứng (UserProfile/RecruiterProfile)

---

### 💼 **2. Jobs (Tin tuyển dụng)**

#### Lấy danh sách việc làm
- **Endpoint:** `GET /api/jobs`
- **Query params:**
  - search (tìm theo title, company, location)
  - jobType (Full-time, Part-time, Contract, Internship)
  - location
  - page, limit (pagination)
- **Output:** jobPostings[], total, page, pages

#### Đăng tin tuyển dụng
- **Endpoint:** `POST /api/jobs`
- **Auth:** Recruiter only
- **Input:** title, position, description, requirements, jobType, location, salary, applicationMethod, deadline
- **Logic:**
  - Tạo JobPosting với status = 'Pending'
  - Tạo Notification cho Admin
  - Admin phải approve trước khi hiển thị

#### Duyệt tin (Admin)
- **Endpoint:** `PUT /api/admin/jobs/:id/approve`
- **Auth:** Admin only
- **Input:** status (Approved/Rejected), reason (optional)
- **Logic:**
  - Cập nhật status
  - Tạo Notification cho Recruiter
  - Ghi Audit Log

---

### 📝 **3. Posts (Bài viết cộng đồng)**

#### Lấy danh sách bài viết
- **Endpoint:** `GET /api/posts`
- **Query params:**
  - search (title, content)
  - category (Experience, Question, CareerAdvice, JobShare)
  - page, limit

#### Đăng bài viết
- **Endpoint:** `POST /api/posts`
- **Auth:** Required
- **Input:** category, title, content
- **Logic:**
  - Tạo Post với status = 'Pending'
  - Admin phải approve trước khi hiển thị

#### Like bài viết
- **Endpoint:** `POST /api/posts/:id/like`
- **Logic:**
  - Toggle like (like → unlike)
  - Cập nhật likeCount trong Post
  - Tạo/Xóa PostLike document

#### Comment
- **Endpoint:** `POST /api/posts/:id/comments`
- **Input:** content
- **Logic:**
  - Tạo Comment
  - Tăng commentCount trong Post
  - Tạo Notification cho author

---

### 🤝 **4. Mentorship (Cố vấn)**

#### Đăng ký làm Mentor
- **Endpoint:** `PUT /api/users/profile`
- **Auth:** Alumni only
- **Input:** isMentorAvailable: true/false
- **Logic:**
  - Cập nhật UserProfile
  - Hiển thị/Ẩn trong danh sách Mentors

#### Gửi yêu cầu Mentor
- **Endpoint:** `POST /api/mentors/request`
- **Auth:** Student only
- **Input:** alumniId, topic, message
- **Logic:**
  - Tạo MentorshipRequest với status = 'Pending'
  - Tạo Notification cho Alumni

#### Phản hồi yêu cầu
- **Endpoint:** `PUT /api/mentors/requests/:id/respond`
- **Auth:** Alumni only
- **Input:** status (Accepted/Rejected), responseMessage
- **Logic:**
  - Cập nhật MentorshipRequest
  - Tạo Notification cho Student

---

### 📄 **5. Applications (Đơn ứng tuyển)**

#### Nộp đơn ứng tuyển
- **Endpoint:** `POST /api/applications`
- **Auth:** Student/Alumni
- **Input:** jobId, cvUrl, coverLetter
- **Logic:**
  - Kiểm tra đã ứng tuyển chưa (duplicate check)
  - Tạo Application với status = 'Pending'
  - Tạo Notification cho Recruiter

#### Cập nhật trạng thái đơn
- **Endpoint:** `PUT /api/applications/:id/status`
- **Auth:** Recruiter (chỉ jobs của mình)
- **Input:** status (Pending/Reviewed/Accepted/Rejected)
- **Logic:**
  - Cập nhật Application
  - Tạo Notification cho applicant

#### Rút đơn ứng tuyển
- **Endpoint:** `DELETE /api/applications/:id`
- **Auth:** Applicant only
- **Logic:**
  - Xóa Application
  - Tạo Notification cho Recruiter

---

### 🚨 **6. Reports (Báo cáo vi phạm)**

#### Gửi báo cáo
- **Endpoint:** `POST /api/reports`
- **Auth:** Required
- **Input:** targetType (Job/Post/User), targetId, reason
- **Logic:**
  - Tạo Report với status = 'Pending'
  - Tạo Notification cho Admin

#### Xử lý báo cáo (Admin)
- **Endpoint:** `PUT /api/admin/reports/:id/resolve`
- **Input:** resolutionNotes
- **Logic:**
  - Cập nhật status = 'Resolved'
  - Có thể khóa User hoặc ẩn Post/Job
  - Ghi Audit Log

---

### 👤 **7. User Management (Admin)**

#### Đổi vai trò
- **Endpoint:** `PUT /api/admin/users/:id/role`
- **Input:** roleId
- **Logic:**
  - Cập nhật User.roleId
  - Ghi Audit Log

#### Khóa/Mở khóa tài khoản
- **Endpoint:** `PUT /api/admin/users/:id/status`
- **Input:** accountStatus (Active/Suspended)
- **Logic:**
  - Cập nhật User.accountStatus
  - User bị khóa không thể đăng nhập
  - Ghi Audit Log

---

### 🔔 **8. Notifications (Thông báo)**

#### Lấy thông báo
- **Endpoint:** `GET /api/notifications`
- **Output:** notifications[] (unread first)

#### Đánh dấu đã đọc
- **Endpoint:** `PUT /api/notifications/:id/read`
- **Logic:** Cập nhật isRead = true

**Các loại thông báo:**
- Job approved/rejected (Recruiter)
- New application (Recruiter)
- Application status changed (Applicant)
- Post approved/rejected (Author)
- New comment on post (Author)
- Mentor request (Alumni)
- Mentor response (Student)
- Report resolved (Reporter)

---

## 🗄️ DATABASE SCHEMA

### User
```javascript
{
  email: String (unique),
  password: String (bcrypt hashed),
  fullName: String,
  roleId: ObjectId (ref: Role),
  accountStatus: 'Active' | 'Suspended',
  createdAt: Date
}
```

### UserProfile
```javascript
{
  userId: ObjectId (ref: User),
  graduationYear: Number,
  currentCompany: String,
  skills: [String],
  linkedInUrl: String,
  isMentorAvailable: Boolean,
  connections: [ObjectId] (ref: User)
}
```

### JobPosting
```javascript
{
  creatorId: ObjectId (ref: User),
  title: String,
  position: String,
  description: String,
  requirements: String,
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship',
  location: String,
  salary: String,
  applicationMethod: String,
  deadline: Date,
  status: 'Pending' | 'Approved' | 'Rejected' | 'Closed'
}
```

### Post
```javascript
{
  authorId: ObjectId (ref: User),
  category: 'Experience' | 'Question' | 'CareerAdvice' | 'JobShare',
  title: String,
  content: String,
  likeCount: Number,
  commentCount: Number,
  status: 'Pending' | 'Approved' | 'Hidden'
}
```

### Application
```javascript
{
  jobId: ObjectId (ref: JobPosting),
  applicantId: ObjectId (ref: User),
  cvUrl: String,
  coverLetter: String,
  status: 'Pending' | 'Reviewed' | 'Accepted' | 'Rejected'
}
```

### MentorshipRequest
```javascript
{
  studentId: ObjectId (ref: User),
  alumniId: ObjectId (ref: User),
  topic: String,
  message: String,
  status: 'Pending' | 'Accepted' | 'Rejected',
  responseMessage: String
}
```

---

## 🎨 FRONTEND ARCHITECTURE

### Single Page Application (SPA)
- **index.html** chứa tất cả các "trang" trong các `<div class="trang">`
- JavaScript `hienTrang(id)` để chuyển đổi hiển thị
- Không reload page, chỉ fetch data và re-render

### Pages (Các trang)
1. `trang-auth` - Đăng nhập/Đăng ký
2. `trang-chu` - Trang chủ (hero, stats, featured jobs/posts)
3. `viec-lam` - Danh sách việc làm + form đăng tin
4. `cong-dong` - Danh sách bài viết + form đăng bài
5. `mentor` - Danh sách mentors + form yêu cầu
6. `ho-so` - Hồ sơ cá nhân (applications, mentor requests, edit profile)
7. `tuyen-dung` - Trang Recruiter (3 tabs: My Jobs, Applications, Company Profile)
8. `quantri` - Trang Admin (5 tabs: Pending Jobs/Posts/Reports/Users/Audit Logs)

### Key JavaScript Files

#### app.js (1400+ dòng)
**Chức năng chính:**
- Authentication: `dangNhap()`, `dangKy()`, `dangXuat()`
- Navigation: `hienTrang()`, `chuyenTab()`
- Jobs: `taiDanhSachViec()`, `xemChiTietViec()`, `taoViecLam()`
- Posts: `taiDanhSachBai()`, `xemChiTietBai()`, `thichBai()`, `themBinhLuan()`
- Mentors: `taiDanhSachMentor()`, `yeuCauMentor()`
- Profile: `taiHoSo()`, `capNhatHoSo()`
- Recruiter: `taiTinCuaToi()`, `taiDonUngTuyen()`, `capNhatTrangThaiDon()`
- Admin: `taiTinChoDuyet()`, `duyetViec()`, `duyetBai()`, `xuLyBaoCao()`
- Utils: `hienToast()`, `debounceTimKiem()`, `tinhHanNop()`

#### api.js (~500 dòng)
**Wrapper functions cho fetch:**
- Auth: `dangNhapAPI()`, `dangKyAPI()`, `layThongTinToiAPI()`
- Jobs: `layDanhSachViecAPI()`, `layChiTietViecAPI()`, `taoViecLamAPI()`
- Posts: `layDanhSachBaiAPI()`, `taoBaiVietAPI()`, `thichBaiAPI()`
- Applications: `ungTuyenAPI()`, `layDonCuaToiAPI()`, `rutHoSoAPI()`
- Mentors: `guiYeuCauMentorAPI()`, `phanHoiYeuCauMentorAPI()`
- Admin: `duyetViecAPI()`, `duyetBaiAPI()`, `xuLyBaoCaoAPI()`

#### handshake-render.js (~400 dòng)
**Dynamic card renderers:**
- `taoTheViec(viec)` - Render job card với onclick handlers
- `taoTheBai(bai)` - Render post card với like/comment
- `taoTheMentor(mentor)` - Render mentor card
- `taoTheUngVien(app)` - Render applicant card
- Tất cả cards có Handshake-inspired design

---

## 🚀 DEPLOYMENT

### Yêu cầu hệ thống
- Node.js 16+
- MongoDB 7.0+ (Local hoặc Atlas)
- npm/yarn
- Port 5000 available

### Cài đặt
```bash
# 1. Clone repository
git clone <repo-url>
cd Baichonguyen

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Edit .env và điền MongoDB URI, JWT Secret

# 4. Start server
npm start
```

### Environment Variables (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/alumni-network
# hoặc: mongodb+srv://user:pass@cluster.mongodb.net/alumni-network
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRE=7d
```

### Scripts
```bash
npm start      # Chạy server production
npm run dev    # Chạy với nodemon (auto-reload)
npm run seed   # Seed dữ liệu mẫu (cần tạo lại seedData.js)
```

---

## 🔐 SECURITY

### Authentication
- JWT token với expiration (7 days)
- Password hashing với bcrypt (10 rounds)
- Token gửi qua Authorization header

### Authorization
- Middleware `auth.js` verify token
- Role-based access control (RBAC)
- Route protection theo role

### Input Validation
- express-validator cho API inputs
- Mongoose schema validation
- XSS prevention (escape HTML)

### Best Practices
- ✅ CORS enabled
- ✅ Environment variables cho sensitive data
- ✅ Password không lưu plain text
- ✅ Token expiration
- ⚠️ HTTPS recommended cho production
- ⚠️ Rate limiting recommended

---

## 📊 TESTING

### Manual Testing Flow

#### 1. Test Student Role
```
1. Đăng ký: student@test.com / test123 / Student
2. Đăng nhập
3. Xem việc làm → Click "Xem chi tiết" → Click "Apply"
4. Vào Cộng đồng → Đăng bài → Like/Comment
5. Vào Mentors → Tìm mentor → Gửi yêu cầu
6. Vào Hồ sơ → Xem applications & mentor requests
```

#### 2. Test Alumni Role
```
1. Đăng ký: alumni@test.com / test123 / Alumni
2. Đăng nhập
3. Vào Mentors → Bật "Become a Mentor"
4. Vào Hồ sơ → Tab "Requests Received" → Phản hồi yêu cầu
```

#### 3. Test Recruiter Role
```
1. Đăng ký: recruiter@test.com / test123 / Recruiter
2. Đăng nhập
3. Vào Jobs → "Post New Job" → Điền form → Submit
4. Vào Recruitment → Tab "My Jobs" → Xem tin vừa đăng
5. Chờ Admin duyệt
6. Sau khi có application → Tab "Applications" → Update status
```

#### 4. Test Admin Role
```
1. Đăng nhập: admin@test.com / admin123
2. Vào Admin → Tab "Pending Jobs" → Approve/Reject
3. Tab "Pending Posts" → Approve/Hide
4. Tab "Reports" → Resolve
5. Tab "Users" → Change role / Suspend user
6. Tab "Audit Logs" → Xem history
```

---

## 🐛 TROUBLESHOOTING

### Lỗi: "Cannot connect to MongoDB"
**Giải pháp:**
- Kiểm tra MongoDB service đang chạy: `mongosh`
- Kiểm tra MONGODB_URI trong .env
- MongoDB Atlas: Kiểm tra IP whitelist

### Lỗi: "Token invalid"
**Giải pháp:**
- Xóa localStorage: `localStorage.clear()`
- Đăng nhập lại
- Kiểm tra JWT_SECRET trong .env

### Lỗi: "Cannot POST /api/..."
**Giải pháp:**
- Kiểm tra server đang chạy: `npm start`
- Kiểm tra route đã được import trong server.js
- Kiểm tra method (GET/POST/PUT/DELETE)

### Giao diện không load JS
**Giải pháp:**
- Hard refresh: Ctrl+Shift+R
- Xóa cache browser
- Kiểm tra console (F12) có lỗi JS không
- Kiểm tra file path trong index.html

### Chức năng không hoạt động
**Giải pháp:**
- Mở Developer Console (F12)
- Tab Console: Xem lỗi JavaScript
- Tab Network: Xem API calls (status code, response)
- Kiểm tra token còn hạn không

---

## 📞 HỖ TRỢ & BẢO TRÌ

### Git Workflow
```bash
# Commit changes
git add .
git commit -m "feat: add new feature"
git push

# Create branch
git checkout -b feature/new-feature
```

### Backup Database
```bash
# MongoDB Local
mongodump --db alumni-network --out ./backup

# MongoDB Atlas
# Sử dụng Automated Backups trong Atlas Dashboard
```

### Monitoring
- Kiểm tra server logs
- Monitor MongoDB connections
- Track API response times
- Review Audit Logs (Admin page)

---

## 🎓 KẾT LUẬN

AlumniNet là một hệ thống mạng xã hội nghề nghiệp hoàn chỉnh với:
- ✅ **4 vai trò** với phân quyền rõ ràng
- ✅ **13 models** database với quan hệ đầy đủ
- ✅ **50+ API endpoints** cho tất cả chức năng
- ✅ **8 trang** frontend với giao diện Handshake-inspired
- ✅ **100% tiếng Việt** với UTF-8 encoding
- ✅ **Real-time features** (notifications, likes, comments)
- ✅ **Admin dashboard** với full moderation tools

### Điểm mạnh
- Kiến trúc MVC rõ ràng
- Code có tổ chức, dễ maintain
- Giao diện đẹp, responsive
- Bảo mật với JWT + bcrypt
- Scalable với MongoDB

### Có thể mở rộng
- WebSocket cho real-time chat
- File upload cho CV/Avatar
- Email notifications
- Advanced search & filters
- Analytics dashboard
- Mobile app (React Native)

---

**© 2024 AlumniNet. All rights reserved.**

