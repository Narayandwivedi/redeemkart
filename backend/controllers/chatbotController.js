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

const chatWithBot = async (req, res) => {
  try {
    const { messages } = req.body;

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
      return res.status(502).json({ success: false, message: 'AI service error. Please try again.' });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return res.status(502).json({ success: false, message: 'Empty response from AI' });
    }

    return res.status(200).json({ success: true, reply });
  } catch (error) {
    console.error('Chatbot error:', error.message);
    return res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
  }
};

module.exports = { chatWithBot };
