const express = require('express');
const router = express.Router();
const { chatWithBot, logMessages, getConversations, getConversation, exportConversations } = require('../controllers/chatbotController');
const { protect, authorize } = require('../middleware/auth');

// POST /api/chatbot (logged-in users only)
router.post('/', protect, chatWithBot);

// Messages the chat widget handled without the AI, saved to the same conversation
router.post('/log', protect, logMessages);

// Saved AI conversations (admin only)
router.get('/conversations', protect, authorize('admin'), getConversations);
router.get('/conversations/export', protect, authorize('admin'), exportConversations);
router.get('/conversations/:id', protect, authorize('admin'), getConversation);

module.exports = router;
