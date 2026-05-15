import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'data', 'orders.json');

// Security Middleware
app.use(helmet()); // Sets various HTTP headers for security
app.use(cors()); // Enable CORS for all routes (can be restricted to frontend URL in production)

// Body parsing with size limits to prevent payload attacks
app.use(express.json({ limit: '10kb' })); 

// Ensure data directory and file exist
async function initDataFile() {
  const dataDir = path.join(__dirname, 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }

  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, '[]');
  }
}

// Basic validation function
function validateOrderData(data: any) {
  const requiredFields = ['name', 'email', 'phone', 'gender'];
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

    // Read existing orders
    let currentOrders = [];
    try {
      const fileData = await fs.readFile(DATA_FILE, 'utf8');
      currentOrders = JSON.parse(fileData);
    } catch (err) {
      console.error('Error reading orders file:', err);
      currentOrders = []; // Fallback to empty array if read fails
    }

    // Create new order with metadata
    const newOrder = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      ...orderData,
      createdAt: new Date().toISOString(),
      status: 'pending' // Initial status
    };

    // Add and save
    currentOrders.push(newOrder);
    await fs.writeFile(DATA_FILE, JSON.stringify(currentOrders, null, 2));

    console.log(`New order received from ${newOrder.name} (${newOrder.email})`);

    // Simulate slight delay for processing
    setTimeout(() => {
       res.status(201).json({ 
        success: true, 
        message: 'Order placed successfully',
        orderId: newOrder.id 
      });
    }, 1000);

  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.get('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const fileData = await fs.readFile(DATA_FILE, 'utf8');
    const orders = JSON.parse(fileData);
    
    const order = orders.find((o: any) => o.id === id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.post('/api/orders/:id/pay', async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentMethod } = req.body;
    
    const fileData = await fs.readFile(DATA_FILE, 'utf8');
    const orders = JSON.parse(fileData);
    
    const orderIndex = orders.findIndex((o: any) => o.id === id);
    if (orderIndex === -1) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Update status
    orders[orderIndex].status = 'paid';
    orders[orderIndex].paymentMethod = paymentMethod || 'unknown';
    orders[orderIndex].paidAt = new Date().toISOString();

    await fs.writeFile(DATA_FILE, JSON.stringify(orders, null, 2));

    res.json({ success: true, message: 'Payment successful', order: orders[orderIndex] });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Start server
initDataFile().then(() => {
  app.listen(PORT, () => {
    console.log(`Secure Backend server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize backend:', err);
});
