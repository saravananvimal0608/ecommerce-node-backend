import nodemailer from "nodemailer";

if (!process.env.GOOGLE_APP_PASSWORD) {
  console.log("GOOGLE_APP_PASSWORD is required in env");
}

export const emailSend = async ({email,subject,html}) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
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

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
