# 🎯 HƯỚNG DẪN CHẠY DEMO MODE

## ✅ Các vấn đề đã fix:
1. ✅ **Xóa màu xanh nền đăng nhập** - Giờ background màu trắng
2. ✅ **Sửa accountStatus mặc định** - User có thể đăng nhập ngay
3. ✅ **Thêm console.log** - Debug dễ dàng hơn

## 🚀 Cách chạy:

### Cách 1: Dùng file BAT (Dễ nhất)
```
start-demo.bat
```

### Cách 2: Chạy thủ công
```bash
# 1. Tắt tất cả Node processes cũ
taskkill /F /IM node.exe

# 2. Khởi động server demo
node server-demo.js

# 3. Mở trình duyệt
http://localhost:5000
```

## 👤 Tài khoản demo có sẵn:

Bạn có thể đăng nhập bằng **BẤT KỲ** email và password nào (trong demo mode).

**Gợi ý:**
- Email: `student@university.edu.vn`
- Password: `123456` (bất kỳ password nào)

Hoặc:
- Email: `admin@university.edu.vn`  
- Password: `admin`

## 🐛 Nếu không đăng nhập được:

1. **Kiểm tra Console (F12)**:
   - Mở DevTools (F12)
   - Vào tab Console
   - Nhập email/password và nhấn Đăng nhập
   - Xem log: `Đang đăng nhập với:` và `Kết quả đăng nhập:`

2. **Kiểm tra Network (F12)**:
   - Vào tab Network
   - Đăng nhập
   - Tìm request `/api/auth/login`
   - Xem Response có trả về `token` không

3. **Kiểm tra server có chạy không**:
   - Server phải hiện: `🎨 Running in DEMO MODE`
   - Port: `5000`

## 📝 Tính năng trong Demo Mode:

✅ Đăng ký / Đăng nhập
✅ Xem việc làm (3 việc mẫu)
✅ Xem bài viết (2 bài mẫu)
✅ Xem mentor (2 mentor mẫu)
✅ Giao diện đầy đủ

❌ Không lưu dữ liệu (reload là mất)
❌ Không có pagination thật
❌ Không có notification thật

## 🔄 Chuyển sang Full Mode (có MongoDB):

Khi muốn dùng database thật:
```bash
# 1. Start MongoDB
net start MongoDB

# 2. Seed dữ liệu (lần đầu)
node seedData.js

# 3. Chạy server full
node server.js
```

Tài khoản sau khi seed:
- admin@example.com / admin123
- student@example.com / student123
- alumni@example.com / alumni123
- recruiter@example.com / recruiter123
