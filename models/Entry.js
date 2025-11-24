const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
    journalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Journal',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        default: 'Untitled'
    },
    content: {
        type: String,
        default: ''
    },
    mood: {
        type: String,
        enum: ['happy', 'sad', 'neutral', 'excited', 'calm', 'anxious', 'grateful'],
        default: 'neutral'
    },
    tags: [String],
    images: [String],
    videos: [String],
    audioNotes: [String],
    isLocked: {
        type: Boolean,
        default: false
    },
    lockPassword: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Entry', entrySchema);
