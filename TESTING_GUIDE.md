# 🔍 Testing & Troubleshooting Guide

## ✅ Verification Checklist

### Server Status
- [ ] MongoDB service is running (`Get-Service MongoDB`)
- [ ] Express server started (`npm start`)
- [ ] Console shows "Server running on port 5000"
- [ ] Console shows "MongoDB connected successfully"

### Frontend Access
- [ ] Can open `http://localhost:5000` in browser
- [ ] Landing page loads with all styling
- [ ] Navigation buttons work
- [ ] Can click through pages without errors

### Database Connection
- [ ] MongoDB shell connects (`mongosh`)
- [ ] Database `journey-journal` exists
- [ ] Collections are created after first signup

### Authentication
- [ ] Can create new account
- [ ] Can login with created account
- [ ] Token is stored in localStorage
- [ ] Logout clears the token

### Journal Management
- [ ] Can create new journal
- [ ] Can see journal in sidebar
- [ ] Can select journal to view entries
- [ ] Can delete journal

### Entry Management
- [ ] Can create new entry
- [ ] Entry appears in list
- [ ] Can edit existing entry
- [ ] Can delete entry
- [ ] Mood selection works
- [ ] Tags are saved
- [ ] Data persists after page refresh

---

## 🧪 Testing Guide

### Test 1: User Registration
```
1. Go to http://localhost:5000
2. Click "Get Started" → Sign Up
3. Enter:
   Username: testuser1
   Email: test1@example.com
   Password: Password@123
   Confirm: Password@123
4. Click "Sign Up"
5. Verify: Redirected to dashboard
6. Verify: Logged in successfully
```

**Expected Result:** ✅ Account created, logged in automatically

### Test 2: User Login
```
1. From dashboard, click Logout
2. Click Sign In
3. Enter:
   Email: test1@example.com
   Password: Password@123
4. Click "Sign In"
5. Verify: Logged in successfully
```

**Expected Result:** ✅ Able to log in with saved credentials

### Test 3: Create Journal
```
1. On dashboard, click "+ New Journal"
2. Enter: "Travel Journal"
3. Click OK
4. Verify: New journal appears in sidebar
5. Verify: Journal is selected automatically
```

**Expected Result:** ✅ Journal created and displayed

### Test 4: Create Entry
```
1. On dashboard, click "+ New Entry"
2. Fill in:
   Title: "First Day in Paris"
   Content: "Arrived today. City is beautiful!"
   Mood: 🤩 Excited
   Tags: paris, travel
3. Click "Save"
4. Verify: Entry appears in the list
5. Refresh page
6. Verify: Entry still there (persisted)
```

**Expected Result:** ✅ Entry created and persisted in database

### Test 5: Edit Entry
```
1. Click on an existing entry
2. Modify title and content
3. Change mood
4. Click "Save"
5. Close editor
6. Verify: Changes are reflected in the list
```

**Expected Result:** ✅ Entry updated successfully

### Test 6: Delete Entry
```
1. Create a new entry (e.g., "Delete Me")
2. Click on the entry to open editor
3. (Note: Delete button may need to be added)
4. Verify: Entry removed from list
```

**Expected Result:** ✅ Entry deleted successfully

### Test 7: Switch Journals
```
1. Create two journals: "Journal A", "Journal B"
2. In Journal A, create 2 entries
3. In Journal B, create 3 entries
4. Click on Journal A
5. Verify: Only 2 entries shown
6. Click on Journal B
7. Verify: 3 entries shown
```

**Expected Result:** ✅ Entries correctly filtered by journal

### Test 8: Multiple Users
```
1. Sign up: User1 (user1@test.com)
2. Create entry in User1's journal
3. Logout
4. Sign up: User2 (user2@test.com)
5. Verify: User2 sees empty journals
6. Create entry in User2's journal
7. Logout and login as User1
8. Verify: User1 only sees their entries
```

**Expected Result:** ✅ User data isolated correctly

### Test 9: Token Verification
```
1. Open DevTools (F12)
2. Go to Application → LocalStorage
3. Find 'token' entry
4. Verify: Token is long JWT string
5. Copy token
6. Logout
7. Manually paste token back
8. Refresh
9. Verify: Still logged in (if token still valid)
```

**Expected Result:** ✅ Token present and valid

### Test 10: Customization
```
1. Click "🎨 Customize"
2. Change:
   - Cover: "Leather"
   - Background: Pick a color
   - Accent: Pick a color
3. Click "Save Changes"
4. Verify: Settings saved
5. Logout and login
6. Verify: Settings persisted
```

**Expected Result:** ✅ Customization saved to database

---

## 🐛 Common Issues & Solutions

### Issue 1: "MongoDB connection error"
**Error Message:**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solutions:**
```powershell
# Check if MongoDB service is running
Get-Service MongoDB

# If not running, start it
net start MongoDB

# Verify it's listening
netstat -ano | findstr :27017

# If still failing, restart the service
net stop MongoDB
net start MongoDB
```

---

### Issue 2: "Address already in use :5000"
**Error Message:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**
```powershell
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual number)
taskkill /PID 12345 /F

# Or change PORT in .env file
# Edit .env and change: PORT=5001

# Then restart server
npm start
```

---

### Issue 3: "Cannot find module 'express'"
**Error Message:**
```
Cannot find module 'express'
```

**Solutions:**
```powershell
# Install dependencies
npm install

# Verify installation
npm list

# If still failing, clear and reinstall
rm -r node_modules
npm install
```

---

### Issue 4: "Entries not showing up"
**Symptoms:**
- Created entry but doesn't appear in list
- Page shows "No entries yet"

**Solutions:**
```
1. Verify you're logged in (check localStorage token)
2. Make sure a journal is selected
3. Open DevTools (F12) → Console
4. Look for error messages
5. Check that entryCount is updating
6. Try refreshing the page
7. Check MongoDB:
   - Open mongosh
   - use journey-journal
   - db.entries.find().pretty()
```

---

### Issue 5: "Login not working"
**Symptoms:**
- Form submits but nothing happens
- Stay on signin page

**Solutions:**
```
1. Check console (F12) for errors
2. Verify MongoDB is running
3. Verify server shows "MongoDB connected"
4. Try creating account first (test if signup works)
5. Check that email exists: mongosh → use journey-journal → db.users.find()
6. Verify password is correct
7. Check browser network tab for failed requests
```

---

### Issue 6: "Cannot POST /api/entries"
**Error Message:**
```
404 Not Found: Cannot POST /api/entries
```

**Solutions:**
```
1. Check server terminal - all routes should load
2. Verify routes/entries.js exists
3. Verify server.js has: app.use('/api/entries', require('./routes/entries'))
4. Restart the server
5. Check for typos in route paths
```

---

### Issue 7: "Invalid token" error
**Symptoms:**
- Logged in but can't create entries
- All API calls return 401

**Solutions:**
```
1. Token might be expired (lasts 7 days)
2. Logout and login again to get new token
3. Check token in localStorage (F12 → Application)
4. Verify token hasn't been modified
5. Clear localStorage and login again:
   - localStorage.clear()
   - Refresh page
   - Login again
```

---

### Issue 8: "Cannot find uploads directory"
**Error Message:**
```
Error: ENOENT: no such file or directory, open 'uploads/...'
```

**Solutions:**
```powershell
# Create uploads directory
mkdir uploads

# Or from Node:
# The app should create it automatically

# Verify it exists
ls -la uploads
```

---

### Issue 9: "CORS error"
**Error Message:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solutions:**
- CORS is already enabled in server.js
- If still failing, check:
  1. Server is running
  2. API_BASE in app.js is correct: `http://localhost:5000/api`
  3. Headers are correct: `'Content-Type': 'application/json'`

---

### Issue 10: "Nodemon not reloading"
**Symptoms:**
- Make changes but they don't take effect
- Have to manually restart server

**Solutions:**
```powershell
# Make sure using dev mode
npm run dev

# Not production mode
# npm start

# Check nodemon installed
npm list nodemon

# If not installed
npm install --save-dev nodemon
```

---

## 🔧 Debug Mode

### Enable Detailed Logging

**In server.js, add at top:**
```javascript
const morgan = require('morgan');
// You need: npm install morgan
app.use(morgan('tiny'));
```

**In app.js, add in apiCall function:**
```javascript
console.log('API Call:', method, endpoint, body);
// ... after response:
console.log('API Response:', data);
```

**In browser console (F12):**
```javascript
// View all requests
fetch('http://localhost:5000/api/journals', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
}).then(r => r.json()).then(console.log)
```

---

## 📊 Database Inspection

### View All Data
```powershell
mongosh

use journey-journal

# See all users
db.users.find().pretty()

# See all journals
db.journals.find().pretty()

# See all entries
db.entries.find().pretty()

# Count entries
db.entries.countDocuments()

# Find specific user
db.users.findOne({ email: "test@example.com" })

# Find user's journals
db.journals.find({ userId: ObjectId("USER_ID") }).pretty()

# Find user's entries
db.entries.find({ userId: ObjectId("USER_ID") }).pretty()
```

### Clear Database
```powershell
# WARNING: This deletes all data!
mongosh

use journey-journal

# Delete all documents
db.users.deleteMany({})
db.journals.deleteMany({})
db.entries.deleteMany({})

# Verify empty
db.users.countDocuments()
```

---

## 📈 Performance Testing

### Check Response Times
```javascript
// In browser console:
async function testAPI() {
  const start = performance.now();
  const response = await fetch('http://localhost:5000/api/journals', {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  const end = performance.now();
  console.log(`Request took ${end - start}ms`);
  return response.json();
}
testAPI();
```

### Expected Response Times:
- Login: 50-100ms
- Get Journals: 30-50ms
- Create Entry: 100-150ms
- Get Entries: 30-50ms

If slower, check:
1. MongoDB is running smoothly
2. No other processes using resources
3. Network connectivity

---

## ✅ Final Verification

Run this complete test:
```
1. Start MongoDB: net start MongoDB
2. Start server: npm start
3. Open browser: http://localhost:5000
4. Complete Test 1-10 from above
5. Check all pass ✅
6. Check console for no errors
7. Check terminal for no errors
```

If all pass: **Your app is working perfectly! 🎉**

---

## 📞 Getting Help

If something isn't working:

1. **Check Server Terminal**
   - Is server running?
   - Are there error messages?
   - Is MongoDB connected?

2. **Check Browser Console (F12)**
   - Any JavaScript errors?
   - Network tab: are requests going through?
   - Storage tab: is token present?

3. **Check MongoDB**
   ```powershell
   mongosh
   use journey-journal
   show collections
   db.users.countDocuments()
   ```

4. **Restart Everything**
   ```powershell
   # Stop server (Ctrl+C)
   # Stop MongoDB: net stop MongoDB
   # Start MongoDB: net start MongoDB
   # Start server: npm start
   ```

5. **Review Logs**
   - Check terminal output
   - Check browser console
   - Check Network tab in DevTools

---

**If all else fails: Provide us with:**
- Error message (exact text)
- Steps to reproduce
- Which OS/browser
- Server terminal output
- Browser console output

Then we can help debug! 🛠️
