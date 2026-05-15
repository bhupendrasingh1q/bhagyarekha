import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

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
app.use(helmet()); 
app.use(cors()); 

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

app.post('/api/orders/:id/pay', async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentMethod, addons, totalPrice } = req.body;
    
    // Update in Supabase
    const updateData: any = {
      status: 'paid',
      paymentMethod: paymentMethod || 'unknown',
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

    res.json({ success: true, message: 'Payment successful', order: data });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Secure Backend server running on http://localhost:${PORT}`);
});
