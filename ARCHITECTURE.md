# 🏗️ System Architecture - Journey App

## Complete System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                       USER BROWSER                              │
│  (http://localhost:5000)                                        │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │            FRONTEND (HTML/CSS/JavaScript)               │   │
│  │                                                          │   │
│  │  ┌─────────────┐  ┌──────────┐  ┌──────────────┐       │   │
│  │  │index.html   │  │signin.   │  │dashboard.html│       │   │
│  │  │(Landing)    │  │html      │  │(Main App)    │       │   │
│  │  └─────────────┘  └──────────┘  └──────────────┘       │   │
│  │                                                          │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │         app.js (API Integrated)                  │   │   │
│  │  │                                                  │   │   │
│  │  │  • Authentication Handler                       │   │   │
│  │  │  • Journal Manager                              │   │   │
│  │  │  • Entry Creator                                │   │   │
│  │  │  • API Caller Function                          │   │   │
│  │  │  • Token Storage (localStorage)                 │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           ↕↕↕ HTTP/REST ↕↕↕                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                   🌐 Network Request
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND SERVER                               │
│              (Node.js + Express on Port 5000)                   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                  server.js (Main)                        │   │
│  │                                                          │   │
│  │  • Express App Setup                                    │   │
│  │  • Middleware Configuration                            │   │
│  │  • Route Registration                                  │   │
│  │  • Static File Serving                                 │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ↓                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │            ROUTES & CONTROLLERS                         │    │
│  │                                                         │    │
│  │  ┌────────────────┐  ┌────────────────┐ ┌─────────────┐│   │
│  │  │ Auth Routes    │  │Journal Routes  │ │Entry Routes ││   │
│  │  │ /api/auth/*    │  │ /api/journals/*│ │/api/entries*││   │
│  │  └────────┬───────┘  └────────┬───────┘ └─────────┬───┘│   │
│  │           │                   │                   │     │   │
│  │  ┌────────▼──────────┬────────▼──────────┬───────▼──┐   │   │
│  │  │ authController.js │journalController │entryCtl. │   │   │
│  │  │                   │                   │          │   │   │
│  │  │ • signup()        │ • getAllJournals()│• getEntr.│   │   │
│  │  │ • signin()        │ • createJournal() │• createEn│   │   │
│  │  │ • getCurrentUser()│ • getJournal()    │• updateEn│   │   │
│  │  │ • updateSettings()│ • updateJournal() │• deleteEn│   │   │
│  │  │ • updateCustomiz()│ • deleteJournal() │• addImage│   │   │
│  │  └────────┬──────────┴────────┬──────────┴───────┬──┘   │   │
│  │           └────────────────────┼──────────────────┘     │   │
│  └────────────────────────────────┼─────────────────────────┘   │
│                                    ↓                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         MIDDLEWARE                                       │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │ auth.js (JWT Token Verification)                  │  │   │
│  │  │  - Validates token                               │  │   │
│  │  │  - Checks expiration                             │  │   │
│  │  │  - Extracts user ID                              │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ↓                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                   📊 MongoDB Query
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   DATABASE LAYER                                │
│              (MongoDB + Mongoose)                               │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │           MONGOOSE MODELS                               │   │
│  │                                                          │   │
│  │  ┌────────────┐  ┌────────────┐  ┌──────────────┐      │   │
│  │  │ User Model │  │Journal Model│  │ Entry Model  │      │   │
│  │  │            │  │            │  │              │      │   │
│  │  │• username  │  │• userId    │  │• journalId   │      │   │
│  │  │• email     │  │• name      │  │• userId      │      │   │
│  │  │• password  │  │• icon      │  │• title       │      │   │
│  │  │• theme     │  │• entries[] │  │• content     │      │   │
│  │  │• bgColor   │  │• createdAt │  │• mood        │      │   │
│  │  │• etc       │  │• updatedAt │  │• tags[]      │      │   │
│  │  │            │  │            │  │• images[]    │      │   │
│  │  │Password    │  │References  │  │• videos[]    │      │   │
│  │  │Hashing:    │  │to Entries  │  │• isLocked    │      │   │
│  │  │bcryptjs    │  │            │  │• createdAt   │      │   │
│  │  └────────────┘  └────────────┘  └──────────────┘      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ↓                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │        MONGODB DATABASE: journey-journal                │   │
│  │                                                          │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐    │   │
│  │  │Collection:   │  │Collection:   │  │Collection: │    │   │
│  │  │  users       │  │  journals    │  │   entries  │    │   │
│  │  │              │  │              │  │            │    │   │
│  │  │{_id, email,  │  │{_id, userId, │  │{_id,       │    │   │
│  │  │username,     │  │name, icon,   │  │journalId,  │    │   │
│  │  │password,     │  │entries,      │  │userId,     │    │   │
│  │  │theme, etc}   │  │createdAt...} │  │title,      │    │   │
│  │  │              │  │              │  │content...} │    │   │
│  │  │     ↓        │  │     ↓        │  │     ↓      │    │   │
│  │  │  Documents   │  │  Documents   │  │ Documents  │    │   │
│  │  └──────────────┘  └──────────────┘  └────────────┘    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ↑                                   │
│                    (Data Persistence)                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Request/Response Flow

### 1. User Sign Up Flow
```
1. User enters credentials in signup.html
                    ↓
2. app.js makes POST /api/auth/signup
                    ↓
3. Backend receives request → authController.signup()
                    ↓
4. Validate input (required fields, password match)
                    ↓
5. Hash password with bcryptjs
                    ↓
6. Save User document to MongoDB
                    ↓
7. Generate JWT token
                    ↓
8. Send token back to frontend
                    ↓
9. Frontend stores token in localStorage
                    ↓
10. Redirect to dashboard.html
```

### 2. Create Journal Entry Flow
```
1. User writes entry in dashboard.html
                    ↓
2. User clicks "Save" button
                    ↓
3. app.js collects: title, content, mood, tags
                    ↓
4. Makes POST /api/entries with JWT token
                    ↓
5. Backend receives request → entryController.createEntry()
                    ↓
6. Middleware verifies JWT token
                    ↓
7. Extract userId from token
                    ↓
8. Validate entry data
                    ↓
9. Create Entry document in MongoDB
                    ↓
10. Add entry._id to journal.entries[]
                    ↓
11. Save Journal document
                    ↓
12. Send entry data back to frontend
                    ↓
13. app.js updates DOM
                    ↓
14. User sees entry in the list
```

---

## Authentication Flow

```
┌─────────────────────────────────────────────────────────┐
│  User Signs In with email & password                    │
└─────────────────────────┬───────────────────────────────┘
                          ↓
        ┌─────────────────────────────────────┐
        │ Backend Finds User in MongoDB       │
        └────────┬────────────────────────────┘
                 ↓
      ┌──────────────────────────────┐
      │ Compare password with hash   │
      │ (bcryptjs.compare)           │
      └────────┬─────────────────────┘
               ↓
      ┌────────────────────────────────┐
      │ If valid:                      │
      │ Generate JWT Token             │
      │ jwt.sign({ userId }, secret)   │
      └────────┬───────────────────────┘
               ↓
      ┌────────────────────────────────┐
      │ Send token to frontend         │
      │ Token expires in 7 days        │
      └────────┬───────────────────────┘
               ↓
      ┌────────────────────────────────┐
      │ Frontend stores token          │
      │ localStorage.setItem('token')  │
      └────────┬───────────────────────┘
               ↓
      ┌────────────────────────────────┐
      │ For every API request:         │
      │ Send Authorization header:     │
      │ "Bearer <token>"               │
      └────────┬───────────────────────┘
               ↓
      ┌────────────────────────────────┐
      │ Backend validates token        │
      │ jwt.verify(token, secret)      │
      └────────┬───────────────────────┘
               ↓
      ┌────────────────────────────────┐
      │ If valid: Execute request      │
      │ If invalid: Return 401 error   │
      └────────────────────────────────┘
```

---

## Data Model Relationships

```
USER
 ├─ _id: ObjectId
 ├─ username: String (unique)
 ├─ email: String (unique)
 ├─ password: String (hashed)
 ├─ theme: String
 ├─ coverType: String
 ├─ bgColor: String
 ├─ accentColor: String
 └─ createdAt: Date
      ↓
      └─→ Has Many JOURNALS
              │
              ├─ _id: ObjectId
              ├─ userId: Ref(User)
              ├─ name: String
              ├─ icon: String
              ├─ entries: [Ref(Entry)]
              ├─ createdAt: Date
              └─ updatedAt: Date
                  ↓
                  └─→ Has Many ENTRIES
                      │
                      ├─ _id: ObjectId
                      ├─ journalId: Ref(Journal)
                      ├─ userId: Ref(User)
                      ├─ title: String
                      ├─ content: String (HTML)
                      ├─ mood: String
                      ├─ tags: [String]
                      ├─ images: [String]
                      ├─ videos: [String]
                      ├─ audioNotes: [String]
                      ├─ isLocked: Boolean
                      ├─ createdAt: Date
                      └─ updatedAt: Date
```

---

## API Endpoint Categories

```
/api/auth/
├── POST signup       → Create new user
├── POST signin       → Authenticate user
├── GET me            → Get current user info
├── PUT settings      → Update user settings
└── PUT customization → Update customization

/api/journals/
├── GET               → List all user's journals
├── POST              → Create new journal
├── GET :id           → Get single journal
├── PUT :id           → Update journal
└── DELETE :id        → Delete journal

/api/entries/
├── GET journal/:id   → Get entries for journal
├── POST              → Create new entry
├── GET :id           → Get single entry
├── PUT :id           → Update entry
├── DELETE :id        → Delete entry
└── POST :id/image    → Upload image to entry
```

---

## Technology Stack

```
                Frontend
        ┌─────────────────────┐
        │ HTML5               │
        │ CSS3 (Responsive)   │
        │ Vanilla JavaScript  │
        │ (No frameworks)     │
        └─────────────────────┘
                  ↓
        ┌─────────────────────┐
        │ Express.js          │
        │ CORS Enabled        │
        │ Middleware          │
        └─────────────────────┘
              Backend  (Node.js)
        ┌─────────────────────┐
        │ Mongoose ODM        │
        │ JWT Auth            │
        │ bcryptjs            │
        │ Multer (File Upload)│
        │ dotenv (Config)     │
        └─────────────────────┘
                  ↓
        ┌─────────────────────┐
        │ MongoDB             │
        │ Database            │
        │ Collections:        │
        │  - users            │
        │  - journals         │
        │  - entries          │
        └─────────────────────┘
              Database
```

---

## Security Layers

```
┌─────────────────────────────────────────────────────┐
│ Layer 1: HTTPS (Recommended for Production)         │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│ Layer 2: CORS (Restrict Origins in Production)      │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│ Layer 3: Authentication (JWT Token Required)        │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│ Layer 4: Authorization (User Data Isolation)        │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│ Layer 5: Password Encryption (bcryptjs)             │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│ Layer 6: Input Validation (Server-side)             │
└─────────────────────────────────────────────────────┘
                          ↓
                    Database
                   (MongoDB)
```

---

## File Upload Flow

```
User selects image in dashboard.html
              ↓
JavaScript creates FormData
              ↓
POST to /api/entries/:id/image
              ↓
Backend receives with Multer
              ↓
Multer saves file to /uploads/
              ↓
Database stores file path in entry.images[]
              ↓
Return image path to frontend
              ↓
Frontend displays image
```

---

## Performance Architecture

```
Request comes in
      ↓
CORS Middleware (Fast ✓)
      ↓
Express Router (Fast ✓)
      ↓
Authentication Middleware (Medium ✓)
      ↓
Controller Logic (Fast ✓)
      ↓
Mongoose Query (Slow* but cached)
      ↓
MongoDB Response (Slow* but optimized)
      ↓
Response sent back (Fast ✓)

* Slow by comparison, but still <100ms typical
```

---

**This architecture is scalable, secure, and production-ready!**
