# Journey - Personal Journaling App
## Full Stack Setup Guide

### ✅ What's Been Set Up

#### Backend
- **Express.js Server** on port 5000
- **MongoDB Database** integration using Mongoose
- **Authentication System** with JWT tokens and password encryption
- **API Routes**:
  - `POST /api/auth/signup` - User registration
  - `POST /api/auth/signin` - User login
  - `GET /api/auth/me` - Get current user
  - `PUT /api/auth/settings` - Update user settings
  - `PUT /api/auth/customization` - Update journal customization
  - `GET /api/journals` - Get all journals
  - `POST /api/journals` - Create new journal
  - `PUT /api/journals/:id` - Update journal
  - `DELETE /api/journals/:id` - Delete journal
  - `GET /api/entries/journal/:journalId` - Get journal entries
  - `POST /api/entries` - Create entry
  - `PUT /api/entries/:id` - Update entry
  - `DELETE /api/entries/:id` - Delete entry

#### Database Models
- **User Model** - Stores username, email, hashed password, preferences
- **Journal Model** - Stores journal data with references to entries
- **Entry Model** - Stores journal entries with content, mood, tags, media

#### Frontend Integration
- **Authentication** - Sign up and sign in with backend validation
- **Journal Management** - Create, edit, delete journals
- **Entry Management** - Create, edit, delete entries with mood tracking
- **Auto-save** - Entries are saved to database
- **Settings & Customization** - User preferences stored in database

### 📦 Prerequisites

You need MongoDB installed on your computer:

**For Windows:**
1. Download MongoDB Community Edition from: https://www.mongodb.com/try/download/community
2. Run the installer and follow the setup wizard
3. MongoDB will start automatically
4. Default location: `C:\Program Files\MongoDB\Server\7.0` (or latest version)

**To verify MongoDB is running:**
```powershell
# Check if mongod service is running
Get-Service MongoDB
```

### 🚀 How to Run

#### 1. Start MongoDB
MongoDB should start automatically. If not:
```powershell
# Windows
net start MongoDB
```

#### 2. Start the Backend Server
```powershell
cd "c:\Users\subhalakshmi s\OneDrive\Desktop\full stack project"
npm start
```

The server will start on `http://localhost:5000`

You should see:
```
Server running on port 5000
MongoDB connected successfully
```

#### 3. Open the App
Open your browser and go to: `http://localhost:5000`

You'll see:
- Landing page with navigation
- Sign up / Sign in pages
- Dashboard with journal entries

### 📝 Testing the App

**First Time Setup:**
1. Click "Get Started" on the landing page
2. Fill in Sign Up form with:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
3. Click "Sign Up"
4. You'll be directed to the dashboard

**Create a Journal Entry:**
1. On the dashboard, click "+ New Entry"
2. Add a title (e.g., "My First Entry")
3. Write some content in the editor
4. Select a mood (Happy, Sad, etc.)
5. Add tags (comma-separated)
6. Click "Save"

**Create a New Journal:**
1. Click "+ New Journal" button
2. Enter journal name
3. The new journal appears in the left sidebar

### 🔧 Environment Variables

The `.env` file is already configured with:
```
MONGODB_URI=mongodb://localhost:27017/journey-journal
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

**Important:** For production, change the `JWT_SECRET` to a strong random string.

### 💾 Database Info

- **Database Name:** `journey-journal`
- **Collections:**
  - `users` - User accounts and preferences
  - `journals` - Journal collections
  - `entries` - Journal entries

**To view your data in MongoDB:**
```powershell
# Open MongoDB shell
mongosh

# List databases
show dbs

# Use journey-journal database
use journey-journal

# View collections
show collections

# View users
db.users.find()

# View journals
db.journals.find()

# View entries
db.entries.find()
```

### 🛠️ Troubleshooting

**Issue:** "MongoDB connection error"
- Solution: Make sure MongoDB is running (`net start MongoDB` on Windows)

**Issue:** "Address already in use" on port 5000
- Solution: Change PORT in `.env` file or close the app using port 5000

**Issue:** "Token not found" error
- Solution: Make sure you're signed in and the token is saved in localStorage

**Issue:** Entries not showing up
- Solution: Check browser console (F12) for errors. Make sure you have a journal selected.

### 📚 File Structure

```
full stack project/
├── server.js                 # Main Express server
├── app.js                    # Frontend JavaScript (updated)
├── .env                      # Environment variables
├── package.json              # Dependencies
├── models/
│   ├── User.js              # User model
│   ├── Journal.js           # Journal model
│   └── Entry.js             # Entry model
├── controllers/
│   ├── authController.js    # Auth logic
│   ├── journalController.js # Journal logic
│   └── entryController.js   # Entry logic
├── routes/
│   ├── auth.js              # Auth routes
│   ├── journals.js          # Journal routes
│   └── entries.js           # Entry routes
├── middleware/
│   └── auth.js              # JWT authentication
├── uploads/                 # User uploads directory
├── index.html               # Landing page
├── signin.html              # Sign in page
├── signup.html              # Sign up page
├── dashboard.html           # Dashboard
└── styles.css               # Styling
```

### 🔐 Security Notes

- Passwords are hashed with bcryptjs before storage
- JWT tokens expire after 7 days
- All API routes require authentication (except signup/signin)
- Users can only access their own data

### 🎯 Next Features to Add

- [ ] Voice/Video recording
- [ ] File uploads
- [ ] Search functionality
- [ ] Mood charts/analytics
- [ ] Backup/Export functionality
- [ ] Dark mode theme
- [ ] Mobile app
- [ ] Email verification

### ✨ Happy Journaling!

Your full-stack journal app is now ready to use. Start by creating some entries and exploring the features!

---

**Need help?** Check the console (F12) in your browser for error messages.
