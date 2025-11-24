const Entry = require('../models/Entry');
const Journal = require('../models/Journal');

// Get all entries for a journal
exports.getEntries = async (req, res) => {
    try {
        const entries = await Entry.find({
            journalId: req.params.journalId,
            userId: req.userId
        }).sort({ createdAt: -1 });

        res.status(200).json({ success: true, entries });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create a new entry
exports.createEntry = async (req, res) => {
    try {
        const { journalId, title, content, mood, tags } = req.body;

        // Verify journal belongs to user
        const journal = await Journal.findOne({ _id: journalId, userId: req.userId });
        if (!journal) {
            return res.status(404).json({ success: false, message: 'Journal not found' });
        }

        const entry = new Entry({
            journalId,
            userId: req.userId,
            title: title || 'Untitled',
            content,
            mood: mood || 'neutral',
            tags: tags || []
        });

        await entry.save();

        // Add entry to journal
        journal.entries.push(entry._id);
        await journal.save();

        res.status(201).json({ success: true, message: 'Entry created', entry });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get a single entry
exports.getEntry = async (req, res) => {
    try {
        const entry = await Entry.findById(req.params.id);

        if (!entry || entry.userId.toString() !== req.userId) {
            return res.status(404).json({ success: false, message: 'Entry not found' });
        }

        res.status(200).json({ success: true, entry });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update an entry
exports.updateEntry = async (req, res) => {
    try {
        const { title, content, mood, tags } = req.body;

        let entry = await Entry.findById(req.params.id);

        if (!entry || entry.userId.toString() !== req.userId) {
            return res.status(404).json({ success: false, message: 'Entry not found' });
        }

        if (title) entry.title = title;
        if (content) entry.content = content;
        if (mood) entry.mood = mood;
        if (tags) entry.tags = tags;
        entry.updatedAt = Date.now();

        await entry.save();
        res.status(200).json({ success: true, message: 'Entry updated', entry });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete an entry
exports.deleteEntry = async (req, res) => {
    try {
        const entry = await Entry.findById(req.params.id);

        if (!entry || entry.userId.toString() !== req.userId) {
            return res.status(404).json({ success: false, message: 'Entry not found' });
        }

        // Remove from journal
        await Journal.findByIdAndUpdate(entry.journalId, {
            $pull: { entries: req.params.id }
        });

        await Entry.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Entry deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Add image to entry
exports.addImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const entry = await Entry.findById(req.params.id);
        if (!entry || entry.userId.toString() !== req.userId) {
            return res.status(404).json({ success: false, message: 'Entry not found' });
        }

        const imagePath = `/uploads/${req.file.filename}`;
        entry.images.push(imagePath);
        await entry.save();

        res.status(200).json({ success: true, message: 'Image added', imagePath });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
