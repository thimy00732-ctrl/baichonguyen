# 📝 CHANGELOG - AlumniNet

## [Unreleased] - 2024-11-21

### ✨ Added - Priority 1 Features

#### 1. Notification System API
- ✅ `GET /api/notifications` - Lấy danh sách thông báo (có pagination)
- ✅ `PUT /api/notifications/:id/read` - Đánh dấu đã đọc
- ✅ `PUT /api/notifications/mark-all-read` - Đánh dấu tất cả đã đọc
- ✅ `DELETE /api/notifications/:id` - Xóa thông báo
- ✅ `DELETE /api/notifications/clear-read` - Xóa tất cả thông báo đã đọc

#### 2. Report System API
- ✅ `POST /api/reports` - Tạo báo cáo vi phạm
- ✅ `GET /api/reports/my-reports` - Xem báo cáo đã gửi
- ✅ `DELETE /api/reports/:id` - Xóa báo cáo (nếu chưa xử lý)
- ✅ Kiểm tra duplicate report (không cho báo cáo 2 lần cùng nội dung)

#### 3. RecruiterProfile API
- ✅ `POST /api/recruiter-profile` - Tạo/cập nhật profile nhà tuyển dụng
- ✅ `GET /api/recruiter-profile/me` - Lấy profile của mình
- ✅ `GET /api/recruiter-profile/:id` - Xem profile công khai
- ✅ `GET /api/recruiter-profile` - Danh sách tất cả recruiters (có filter)
- ✅ `DELETE /api/recruiter-profile/me` - Xóa profile
- ✅ Validation: Company name, tax code required
- ✅ Unique tax code check
- ✅ Waiting for admin verification flow

#### 4. Pagination Implementation
- ✅ **Jobs API**: Pagination với page, limit, total, totalPages, hasMore
- ✅ **Posts API**: Pagination với page, limit, total, totalPages, hasMore
- ✅ **Frontend**: Pagination controls với nút Previous/Next
- ✅ **CSS**: Style cho pagination buttons
- ✅ Enhanced search: Thêm requirements vào tìm kiếm jobs

#### 5. API Client Updates
- ✅ Thêm RecruiterProfile API functions vào api.js
- ✅ Update layDanhSachViecAPI và layDanhSachBaiAPI hỗ trợ pagination
- ✅ Thêm state management cho pagination (paginationState)

### 🐛 Fixed

#### Auth & UI Fixes
- ✅ Xóa màu xanh gradient nền trang đăng nhập
- ✅ Background auth-wrapper từ gradient → trắng
- ✅ Auth sidebar vẫn giữ gradient xanh đẹp
- ✅ Sửa accountStatus mặc định: Unverified → Active
- ✅ User có thể đăng nhập ngay sau khi đăng ký
- ✅ Thêm console.log để debug đăng nhập

### 📚 Documentation
- ✅ Tạo `HUONG-DAN-DEMO.md` - Hướng dẫn chi tiết chạy demo mode
- ✅ Tạo `start-demo.bat` - Script khởi động demo nhanh
- ✅ Tạo `CHANGELOG.md` - File theo dõi thay đổi

### 🔧 Configuration
- ✅ Đăng ký route `/api/recruiter-profile` vào server.js
- ✅ Routes notifications và reports đã có sẵn

---

## 🎯 TODO - Priority 2 Features

### Chưa implement:
- ⏳ Events & Programs Module
- ⏳ Pagination cho Mentor API
- ⏳ Pagination cho Applications API
- ⏳ Advanced filter: Multiple skills, salary range, experience level
- ⏳ UI for Notification System (dropdown hiển thị thông báo)
- ⏳ UI for Report System (nút báo cáo trên jobs/posts)
- ⏳ UI for RecruiterProfile (form tạo/edit profile)
- ⏳ Real-time notifications (WebSocket/SSE)
- ⏳ Email notifications
- ⏳ File upload cho company logo
- ⏳ Advanced analytics dashboard
- ⏳ Export reports (CSV/PDF)

### Các tính năng từ BU Alumni (Priority 2):
1. ⏳ Donations & Fundraising
2. ⏳ Career Services (CV review, mock interviews)
3. ⏳ Volunteer Opportunities
4. ⏳ Regional Chapters
5. ⏳ Alumni Directory với advanced search
6. ⏳ Mentorship Program upgrade (group mentorship, schedule system)
7. ⏳ Success Stories showcase
8. ⏳ Photo Gallery & Media Library

---

## 📊 Statistics

### API Endpoints Added: 13
- Notifications: 5 endpoints
- Reports: 3 endpoints
- RecruiterProfile: 5 endpoints

### Files Created: 7
- `routes/notifications.js`
- `routes/reports.js` (overwrote existing with improvements)
- `routes/recruiterProfile.js`
- `HUONG-DAN-DEMO.md`
- `start-demo.bat`
- `CHANGELOG.md`
- (Updated) `server.js`, `models/User.js`, `public/css/style.css`, `public/js/app.js`, `public/js/api.js`

### Lines of Code Added: ~600+
- Backend: ~400 lines
- Frontend: ~150 lines
- Documentation: ~50 lines

---

## 🚀 How to Test New Features

### 1. Notification System
```bash
# Cần MongoDB running
node server.js

# Test endpoints:
POST   /api/notifications (tạo từ system)
GET    /api/notifications
PUT    /api/notifications/:id/read
PUT    /api/notifications/mark-all-read
DELETE /api/notifications/:id
```

### 2. Report System
```javascript
// Trong frontend console hoặc test với Postman
baoCaoNoiDung('JobPosting', 'jobId123', 'Spam content');
```

### 3. RecruiterProfile
```bash
# Login as Recruiter role
POST /api/recruiter-profile
{
  "companyName": "FPT Software",
  "taxCodeOrLicense": "0123456789",
  "companyWebsite": "https://fpt.com.vn",
  "phone": "0123456789",
  "address": "Hà Nội"
}

GET /api/recruiter-profile/me
```

### 4. Pagination
```bash
# Test với query params
GET /api/jobs?page=1&limit=5&search=developer
GET /api/posts?page=2&limit=10&category=Experience
```

Frontend tự động hiển thị nút Previous/Next khi có nhiều trang.

---

## 🔐 Git Commit History

```
commit be59406 - Fix: Xóa màu xanh nền đăng nhập và sửa lỗi không đăng nhập được
commit (next)  - Feature: Add Notification, Report, RecruiterProfile APIs + Pagination
```

---

## 👥 Contributors
- Development: Kiro AI Assistant
- Project Owner: thimy00732-ctrl

