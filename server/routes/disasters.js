const express = require('express');
const router = express.Router();
const Disaster = require('../models/Disaster');

// GET /api/disasters — Get all active disasters
router.get('/', async (req, res) => {
  try {
    const disasters = await Disaster.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(disasters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/disasters — Create a disaster zone (admin)
router.post('/', async (req, res) => {
  try {
    const { name, type, severity, polygon, center, description } = req.body;

    if (!name || !type || !severity || !polygon || !center) {
      return res.status(400).json({ error: 'name, type, severity, polygon, and center are required' });
    }

    const disaster = new Disaster({
      name,
      type,
      severity,
      polygon,
      center,
      description: description || '',
    });

    await disaster.save();

    // Emit via Socket.IO
    const io = req.app.get('io');
    if (io) {
      io.emit('newDisaster', disaster);
    }

    res.status(201).json(disaster);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
