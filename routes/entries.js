const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
    getEntries,
    createEntry,
    getEntry,
    updateEntry,
    deleteEntry,
    addImage
} = require('../controllers/entryController');
const authMiddleware = require('../middleware/auth');

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.get('/journal/:journalId', authMiddleware, getEntries);
router.post('/', authMiddleware, createEntry);
router.get('/:id', authMiddleware, getEntry);
router.put('/:id', authMiddleware, updateEntry);
router.delete('/:id', authMiddleware, deleteEntry);
router.post('/:id/image', authMiddleware, upload.single('image'), addImage);

module.exports = router;
