# Journey - Personal Journaling App

A full-stack journaling application with user authentication, database integration, and real-time journal entry management.

## ✨ Features

### ✅ Completed Features
- **User Authentication** - Secure sign up/sign in with JWT tokens
- **Database Integration** - MongoDB with Mongoose ODM
- **Journal Management** - Create, update, delete multiple journals
- **Entry Management** - Create, edit, and delete journal entries
- **Mood Tracking** - Tag entries with emotional state (happy, sad, calm, etc.)
- **Customization** - Personalize journal themes and colors
- **Settings** - User preferences and account management
- **Responsive Design** - Beautiful UI that works on all devices

### 🚀 Quick Start

**Prerequisites:**
- Node.js installed
- MongoDB installed (Windows: Download from https://www.mongodb.com)

**1. Start MongoDB:**
```powershell
net start MongoDB
```

**2. Start the Server:**
```powershell
cd "c:\Users\subhalakshmi s\OneDrive\Desktop\full stack project"
npm start
```

**3. Open in Browser:**
Go to `http://localhost:5000`

## 📁 Project Structure

```
full stack project/
├── server.js                 # Express server
├── app.js                    # Frontend JavaScript (API integrated)
├── .env                      # Environment variables
├── package.json              # Dependencies
├── models/                   # Database models
│   ├── User.js
│   ├── Journal.js
│   └── Entry.js
├── controllers/              # Business logic
│   ├── authController.js
│   ├── journalController.js
│   └── entryController.js
├── routes/                   # API routes
│   ├── auth.js
│   ├── journals.js
│   └── entries.js
├── middleware/
│   └── auth.js               # JWT authentication
├── uploads/                  # User file uploads
├── index.html                # Landing page
├── signin.html               # Sign in page
├── signup.html               # Sign up page
├── dashboard.html            # Main dashboard
├── styles.css                # Styling
└── SETUP.md                  # Detailed setup guide
```

## 🔐 Authentication

- Passwords hashed with bcryptjs
- JWT tokens for session management
- All API routes require authentication
- Users can only access their own data

## 📚 API Endpoints

**Auth:**
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/settings` - Update settings
- `PUT /api/auth/customization` - Update journal customization

**Journals:**
- `GET /api/journals` - Get all user journals
- `POST /api/journals` - Create journal
- `PUT /api/journals/:id` - Update journal
- `DELETE /api/journals/:id` - Delete journal

**Entries:**
- `GET /api/entries/journal/:journalId` - Get journal entries
- `POST /api/entries` - Create entry
- `PUT /api/entries/:id` - Update entry
- `DELETE /api/entries/:id` - Delete entry

## 💾 Database

**MongoDB Database:** `journey-journal`

**Collections:**
- `users` - User accounts and settings
- `journals` - User journals
- `entries` - Journal entries with mood, tags, and content

## 📖 Usage Guide

1. **Sign Up** - Create a new account
2. **Create Journal** - Click "+ New Journal" to create custom journals
3. **Write Entry** - Click "+ New Entry" to write journal entries
4. **Tag Mood** - Select mood while writing entries
5. **Customize** - Click 🎨 to customize journal appearance
6. **Save & Auto-sync** - Entries automatically sync with database

## ⚙️ Environment Variables

```
MONGODB_URI=mongodb://localhost:27017/journey-journal
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

## 🛠️ Development

**Available Scripts:**
```bash
npm start      # Start production server
npm run dev    # Start with nodemon (auto-reload)
```

## 📖 For More Details

See **SETUP.md** for:
- Detailed MongoDB installation
- Testing the app
- Troubleshooting
- Security information
- Future features roadmap

## 🎯 Next Features

- [ ] Voice/video recording
- [ ] Image uploads with gallery
- [ ] Mood analytics charts
- [ ] Export entries as PDF
- [ ] Dark mode theme
- [ ] Search functionality
- [ ] Mobile app

## 📝 Notes

- All form submissions now connect to the backend
- Entries are persisted in MongoDB
- User data is secure and authenticated
- Real-time dashboard updates

---

**Happy Journaling! 📔✨**

