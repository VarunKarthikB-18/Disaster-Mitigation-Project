const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const { connectDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const sosRoutes = require('./routes/sos');
const shelterRoutes = require('./routes/shelters');
const disasterRoutes = require('./routes/disasters');
const alertRoutes = require('./routes/alerts');
const routingRoutes = require('./routes/routing');
const damageRoutes = require('./routes/damage');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT'],
  },
});

app.set('io', io);

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());

app.use('/api/sos', sosRoutes);
app.use('/api/shelters', shelterRoutes);
app.use('/api/disasters', disasterRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/route', routingRoutes);
app.use('/api/damage', damageRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5001;

async function start() {
  await connectDB();

  const SOS = require('./models/SOS');
  const count = await SOS.countDocuments();
  if (count === 0) {
    console.log('📦 Empty database detected, running seed...');
    const Shelter = require('./models/Shelter');
    const Disaster = require('./models/Disaster');
    const Alert = require('./models/Alert');
    const mockDisasters = require('./data/mockDisasters');
    const mockShelters = require('./data/mockShelters');

    const mockSOS = [
      { type: 'medical', description: 'Elderly person trapped in flooded building near Yamuna bank. Needs immediate medical assistance and evacuation.', location: { type: 'Point', coordinates: [77.260, 28.650] }, status: 'pending', createdAt: new Date(Date.now() - 1800000) },
      { type: 'rescue', description: 'Family of 5 stranded on rooftop in East Delhi due to rising flood water levels. Children present.', location: { type: 'Point', coordinates: [77.275, 28.660] }, status: 'assigned', assignedResource: 'NDRF Team Alpha', createdAt: new Date(Date.now() - 3600000) },
      { type: 'food', description: '50+ people in Lajpat Nagar shelter without food supplies for 2 days. Running low on drinking water.', location: { type: 'Point', coordinates: [77.237, 28.570] }, status: 'pending', createdAt: new Date(Date.now() - 7200000) },
      { type: 'medical', description: 'Child with severe breathing difficulties due to toxic smoke from industrial fire. Inhaler and oxygen needed.', location: { type: 'Point', coordinates: [77.090, 28.830] }, status: 'pending', createdAt: new Date(Date.now() - 900000) },
      { type: 'rescue', description: 'Construction workers trapped under debris after earthquake tremor in Saket area. Approximately 8 people.', location: { type: 'Point', coordinates: [77.200, 28.520] }, status: 'assigned', assignedResource: 'Fire Brigade Unit 7', createdAt: new Date(Date.now() - 5400000) },
    ];

    const mockAlerts = [
      { title: '🔴 Flood Emergency — Yamuna River', message: 'Water levels critical. All residents east of Ring Road must evacuate to designated shelters immediately.', severity: 'critical', isActive: true },
      { title: '⚠️ Seismic Advisory — South Delhi', message: 'Aftershocks expected in next 12 hours. Avoid damaged buildings. Emergency teams deployed.', severity: 'warning', isActive: true },
      { title: 'ℹ️ Relief Operations Active', message: 'Pragati Maidan and Rohini Stadium shelters now accepting evacuees. Food and medical aid available.', severity: 'info', isActive: true },
    ];

    await Disaster.insertMany(mockDisasters);
    await Shelter.insertMany(mockShelters);
    await SOS.insertMany(mockSOS);
    await Alert.insertMany(mockAlerts);
    console.log('✅ Database seeded with Delhi NCR mock data');
  }

  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 WebSocket server ready`);
  });
}

start().catch(err => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});
