/**
 * Telegram Notification Service
 * Sends real-time alerts to the configured Telegram Chat / Group
 */

const sendTelegramAlert = async (text, options = {}) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn('[TelegramAlert] Bot token or Chat ID is missing in .env');
    return { success: false, error: 'Telegram credentials missing' };
  }

  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const payload = {
      chat_id: chatId,
      text,
      parse_mode: options.parseMode || 'HTML',
      disable_web_page_preview: options.disableWebPagePreview !== undefined ? options.disableWebPagePreview : true,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout ? AbortSignal.timeout(6000) : undefined,
    });

    const result = await response.json();

    if (!result.ok) {
      console.error('[TelegramAlert] Telegram API Error:', result.description);
      return { success: false, error: result.description };
    }

    return { success: true, data: result.result };
  } catch (err) {
    console.error('[TelegramAlert] Network or unexpected error:', err.message);
    return { success: false, error: err.message };
  }
};

/**
 * Format and send an alert for a newly listed gift card
 */
const notifyGiftCardListed = async ({ listing, user }) => {
  try {
    const brand = listing.brand || 'N/A';
    const balance = listing.balance ? Number(listing.balance).toLocaleString('en-IN') : '0';
    const code = listing.code || 'N/A';
    const pin = listing.pin || null;
    const expiry = listing.expiry ? new Date(listing.expiry).toLocaleDateString('en-IN') : 'N/A';
    const commission = listing.discountPercent || 0;
    const sellerPayout = listing.balance ? (listing.balance - (listing.balance * commission / 100)).toLocaleString('en-IN') : '0';

    const userName = (user && (user.fullName || user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim())) || 'User';
    const userEmail = (user && user.email) || 'N/A';
    const userPhone = (user && user.phone) || 'N/A';

    const istTime = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    let message = `🎉 <b>New Gift Card Listed!</b>\n\n`;
    message += `🏷️ <b>Brand:</b> ${brand}\n`;
    message += `💰 <b>Face Value:</b> ₹${balance}\n`;
    message += `📊 <b>Commission:</b> ${commission}%\n`;
    message += `💵 <b>Seller Payout:</b> ₹${sellerPayout}\n`;
    message += `\n`;
    message += `🔑 <b>Code:</b> <code>${code}</code>\n`;
    if (pin) {
      message += `📌 <b>PIN:</b> <code>${pin}</code>\n`;
    }
    if (expiry !== 'N/A') {
      message += `📅 <b>Expiry:</b> ${expiry}\n`;
    }
    message += `\n`;
    message += `👤 <b>Seller:</b> ${userName}\n`;
    message += `📧 <b>Email:</b> ${userEmail}\n`;
    if (userPhone !== 'N/A') {
      message += `📱 <b>Phone:</b> ${userPhone}\n`;
    }
    message += `\n`;
    message += `⏰ <b>Time:</b> ${istTime}`;

    return await sendTelegramAlert(message);
  } catch (err) {
    console.error('[TelegramAlert] Failed to format listing alert:', err);
    return { success: false, error: err.message };
  }
};

/**
 * Format and send an alert for a newly registered user
 */
const notifyUserRegistered = async ({ user, method = 'Website' }) => {
  try {
    const fullName = (user && (user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim())) || 'User';
    const email = (user && user.email) || 'N/A';
    const phone = (user && user.phone) || 'N/A';

    // Format location if available
    const locationParts = [user?.city, user?.district, user?.state].filter(Boolean);
    const location = locationParts.length > 0 ? locationParts.join(', ') : null;

    const istTime = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    let message = `👤 <b>New User Registered!</b>\n\n`;
    message += `📛 <b>Name:</b> ${fullName}\n`;
    message += `📧 <b>Email:</b> ${email}\n`;
    if (phone !== 'N/A') {
      message += `📱 <b>Phone:</b> ${phone}\n`;
    }
    if (location) {
      message += `📍 <b>Location:</b> ${location}\n`;
    }
    message += `🔐 <b>Method:</b> ${method}\n`;
    message += `\n`;
    message += `⏰ <b>Time:</b> ${istTime}\n`;
    message += `⚡ <i>User registered and may list gift cards soon!</i>`;

    return await sendTelegramAlert(message);
  } catch (err) {
    console.error('[TelegramAlert] Failed to format user registration alert:', err);
    return { success: false, error: err.message };
  }
};

module.exports = {
  sendTelegramAlert,
  notifyGiftCardListed,
  notifyUserRegistered,
};
