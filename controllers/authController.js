const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// Sign Up
exports.signup = async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: 'Passwords do not match' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Create new user
        const user = new User({ username, email, password });
        await user.save();

        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Sign In
exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Sign in successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Current User
exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update User Settings
exports.updateSettings = async (req, res) => {
    try {
        const { 
            username, 
            theme, 
            privateJournals, 
            autoLockEntries, 
            enableNotifications,
            emailNotifications,
            dailyReminder,
            reminderTime,
            weeklyDigest
        } = req.body;
        
        const user = await User.findByIdAndUpdate(
            req.userId,
            { 
                username, 
                theme,
                settings: {
                    privateJournals,
                    autoLockEntries,
                    enableNotifications,
                    emailNotifications,
                    dailyReminder,
                    reminderTime,
                    weeklyDigest
                }
            },
            { new: true }
        );
        res.status(200).json({ success: true, message: 'Settings updated', user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Journal Customization
exports.updateCustomization = async (req, res) => {
    try {
        const { coverType, bgColor, accentColor } = req.body;
        const user = await User.findByIdAndUpdate(
            req.userId,
            { coverType, bgColor, accentColor },
            { new: true }
        );
        res.status(200).json({ success: true, message: 'Customization updated', user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete Account
exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.userId;
        
        // Delete all user's journals and entries
        const Journal = require('../models/Journal');
        const Entry = require('../models/Entry');
        
        const journals = await Journal.find({ userId });
        for (const journal of journals) {
            await Entry.deleteMany({ journalId: journal._id });
        }
        await Journal.deleteMany({ userId });
        
        // Delete the user account
        await User.findByIdAndDelete(userId);
        
        res.status(200).json({ success: true, message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};