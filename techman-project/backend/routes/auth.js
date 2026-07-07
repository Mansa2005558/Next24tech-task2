// =============================================
// routes/auth.js - User Register & Login
// =============================================
const express  = require('express');
const router   = express.Router();
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const authMW   = require('../middleware/auth');
const db       = require('../models/db');

const JWT_SECRET = process.env.JWT_SECRET || 'techman_secret_key_2024';
const JWT_EXPIRY = '7d';

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Naam, email aur password zaroori hain.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password kam se kam 6 characters ka hona chahiye.' });
    }

    const exists = db.users.find(u => u.email === email.toLowerCase());
    if (exists) {
      return res.status(409).json({ error: 'Yeh email pehle se registered hai.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = {
      id:    db.incUserId(),
      name:  name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      createdAt: new Date().toISOString()
    };
    db.users.push(newUser);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, name: newUser.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    res.status(201).json({
      message: `Swagat hai, ${newUser.name}! Account ban gaya. 🎉`,
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email }
    });
  } catch (err) {
    res.status(500).json({ error: 'Registration mein problem aayi.', detail: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email aur password dono chahiye.' });
    }

    const user = db.users.find(u => u.email === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: 'Email ya password galat hai.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Email ya password galat hai.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    res.json({
      message: `Wapas aaye, ${user.name}! 👋`,
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ error: 'Login mein problem aayi.', detail: err.message });
  }
});

// GET /api/auth/profile (protected)
router.get('/profile', authMW, (req, res) => {
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User nahi mila.' });

  // User ke orders
  const userOrders = db.orders.filter(o => o.userId === req.user.id);

  res.json({
    user:   { id: user.id, name: user.name, email: user.email, joinedAt: user.createdAt },
    orders: userOrders
  });
});

module.exports = router;
