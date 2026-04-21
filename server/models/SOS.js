const mongoose = require('mongoose');

const sosSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['medical', 'food', 'rescue'],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'resolved'],
    default: 'pending',
  },
  assignedResource: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

sosSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('SOS', sosSchema);
