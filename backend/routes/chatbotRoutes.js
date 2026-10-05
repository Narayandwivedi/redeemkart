const express = require('express');
const router = express.Router();
const { chatWithBot } = require('../controllers/chatbotController');
const { protect } = require('../middleware/auth');

// POST /api/chatbot (logged-in users only)
router.post('/', protect, chatWithBot);

module.exports = router;
