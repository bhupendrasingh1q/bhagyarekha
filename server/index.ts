import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Define ESM equivalents for __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Security Middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        // Allow loading the Razorpay checkout script
        "script-src": ["'self'", "https://checkout.razorpay.com", "https://cdn.razorpay.com"],
        // Allow client-side checkout to connect to Razorpay APIs
        "connect-src": ["'self'", "https://api.razorpay.com"],
        // Allow the payment form inside an iframe
        "frame-src": ["'self'", "https://api.razorpay.com", "https://checkout.razorpay.com"],
        // Allow Razorpay asset images
        "img-src": ["'self'", "https://cdn.razorpay.com", "data:"],
      },
    },
    // Allow external pages (bank gateways, UPI deep-links) to open in popups
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  })
);
app.use(cors()); 


// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || ''
}); 

// Initialize Nodemailer with explicit secure SMTP configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // Use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Body parsing with size limits to prevent payload attacks
app.use(express.json({ limit: '10kb' })); 

// Basic validation function
function validateOrderData(data: any) {
  const requiredFields = ['name', 'email', 'phone', 'gender', 'tob', 'pobCity', 'pobState'];
  const errors: string[] = [];

  for (const field of requiredFields) {
    if (!data[field] || typeof data[field] !== 'string' || data[field].trim() === '') {
      errors.push(`${field} is required and must be a string.`);
    }
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (data.email && !emailRegex.test(data.email)) {
    errors.push('Invalid email format.');
  }

  return errors;
}

// API Routes
app.post('/api/orders', async (req, res) => {
  try {
    const orderData = req.body;

    // Validate incoming data
    const validationErrors = validateOrderData(orderData);
    if (validationErrors.length > 0) {
      return res.status(400).json({ success: false, errors: validationErrors });
    }

    // Create new order
    const newOrder = {
      name: orderData.name,
      email: orderData.email,
      phone: orderData.phone,
      gender: orderData.gender,
      dob: orderData.dob,
      tob: orderData.tob,
      pobCity: orderData.pobCity,
      pobState: orderData.pobState,
      status: 'pending'
    };

    // Insert into Supabase
    const { data, error } = await supabase
      .from('orders')
      .insert([newOrder])
      .select();

    if (error) {
      console.error('Supabase Insert Error:', error);
      return res.status(500).json({ success: false, message: 'Database Error' });
    }

    console.log(`New order received from ${newOrder.name} (${newOrder.email})`);

    res.status(201).json({ 
      success: true, 
      message: 'Order placed successfully',
      orderId: data[0].id 
    });

  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.get('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, order: data });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.post('/api/orders/:id/create-razorpay-order', async (req, res) => {
  try {
    const { id } = req.params;
    const { totalPrice } = req.body;

    if (!totalPrice) {
      return res.status(400).json({ success: false, message: 'Total price is required' });
    }

    const options = {
      amount: totalPrice * 100, // paise
      currency: "INR",
      receipt: id,
    };

    const order = await razorpay.orders.create(options);

    res.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.post('/api/orders/:id/verify-payment', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      paymentMethod,
      addons,
      totalPrice
    } = req.body;
    
    // Check if this is a mock payment or actual razorpay payment
    // If it's razorpay, verify signature
    if (razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      const text = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || '')
        .update(text.toString())
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ success: false, message: 'Invalid payment signature' });
      }
    }

    // Update in Supabase
    const updateData: any = {
      status: 'paid',
      paymentMethod: paymentMethod || 'razorpay',
      paidAt: new Date().toISOString()
    };
    
    if (addons) updateData.addons = addons;
    if (totalPrice) updateData.totalPrice = totalPrice;

    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      console.error('Supabase Update Error:', error);
      return res.status(404).json({ success: false, message: 'Order not found or update failed' });
    }

    // Send Success Email via Resend HTTP API
    try {
      const selectedServices = ['Soulmate Sketch'];
      if (data.addons && data.addons.includes('personality')) selectedServices.push('Detailed Name & Personality Report');
      if (data.addons && data.addons.includes('timeline')) selectedServices.push('Love Timeline (12 Months)');

      const servicesHtml = selectedServices.map(s => `<li>${s}</li>`).join('');
      
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'team@bhagyarekha.online';

      const emailPayload = {
        from: `BhagyaRekha <${fromEmail}>`,
        to: [data.email],
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
            
            <p style="margin-top: 30px;">If you have any questions, feedback, or require assistance, please reply directly to this email at <a href="mailto:${fromEmail}" style="color: #F97316; text-decoration: none;">${fromEmail}</a>.</p>

            <p style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; color: #666;">
              Warm regards,<br/>
              <strong>The BhagyaRekha Team</strong>
            </p>
          </div>
        `
      };

      // Send non-blocking HTTP POST request to Resend API
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailPayload)
      })
        .then(async (response) => {
          const responseData = await response.json();
          if (response.ok) {
            console.log(`Success email sent to ${data.email} via Resend:`, responseData);
          } else {
            console.error('Resend API returned an error:', responseData);
          }
        })
        .catch(emailError => console.error('Error calling Resend API:', emailError));

    } catch (emailError) {
      console.error('Error constructing success email:', emailError);
    }

    res.json({ success: true, message: 'Payment successful', order: data });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Serve React static files from dist folder in production
app.use(express.static(path.join(__dirname, '../dist')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Secure Backend server running on http://localhost:${PORT}`);
});
