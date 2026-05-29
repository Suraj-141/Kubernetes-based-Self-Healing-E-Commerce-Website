const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/pay', (req, res) => {
  const { orderId, amount, userId } = req.body;
  
  // Mock payment processing logic
  // Let's simulate a 90% success rate
  const isSuccess = Math.random() < 0.9;
  
  setTimeout(() => {
    if (isSuccess) {
      res.json({ success: true, message: 'Payment processed successfully', transactionId: `TXN-${Math.floor(Math.random() * 1000000)}` });
    } else {
      res.status(400).json({ success: false, message: 'Payment declined' });
    }
  }, 1000); // 1 second delay to simulate processing
});

app.get('/health', (req, res) => res.status(200).send('OK'));

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Payment Service running on port ${PORT}`);
});
