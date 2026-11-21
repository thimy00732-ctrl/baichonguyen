# 🎓 AlumniNet - Mạng Xã Hội Nghề Nghiệp

Hệ thống kết nối sinh viên, cựu sinh viên, và nhà tuyển dụng.

## 🚀 Khởi động nhanh

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Cấu hình môi trường
```bash
cp .env.example .env
```

Chỉnh sửa file `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/alumni-network
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d
```

### 3. Khởi động server
```bash
npm start
```

Truy cập: **http://localhost:5000**

---

## 📚 Tài liệu

Chi tiết đầy đủ trong **[DOC-TONG-HOP.md](./DOC-TONG-HOP.md)**:
- Cấu trúc dự án
- Hệ thống vai trò (4 roles)
- Chức năng chi tiết (50+ endpoints)
- Database schema
- Frontend architecture
- Testing & Deployment

---

## 👥 Vai trò hệ thống

| Vai trò | Quyền chính |
|---------|-------------|
| 🎓 **Student** | Xem jobs, Ứng tuyển, Yêu cầu mentor |
| 🎖️ **Alumni** | + Làm mentor, Phản hồi requests |
| 💼 **Recruiter** | + Đăng tin tuyển dụng, Quản lý ứng viên |
| ⚙️ **Admin** | + Duyệt jobs/posts, Quản lý users |

---

## 🛠️ Công nghệ

- **Backend:** Node.js + Express.js
- **Database:** MongoDB + Mongoose
- **Frontend:** Vanilla JavaScript (SPA)
- **Authentication:** JWT + bcrypt
- **UI:** Handshake-inspired design

---

## 📂 Cấu trúc

```
├── models/          # Mongoose schemas
├── routes/          # API endpoints
├── middleware/      # Auth & authorization
├── public/          # Frontend (HTML/CSS/JS)
│   ├── index.html
│   ├── css/
│   └── js/
└── server.js        # Entry point
```

---

## 🔑 Yêu cầu

- Node.js 16+
- MongoDB 7.0+
- Port 5000 (có thể đổi trong .env)

---

## 📞 Scripts

```bash
npm start          # Khởi động server
npm run dev        # Development mode (nodemon)
```

---

## 📖 Hướng dẫn MongoDB

### MongoDB Local
```bash
# 1. Tải và cài MongoDB Community
# https://www.mongodb.com/try/download/community

# 2. Kiểm tra MongoDB đang chạy
mongosh

# 3. Cập nhật .env
MONGODB_URI=mongodb://localhost:27017/alumni-network
```

### MongoDB Atlas (Cloud)
```bash
# 1. Đăng ký tại mongodb.com/cloud/atlas
# 2. Tạo cluster (FREE tier)
# 3. Lấy connection string
# 4. Cập nhật .env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/alumni-network
```

---

## ✨ Features

- ✅ Authentication & Authorization
- ✅ Job posting & Applications
- ✅ Social posts & Comments
- ✅ Mentorship system
- ✅ Real-time notifications
- ✅ Admin moderation tools
- ✅ Responsive UI (Tiếng Việt)

---

## 🐛 Troubleshooting

**Lỗi kết nối MongoDB:**
- Kiểm tra MongoDB service đang chạy
- Kiểm tra MONGODB_URI trong .env
- Atlas: Whitelist IP address

**Lỗi "Token invalid":**
- Xóa localStorage và đăng nhập lại
- Kiểm tra JWT_SECRET trong .env

**Chi tiết xem:** [DOC-TONG-HOP.md](./DOC-TONG-HOP.md)

---

## 📄 License

ISC

---

**Xem tài liệu đầy đủ trong [DOC-TONG-HOP.md](./DOC-TONG-HOP.md)**
