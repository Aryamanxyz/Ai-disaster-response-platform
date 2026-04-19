const express = require('express');
const router = express.Router();
const {
  getAllAlerts,
  createAlert,
  markAsRead
} = require('../controllers/alertController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getAllAlerts);
router.post('/', protect, createAlert);
router.put('/:id/read', protect, markAsRead);

module.exports = router;