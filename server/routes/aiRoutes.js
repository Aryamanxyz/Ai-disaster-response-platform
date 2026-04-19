const express = require('express');
const router = express.Router();
const {
  analyzeIncident,
  getSuggestions,
  chat,
  getRiskScore
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.get('/analyze/:id', protect, analyzeIncident);
router.post('/suggest', protect, getSuggestions);
router.post('/chat', protect, chat);
router.get('/risk/:id', protect, getRiskScore);

module.exports = router;