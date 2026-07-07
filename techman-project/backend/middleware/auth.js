// =============================================
// middleware/auth.js - JWT Authentication
// =============================================
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'techman_secret_key_2024';

module.exports = function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token nahi mila. Login karein.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, email, name }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid ya expire ho gaya.' });
  }
};
