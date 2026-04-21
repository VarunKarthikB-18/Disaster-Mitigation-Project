const express = require('express');
const router = express.Router();
const SOS = require('../models/SOS');

// POST /api/sos — Create an SOS request
router.post('/', async (req, res) => {
  try {
    const { type, description, latitude, longitude } = req.body;

    if (!type || !description || latitude == null || longitude == null) {
      return res.status(400).json({ error: 'type, description, latitude, and longitude are required' });
    }

    const sos = new SOS({
      type,
      description,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
    });

    await sos.save();

    // Emit via Socket.IO if available
    const io = req.app.get('io');
    if (io) {
      io.emit('newSOS', sos);
    }

    res.status(201).json(sos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/sos — Fetch all SOS requests
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const requests = await SOS.find(filter).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/sos/:id — Update SOS request status
router.put('/:id', async (req, res) => {
  try {
    const { status, assignedResource } = req.body;
    const update = {};
    if (status) update.status = status;
    if (assignedResource !== undefined) update.assignedResource = assignedResource;

    const sos = await SOS.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!sos) {
      return res.status(404).json({ error: 'SOS request not found' });
    }

    // Emit update via Socket.IO
    const io = req.app.get('io');
    if (io) {
      io.emit('sosUpdate', sos);
    }

    res.json(sos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
