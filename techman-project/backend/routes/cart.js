// =============================================
// routes/cart.js - Shopping Cart
// =============================================
const express = require('express');
const router  = express.Router();
const authMW  = require('../middleware/auth');
const db      = require('../models/db');

// Helper: Get user cart with product details
function getCartWithDetails(userId) {
  const items = db.carts[userId] || [];
  let total = 0;
  const detailed = items.map(item => {
    const product = db.products.find(p => p.id === item.productId);
    if (!product) return null;
    const subtotal = product.price * item.qty;
    total += subtotal;
    return {
      productId: item.productId,
      name:      product.name,
      brand:     product.brand,
      image:     product.image,
      price:     product.price,
      qty:       item.qty,
      subtotal
    };
  }).filter(Boolean);

  return { items: detailed, total, itemCount: detailed.reduce((s, i) => s + i.qty, 0) };
}

// GET /api/cart - Cart dekho (protected)
router.get('/', authMW, (req, res) => {
  res.json(getCartWithDetails(req.user.id));
});

// POST /api/cart/add - Product add karo
router.post('/add', authMW, (req, res) => {
  const { productId, qty = 1 } = req.body;

  if (!productId) return res.status(400).json({ error: 'productId zaroori hai.' });

  const product = db.products.find(p => p.id === Number(productId));
  if (!product) return res.status(404).json({ error: 'Product nahi mila.' });

  if (product.stock < qty) {
    return res.status(400).json({ error: `Sirf ${product.stock} items available hain.` });
  }

  if (!db.carts[req.user.id]) db.carts[req.user.id] = [];

  const existingIndex = db.carts[req.user.id].findIndex(i => i.productId === Number(productId));
  if (existingIndex >= 0) {
    db.carts[req.user.id][existingIndex].qty += Number(qty);
  } else {
    db.carts[req.user.id].push({ productId: Number(productId), qty: Number(qty) });
  }

  res.json({
    message: `"${product.name}" cart mein add ho gaya! 🛒`,
    cart:    getCartWithDetails(req.user.id)
  });
});

// PUT /api/cart/update - Quantity update karo
router.put('/update', authMW, (req, res) => {
  const { productId, qty } = req.body;

  if (!productId || qty === undefined) {
    return res.status(400).json({ error: 'productId aur qty zaroori hain.' });
  }

  if (!db.carts[req.user.id]) {
    return res.status(404).json({ error: 'Cart khaali hai.' });
  }

  const index = db.carts[req.user.id].findIndex(i => i.productId === Number(productId));
  if (index === -1) {
    return res.status(404).json({ error: 'Yeh product cart mein nahi hai.' });
  }

  if (Number(qty) <= 0) {
    // Remove item
    db.carts[req.user.id].splice(index, 1);
    return res.json({ message: 'Product cart se hata diya.', cart: getCartWithDetails(req.user.id) });
  }

  db.carts[req.user.id][index].qty = Number(qty);
  res.json({ message: 'Quantity update ho gayi.', cart: getCartWithDetails(req.user.id) });
});

// DELETE /api/cart/remove/:productId - Product remove karo
router.delete('/remove/:productId', authMW, (req, res) => {
  if (!db.carts[req.user.id]) {
    return res.status(404).json({ error: 'Cart khaali hai.' });
  }
  db.carts[req.user.id] = db.carts[req.user.id].filter(
    i => i.productId !== Number(req.params.productId)
  );
  res.json({ message: 'Product hata diya gaya.', cart: getCartWithDetails(req.user.id) });
});

// DELETE /api/cart/clear - Poora cart saaf karo
router.delete('/clear', authMW, (req, res) => {
  db.carts[req.user.id] = [];
  res.json({ message: 'Cart saaf ho gaya.' });
});

module.exports = router;
