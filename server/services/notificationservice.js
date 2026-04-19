const Alert = require('../models/Alert');
const User = require('../models/User');

const createAndBroadcastAlert = async (io, alertData, userId) => {
  try {
    const alert = await Alert.create({
      title: alertData.title,
      message: alertData.message,
      type: alertData.type,
      severity: alertData.severity,
      incident: alertData.incident,
      targetArea: alertData.targetArea,
      sentBy: userId
    });

    io.emit('alert:received', alert);

    return alert;
  } catch (error) {
    console.log('Notification error:', error.message);
  }
};

const notifyNearbyUsers = async (io, incident) => {
  try {
    if (incident.severity < 7) return;

    const alertData = {
      title: `High Severity Alert: ${incident.type.toUpperCase()}`,
      message: `A ${incident.type} has been reported in ${incident.location.city}, ${incident.location.state}. Severity: ${incident.severity}/10. Affected people: ${incident.affectedPeople}`,
      type: 'critical',
      severity: incident.severity,
      incident: incident._id,
      targetArea: {
        state: incident.location.state,
        city: incident.location.city
      }
    };

    const alert = await Alert.create({
      ...alertData,
      sentBy: incident.reportedBy
    });

    io.emit('alert:received', alert);

    console.log(`Alert broadcast kiya: ${incident.location.city} ke liye`);
  } catch (error) {
    console.log('Notify error:', error.message);
  }
};

module.exports = { createAndBroadcastAlert, notifyNearbyUsers };