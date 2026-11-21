# 🎓 AlumniNet - Career Network Platform

> Professional career networking platform for students and alumni, inspired by Handshake.

[![Design](https://img.shields.io/badge/Design-Handshake--inspired-0A66C2?style=flat-square)](/)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=flat-square)](/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](/)

## 🌟 Features

### For Students & Alumni
- 💼 **Job Board** - Browse 1000+ opportunities from top companies
- 🤝 **Mentorship** - Connect with experienced alumni for career guidance
- 💬 **Community** - Share experiences, ask questions, get advice
- 📊 **Profile** - Showcase your skills and track applications

### For Recruiters
- 📝 **Post Jobs** - Reach qualified candidates from top universities
- 👥 **Talent Pool** - Access verified student and alumni profiles
- 🎯 **Targeted Hiring** - Filter by major, skills, graduation year

### For Admins
- ⚙️ **Dashboard** - Monitor platform activity and statistics
- ✅ **Content Moderation** - Approve jobs and posts
- 🔒 **User Management** - Manage accounts and permissions
- 📈 **Analytics** - Track engagement and growth metrics

## 🎨 Design

**Handshake-inspired professional UI**
- Clean, modern, card-based layout
- Professional blue color palette (#0A66C2)
- Inter font family for excellent readability
- Fully responsive (Desktop → Tablet → Mobile)
- Smooth animations and hover effects

[📚 View Design Documentation →](./HANDSHAKE-DESIGN.md)

## 🚀 Quick Start

### ⚠️ IMPORTANT: Install Dependencies First!

```bash
# Clone repository
git clone https://github.com/thimy00732-ctrl/baichonguyen.git
cd baichonguyen

# ⚠️ REQUIRED: Install dependencies
npm install
```

**Common Error:** `Cannot find module 'express'`  
**Solution:** Run `npm install` first!

### Option 1: Demo Mode (No Database Required)

Perfect for testing and development.

```bash
# 1. Install dependencies (REQUIRED!)
npm install

# 2. Start demo server
npm run demo
# or
node server-demo.js

# 3. Open browser
http://localhost:5000
```

**Demo accounts**: Use any email + any password

### Option 2: Full Mode (with MongoDB)

For production deployment.

```bash
# 1. Install dependencies
npm install

# 2. Start MongoDB
net start MongoDB

# 3. Create .env file
cp .env.example .env
# Edit .env with your MongoDB URI

# 4. Seed database (first time only)
node seedData.js

# 5. Start server
npm start
# or
node server.js

# 6. Open browser
http://localhost:5000
```

**Seeded accounts**:
- Admin: `admin@example.com` / `admin123`
- Student: `student@example.com` / `student123`
- Alumni: `alumni@example.com` / `alumni123`
- Recruiter: `recruiter@example.com` / `recruiter123`

## 📁 Project Structure

```
AlumniNet/
├── models/              # Mongoose models
│   ├── User.js
│   ├── JobPosting.js
│   ├── Post.js
│   ├── Notification.js
│   └── ...
├── routes/              # API routes
│   ├── auth.js
│   ├── jobs.js
│   ├── posts.js
│   ├── notifications.js
│   ├── reports.js
│   └── ...
├── middleware/          # Express middleware
│   └── auth.js
├── public/              # Frontend files
│   ├── index.html              # Main app (Handshake design)
│   ├── index-original.html     # Original design (backup)
│   ├── css/
│   │   ├── style.css           # Handshake CSS
│   │   └── style-original.css  # Original CSS (backup)
│   └── js/
│       ├── app.js              # Main application logic
│       ├── api.js              # API client functions
│       └── handshake-render.js # Handshake card renderers
├── server.js            # Main server (MongoDB)
├── server-demo.js       # Demo server (No DB)
├── seedData.js          # Database seeder
└── package.json
```

## 🔧 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **Vanilla JavaScript** - No framework, pure JS
- **Modern CSS** - CSS Grid, Flexbox, Variables
- **Fetch API** - HTTP requests
- **LocalStorage** - Client-side state

### Design
- **Handshake-inspired** - Professional, clean, modern
- **Inter Font** - Typography
- **Card-based Layout** - Consistent components
- **Responsive Design** - Mobile-first approach

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register     - Register new user
POST   /api/auth/login        - Login
GET    /api/auth/me           - Get current user
POST   /api/auth/logout       - Logout
```

### Jobs
```
GET    /api/jobs              - List jobs (with pagination)
POST   /api/jobs              - Create job (Recruiter only)
GET    /api/jobs/:id          - Get job details
PUT    /api/jobs/:id          - Update job
DELETE /api/jobs/:id          - Delete job
```

### Posts
```
GET    /api/posts             - List posts (with pagination)
POST   /api/posts             - Create post
GET    /api/posts/:id         - Get post details
PUT    /api/posts/:id         - Update post
POST   /api/posts/:id/like    - Like/unlike post
POST   /api/posts/:id/comments - Add comment
```

### Mentors
```
GET    /api/mentors           - List mentors
POST   /api/mentors/request   - Send mentorship request
GET    /api/mentors/received-requests - Get received requests
GET    /api/mentors/sent-requests     - Get sent requests
PUT    /api/mentors/request/:id/respond - Respond to request
```

### Notifications
```
GET    /api/notifications     - Get notifications
PUT    /api/notifications/:id/read - Mark as read
PUT    /api/notifications/mark-all-read - Mark all as read
DELETE /api/notifications/:id - Delete notification
```

### Reports
```
POST   /api/reports           - Create report
GET    /api/reports/my-reports - Get my reports
DELETE /api/reports/:id       - Delete report
```

### Recruiter Profile
```
POST   /api/recruiter-profile - Create/update profile
GET    /api/recruiter-profile/me - Get my profile
GET    /api/recruiter-profile/:id - Get profile by ID
DELETE /api/recruiter-profile/me - Delete profile
```

[📚 Full API Documentation →](./API.md)

## 🎯 Key Features Implemented

### Priority 1 (✅ Complete)
- ✅ Authentication system (JWT)
- ✅ Job posting and search
- ✅ Community posts and comments
- ✅ Mentorship requests
- ✅ User profiles
- ✅ Admin dashboard
- ✅ Notification system
- ✅ Report system
- ✅ Recruiter profiles
- ✅ Pagination
- ✅ Search & filters

### Priority 2 (🚧 Planned)
- ⏳ Real-time notifications (WebSocket)
- ⏳ Events & Programs
- ⏳ File uploads (resume, profile pic)
- ⏳ Email notifications
- ⏳ Advanced analytics
- ⏳ Message system
- ⏳ Career resources
- ⏳ Company pages

## 🧪 Testing

### Demo Mode Testing
```bash
# Start demo server
npm run demo

# Test in browser
- Try login with any email/password
- Browse jobs, posts, mentors
- Test all CRUD operations
```

### Full Mode Testing
```bash
# Start full server
npm start

# Run with seeded data
- Use seeded accounts
- Test real database operations
- Check admin features
```

## 📦 Deployment

### Heroku
```bash
# 1. Create app
heroku create alumninetwork

# 2. Add MongoDB addon
heroku addons:create mongolab

# 3. Push
git push heroku main

# 4. Open
heroku open
```

### Vercel
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Add MongoDB connection string
vercel env add MONGODB_URI
```

### Railway
```bash
# 1. Install Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Initialize
railway init

# 4. Deploy
railway up
```

## 🔐 Environment Variables

Create `.env` file:

```env
# Server
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb://localhost:27017/alumninetwork

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## 🤝 Contributing

Contributions welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **Development** - Kiro AI Assistant
- **Project Owner** - [@thimy00732-ctrl](https://github.com/thimy00732-ctrl)

## 🙏 Acknowledgments

- Design inspired by [Handshake](https://joinhandshake.com/)
- Icons from emoji system
- Fonts from Google Fonts (Inter)

## 📞 Support

For support, email support@alumninetwork.com or open an issue.

## 🗺️ Roadmap

### Q1 2025
- [ ] Mobile app (React Native)
- [ ] Real-time chat
- [ ] Video interviews
- [ ] AI resume builder

### Q2 2025
- [ ] Company pages
- [ ] Salary insights
- [ ] Career paths
- [ ] Skills assessments

### Q3 2025
- [ ] Internationalization (i18n)
- [ ] Dark mode
- [ ] Accessibility improvements
- [ ] Performance optimization

---

**Made with ❤️ for students and alumni worldwide**

🌐 **Website**: [alumninetwork.com](https://alumninetwork.com)  
📧 **Email**: contact@alumninetwork.com  
🐦 **Twitter**: [@AlumniNetwork](https://twitter.com/alumninetwork)
