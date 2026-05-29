const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

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

const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        stock_quantity INTEGER NOT NULL DEFAULT 0
      );
    `);
    
    // Seed initial data if empty
    const { rows } = await pool.query('SELECT COUNT(*) FROM products');
    if (parseInt(rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO products (name, description, price, stock_quantity) VALUES 
        ('Wireless Headphones', 'High quality noise-cancelling headphones', 199.99, 50),
        ('Mechanical Keyboard', 'RGB mechanical keyboard with blue switches', 89.50, 20),
        ('Gaming Mouse', 'Ergonomic gaming mouse with adjustable DPI', 45.00, 100),
        ('27-inch Monitor', '4K UHD IPS display', 349.99, 15)
      `);
      console.log('Products seeded');
    }
    
    console.log('Product table initialized');
  } catch (err) {
    console.error('Error initializing product table', err);
  }
};

initDb();

app.get('/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products', error: err.message });
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Product not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching product', error: err.message });
  }
});

// Used by order service to deduct stock
app.post('/products/:id/deduct', async (req, res) => {
  const { quantity } = req.body;
  const productId = req.params.id;
  
  try {
    // Begin transaction
    await pool.query('BEGIN');
    const result = await pool.query('SELECT stock_quantity FROM products WHERE id = $1 FOR UPDATE', [productId]);
    
    if (result.rows.length === 0) {
      await pool.query('ROLLBACK');
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const currentStock = result.rows[0].stock_quantity;
    if (currentStock < quantity) {
      await pool.query('ROLLBACK');
      return res.status(400).json({ message: 'Insufficient stock' });
    }
    
    await pool.query('UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2', [quantity, productId]);
    await pool.query('COMMIT');
    res.json({ message: 'Stock deducted successfully' });
  } catch (err) {
    await pool.query('ROLLBACK');
    res.status(500).json({ message: 'Error updating stock', error: err.message });
  }
});

// A computationally intensive endpoint to simulate load for HPA testing
app.get('/compute', (req, res) => {
  let x = 0.0001;
  for (let i = 0; i <= 5000000; i++) {
    x += Math.sqrt(x);
  }
  res.send(`Computed value: ${x}`);
});

app.get('/health', (req, res) => res.status(200).send('OK'));

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Product Service running on port ${PORT}`);
});
