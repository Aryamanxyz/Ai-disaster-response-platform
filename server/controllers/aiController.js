const Incident = require('../models/Incident');
const groqservice = require('../services/groqservice');
const { predictSeverity } = require('../services/mlService');

const analyzeIncident = async (req, res, next) => {
  try {
    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({ success: false, message: 'Incident not found' });
    }

    const analysis = await groqservice.analyzeIncident(incident);

    let mlPrediction = null;
    try {
      mlPrediction = await predictSeverity(incident);
    } catch (mlError) {
      console.log('ML prediction failed:', mlError.message);
    }

    incident.aiAnalysis = {
      severity: analysis.severity,
      recommendations: analysis.recommendations,
      riskLevel: analysis.riskLevel,
      analyzedAt: new Date()
    };

    await incident.save();

    res.status(200).json({ success: true, analysis, mlPrediction });
  } catch (error) {
    next(error);
  }
};

const getSuggestions = async (req, res, next) => {
  try {
    const { incidentType, severity, affectedPeople, location } = req.body;

    const suggestions = await groqservice.getResponseSuggestions({
      incidentType,
      severity,
      affectedPeople,
      location
    });

    res.status(200).json({ success: true, suggestions });
  } catch (error) {
    next(error);
  }
};

const chat = async (req, res, next) => {
  try {
    const { message, history } = req.body;

    const response = await groqservice.chatWithAI(message, history);

    res.status(200).json({ success: true, response });
  } catch (error) {
    next(error);
  }
};

const getRiskScore = async (req, res, next) => {
  try {
    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({ success: false, message: 'Incident not found' });
    }

    const riskData = await groqservice.calculateRisk(incident);

    res.status(200).json({ success: true, riskData });
  } catch (error) {
    next(error);
  }
};

module.exports = { analyzeIncident, getSuggestions, chat, getRiskScore };