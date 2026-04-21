const express = require('express');
const router = express.Router();
const DamageReport = require('../models/DamageReport');

// Get all damage reports
router.get('/', async (req, res, next) => {
  try {
    const reports = await DamageReport.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    next(err);
  }
});

// Create a new damage report
router.post('/', async (req, res, next) => {
  try {
    const { description, latitude, longitude, imageBase64 } = req.body;
    
    const report = new DamageReport({
      description,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
      imageUrl: imageBase64 ? 'data:image/jpeg;base64,...' : null, // Mocked for demo
    });

    await report.save();

    // Emit event
    const io = req.app.get('io');
    if (io) {
      io.emit('newDamageReport', report);
    }

    res.status(201).json(report);
  } catch (err) {
    next(err);
  }
});

// Update damage report status (Admin)
router.put('/:id', async (req, res, next) => {
  try {
    const { status } = req.body;
    const report = await DamageReport.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!report) return res.status(404).json({ error: 'Report not found' });
    
    const io = req.app.get('io');
    if (io) io.emit('damageReportUpdate', report);
    
    res.json(report);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
