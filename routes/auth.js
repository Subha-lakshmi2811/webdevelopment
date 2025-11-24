const express = require('express');
const router = express.Router();
const { signup, signin, getCurrentUser, updateSettings, updateCustomization, deleteAccount } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/me', authMiddleware, getCurrentUser);
router.put('/settings', authMiddleware, updateSettings);
router.put('/customization', authMiddleware, updateCustomization);
router.delete('/account', authMiddleware, deleteAccount);

module.exports = router;
