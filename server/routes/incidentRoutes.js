const express = require('express');
const router = express.Router();
const {
  getAllIncidents,
  getIncidentById,
  createIncident,
  updateIncident,
  deleteIncident,
  getActiveIncidents,
  getNearbyIncidents
} = require('../controllers/incidentController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/active', protect, getActiveIncidents);
router.get('/nearby', protect, getNearbyIncidents);
router.get('/', protect, getAllIncidents);
router.get('/:id', protect, getIncidentById);
router.post('/', protect, createIncident);
router.put('/:id', protect, updateIncident);
router.delete('/:id', protect, adminOnly, deleteIncident);

module.exports = router;