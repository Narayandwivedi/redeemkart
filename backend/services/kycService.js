const User = require('../models/User');
const transporter = require('../config/nodemailer');
const { buildActionEmail } = require('./emailTemplates');

const SELL_PAGE_URL = 'https://redeemkart.in/sell-gift-card';

// A submitted KYC is approved automatically after this wait
const AUTO_APPROVE_DELAY_MS = 2 * 60 * 1000;

// Email the user that their KYC is approved. Used by the admin approval and the auto-approval.
// Every outcome is logged so the server log shows whether the email left the server.
const sendKycApprovedEmail = async (user) => {
  if (!user || !user.email) {
    console.log('[KYC] Approval email skipped: the user has no email address');
    return;
  }

  // Wording is kept plain on purpose: "KYC approved", "documents" and "bank account" in one
  // email read like a phishing mail and sent this message to the spam folder.
  const info = await transporter.sendMail({
    from: `"RedeemKart" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to: user.email,
    subject: 'You can now sell gift cards on RedeemKart',
    text: `Hello ${user.fullName}, your RedeemKart account verification is complete. You can now sell your gift cards on RedeemKart: ${SELL_PAGE_URL}`,
    html: buildActionEmail({
      title: 'Your verification is complete',
      name: user.fullName,
      message: 'Your RedeemKart account verification is complete. You are now ready to sell your gift cards on RedeemKart.',
      buttonLabel: 'Sell a gift card',
      link: SELL_PAGE_URL,
      showLink: false,
      note: 'Listing a card takes only a few minutes.',
      ignore: 'Thank you for choosing RedeemKart.',
      preheader: 'Your account verification is complete. You can now sell gift cards on RedeemKart.'
    })
  });

  console.log(`[KYC] Approval email handed to the mail server for ${user.email}: ${info.response}`);
};

// Approve one KYC and email the user. Does nothing if an admin already approved or rejected it,
// or if the user has submitted again since (that submission has its own timer).
const autoApproveKyc = async (userId, submittedAt) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: userId, kycStatus: 'pending', kycSubmittedAt: submittedAt },
      { $set: { kycStatus: 'verified', kycReviewedAt: new Date() }, $unset: { kycReviewedBy: 1, kycRejectionReason: 1 } },
      { new: true }
    ).select('fullName email');

    if (!user) {
      console.log(`[KYC] Auto-approval skipped for user ${userId}: no longer pending (an admin already decided, or it was submitted again)`);
      return;
    }

    console.log(`[KYC] Auto-approved KYC for ${user.email || user._id}`);
    await sendKycApprovedEmail(user);
  } catch (error) {
    console.error('[KYC] Auto-approval or approval email FAILED:', error);
  }
};

// Called when a user submits KYC: approve it AUTO_APPROVE_DELAY_MS after the submission time
const scheduleKycAutoApproval = (userId, submittedAt) => {
  const wait = Math.max(0, new Date(submittedAt).getTime() + AUTO_APPROVE_DELAY_MS - Date.now());
  console.log(`[KYC] Auto-approval scheduled for user ${userId} in ${Math.round(wait / 1000)}s`);
  setTimeout(() => autoApproveKyc(userId, submittedAt), wait);
};

// Called once when the server starts: timers do not survive a restart, so pick up any KYC
// that was still waiting.
const resumePendingKycApprovals = async () => {
  try {
    const pending = await User.find({ kycStatus: 'pending', kycSubmittedAt: { $ne: null } }).select('_id kycSubmittedAt').lean();
    pending.forEach((user) => scheduleKycAutoApproval(user._id, user.kycSubmittedAt));
    if (pending.length > 0) console.log(`[KYC] Resumed auto-approval for ${pending.length} pending KYC`);
  } catch (error) {
    console.error('[KYC] Could not resume pending KYC approvals:', error);
  }
};

module.exports = { sendKycApprovedEmail, scheduleKycAutoApproval, resumePendingKycApprovals };
