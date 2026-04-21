const mongoose = require('mongoose');

const damageReportSchema = new mongoose.Schema({
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
      type: [Number],
      required: true,
    },
  },
  imageUrl: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

damageReportSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('DamageReport', damageReportSchema);
