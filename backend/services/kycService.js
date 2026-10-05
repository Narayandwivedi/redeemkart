const User = require('../models/User');
const transporter = require('../config/nodemailer');
const { buildActionEmail } = require('./emailTemplates');

const SELL_PAGE_URL = 'https://redeemkart.in/sell-gift-card';

// A submitted KYC is approved automatically after this wait
const AUTO_APPROVE_DELAY_MS = 2 * 60 * 1000;

// Email the user that their KYC is approved. Used by the admin approval and the auto-approval.
const sendKycApprovedEmail = (user) => {
  if (!user || !user.email) return Promise.resolve();

  return transporter.sendMail({
    from: `"RedeemKart" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to: user.email,
    subject: 'Your KYC is approved - RedeemKart',
    text: `Hello ${user.fullName}, your KYC is approved and you are ready to sell your gift cards on RedeemKart. List your first card here: ${SELL_PAGE_URL}`,
    html: buildActionEmail({
      title: 'Your KYC is approved 🎉',
      name: user.fullName,
      message: 'Good news! We have verified your documents and your KYC is approved. You are now ready to sell your gift cards on RedeemKart.',
      buttonLabel: 'Sell a gift card',
      link: SELL_PAGE_URL,
      showLink: false,
      note: 'List your card in a few minutes and get paid to your bank account after it sells.',
      ignore: 'Thank you for choosing RedeemKart. If you have any questions, our support team is happy to help.',
      preheader: 'Your KYC is approved. You are ready to sell your gift cards on RedeemKart.'
    })
  });
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

    if (!user) return;

    console.log(`[KYC] Auto-approved KYC for ${user.email || user._id}`);
    await sendKycApprovedEmail(user);
  } catch (error) {
    console.error('[KYC] Auto-approval error:', error);
  }
};

// Called when a user submits KYC: approve it AUTO_APPROVE_DELAY_MS after the submission time
const scheduleKycAutoApproval = (userId, submittedAt) => {
  const wait = Math.max(0, new Date(submittedAt).getTime() + AUTO_APPROVE_DELAY_MS - Date.now());
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
