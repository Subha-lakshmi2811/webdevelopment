const express = require('express');
const router = express.Router();
const {
    getAllJournals,
    createJournal,
    getJournal,
    updateJournal,
    deleteJournal
} = require('../controllers/journalController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, getAllJournals);
router.post('/', authMiddleware, createJournal);
router.get('/:id', authMiddleware, getJournal);
router.put('/:id', authMiddleware, updateJournal);
router.delete('/:id', authMiddleware, deleteJournal);

module.exports = router;
