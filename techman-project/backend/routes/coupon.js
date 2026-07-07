// =============================================
// routes/coupon.js - Coupon Validation
// =============================================
const express = require('express');
const router  = express.Router();
const authMW  = require('../middleware/auth');
const db      = require('../models/db');

// POST /api/coupon/apply - Coupon lagao
router.post('/apply', authMW, (req, res) => {
  const { code } = req.body;

  if (!code) return res.status(400).json({ error: 'Coupon code daalen.' });

  const coupon = db.coupons.find(c => c.code === code.toUpperCase().trim());
  if (!coupon) {
    return res.status(404).json({ error: 'Yeh coupon code valid nahi hai.' });
  }

  // Calculate cart total
  const cartItems = db.carts[req.user.id] || [];
  if (cartItems.length === 0) {
    return res.status(400).json({ error: 'Cart khaali hai.' });
  }

  let cartTotal = 0;
  cartItems.forEach(item => {
    const product = db.products.find(p => p.id === item.productId);
    if (product) cartTotal += product.price * item.qty;
  });

  if (cartTotal < coupon.minOrder) {
    return res.status(400).json({
      error: `Is coupon ke liye minimum order RS. ${coupon.minOrder} hona chahiye. Aapka cart total RS. ${cartTotal} hai.`
    });
  }

  let discount = 0;
  if (coupon.type === 'percent') {
    discount = Math.round((cartTotal * coupon.discount) / 100);
  } else {
    discount = coupon.discount;
  }

  const finalAmount = cartTotal - discount;

  res.json({
    message:     `Coupon "${coupon.code}" apply ho gaya! 🎉`,
    cartTotal,
    discount,
    discountType: coupon.type === 'percent' ? `${coupon.discount}% off` : `RS. ${coupon.discount} flat off`,
    finalAmount
  });
});

// GET /api/coupon/list - Available coupons
router.get('/list', (req, res) => {
  const publicCoupons = db.coupons.map(c => ({
    code:      c.code,
    offer:     c.type === 'percent' ? `${c.discount}% Off` : `RS. ${c.discount} Off`,
    minOrder:  c.minOrder
  }));
  res.json({ coupons: publicCoupons });
});

module.exports = router;
