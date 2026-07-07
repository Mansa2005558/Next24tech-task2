// =============================================
// TechMan E-commerce Backend Server
// =============================================
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ---- Middleware ----
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (original frontend)
app.use(express.static(path.join(__dirname, 'public')));

// ---- Routes ----
app.use('/api/products', require('./routes/products'));
app.use('/api/cart',     require('./routes/cart'));
app.use('/api/orders',   require('./routes/orders'));
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/contact',  require('./routes/contact'));
app.use('/api/coupon',   require('./routes/coupon'));

// Root route — friendly message so hitting localhost:3000 directly isn't confusing
app.get('/', (req, res) => {
  res.json({
    message: 'TechMan Backend chal raha hai! 🚀 Ye ek API server hai, ismein koi webpage nahi hai.',
    frontend: 'Apna frontend (Index.html) alag se Live Server (VS Code) mein kholiye — usually http://127.0.0.1:5500',
    available_routes: [
      'GET  /api/health',
      'GET  /api/products',
      'GET  /api/products/:id',
      'GET  /api/products/categories',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET  /api/auth/profile        (needs token)',
      'GET  /api/cart                (needs token)',
      'POST /api/cart/add            (needs token)',
      'PUT  /api/cart/update         (needs token)',
      'DELETE /api/cart/remove/:id   (needs token)',
      'DELETE /api/cart/clear        (needs token)',
      'POST /api/orders/place        (needs token)',
      'GET  /api/orders              (needs token)',
      'PUT  /api/orders/:id/cancel   (needs token)',
      'POST /api/contact',
      'GET  /api/contact',
      'POST /api/coupon/apply        (needs token)',
      'GET  /api/coupon/list'
    ]
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'TechMan Backend chal raha hai! 🚀' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route nahi mili',
    tried: req.method + ' ' + req.originalUrl,
    hint: 'Sahi endpoint ke liye http://localhost:3000/ kholiye — waha available routes ki list milegi.'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error aaya', detail: err.message });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📦 Products API: http://localhost:${PORT}/api/products`);
  console.log(`🛒 Cart API:     http://localhost:${PORT}/api/cart`);
  console.log(`📋 Orders API:   http://localhost:${PORT}/api/orders`);
  console.log(`👤 Auth API:     http://localhost:${PORT}/api/auth`);
});
