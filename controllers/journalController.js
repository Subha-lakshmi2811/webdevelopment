const Journal = require('../models/Journal');
const Entry = require('../models/Entry');

// Get all journals for a user
exports.getAllJournals = async (req, res) => {
    try {
        const journals = await Journal.find({ userId: req.userId }).populate('entries');
        res.status(200).json({ success: true, journals });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create a new journal
exports.createJournal = async (req, res) => {
    try {
        const { name, icon } = req.body;

        const journal = new Journal({
            userId: req.userId,
            name: name || 'My Journal',
            icon: icon || '📓'
        });

        await journal.save();
        res.status(201).json({ success: true, message: 'Journal created', journal });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get a single journal
exports.getJournal = async (req, res) => {
    try {
        const journal = await Journal.findById(req.params.id).populate('entries');
        
        if (!journal || journal.userId.toString() !== req.userId) {
            return res.status(404).json({ success: false, message: 'Journal not found' });
        }

        res.status(200).json({ success: true, journal });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update a journal
exports.updateJournal = async (req, res) => {
    try {
        const { name, icon } = req.body;
        
        let journal = await Journal.findById(req.params.id);
        
        if (!journal || journal.userId.toString() !== req.userId) {
            return res.status(404).json({ success: false, message: 'Journal not found' });
        }

        if (name) journal.name = name;
        if (icon) journal.icon = icon;
        journal.updatedAt = Date.now();

        await journal.save();
        res.status(200).json({ success: true, message: 'Journal updated', journal });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a journal
exports.deleteJournal = async (req, res) => {
    try {
        const journal = await Journal.findById(req.params.id);
        
        if (!journal || journal.userId.toString() !== req.userId) {
            return res.status(404).json({ success: false, message: 'Journal not found' });
        }

        // Delete all entries in the journal
        await Entry.deleteMany({ journalId: req.params.id });
        
        await Journal.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Journal deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
