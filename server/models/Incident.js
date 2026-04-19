const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['flood', 'earthquake', 'fire', 'cyclone', 'landslide', 'drought', 'other'],
    required: true
  },
  severity: {
    type: Number,
    min: 1,
    max: 10,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'monitoring', 'resolved', 'closed'],
    default: 'active'
  },
  location: {
    city: { type: String },
    state: { type: String },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  description: {
    type: String
  },
  affectedPeople: {
    type: Number,
    default: 0
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedResources: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource'
  }],
  aiAnalysis: {
    severity: Number,
    recommendations: [String],
    riskLevel: String,
    analyzedAt: Date
  },
  source: {
    type: String,
    enum: ['manual', 'auto-detected'],
    default: 'manual'
  },
  sourceUrl: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Incident', incidentSchema);