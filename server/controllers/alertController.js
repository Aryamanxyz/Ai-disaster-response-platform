const Alert = require('../models/Alert');
const User = require('../models/User');

const getAllAlerts = async (req, res, next) => {
  try {
    const alerts = await Alert.find()
      .populate('incident', 'title type severity')
      .populate('sentBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: alerts.length, alerts });
  } catch (error) {
    next(error);
  }
};

const createAlert = async (req, res, next) => {
  try {
    const { title, message, type, severity, incident, targetArea } = req.body;

    const alert = await Alert.create({
      title,
      message,
      type,
      severity,
      incident,
      targetArea,
      sentBy: req.user._id
    });

    const Alert = require('../models/Alert');

// Auto alert create karo
if (severity >= 5) {
  const alert = await Alert.create({
    title: `${type.toUpperCase()} Alert: ${title}`,
    message: `${severity >= 8 ? 'CRITICAL' : 'WARNING'}: ${type} reported in ${location.city}, ${location.state}. ${affectedPeople} people affected.`,
    type: severity >= 8 ? 'critical' : severity >= 7 ? 'warning' : 'info',
    severity: severity >= 8 ? 'critical' : severity >= 7 ? 'high' : 'medium',
    incident: incident._id,
    sentBy: req.user._id
  });

  // Socket se broadcast karo
  const io = req.app.get('io');
  if (io) {
    io.emit('alert:received', alert);
  }
}

    res.status(201).json({ success: true, alert });
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }

    res.status(200).json({ success: true, alert });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllAlerts, createAlert, markAsRead };