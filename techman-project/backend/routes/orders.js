// =============================================
// routes/orders.js - Order Management
// =============================================
const express = require('express');
const router  = express.Router();
const authMW  = require('../middleware/auth');
const db      = require('../models/db');

// POST /api/orders/place - Order place karo (checkout)
router.post('/place', authMW, (req, res) => {
  const { address, paymentMethod = 'COD' } = req.body;

  if (!address || !address.street || !address.city || !address.pincode) {
    return res.status(400).json({
      error: 'Poora address chahiye: street, city, pincode'
    });
  }

  const cartItems = db.carts[req.user.id] || [];
  if (cartItems.length === 0) {
    return res.status(400).json({ error: 'Cart khaali hai. Pehle products add karein.' });
  }

  // Build order items & check stock
  let total = 0;
  const orderItems = [];
  for (const item of cartItems) {
    const product = db.products.find(p => p.id === item.productId);
    if (!product) continue;
    if (product.stock < item.qty) {
      return res.status(400).json({
        error: `"${product.name}" ka stock ${item.qty} se kam hai. Sirf ${product.stock} available.`
      });
    }
    const subtotal = product.price * item.qty;
    total += subtotal;
    orderItems.push({
      productId: product.id,
      name:      product.name,
      image:     product.image,
      price:     product.price,
      qty:       item.qty,
      subtotal
    });
  }

  // Deduct stock
  orderItems.forEach(item => {
    const product = db.products.find(p => p.id === item.productId);
    if (product) product.stock -= item.qty;
  });

  const newOrder = {
    id:            db.incOrderId(),
    userId:        req.user.id,
    userName:      req.user.name,
    items:         orderItems,
    total,
    address,
    paymentMethod,
    status:        'Confirmed',
    placedAt:      new Date().toISOString(),
    estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
  };

  db.orders.push(newOrder);
  db.carts[req.user.id] = []; // Cart clear

  res.status(201).json({
    message: `Order #${newOrder.id} place ho gaya! 🎉 Estimated delivery: ${new Date(newOrder.estimatedDelivery).toDateString()}`,
    order: newOrder
  });
});

// GET /api/orders - Apne orders dekho
router.get('/', authMW, (req, res) => {
  const myOrders = db.orders
    .filter(o => o.userId === req.user.id)
    .sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt));

  res.json({ count: myOrders.length, orders: myOrders });
});

// GET /api/orders/:id - Single order detail
router.get('/:id', authMW, (req, res) => {
  const order = db.orders.find(
    o => o.id === Number(req.params.id) && o.userId === req.user.id
  );
  if (!order) {
    return res.status(404).json({ error: 'Order nahi mila.' });
  }
  res.json(order);
});

// PUT /api/orders/:id/cancel - Order cancel karo (sirf Confirmed status mein)
router.put('/:id/cancel', authMW, (req, res) => {
  const order = db.orders.find(
    o => o.id === Number(req.params.id) && o.userId === req.user.id
  );
  if (!order) return res.status(404).json({ error: 'Order nahi mila.' });
  if (order.status !== 'Confirmed') {
    return res.status(400).json({ error: `Order "${order.status}" state mein hai, cancel nahi ho sakta.` });
  }

  // Restore stock
  order.items.forEach(item => {
    const product = db.products.find(p => p.id === item.productId);
    if (product) product.stock += item.qty;
  });

  order.status = 'Cancelled';
  order.cancelledAt = new Date().toISOString();
  res.json({ message: `Order #${order.id} cancel ho gaya.`, order });
});

module.exports = router;
