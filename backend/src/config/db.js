const mongoose = require('mongoose');

let mongodInstance = null;
let isConnecting = false;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  if (isConnecting) {
    // Wait until connected
    while (mongoose.connection.readyState !== 1) {
      await new Promise(r => setTimeout(r, 100));
    }
    return mongoose.connection;
  }

  isConnecting = true;
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/unipulse';
  
  try {
    // Attempt standard connection with 2 second timeout
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    isConnecting = false;

    // Auto-seed if clubs are missing in the connected database
    const Club = require('../models/Club');
    const clubCount = await Club.countDocuments();
    if (clubCount === 0) {
      console.log('🌱 No clubs found in database. Auto-seeding initial campus data...');
      const seed = require('../seed/seed');
      await seed(false);
    }

    return conn;
  } catch (error) {
    console.warn(`⚠️  Could not connect to ${uri}: ${error.message}`);
    console.log('🔄 Spinning up embedded MongoDB (mongodb-memory-server)...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create({
        instance: {
          dbName: 'unipulse'
        }
      });
      const memUri = mongodInstance.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(`✅ Embedded MongoDB running at: ${memUri}`);
      isConnecting = false;

      // Auto-seed if database is empty
      const User = require('../models/User');
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        console.log('🌱 Empty database detected. Auto-seeding initial data...');
        const seed = require('../seed/seed');
        await seed(false);
      }

      return conn;
    } catch (memError) {
      isConnecting = false;
      console.error('❌ Failed to start embedded MongoDB:', memError.message);
      throw memError;
    }
  }
};

module.exports = connectDB;
