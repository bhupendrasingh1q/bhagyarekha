import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

console.log("Testing email with user:", process.env.EMAIL_USER);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function run() {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Test Email from AstroJyoti",
      text: "If you receive this, Nodemailer is working!"
    });
    console.log("Email sent successfully!", info.messageId);
  } catch (err) {
    console.error("Failed to send email:", err);
  }
}

run();
