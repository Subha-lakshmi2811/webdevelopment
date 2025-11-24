# 🚀 Quick Start Guide - Journey App

## Status: ✅ FULLY CONNECTED

Your full-stack journaling app is now fully operational with:
- ✅ Backend API running on port 5000
- ✅ MongoDB database connected
- ✅ Frontend integrated with backend
- ✅ User authentication (Sign up/Sign in)
- ✅ Journal management
- ✅ Entry management with mood tracking

---

## 🎯 How to Use

### Starting the App

**Option 1: Quick Start Script (Easiest)**
```powershell
# Run the start.bat file in the project folder
.\start.bat
```

**Option 2: Manual Start**
```powershell
# Make sure MongoDB is running
net start MongoDB

# Navigate to project folder
cd "c:\Users\subhalakshmi s\OneDrive\Desktop\full stack project"

# Start the server
npm start

# Open in browser
http://localhost:5000
```

---

## 📝 Testing the App Step by Step

### 1. Sign Up
1. Go to `http://localhost:5000`
2. Click "Get Started" or "Sign Up"
3. Fill in:
   - **Username:** testuser
   - **Email:** test@example.com
   - **Password:** password123
   - **Confirm Password:** password123
4. Click "Sign Up"
5. You'll be logged in and redirected to dashboard

### 2. Create a Journal Entry
1. On the dashboard, click **"+ New Entry"**
2. Fill in:
   - **Title:** "My First Entry" (or any title)
   - **Content:** Write something in the editor
   - **Mood:** Select from dropdown (Happy, Sad, Calm, etc.)
   - **Tags:** "personal, diary" (comma-separated, optional)
3. Click **"Save"**
4. Entry appears in the journal list

### 3. Create a New Journal
1. Click **"+ New Journal"** button on left sidebar
2. Enter name: "Travel Diary" (or any name)
3. Click OK
4. New journal appears in the sidebar

### 4. Edit an Entry
1. Click on any entry card in the list
2. The entry opens in the editor
3. Make changes
4. Click "Save"

### 5. Customize Your Journal
1. Click **"🎨 Customize"** button
2. Choose:
   - Cover type (leather, wood, marble, fabric)
   - Background color
   - Accent color
3. Click "Save Changes"

---

## 📊 Behind the Scenes

### What Happens When You Create an Entry:

```
1. Frontend (app.js)
   ↓
2. Sends POST request to /api/entries
   ↓
3. Backend (entryController.js)
   - Validates the request
   - Checks user authentication
   ↓
4. MongoDB Database
   - Saves entry to collection
   - Links entry to journal
   ↓
5. Response sent back to frontend
   ↓
6. Page updates with new entry
```

---

## 🔑 Key Features Implemented

### Authentication
- Users create secure accounts
- Passwords are encrypted (bcryptjs)
- JWT tokens for session management
- Auto-logout when token expires (7 days)

### Database
- **MongoDB** stores all data
- **Collections:**
  - `users` - User accounts
  - `journals` - Journal collections
  - `entries` - Journal entries
- Data persists even after closing the app

### API Endpoints
All endpoints require authentication (JWT token)

**User Auth:**
- `POST /api/auth/signup` - Create account
- `POST /api/auth/signin` - Login
- `GET /api/auth/me` - Get profile
- `PUT /api/auth/settings` - Update settings

**Journals:**
- `GET /api/journals` - List all journals
- `POST /api/journals` - Create journal
- `PUT /api/journals/:id` - Edit journal
- `DELETE /api/journals/:id` - Delete journal

**Entries:**
- `GET /api/entries/journal/:id` - List entries
- `POST /api/entries` - Create entry
- `PUT /api/entries/:id` - Edit entry
- `DELETE /api/entries/:id` - Delete entry

---

## 🛠️ Troubleshooting

### Problem: "MongoDB connection error"
**Solution:**
```powershell
# Start MongoDB service
net start MongoDB

# Verify it's running
Get-Service MongoDB | Select Status
```

### Problem: "Address already in use" on port 5000
**Solution:**
```powershell
# Kill the process using port 5000
netstat -ano | findstr :5000
taskkill /PID [PID_NUMBER] /F

# Or change PORT in .env file
```

### Problem: Can't login or create account
1. Check browser console (Press F12)
2. Look for error messages
3. Make sure MongoDB is running
4. Check that server shows "MongoDB connected successfully"

### Problem: Entries not showing up
1. Make sure you're logged in (token in localStorage)
2. Select a journal first
3. Check browser console for errors
4. Try refreshing the page

---

## 📁 File Locations

**Backend Files:**
- `server.js` - Main server file
- `models/` - Database models
- `controllers/` - Business logic
- `routes/` - API endpoints
- `middleware/` - Authentication

**Frontend Files:**
- `app.js` - Updated with API calls
- `index.html` - Landing page
- `signin.html` - Sign in page
- `signup.html` - Sign up page
- `dashboard.html` - Main app
- `styles.css` - Styling

**Config Files:**
- `.env` - Environment variables
- `package.json` - Dependencies

---

## 💾 Viewing Your Data

To see what's stored in MongoDB:

```powershell
# Open MongoDB shell
mongosh

# List databases
show dbs

# Use journey-journal database
use journey-journal

# View all users
db.users.find().pretty()

# View all journals
db.journals.find().pretty()

# View all entries
db.entries.find().pretty()

# Find specific user
db.users.findOne({ email: "test@example.com" })

# Count entries
db.entries.countDocuments()
```

---

## 🔐 Security Info

- ✅ Passwords encrypted with bcryptjs
- ✅ JWT tokens for authentication
- ✅ Users can only see their own data
- ✅ All API routes protected
- ⚠️ Change JWT_SECRET in .env for production

---

## 📈 Performance Tips

- Close other apps using MongoDB
- Don't open too many browser tabs
- Clear browser cache if you see stale data
- Use Incognito mode for testing multiple accounts

---

## 🎓 What You Learned

You now have a full-stack application with:
1. **Frontend** - HTML, CSS, JavaScript with API integration
2. **Backend** - Express.js REST API
3. **Database** - MongoDB for data persistence
4. **Security** - Authentication and authorization
5. **Architecture** - Model-Controller-Route pattern (MVC)

---

## ✨ Next Steps

1. **Test all features** - Try creating multiple journals and entries
2. **Explore the data** - Use MongoDB shell to view database
3. **Add more features** - Voice recording, file uploads, etc.
4. **Deploy** - Deploy to cloud (Heroku, AWS, etc.)
5. **Mobile app** - Build React Native version

---

## 📞 Support

If something doesn't work:
1. Check the browser console (F12)
2. Check terminal output where server is running
3. Verify MongoDB is running (`Get-Service MongoDB`)
4. Restart the server
5. Check SETUP.md for more details

---

**Your app is ready to use! 🎉**

Start journaling now at: `http://localhost:5000`
