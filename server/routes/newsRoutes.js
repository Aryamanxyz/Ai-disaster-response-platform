const express = require('express');
const router = express.Router();
const { getDisasterNews } = require('../controllers/newsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getDisasterNews);

module.exports = router;