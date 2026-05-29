const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'postgres-service',
  database: process.env.DB_NAME || 'ecommerce',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://product-service:3002';
const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || 'http://payment-service:3004';

const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        total_price DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'PENDING'
      );
    `);
    console.log('Order table initialized');
  } catch (err) {
    console.error('Error initializing order table', err);
  }
};

initDb();

app.post('/orders', async (req, res) => {
  const { userId, productId, quantity, price } = req.body;
  if (!userId || !productId || !quantity || !price) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const totalPrice = price * quantity;

  try {
    // 1. Check & Deduct Stock from Product Service
    try {
      await axios.post(`${PRODUCT_SERVICE_URL}/products/${productId}/deduct`, { quantity });
    } catch (err) {
      return res.status(400).json({ message: 'Failed to deduct stock. May be out of stock.', error: err.message });
    }

    // 2. Create Order as PENDING
    const result = await pool.query(
      'INSERT INTO orders (user_id, product_id, quantity, total_price, status) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [userId, productId, quantity, totalPrice, 'PENDING']
    );
    const orderId = result.rows[0].id;

    // 3. Process Payment
    try {
      const paymentRes = await axios.post(`${PAYMENT_SERVICE_URL}/pay`, {
        orderId,
        amount: totalPrice,
        userId
      });

      if (paymentRes.data.success) {
        // Update to PAID
        await pool.query('UPDATE orders SET status = $1 WHERE id = $2', ['PAID', orderId]);
        return res.status(201).json({ message: 'Order placed and paid successfully', orderId, status: 'PAID' });
      } else {
        await pool.query('UPDATE orders SET status = $1 WHERE id = $2', ['PAYMENT_FAILED', orderId]);
        return res.status(400).json({ message: 'Payment failed', orderId, status: 'PAYMENT_FAILED' });
      }
    } catch (err) {
      await pool.query('UPDATE orders SET status = $1 WHERE id = $2', ['PAYMENT_ERROR', orderId]);
      return res.status(500).json({ message: 'Payment error', orderId, status: 'PAYMENT_ERROR', error: err.message });
    }
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

app.get('/orders/:userId', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders WHERE user_id = $1 ORDER BY id DESC', [req.params.userId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders', error: err.message });
  }
});

app.get('/health', (req, res) => res.status(200).send('OK'));

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Order Service running on port ${PORT}`);
});
