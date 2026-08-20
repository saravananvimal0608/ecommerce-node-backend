import { BrevoClient } from "@getbrevo/brevo";

if (!process.env.BREVO_API_KEY) {
  console.log("BREVO_API_KEY is required in env");
}

const brevo = new BrevoClient({ apiKey: process.env.BREVO_API_KEY });

export const emailSend = async ({ email, subject, html }) => {
  const { body } = await brevo.transactionalEmails.sendTransacEmail({
    sender: { name: "Blinkit", email: "saravananvimal0608@gmail.com" },
    to: [{ email }],
    subject,
    htmlContent: html,
  });

  console.log("Email sent: " + body.messageId);
};
