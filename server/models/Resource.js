const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['ambulance', 'fire_truck', 'rescue_team', 'helicopter', 'medical_supply', 'food', 'shelter', 'other'],
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'deployed', 'maintenance', 'unavailable'],
    default: 'available'
  },
  quantity: {
    type: Number,
    default: 1
  },
  location: {
    city: { type: String },
    state: { type: String },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Incident',
    default: null
  },
  contactPerson: {
    name: { type: String },
    phone: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);