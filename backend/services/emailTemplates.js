const SITE_URL = 'https://redeemkart.in';
const LOGO_URL = `${SITE_URL}/redeemkart-logo.png`;
const FONT = "'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif";

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Branded OTP email (signup verification, password reset). Table layout + inline styles so it
// renders the same in Gmail, Outlook and mobile mail apps.
//   title    - heading inside the card
//   name     - recipient name for the greeting (optional)
//   message  - one line explaining what the OTP is for
//   otp      - the code
//   minutes  - validity shown under the code
//   ignore   - what to do if the recipient did not request it
const buildOtpEmail = ({ title, name, message, otp, minutes = 10, ignore }) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9;">
  <div style="display: none; max-height: 0; overflow: hidden; opacity: 0; color: transparent;">Your RedeemKart OTP is ${escapeHtml(otp)}. It is valid for ${minutes} minutes.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f1f5f9;">
    <tr>
      <td align="center" style="padding: 32px 12px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 520px; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
          <tr>
            <td style="height: 6px; line-height: 6px; font-size: 0; background-color: #16a34a;">&nbsp;</td>
          </tr>
          <tr>
            <td align="center" style="padding: 28px 24px 20px; border-bottom: 1px solid #f1f5f9;">
              <a href="${SITE_URL}" style="text-decoration: none;">
                <img src="${LOGO_URL}" alt="RedeemKart" width="190" style="display: block; width: 190px; max-width: 70%; height: auto; border: 0;">
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding: 28px 28px 8px; font-family: ${FONT};">
              <h1 style="margin: 0 0 14px; font-size: 22px; line-height: 1.3; font-weight: 700; color: #0f172a;">${escapeHtml(title)}</h1>
              <p style="margin: 0 0 6px; font-size: 15px; line-height: 1.6; color: #334155;">Hello${name ? ` <strong>${escapeHtml(name)}</strong>` : ''},</p>
              <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #475569;">${escapeHtml(message)}</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 28px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding: 22px 12px; background-color: #f0fdf4; border: 2px dashed #86efac; border-radius: 14px;">
                    <p style="margin: 0 0 8px; font-family: ${FONT}; font-size: 12px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: #15803d;">Your one-time password</p>
                    <p style="margin: 0; padding-left: 10px; font-family: 'Courier New', Courier, monospace; font-size: 36px; line-height: 1.2; font-weight: 700; letter-spacing: 10px; color: #0f172a;">${escapeHtml(otp)}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 10px 28px 4px; font-family: ${FONT}; font-size: 13px; color: #64748b;">
              Valid for <strong style="color: #0f172a;">${minutes} minutes</strong>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 28px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding: 14px 16px; background-color: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 8px; font-family: ${FONT}; font-size: 13px; line-height: 1.6; color: #92400e;">
                    <strong>Never share this OTP with anyone.</strong> RedeemKart will never ask for it on a call, WhatsApp or Telegram.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 14px 28px 28px; font-family: ${FONT}; font-size: 13px; line-height: 1.6; color: #64748b;">
              ${escapeHtml(ignore)}
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 20px 24px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; font-family: ${FONT}; font-size: 12px; line-height: 1.7; color: #94a3b8;">
              Need help? <a href="${SITE_URL}/contact" style="color: #16a34a; text-decoration: none; font-weight: 600;">Contact support</a><br>
              &copy; ${new Date().getFullYear()} RedeemKart &middot; <a href="${SITE_URL}" style="color: #94a3b8; text-decoration: none;">redeemkart.in</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

module.exports = { buildOtpEmail };
