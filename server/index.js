require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
}));
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/vision', require('./routes/vision'));
app.use('/api/maps', require('./routes/maps'));
app.use('/api/analytics', require('./routes/analytics'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'SmartCart AI API' });
});

app.listen(PORT, () => {
  console.log(`🚀 SmartCart AI Server running on port ${PORT}`);
});
