# 🚀 HƯỚNG DẪN CHẠY DỰ ÁN

## ⚠️ Yêu Cầu Cài Đặt

### 1. Cài MongoDB

**Tải MongoDB Community Edition:**
https://www.mongodb.com/try/download/community

**Chọn:**
- Version: Latest
- Platform: Windows
- Package: MSI

**Sau khi cài đặt:**
```powershell
# Khởi động MongoDB
net start MongoDB

# Hoặc nếu cài không có service:
"C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" --dbpath="C:\data\db"
```

**Kiểm tra MongoDB đã chạy:**
```powershell
mongosh
# Nếu kết nối được là OK
```

### 2. Đã Cài Node.js
```powershell
node --version
# Phải >= 16.x
```

---

## 📦 CÀI ĐẶT DỰ ÁN

### Bước 1: Cài Dependencies (Đã xong)
```powershell
cd d:\Baichonguyen
npm install
```

### Bước 2: Kiểm Tra File .env
File `.env` phải có nội dung:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/alumni-student-network
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

### Bước 3: Import Data Mẫu vào MongoDB
```powershell
node seedData.js
```

**Nếu thành công, bạn sẽ thấy:**
```
✅ Seed data completed successfully!
```

### Bước 4: Chạy Server
```powershell
npm start
# Hoặc development mode:
npm run dev
```

**Nếu thành công, bạn sẽ thấy:**
```
✅ MongoDB connected
🚀 Server running on http://localhost:5000
```

### Bước 5: Truy Cập Website
Mở trình duyệt: http://localhost:5000

---

## 🔑 TÀI KHOẢN TEST

| Vai trò | Email | Password |
|---------|-------|----------|
| **Admin** | admin@university.edu.vn | admin123 |
| **Sinh viên** | student1@university.edu.vn | student123 |
| **Cựu sinh viên** | alumni1@company.com | alumni123 |
| **Nhà tuyển dụng** | hr@fpt.com.vn | recruiter123 |

---

## 🐛 XỬ LÝ LỖI

### Lỗi: MongoDB connection error
**Nguyên nhân:** MongoDB chưa chạy

**Giải pháp:**
```powershell
# Khởi động MongoDB service
net start MongoDB

# Hoặc kiểm tra MongoDB có chạy không:
tasklist | findstr mongod
```

### Lỗi: Port 5000 already in use
**Giải pháp 1:** Thay đổi PORT trong file `.env`
```
PORT=3000
```

**Giải pháp 2:** Kill process đang chiếm port 5000
```powershell
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

### Lỗi: Cannot find module
**Giải pháp:**
```powershell
rm -r node_modules
rm package-lock.json
npm install
```

### Lỗi: JWT token invalid
**Giải pháp:** Clear localStorage trong browser
- Mở Developer Tools (F12)
- Console tab
- Gõ: `localStorage.clear()`
- Refresh trang

---

## 📂 CẤU TRÚC DỰ ÁN

```
d:\Baichonguyen\
├── models/              # MongoDB Schemas (13 files)
├── routes/              # API Routes (7 files)
├── middleware/          # Auth middleware
├── public/              # Frontend
│   ├── index.html
│   ├── css/style.css
│   └── js/
│       ├── api.js
│       └── app.js
├── server.js            # Main server file
├── seedData.js          # Data seeding script
├── .env                 # Environment variables
└── package.json
```

---

## ✅ KIỂM TRA HỆ THỐNG

### 1. Kiểm tra MongoDB
```powershell
mongosh
use alumni-student-network
show collections
db.users.countDocuments()
```

### 2. Kiểm tra Server
```powershell
# Terminal 1: Chạy server
npm start

# Terminal 2: Test API
curl http://localhost:5000/api/auth/login -X POST -H "Content-Type: application/json" -d "{\"email\":\"student1@university.edu.vn\",\"password\":\"student123\"}"
```

### 3. Kiểm tra Frontend
- Mở: http://localhost:5000
- Click "Đăng Nhập"
- Nhập: student1@university.edu.vn / student123
- Nếu vào được Dashboard = OK!

---

## 📞 HỖ TRỢ

Nếu gặp lỗi khác:
1. Kiểm tra MongoDB có chạy: `mongosh`
2. Kiểm tra PORT 5000 có bị chiếm: `netstat -ano | findstr :5000`
3. Xem log lỗi trong terminal
4. Kiểm tra file .env có đúng format không
