const express = require('express');
const router = express.Router();
const { chatWithBot, getConversations, getConversation, exportConversations } = require('../controllers/chatbotController');
const { protect, authorize } = require('../middleware/auth');

// POST /api/chatbot (logged-in users only)
router.post('/', protect, chatWithBot);

// Saved AI conversations (admin only)
router.get('/conversations', protect, authorize('admin'), getConversations);
router.get('/conversations/export', protect, authorize('admin'), exportConversations);
router.get('/conversations/:id', protect, authorize('admin'), getConversation);

module.exports = router;
