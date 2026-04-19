const axios = require('axios');

const predictSeverity = async (incidentData) => {
  const response = await axios.post('http://localhost:5001/predict', {
    disaster_type: incidentData.type,
    affected_people: incidentData.affectedPeople,
    area_sqkm: incidentData.area_sqkm || 100,
    duration_hours: incidentData.duration_hours || 24
  });

  return response.data;
};

module.exports = { predictSeverity };