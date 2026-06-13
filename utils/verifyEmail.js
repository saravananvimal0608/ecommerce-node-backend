const verifyEmail = (name, url) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
            <!-- Header -->
            <tr>
              <td style="background:#2563eb;padding:32px 40px;text-align:center;">
                <h1 style="margin:0;color:#ffffff;font-size:26px;letter-spacing:1px;">🛒 Blinkit</h1>
              </td>
            </tr>
            <!-- Body -->
            <tr>
              <td style="padding:40px;">
                <h2 style="margin:0 0 12px;color:#1e293b;font-size:22px;">Hi ${name},</h2>
                <p style="margin:0 0 20px;color:#475569;font-size:15px;line-height:1.6;">
                  Thank you for registering with <strong>Blinkit</strong>! Please verify your email address to activate your account.
                </p>
                <table cellpadding="0" cellspacing="0" style="margin:28px 0;">
                  <tr>
                    <td style="background:#2563eb;border-radius:6px;">
                      <a href="${url}" style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:15px;font-weight:bold;text-decoration:none;border-radius:6px;">Verify Email Address</a>
                    </td>
                  </tr>
                </table>
                <p style="margin:0 0 8px;color:#94a3b8;font-size:13px;">If the button doesn't work, copy and paste this link:</p>
                <p style="margin:0;word-break:break-all;"><a href="${url}" style="color:#2563eb;font-size:13px;">${url}</a></p>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="background:#f8fafc;padding:24px 40px;text-align:center;border-top:1px solid #e2e8f0;">
                <p style="margin:0;color:#94a3b8;font-size:12px;">If you didn't create an account, you can safely ignore this email.</p>
                <p style="margin:8px 0 0;color:#94a3b8;font-size:12px;">© ${new Date().getFullYear()} Blinkit. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};

export default verifyEmail;