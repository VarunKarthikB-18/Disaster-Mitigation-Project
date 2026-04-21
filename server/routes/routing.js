const express = require('express');
const router = express.Router();
const Disaster = require('../models/Disaster');
const { dijkstra, snapToGraph } = require('../services/dijkstra');
const roadNetwork = require('../data/mockRoadNetwork');

// POST /api/route — Compute safest evacuation route
router.post('/', async (req, res) => {
  try {
    const { startLat, startLng, endLat, endLng } = req.body;

    if (startLat == null || startLng == null || endLat == null || endLng == null) {
      return res.status(400).json({ error: 'startLat, startLng, endLat, endLng are required' });
    }

    // Get active disaster zones
    const disasters = await Disaster.find({ isActive: true });

    // Snap start and end to nearest graph nodes
    const startNode = snapToGraph(startLat, startLng, roadNetwork);
    const endNode = snapToGraph(endLat, endLng, roadNetwork);

    if (!startNode || !endNode) {
      return res.status(400).json({ error: 'Could not find nearby road network nodes' });
    }

    // Run Dijkstra's algorithm
    const result = dijkstra(roadNetwork, startNode, endNode, disasters);

    if (!result.reachable) {
      return res.json({
        path: [],
        distance: null,
        reachable: false,
        message: 'No safe route found. All paths are blocked by disaster zones.',
        startNode: roadNetwork.nodes[startNode],
        endNode: roadNetwork.nodes[endNode],
      });
    }

    // Add actual start/end as first/last points
    const fullPath = [
      { lat: parseFloat(startLat), lng: parseFloat(startLng) },
      ...result.path,
      { lat: parseFloat(endLat), lng: parseFloat(endLng) },
    ];

    res.json({
      path: fullPath,
      distance: result.distance,
      reachable: true,
      startNode: roadNetwork.nodes[startNode],
      endNode: roadNetwork.nodes[endNode],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/route/network — Get the road network for visualization
router.get('/network', (req, res) => {
  res.json(roadNetwork);
});

module.exports = router;
