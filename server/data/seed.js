const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('../config/db');
const SOS = require('../models/SOS');
const Shelter = require('../models/Shelter');
const Disaster = require('../models/Disaster');
const Alert = require('../models/Alert');
const mockDisasters = require('./mockDisasters');
const mockShelters = require('./mockShelters');

const mockSOS = [
  {
    type: 'medical',
    description: 'Elderly person trapped in flooded building. Needs immediate medical assistance.',
    location: { type: 'Point', coordinates: [72.832, 18.938] },
    status: 'pending',
    createdAt: new Date(Date.now() - 1800000),
  },
  {
    type: 'rescue',
    description: 'Family of 4 stranded on rooftop due to rising water levels.',
    location: { type: 'Point', coordinates: [72.825, 18.928] },
    status: 'assigned',
    assignedResource: 'NDRF Team Bravo',
    createdAt: new Date(Date.now() - 3600000),
  },
  {
    type: 'food',
    description: 'Community of 30 people without food supplies for 2 days. Located near Kurla station.',
    location: { type: 'Point', coordinates: [72.880, 19.070] },
    status: 'pending',
    createdAt: new Date(Date.now() - 7200000),
  },
  {
    type: 'medical',
    description: 'Child with breathing difficulties. Inhaler required urgently.',
    location: { type: 'Point', coordinates: [72.860, 19.055] },
    status: 'pending',
    createdAt: new Date(Date.now() - 900000),
  },
  {
    type: 'rescue',
    description: 'Construction workers trapped under debris after tremor. Approximately 6 people.',
    location: { type: 'Point', coordinates: [72.905, 19.075] },
    status: 'assigned',
    assignedResource: 'Fire Brigade Unit 3',
    createdAt: new Date(Date.now() - 5400000),
  },
];

const mockAlerts = [
  {
    title: '⚠️ Cyclone Alert — Northern Mumbai',
    message: 'Category 3 cyclone expected to make landfall in 6 hours. All residents north of Goregaon advised to evacuate immediately.',
    severity: 'critical',
    isActive: true,
    createdAt: new Date(Date.now() - 600000),
  },
  {
    title: '🌊 Flood Warning — Marine Drive',
    message: 'High tide expected at 2:30 AM. Water levels may rise 3-4 feet in low-lying areas. Avoid coastal roads.',
    severity: 'warning',
    isActive: true,
    createdAt: new Date(Date.now() - 1200000),
  },
  {
    title: 'ℹ️ Shelter Update',
    message: 'Dadar Municipal Hall shelter has been opened with capacity for 500 people. Food and medical supplies available.',
    severity: 'info',
    isActive: true,
    createdAt: new Date(Date.now() - 1800000),
  },
];

async function seed() {
  try {
    await connectDB();
    console.log('🌱 Starting database seed...');

    // Clear existing data
    await Promise.all([
      SOS.deleteMany({}),
      Shelter.deleteMany({}),
      Disaster.deleteMany({}),
      Alert.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data');

    // Seed data
    await Disaster.insertMany(mockDisasters);
    console.log(`✅ Inserted ${mockDisasters.length} disaster zones`);

    await Shelter.insertMany(mockShelters);
    console.log(`✅ Inserted ${mockShelters.length} shelters/hospitals`);

    await SOS.insertMany(mockSOS);
    console.log(`✅ Inserted ${mockSOS.length} SOS requests`);

    await Alert.insertMany(mockAlerts);
    console.log(`✅ Inserted ${mockAlerts.length} alerts`);

    console.log('🌱 Seed complete!');
  } catch (err) {
    console.error('❌ Seed failed:', err);
  } finally {
    await disconnectDB();
  }
}

// Run if called directly
if (require.main === module) {
  seed();
}

module.exports = seed;
