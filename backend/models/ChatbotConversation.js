const mongoose = require('mongoose');

// One chat between a user and the assistant: the AI questions and answers, plus the
// widget's own steps (sell, refund, sales, games). Gift card codes and PINs typed in
// the sell steps are replaced with a placeholder by the widget and never stored here.
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
    // true for the widget's own steps (sell, refund, sales, games); false for AI chat
    scripted: {
      type: Boolean,
      default: false
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
