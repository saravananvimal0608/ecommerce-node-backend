import nodemailer from "nodemailer";
import dns from "dns";
import { promisify } from "util";

const resolve4 = promisify(dns.resolve4);

if (!process.env.GOOGLE_APP_PASSWORD) {
  console.log("GOOGLE_APP_PASSWORD is required in env");
}

export const emailSend = async ({ email, subject, html }) => {
  const [smtpIp] = await resolve4("smtp.gmail.com");

  const transporter = nodemailer.createTransport({
    host: smtpIp,
    port: 587,
    secure: false,
    tls: { servername: "smtp.gmail.com" },
    auth: {
      user: "saravananvimal0608@gmail.com",
      pass: process.env.GOOGLE_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: "saravananvimal0608@gmail.com",
    to: email,
    subject: subject,
    html: html,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("Email sent: " + info.response);
};
