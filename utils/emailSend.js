import { BrevoClient } from "@getbrevo/brevo";

if (!process.env.BREVO_API_KEY) {
  console.log("BREVO_API_KEY is required in env");
}

const client = new BrevoClient({ apiKey: process.env.BREVO_API_KEY });

export const emailSend = async ({ email, subject, html }) => {
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
