const express = require('express');
const router = express.Router();
const {
  getAllResources,
  createResource,
  updateResource,
  deleteResource,
  allocateResource
} = require('../controllers/resourceController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, getAllResources);
router.post('/', protect, adminOnly, createResource);
router.put('/:id', protect, updateResource);
router.delete('/:id', protect, adminOnly, deleteResource);
router.post('/allocate', protect, allocateResource);

module.exports = router;