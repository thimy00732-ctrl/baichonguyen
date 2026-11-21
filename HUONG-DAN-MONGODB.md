# 🗄️ HƯỚNG DẪN SỬ DỤNG DATABASE THẬT (MONGODB)

## ⚠️ VẤN ĐỀ VỚI DEMO MODE

**Server Demo (`server-demo.js`) có hạn chế:**
- ❌ Đăng ký user mới nhưng luôn trả về user cố định
- ❌ Không lưu dữ liệu thật vào database
- ❌ Token giả cố định (`demo-token-12345`)
- ❌ Mỗi lần restart server → mất hết dữ liệu

**✅ Với MongoDB thật (`server.js`):**
- ✅ Mỗi user đăng ký được lưu riêng biệt
- ✅ Đăng nhập với đúng user vừa tạo
- ✅ Token thật được tạo từ userId
- ✅ Dữ liệu không mất khi restart server
- ✅ Tất cả chức năng hoạt động đầy đủ

---

## 📋 YÊU CẦU HỆ THỐNG

- ✅ Node.js đã cài (kiểm tra: `node --version`)
- ✅ npm đã cài (kiểm tra: `npm --version`)
- 🆕 MongoDB cần cài

---

## 🚀 CÁCH 1: MONGODB LOCAL (Chạy trên máy)

### Bước 1: Tải MongoDB Community
```
https://www.mongodb.com/try/download/community
```

**Chọn:**
- Version: 7.0 trở lên
- Platform: Windows
- Package: MSI

### Bước 2: Cài đặt
1. Chạy file `.msi` đã tải
2. Chọn "Complete" installation
3. **✅ QUAN TRỌNG:** Tick vào "Install MongoDB as a Service"
4. Nhấn "Install"

### Bước 3: Kiểm tra MongoDB đã chạy
```powershell
# Mở PowerShell
mongosh
```

Nếu thấy:
```
Current Mongosh Log ID: ...
Connecting to: mongodb://127.0.0.1:27017/
```
→ ✅ **MongoDB đã chạy thành công!**

Gõ `exit` để thoát mongosh.

### Bước 4: Seed dữ liệu mẫu
```powershell
cd d:\Baichonguyen
node seedData.js
```

Bạn sẽ thấy:
```
🗑️ Clearing old data...
👥 Creating users...
📝 Creating user profiles...
💼 Creating job postings...
...
✅ Seed data completed successfully!
```

### Bước 5: Khởi động server THẬT
```powershell
# Dừng server demo nếu đang chạy
taskkill /F /IM node.exe

# Chạy server với MongoDB
node server.js
```

Bạn sẽ thấy:
```
🚀 Server running on port 5000
✅ MongoDB Connected: alumni-student-network
```

### Bước 6: Mở browser và test
```
http://localhost:5000
```

**Đăng ký user MỚI:**
- Nhấn "Sign up"
- Điền thông tin:
  - Full name: Nguyễn Văn Test
  - Email: test@example.com
  - Password: test123
  - Role: Student
- Nhấn "Create account"

**→ ✅ Lần này sẽ TẠO USER MỚI thật sự!**

**Đăng nhập lại:**
- Email: test@example.com
- Password: test123

**→ ✅ Sẽ đăng nhập đúng vào user vừa tạo!**

---

## ☁️ CÁCH 2: MONGODB ATLAS (Cloud - Miễn phí)

**Ưu điểm:**
- Không cần cài MongoDB trên máy
- Truy cập từ mọi nơi
- Tự động backup
- FREE tier đủ dùng cho học tập

### Bước 1: Đăng ký MongoDB Atlas
```
https://www.mongodb.com/cloud/atlas/register
```

### Bước 2: Tạo Cluster
1. Chọn "Build a Database"
2. Chọn **FREE** tier (M0)
3. Chọn region gần Việt Nam (Singapore)
4. Nhấn "Create"

### Bước 3: Tạo Database User
1. Vào "Database Access"
2. Nhấn "Add New Database User"
3. Username: `admin`
4. Password: `admin123` (hoặc tự đặt)
5. Nhấn "Add User"

### Bước 4: Whitelist IP
1. Vào "Network Access"
2. Nhấn "Add IP Address"
3. Chọn "Allow Access from Anywhere" → `0.0.0.0/0`
4. Nhấn "Confirm"

### Bước 5: Lấy Connection String
1. Vào "Database" → Nhấn "Connect"
2. Chọn "Connect your application"
3. Copy connection string:
```
mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### Bước 6: Cập nhật .env
Mở file `.env` và sửa dòng `MONGODB_URI`:
```env
MONGODB_URI=mongodb+srv://admin:admin123@cluster0.xxxxx.mongodb.net/alumni-network?retryWrites=true&w=majority
```

**⚠️ Thay thế:**
- `<password>` → password bạn đặt (ví dụ: `admin123`)
- `cluster0.xxxxx` → URL thật từ Atlas
- `alumni-network` → tên database

### Bước 7: Seed data và chạy server
```powershell
cd d:\Baichonguyen
node seedData.js
node server.js
```

---

## 🎯 TÀI KHOẢN MẪU (Sau khi seed)

### Admin:
- **Email:** admin@alumnet.edu.vn
- **Password:** admin123

### Student:
- **Email:** student1@alumnet.edu.vn
- **Password:** student123

### Alumni:
- **Email:** alumni1@alumnet.edu.vn
- **Password:** alumni123

### Recruiter:
- **Email:** recruiter1@alumnet.edu.vn
- **Password:** recruiter123

---

## 🔄 SO SÁNH DEMO vs THẬT

| Tính năng | Demo Mode | MongoDB Real |
|-----------|-----------|--------------|
| Đăng ký user mới | ❌ Giả | ✅ Thật |
| Lưu dữ liệu | ❌ Không | ✅ Có |
| Token | ❌ Cố định | ✅ JWT thật |
| User profile | ❌ Cố định | ✅ Riêng biệt |
| Mất data khi restart | ❌ Có | ✅ Không |
| Chức năng đầy đủ | ⚠️ Hạn chế | ✅ 100% |

---

## 🛠️ LỆNH HỮU ÍCH

### Xem dữ liệu trong MongoDB (Local):
```powershell
mongosh
use alumni-student-network
db.users.find().pretty()
db.usersprofiles.find().pretty()
```

### Xóa toàn bộ data và seed lại:
```powershell
node seedData.js
```

### Chuyển giữa Demo và Real:
```powershell
# Demo mode (không cần MongoDB)
node server-demo.js

# Real mode (cần MongoDB)
node server.js
```

---

## ❓ XỬ LÝ LỖI

### Lỗi: "MongoServerError: Authentication failed"
→ Sai username/password trong connection string
→ Kiểm tra lại `.env`

### Lỗi: "MongooseError: connect ECONNREFUSED"
→ MongoDB chưa chạy
→ Chạy MongoDB service hoặc check Atlas

### Lỗi: "Module 'mongoose' not found"
```powershell
npm install
```

---

## 📞 HỖ TRỢ

Nếu gặp vấn đề:
1. Kiểm tra MongoDB đang chạy: `mongosh`
2. Kiểm tra file `.env` có đúng không
3. Chạy lại: `npm install`
4. Seed lại: `node seedData.js`

---

✅ **Sau khi setup MongoDB, tất cả chức năng sẽ hoạt động đúng 100%!**
