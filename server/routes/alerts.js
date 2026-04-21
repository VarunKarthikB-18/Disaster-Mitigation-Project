const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');

// GET /api/alerts — Get all active alerts
router.get('/', async (req, res) => {
  try {
    const alerts = await Alert.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/alerts — Broadcast a new alert
router.post('/', async (req, res) => {
  try {
    const { title, message, severity } = req.body;

    if (!title || !message) {
      return res.status(400).json({ error: 'title and message are required' });
    }

    const alert = new Alert({
      title,
      message,
      severity: severity || 'info',
    });

    await alert.save();

    // Broadcast via Socket.IO
    const io = req.app.get('io');
    if (io) {
      io.emit('newAlert', alert);
    }

    res.status(201).json(alert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
