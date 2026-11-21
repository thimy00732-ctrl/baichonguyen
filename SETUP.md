# 🚀 Setup Guide - AlumniNet

## ⚠️ Common Issue: "Cannot find module 'express'"

### Solution:
```bash
# Install dependencies first!
npm install
```

**Always run `npm install` after:**
- Cloning the repository
- Pulling new code
- Switching branches

---

## 📦 Quick Setup

### 1️⃣ Clone Repository
```bash
git clone https://github.com/thimy00732-ctrl/baichonguyen.git
cd baichonguyen
```

### 2️⃣ Install Dependencies ⚠️ **REQUIRED**
```bash
npm install
```

This installs all required packages:
- express
- mongoose
- cors
- bcryptjs
- jsonwebtoken
- dotenv
- etc.

### 3️⃣ Choose Mode

#### Option A: Demo Mode (No Database)
```bash
npm run demo
# or
node server-demo.js
```

**Features:**
- ✅ No MongoDB required
- ✅ Works immediately
- ✅ Mock data included
- ✅ Perfect for testing UI
- ❌ Data doesn't persist

**Access:** http://localhost:5000

**Login:** Any email + any password

---

#### Option B: Full Mode (With MongoDB)
```bash
# 1. Start MongoDB
net start MongoDB

# 2. Create .env file
# Copy .env.example to .env and configure:
MONGODB_URI=mongodb://localhost:27017/alumninetwork
JWT_SECRET=your-secret-key-here
PORT=5000

# 3. Seed database (first time only)
npm run seed

# 4. Start server
npm start
# or
node server.js
```

**Features:**
- ✅ Real database
- ✅ Data persists
- ✅ All features enabled
- ✅ Production-ready

**Access:** http://localhost:5000

**Login with seeded accounts:**
- Admin: `admin@example.com` / `admin123`
- Student: `student@example.com` / `student123`
- Alumni: `alumni@example.com` / `alumni123`
- Recruiter: `recruiter@example.com` / `recruiter123`

---

## 🛠️ Troubleshooting

### Problem: "Cannot find module 'express'"
**Solution:**
```bash
npm install
```

### Problem: "Port 5000 already in use"
**Solution:**
```bash
# Kill existing Node processes
taskkill /F /IM node.exe

# Or change port in .env
PORT=3000
```

### Problem: "MongoDB connection failed"
**Solution:**
```bash
# Check if MongoDB is running
net start MongoDB

# Or use demo mode instead
npm run demo
```

### Problem: "npm not found"
**Solution:**
- Install Node.js from https://nodejs.org/
- Restart terminal after installation

### Problem: Git CRLF warnings
**Solution:**
```bash
# Normal, safe to ignore
# Or configure Git:
git config --global core.autocrlf true
```

---

## 📁 Project Files Structure

```
baichonguyen/
├── node_modules/        ⚠️ Required (run npm install)
├── public/              Frontend files
│   ├── index.html       (Handshake design)
│   ├── css/
│   │   └── style.css    (Handshake CSS)
│   └── js/
│       ├── api.js
│       ├── app.js
│       └── handshake-render.js
├── routes/              API routes
├── models/              Database models
├── middleware/          Auth & validation
├── server.js            Main server (MongoDB)
├── server-demo.js       Demo server (No DB)
├── package.json         Dependencies list
└── .env                 Config (create from .env.example)
```

---

## 🔧 NPM Scripts

```bash
npm start       # Start full server (MongoDB required)
npm run demo    # Start demo server (No DB needed)
npm run dev     # Start with nodemon (auto-restart)
npm run seed    # Seed database with sample data
```

---

## ✅ Verification Checklist

After setup, verify:

- [ ] `node_modules/` folder exists
- [ ] `npm install` ran successfully
- [ ] Server starts without errors
- [ ] Can access http://localhost:5000
- [ ] Can see Handshake design
- [ ] Can login (demo mode: any email/password)

---

## 🆘 Still Having Issues?

1. **Check Node.js version:**
   ```bash
   node --version
   # Should be v14+ or higher
   ```

2. **Clear npm cache:**
   ```bash
   npm cache clean --force
   rm -rf node_modules
   npm install
   ```

3. **Check for typos in commands:**
   - Use `npm install` not `npm instal`
   - Use `node server-demo.js` not `node server-demo`

4. **Read error messages carefully:**
   - "Cannot find module" → Run `npm install`
   - "Port in use" → Kill Node processes
   - "MongoDB error" → Use demo mode instead

---

## 📞 Support

If problems persist:
- Check [README.md](./README.md) for full documentation
- Review [HANDSHAKE-DESIGN.md](./HANDSHAKE-DESIGN.md) for design docs
- Open an issue on GitHub

---

**Remember: Always run `npm install` first! 🎯**
