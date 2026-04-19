const groq = require('../config/groq');

const MODEL = 'llama-3.3-70b-versatile';

const analyzeIncident = async (incident) => {
  const prompt = `
    You are an AI assistant for disaster response coordination in India.
    Analyze this disaster incident and respond ONLY in JSON format:
    
    Incident Data:
    - Title: ${incident.title}
    - Type: ${incident.type}
    - Severity: ${incident.severity}/10
    - Location: ${incident.location.city}, ${incident.location.state}
    - Description: ${incident.description}
    - Affected People: ${incident.affectedPeople}
    
    Respond in this exact JSON format:
    {
      "severity": <number 1-10>,
      "riskLevel": "<low/medium/high/critical>",
      "recommendations": ["<action 1>", "<action 2>", "<action 3>"],
      "resourcesNeeded": ["<resource 1>", "<resource 2>"],
      "estimatedDuration": "<how long to resolve>",
      "immediateActions": ["<action 1>", "<action 2>"]
    }
  `;

  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3
  });

  const text = response.choices[0].message.content;
  const cleaned = text.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
};

const getResponseSuggestions = async ({ incidentType, severity, affectedPeople, location }) => {
  const prompt = `
    You are an expert disaster response coordinator in India.
    Give response suggestions for this situation and respond ONLY in JSON format:
    
    - Disaster Type: ${incidentType}
    - Severity: ${severity}/10
    - Affected People: ${affectedPeople}
    - Location: ${location}
    
    Respond in this exact JSON format:
    {
      "immediateSteps": ["<step 1>", "<step 2>", "<step 3>"],
      "resourcesRequired": ["<resource 1>", "<resource 2>"],
      "agenciesToContact": ["<agency 1>", "<agency 2>"],
      "evacuationNeeded": <true/false>,
      "estimatedRelief": "<time estimate>"
    }
  `;

  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3
  });

  const text = response.choices[0].message.content;
  const cleaned = text.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
};

const chatWithAI = async (message, history = []) => {
  const systemContext = `You are DISHA - Disaster Intelligence and Support Hub Assistant.
    You help disaster response coordinators in India.
    You have knowledge about NDMA guidelines, disaster protocols, and emergency response.
    Always respond in English only.
    Keep responses concise and actionable.`;

  const formattedHistory = history.map(msg => ({
    role: msg.role === 'model' ? 'assistant' : msg.role,
    content: msg.content
  }));

  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: systemContext },
      ...formattedHistory,
      { role: 'user', content: message }
    ],
    temperature: 0.5
  });

  return response.choices[0].message.content;
};

const calculateRisk = async (incident) => {
  const prompt = `
    You are a disaster risk assessment expert.
    Calculate risk score for this incident and respond ONLY in JSON format:
    
    - Type: ${incident.type}
    - Current Severity: ${incident.severity}/10
    - Location: ${incident.location.city}, ${incident.location.state}
    - Affected People: ${incident.affectedPeople}
    - Status: ${incident.status}
    - Reported At: ${incident.createdAt}
    
    Respond in this exact JSON format:
    {
      "riskScore": <number 1-100>,
      "riskLevel": "<low/medium/high/critical>",
      "escalationLikelihood": "<low/medium/high>",
      "keyRiskFactors": ["<factor 1>", "<factor 2>"],
      "mitigationSteps": ["<step 1>", "<step 2>"]
    }
  `;

  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3
  });

  const text = response.choices[0].message.content;
  const cleaned = text.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
};

module.exports = { analyzeIncident, getResponseSuggestions, chatWithAI, calculateRisk };