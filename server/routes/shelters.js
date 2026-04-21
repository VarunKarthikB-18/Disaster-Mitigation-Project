const express = require('express');
const router = express.Router();
const Shelter = require('../models/Shelter');
const Disaster = require('../models/Disaster');
const { recommendShelters } = require('../services/shelterRecommend');

// GET /api/shelters — Get all shelters, optionally sorted by distance
router.get('/', async (req, res) => {
  try {
    const { lat, lng, recommend } = req.query;

    if (recommend === 'true' && lat && lng) {
      // Use recommendation engine
      const shelters = await Shelter.find({});
      const disasters = await Disaster.find({ isActive: true });
      const recommended = recommendShelters(
        parseFloat(lat),
        parseFloat(lng),
        shelters,
        disasters
      );
      return res.json(recommended);
    }

    const shelters = await Shelter.find({}).sort({ createdAt: -1 });
    res.json(shelters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/shelters — Create a shelter (admin)
router.post('/', async (req, res) => {
  try {
    const { name, latitude, longitude, capacity, amenities, contact, isHospital } = req.body;

    if (!name || latitude == null || longitude == null || !capacity) {
      return res.status(400).json({ error: 'name, latitude, longitude, and capacity are required' });
    }

    const shelter = new Shelter({
      name,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
      capacity,
      amenities: amenities || [],
      contact: contact || '',
      isHospital: isHospital || false,
    });

    await shelter.save();
    res.status(201).json(shelter);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
