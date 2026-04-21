const mongoose = require('mongoose');

const disasterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['flood', 'earthquake', 'cyclone', 'fire', 'landslide'],
    required: true,
  },
  severity: {
    type: String,
    enum: ['high', 'critical'],
    required: true,
  },
  polygon: {
    type: [[Number]], // Array of [lat, lng] pairs forming boundary
    required: true,
  },
  center: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  description: {
    type: String,
    default: '',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Disaster', disasterSchema);
