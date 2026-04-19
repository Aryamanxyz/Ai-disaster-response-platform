const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendDisasterAlert = async (incident) => {
  const message = `🚨 DISASTER ALERT
Type: ${incident.type.toUpperCase()}
Location: ${incident.location.city}, ${incident.location.state}
Severity: ${incident.severity}/10
Affected People: ${incident.affectedPeople}
Status: ${incident.status.toUpperCase()}
Immediate action required!
- DisasterAI Platform`;

  const result = await client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: process.env.ALERT_PHONE_NUMBER
  });

  return result.sid;
};

module.exports = { sendDisasterAlert };