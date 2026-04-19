const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['warning', 'critical', 'info', 'update'],
    required: true
  },
  severity: {
    type: Number,
    min: 1,
    max: 10
  },
  incident: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Incident'
  },
  sentBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  targetArea: {
    state: { type: String },
    city: { type: String }
  },
  isRead: {
    type: Boolean,
    default: false
  },
  smsSent: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);