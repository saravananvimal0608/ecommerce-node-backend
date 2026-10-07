import { BrevoClient } from "@getbrevo/brevo";

export const emailSend = async ({ email, subject, html }) => {
  const client = new BrevoClient({ apiKey: process.env.BREVO_API_KEY });
  const response = await client.transactionalEmails.sendTransacEmail({
    sender: {
      email: process.env.BREVO_SENDER_EMAIL,
      name: process.env.BREVO_SENDER_NAME || "Blinkit",
    },
    to: [{ email }],
    subject,
    htmlContent: html,
  });
  console.log("Email sent: " + response.data?.messageId);
};
