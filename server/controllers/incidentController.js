const Incident = require('../models/Incident');
const { sendDisasterAlert } = require('../services/twilioServices');

const getAllIncidents = async (req, res, next) => {
  try {
    const incidents = await Incident.find()
      .populate('reportedBy', 'name email')
      .populate('assignedResources', 'name type status')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: incidents.length, incidents });
  } catch (error) {
    next(error);
  }
};

const getIncidentById = async (req, res, next) => {
  try {
    const incident = await Incident.findById(req.params.id)
      .populate('reportedBy', 'name email')
      .populate('assignedResources', 'name type status');

    if (!incident) {
      return res.status(404).json({ success: false, message: 'Incident not found' });
    }

    res.status(200).json({ success: true, incident });
  } catch (error) {
    next(error);
  }
};

const createIncident = async (req, res, next) => {
  try {
    const { title, type, severity, location, description, affectedPeople } = req.body;

    const incident = await Incident.create({
      title,
      type,
      severity,
      location,
      description,
      affectedPeople,
      reportedBy: req.user._id
    });

    if (severity >= 7) {
      try {
        await sendDisasterAlert(incident);
        console.log('SMS alert sent for high severity incident');
      } catch (smsError) {
        console.log('SMS send failed:', smsError.message);
      }
    }

    res.status(201).json({ success: true, incident });
  } catch (error) {
    next(error);
  }
};

const updateIncident = async (req, res, next) => {
  try {
    const incident = await Incident.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!incident) {
      return res.status(404).json({ success: false, message: 'Incident not found' });
    }

    res.status(200).json({ success: true, incident });
  } catch (error) {
    next(error);
  }
};

const deleteIncident = async (req, res, next) => {
  try {
    const incident = await Incident.findByIdAndDelete(req.params.id);

    if (!incident) {
      return res.status(404).json({ success: false, message: 'Incident not found' });
    }

    res.status(200).json({ success: true, message: 'Incident deleted' });
  } catch (error) {
    next(error);
  }
};

const getActiveIncidents = async (req, res, next) => {
  try {
    const incidents = await Incident.find({ status: 'active' })
      .populate('reportedBy', 'name email')
      .sort({ severity: -1 });

    res.status(200).json({ success: true, count: incidents.length, incidents });
  } catch (error) {
    next(error);
  }
};

const getNearbyIncidents = async (req, res, next) => {
  try {
    const { state } = req.query;

    const incidents = await Incident.find({
      'location.state': state,
      status: 'active'
    }).sort({ severity: -1 });

    res.status(200).json({ success: true, count: incidents.length, incidents });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllIncidents,
  getIncidentById,
  createIncident,
  updateIncident,
  deleteIncident,
  getActiveIncidents,
  getNearbyIncidents
};