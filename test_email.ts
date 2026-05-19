import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.RESEND_API_KEY || 're_L1RRE6dD_BhFX4bzxiPQJb5TXKbjUbvTn';
const fromEmail = process.env.RESEND_FROM_EMAIL || 'team@bhagyarekha.online';
const toEmail = 'bhagyarekhateam@gmail.com';

console.log("Testing Resend API...");
console.log("API Key:", apiKey.substring(0, 10) + "...");
console.log("From Email:", fromEmail);
console.log("To Email:", toEmail);

async function run() {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: `BhagyaRekha <${fromEmail}>`,
        to: [toEmail],
        subject: "Test Resend Email from BhagyaRekha",
        html: "<p>If you receive this, Resend HTTP API integration is working perfectly!</p>"
      })
    });

    const data = await response.json();
    console.log("Resend Status Code:", response.status);
    console.log("Resend Response Data:", data);
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}

run();
