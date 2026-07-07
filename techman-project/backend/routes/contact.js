// =============================================
// routes/contact.js - Contact Form
// =============================================
const express = require('express');
const router  = express.Router();
const db      = require('../models/db');

// POST /api/contact - Contact form submit karo
router.post('/', (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Naam, email aur message zaroori hain.' });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Valid email address daalen.' });
  }

  const submission = {
    id:          db.contacts.length + 1,
    name:        name.trim(),
    email:       email.toLowerCase().trim(),
    phone:       phone || null,
    subject:     subject || 'General Inquiry',
    message:     message.trim(),
    submittedAt: new Date().toISOString()
  };

  db.contacts.push(submission);

  console.log(`📩 New contact form: ${name} <${email}> - "${submission.subject}"`);

  res.status(201).json({
    message: `Shukriya ${name}! Aapka message mil gaya. Hum jaldi reply karenge. 😊`,
    ticketId: `TICKET-${String(submission.id).padStart(4, '0')}`
  });
});

// GET /api/contact (admin use ke liye)
router.get('/', (req, res) => {
  res.json({ count: db.contacts.length, submissions: db.contacts });
});

module.exports = router;
