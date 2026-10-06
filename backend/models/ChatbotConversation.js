const mongoose = require('mongoose');

// One chat between a user and the AI assistant. Only the AI part of the chat is
// stored: the scripted sell / refund steps never reach the server, so gift card
// codes and PINs typed there are not saved here.
const chatbotConversationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Name and email at the time of the chat, so the record stays readable
  // even if the account is renamed or deleted later
  userName: {
    type: String,
    trim: true,
    default: ''
  },
  userEmail: {
    type: String,
    trim: true,
    default: ''
  },
  // Sent by the chat widget; a new one starts every time the chat is reset
  conversationId: {
    type: String,
    required: true
  },
  messages: [{
    _id: false,
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  messageCount: {
    type: Number,
    default: 0
  },
  aiModel: {
    type: String,
    default: ''
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

chatbotConversationSchema.index({ user: 1, conversationId: 1 }, { unique: true });
chatbotConversationSchema.index({ lastMessageAt: -1 });

module.exports = mongoose.model('ChatbotConversation', chatbotConversationSchema);
