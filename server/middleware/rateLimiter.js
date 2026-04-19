const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many attempts, try again after 15 minutes' },
  handler: (req, res) => {
    res.status(429).json({ success: false, message: 'Too many attempts, try again after 15 minutes' });
  }
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, slow down' },
  handler: (req, res) => {
    res.status(429).json({ success: false, message: 'Too many requests, slow down' });
  }
});

module.exports = { authLimiter, apiLimiter };