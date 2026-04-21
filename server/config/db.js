const mongoose = require('mongoose');

let mongoServer;

async function connectDB() {
  try {
    // Try local MongoDB first
    const localURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/disaster-platform';
    await mongoose.connect(localURI, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log('✅ Connected to local MongoDB');
  } catch (err) {
    console.log('⚠️  Local MongoDB not available, starting in-memory server...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    console.log('✅ Connected to in-memory MongoDB');
  }
}

async function disconnectDB() {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
}

module.exports = { connectDB, disconnectDB };
