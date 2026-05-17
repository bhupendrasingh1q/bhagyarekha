import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function run() {
  const data = {
    email: 'princesingh80555@gmail.com',
    name: 'gmailcheck3',
    totalPrice: 248,
    dob: '2222-02-02',
    tob: '14:02',
    pobCity: 'Delhi',
    pobState: 'Delhi',
    addons: ['personality']
  };

  try {
    const selectedServices = ['Soulmate Sketch'];
    if (data.addons && data.addons.includes('personality')) selectedServices.push('Detailed Name & Personality Report');
    if (data.addons && data.addons.includes('timeline')) selectedServices.push('Love Timeline (12 Months)');

    const servicesHtml = selectedServices.map(s => `<li>${s}</li>`).join('');

    const mailOptions = {
      from: `"BhagyaRekha" <${process.env.EMAIL_USER}>`,
      to: data.email,
      subject: 'Payment Successful - BhagyaRekha Order Confirmation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #F97316; margin-bottom: 5px;">Order Confirmed!</h2>
            <p style="color: #666; margin-top: 0;">Thank you for choosing BhagyaRekha.</p>
          </div>
          
          <p>Dear <strong>${data.name}</strong>,</p>
          <p>We have successfully received your payment of <strong>₹${data.totalPrice}</strong>.</p>
          
          <div style="background-color: #fffaf0; padding: 20px; border-radius: 8px; border: 1px solid #ffedd5; margin: 25px 0;">
            <h3 style="margin-top: 0; color: #F97316; border-bottom: 1px solid #ffedd5; padding-bottom: 10px;">Services Requested</h3>
            <ul style="margin-bottom: 0;">
              ${servicesHtml}
            </ul>
          </div>

          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; border: 1px solid #eee; margin: 25px 0;">
            <h3 style="margin-top: 0; color: #555; border-bottom: 1px solid #eee; padding-bottom: 10px;">Your Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 5px 0; color: #666;"><strong>Date of Birth:</strong></td><td style="padding: 5px 0;">${data.dob || 'Not provided'}</td></tr>
              <tr><td style="padding: 5px 0; color: #666;"><strong>Time of Birth:</strong></td><td style="padding: 5px 0;">${data.tob || 'Not provided'}</td></tr>
              <tr><td style="padding: 5px 0; color: #666;"><strong>Place of Birth:</strong></td><td style="padding: 5px 0;">${data.pobCity || ''}, ${data.pobState || ''}</td></tr>
            </table>
          </div>

          <p style="background-color: #f0fdf4; padding: 15px; border-radius: 8px; border-left: 4px solid #22c55e;">
            Our intuitive artists and readers will begin meditating on your birth energy immediately. You will receive your completed sketch and reading via email within the next <strong>4 working hours</strong>.
          </p>
          
          <p style="margin-top: 30px;">If you have any questions, feedback, or require assistance, please reply directly to this email at <a href="mailto:${process.env.EMAIL_USER}" style="color: #F97316; text-decoration: none;">${process.env.EMAIL_USER}</a>.</p>

          <p style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; color: #666;">
            Warm regards,<br/>
            <strong>The BhagyaRekha Team</strong>
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Success email sent to ${data.email}, ID: ${info.messageId}`);
  } catch (emailError) {
    console.error('Error sending success email:', emailError);
  }
}

run();
