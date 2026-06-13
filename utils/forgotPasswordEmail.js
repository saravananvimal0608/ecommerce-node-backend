const forgotPasswordEmail = (name, token, expireTime) => {
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
                <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.6;">
                  We received a request to reset your password. Use the OTP below to proceed.
                </p>
                <!-- OTP Box -->
                <table cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 24px;">
                  <tr>
                    <td align="center" style="background:#f1f5f9;border-radius:8px;padding:24px;border:1px dashed #cbd5e1;">
                      <p style="margin:0 0 6px;color:#64748b;font-size:13px;letter-spacing:1px;text-transform:uppercase;">Your OTP</p>
                      <p style="margin:0;color:#2563eb;font-size:36px;font-weight:bold;letter-spacing:8px;">${token}</p>
                    </td>
                  </tr>
                </table>
                <p style="margin:0;color:#ef4444;font-size:13px;">⏰ This OTP expires at: <strong>${expireTime.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</strong></p>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="background:#f8fafc;padding:24px 40px;text-align:center;border-top:1px solid #e2e8f0;">
                <p style="margin:0;color:#94a3b8;font-size:12px;">If you didn't request a password reset, please ignore this email.</p>
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

export default forgotPasswordEmail;
