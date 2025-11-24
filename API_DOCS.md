# API Documentation - Journey App

## Base URL
```
http://localhost:5000/api
```

## Authentication
All requests (except signup and signin) require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Sign Up
Create a new user account.

**Endpoint:** `POST /auth/signup`

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "confirmPassword": "securePassword123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "User already exists"
}
```

---

### Sign In
Authenticate user and get JWT token.

**Endpoint:** `POST /auth/signin`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Sign in successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

---

### Get Current User
Get the current logged-in user information.

**Endpoint:** `GET /auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "theme": "default",
    "coverType": "default",
    "bgColor": "#ffffff",
    "accentColor": "#6366f1",
    "createdAt": "2025-01-15T10:30:00Z"
  }
}
```

---

### Update Settings
Update user account settings.

**Endpoint:** `PUT /auth/settings`

**Request Body:**
```json
{
  "username": "john_doe_new",
  "theme": "dark"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Settings updated",
  "user": { /* updated user object */ }
}
```

---

### Update Customization
Update journal customization settings.

**Endpoint:** `PUT /auth/customization`

**Request Body:**
```json
{
  "coverType": "leather",
  "bgColor": "#f0f0f0",
  "accentColor": "#ff6b6b"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Customization updated",
  "user": { /* updated user object */ }
}
```

---

## Journal Endpoints

### Get All Journals
Retrieve all journals for the logged-in user.

**Endpoint:** `GET /journals`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "journals": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "userId": "507f1f77bcf86cd799439011",
      "name": "My First Journal",
      "icon": "📓",
      "entries": ["507f1f77bcf86cd799439013", "507f1f77bcf86cd799439014"],
      "createdAt": "2025-01-15T10:30:00Z",
      "updatedAt": "2025-01-15T10:30:00Z"
    }
  ]
}
```

---

### Create Journal
Create a new journal.

**Endpoint:** `POST /journals`

**Request Body:**
```json
{
  "name": "Travel Diary",
  "icon": "✈️"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Journal created",
  "journal": {
    "_id": "507f1f77bcf86cd799439015",
    "userId": "507f1f77bcf86cd799439011",
    "name": "Travel Diary",
    "icon": "✈️",
    "entries": [],
    "createdAt": "2025-01-15T11:00:00Z",
    "updatedAt": "2025-01-15T11:00:00Z"
  }
}
```

---

### Get Single Journal
Get details of a specific journal.

**Endpoint:** `GET /journals/:id`

**Response:**
```json
{
  "success": true,
  "journal": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "name": "My First Journal",
    "icon": "📓",
    "entries": [ /* entry objects */ ],
    "createdAt": "2025-01-15T10:30:00Z",
    "updatedAt": "2025-01-15T10:30:00Z"
  }
}
```

---

### Update Journal
Update a journal's details.

**Endpoint:** `PUT /journals/:id`

**Request Body:**
```json
{
  "name": "My Updated Journal",
  "icon": "📖"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Journal updated",
  "journal": { /* updated journal */ }
}
```

---

### Delete Journal
Delete a journal and all its entries.

**Endpoint:** `DELETE /journals/:id`

**Response:**
```json
{
  "success": true,
  "message": "Journal deleted"
}
```

---

## Entry Endpoints

### Get Journal Entries
Get all entries for a specific journal.

**Endpoint:** `GET /entries/journal/:journalId`

**Response:**
```json
{
  "success": true,
  "entries": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "journalId": "507f1f77bcf86cd799439012",
      "userId": "507f1f77bcf86cd799439011",
      "title": "Today's Reflections",
      "content": "<p>Had a great day today...</p>",
      "mood": "happy",
      "tags": ["grateful", "family"],
      "images": [],
      "videos": [],
      "audioNotes": [],
      "isLocked": false,
      "createdAt": "2025-01-15T10:30:00Z",
      "updatedAt": "2025-01-15T10:30:00Z"
    }
  ]
}
```

---

### Create Entry
Create a new journal entry.

**Endpoint:** `POST /entries`

**Request Body:**
```json
{
  "journalId": "507f1f77bcf86cd799439012",
  "title": "Morning Thoughts",
  "content": "<p>Started my day with meditation...</p>",
  "mood": "calm",
  "tags": ["meditation", "morning"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Entry created",
  "entry": {
    "_id": "507f1f77bcf86cd799439016",
    "journalId": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "title": "Morning Thoughts",
    "content": "<p>Started my day with meditation...</p>",
    "mood": "calm",
    "tags": ["meditation", "morning"],
    "images": [],
    "videos": [],
    "audioNotes": [],
    "isLocked": false,
    "createdAt": "2025-01-15T11:00:00Z",
    "updatedAt": "2025-01-15T11:00:00Z"
  }
}
```

---

### Get Single Entry
Get details of a specific entry.

**Endpoint:** `GET /entries/:id`

**Response:**
```json
{
  "success": true,
  "entry": { /* entry object */ }
}
```

---

### Update Entry
Update an existing entry.

**Endpoint:** `PUT /entries/:id`

**Request Body:**
```json
{
  "title": "Updated Title",
  "content": "<p>Updated content...</p>",
  "mood": "excited",
  "tags": ["update", "new"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Entry updated",
  "entry": { /* updated entry */ }
}
```

---

### Delete Entry
Delete an entry.

**Endpoint:** `DELETE /entries/:id`

**Response:**
```json
{
  "success": true,
  "message": "Entry deleted"
}
```

---

### Add Image to Entry
Upload an image to an entry.

**Endpoint:** `POST /entries/:id/image`

**Request:** FormData with image file
```
file: <image_file>
```

**Response:**
```json
{
  "success": true,
  "message": "Image added",
  "imagePath": "/uploads/1642256400000.jpg"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "All fields are required"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "No token provided"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Journal not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Server error",
  "error": "Error details here"
}
```

---

## Mood Options
Valid mood values:
- `happy` 😊
- `sad` 😢
- `neutral` 😐
- `excited` 🤩
- `calm` 😌
- `anxious` 😰
- `grateful` 🙏

---

## Testing with cURL

### Sign Up
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### Get Journals
```bash
curl -X GET http://localhost:5000/api/journals \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Entry
```bash
curl -X POST http://localhost:5000/api/entries \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "journalId": "JOURNAL_ID",
    "title": "My Entry",
    "content": "<p>Entry content here</p>",
    "mood": "happy",
    "tags": ["tag1", "tag2"]
  }'
```

---

## Rate Limiting
No rate limiting is currently implemented. Add it in production!

---

## CORS
CORS is enabled for all origins. Restrict in production!

```javascript
// In production, change to:
app.use(cors({
  origin: 'https://yourdomain.com'
}));
```
