const crypto = require('crypto');
const ChatbotConversation = require('../models/ChatbotConversation');

const SYSTEM_PROMPT = `You are the customer support assistant for RedeemKart (redeemkart.in), an Indian marketplace where people buy discounted digital gift cards and sell their unused gift cards for cash.

Selling a gift card on RedeemKart:
- Brands that can be sold: Google Play, Flipkart, Amazon Pay Gift Card, Amazon Shopping Voucher, Reliance JioMart Gift Card, Steam, Myntra, MakeMyTrip, PhonePe, Zomato, BigBasket.
- Steps: log in, choose the brand, enter the balance, the gift card code and the PIN (if the card has one), then publish. The team verifies the card and lists it. Most popular cards sell within 24 hours.
- Listing is free. Commission is deducted only when the card sells: 10% for Amazon Pay Gift Card, Amazon Shopping Voucher, Flipkart and PhonePe; 20% for Myntra and MakeMyTrip; 25% for Google Play and Zomato; 30% for JioMart, Steam and BigBasket. Example: a Rs. 1,000 Flipkart card pays Rs. 900.
- PIN: Flipkart needs a 16-digit card number and a 6-digit PIN. MakeMyTrip, PhonePe and Zomato also need a PIN. Google Play and Amazon Pay Gift Card have no PIN.
- Payout goes to the bank account or UPI ID saved in Payout Details, usually within 3-4 hours after the card is sold.
- Sellers must verify their email before a payout is released. A "Verify my email" link is emailed at signup and can be sent again from the My Sales, Sell Gift Card or Payout Details page. Listing cards works without verification.
- The card must be unused and not added to any account. Invalid or used cards are rejected.
- Sellers can track their cards on the My Sales page.
- The chat has a "Sell a gift card" button that lists a card step by step. If the user wants to sell, tell them to tap it or type "sell gift card".

Buying on RedeemKart:
- Discounted digital gift cards (Google Play, Amazon, Flipkart, Steam, Myntra, BigBasket and more) and games.
- Everything is delivered digitally. Codes are shown in My Orders and sent by email.
- Refunds are given only if the voucher code is invalid or not working, and take 3-5 days. Games are non-refundable unless they were not delivered or have a download error.

Rules:
- Be friendly, professional and brief. Use short sentences or short bullet points, no long paragraphs.
- Reply in the language the user writes in (English, Hindi or Hinglish).
- Only help with RedeemKart topics. Politely decline anything else.
- NEVER ask the user to type a gift card code, PIN, password, OTP or bank details in this chat conversation. If they want to sell, point them to the "Sell a gift card" button.
- Do not invent offers, prices, order details or policies that are not listed above. If you do not know, say so and suggest emailing support@redeemkart.in.`;

const GROQ_MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';
const MAX_HISTORY = 12; // messages sent to the AI per request
const MAX_MESSAGE_LENGTH = 1000;

// Simple in-memory limit so the public endpoint cannot be used to burn the AI quota
const RATE_WINDOW_MS = 5 * 60 * 1000;
const RATE_MAX_REQUESTS = 30;
const requestLog = new Map();

const isRateLimited = (key) => {
  const now = Date.now();
  if (requestLog.size > 5000) {
    for (const [k, times] of requestLog) {
      if (now - times[times.length - 1] > RATE_WINDOW_MS) requestLog.delete(k);
    }
  }
  const recent = (requestLog.get(key) || []).filter((time) => now - time < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX_REQUESTS) {
    requestLog.set(key, recent);
    return true;
  }
  recent.push(now);
  requestLog.set(key, recent);
  return false;
};

// Long digit runs are card numbers or account numbers: keep them out of the saved chats
const maskNumbers = (text) => text.replace(/\d(?:[ -]?\d){11,18}/g, '[number removed]');

// Adds messages to the end of the user's conversation, creating it if needed
const appendMessages = async ({ user, conversationId, startsNewChat, entries }) => {
  let id = /^[\w-]{8,64}$/.test(String(conversationId || '')) ? String(conversationId) : null;

  // Chat widget without a conversation id (old cached page): a first message
  // starts a new conversation, anything else continues the latest one.
  if (!id && !startsNewChat) {
    const latest = await ChatbotConversation.findOne({ user: user._id }).sort({ lastMessageAt: -1 }).select('conversationId');
    id = latest ? latest.conversationId : null;
  }
  if (!id) id = crypto.randomUUID();

  const now = new Date();
  const messages = entries.map((entry) => ({ ...entry, content: maskNumbers(entry.content), createdAt: now }));

  await ChatbotConversation.updateOne(
    { user: user._id, conversationId: id },
    {
      $set: { userName: user.fullName || '', userEmail: user.email || '', aiModel: GROQ_MODEL, lastMessageAt: now },
      $push: { messages: { $each: messages } },
      $inc: { messageCount: messages.length }
    },
    { upsert: true }
  );
};

// Saves the newest user message (and the AI reply, when there is one) to the user's
// conversation. Never throws: a failed save must not break the chat itself.
const saveTurn = async ({ user, conversationId, isFirstMessage, userMessage, reply }) => {
  try {
    const entries = [{ role: 'user', content: userMessage }];
    if (reply) entries.push({ role: 'assistant', content: reply });
    await appendMessages({ user, conversationId, startsNewChat: isFirstMessage, entries });
  } catch (error) {
    console.error('Chatbot save error:', error.message);
  }
};

// The chat widget answers some messages itself, without the AI: the sell, refund, sales
// and games steps. It sends those here so the saved conversation has no gaps. The widget
// replaces gift card codes and PINs with a placeholder before sending.
const logMessages = async (req, res) => {
  try {
    const { messages, conversationId } = req.body;

    const entries = (Array.isArray(messages) ? messages : [])
      .filter((m) => m && ['user', 'assistant'].includes(m.role) && typeof m.content === 'string' && m.content.trim())
      .slice(0, 20)
      .map(({ role, content }) => ({ role, content: content.slice(0, MAX_MESSAGE_LENGTH * 2), scripted: true }));

    if (entries.length === 0) {
      return res.status(400).json({ success: false, message: 'Messages are required' });
    }
    if (isRateLimited(`log:${req.user._id}`)) {
      return res.status(429).json({ success: false, message: 'Too many messages.' });
    }

    await appendMessages({ user: req.user, conversationId, startsNewChat: false, entries });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Chatbot log error:', error.message);
    return res.status(500).json({ success: false, message: 'Could not save the messages' });
  }
};

const chatWithBot = async (req, res) => {
  try {
    const { messages, conversationId } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ success: false, message: 'Messages are required' });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, message: 'AI service not configured' });
    }

    const clientKey = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.ip || 'unknown';
    if (isRateLimited(clientKey)) {
      return res.status(429).json({ success: false, message: 'Too many messages. Please wait a few minutes and try again.' });
    }

    const history = messages
      .filter((m) => m && ['user', 'assistant'].includes(m.role) && typeof m.content === 'string' && m.content.trim())
      .slice(-MAX_HISTORY)
      .map(({ role, content }) => ({ role, content: content.slice(0, MAX_MESSAGE_LENGTH) }));

    if (history.length === 0) {
      return res.status(400).json({ success: false, message: 'Messages are required' });
    }

    // What gets saved for this request: only the newest user message, since the
    // earlier ones were saved when they were sent
    const lastMessage = history[history.length - 1];
    const turn = lastMessage.role === 'user'
      ? { user: req.user, conversationId, isFirstMessage: history.length === 1, userMessage: lastMessage.content }
      : null;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...history
        ],
        max_completion_tokens: 900,
        temperature: 0.4,
        reasoning_effort: 'low',
        include_reasoning: false
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Groq API error:', err);
      if (turn) saveTurn(turn);
      return res.status(502).json({ success: false, message: 'AI service error. Please try again.' });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      if (turn) saveTurn(turn);
      return res.status(502).json({ success: false, message: 'Empty response from AI' });
    }

    if (turn) saveTurn({ ...turn, reply });

    return res.status(200).json({ success: true, reply });
  } catch (error) {
    console.error('Chatbot error:', error.message);
    return res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
  }
};

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Admin: list saved conversations, newest first (without the message bodies)
const getConversations = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);
    const search = String(req.query.search || '').trim();

    const filter = {};
    if (search) {
      const pattern = new RegExp(escapeRegex(search), 'i');
      filter.$or = [{ userName: pattern }, { userEmail: pattern }];
    }

    const [conversations, total] = await Promise.all([
      ChatbotConversation.find(filter)
        .select('user userName userEmail conversationId messageCount lastMessageAt createdAt')
        .sort({ lastMessageAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      ChatbotConversation.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      data: {
        conversations,
        pagination: { currentPage: page, totalPages: Math.max(Math.ceil(total / limit), 1), totalConversations: total }
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Admin: one conversation with all its messages
const getConversation = async (req, res) => {
  try {
    const conversation = await ChatbotConversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }
    res.status(200).json({ success: true, data: conversation });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Admin: every conversation as a JSON Lines file (one conversation per line), for training
const exportConversations = async (req, res) => {
  try {
    const fileName = `chatbot-conversations-${new Date().toISOString().slice(0, 10)}.jsonl`;
    res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    const cursor = ChatbotConversation.find().sort({ createdAt: 1 }).lean().cursor();
    for await (const c of cursor) {
      res.write(JSON.stringify({
        conversationId: c.conversationId,
        userName: c.userName,
        userEmail: c.userEmail,
        startedAt: c.createdAt,
        // "scripted" marks replies and choices from the widget's own steps, not from the AI
        messages: c.messages.map(({ role, content, scripted }) => (scripted ? { role, content, scripted: true } : { role, content }))
      }) + '\n');
    }
    res.end();
  } catch (error) {
    console.error('Chatbot export error:', error.message);
    if (!res.headersSent) return res.status(500).json({ success: false, message: 'Export failed' });
    res.end();
  }
};

module.exports = { chatWithBot, logMessages, getConversations, getConversation, exportConversations };
