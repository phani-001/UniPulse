const mongoose = require('mongoose');
const { exec } = require('child_process');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

// GET /api/v1/database/overview
const getDatabaseOverview = asyncHandler(async (req, res) => {
  const db = mongoose.connection.db;
  if (!db) {
    throw ApiError.internal('Database connection not established');
  }

  const collections = await db.listCollections().toArray();
  let totalDocs = 0;

  const collectionStats = await Promise.all(
    collections.map(async (col) => {
      try {
        const count = await mongoose.connection.collection(col.name).countDocuments();
        totalDocs += count;
        return {
          name: col.name,
          type: col.type || 'collection',
          count
        };
      } catch (e) {
        return {
          name: col.name,
          type: col.type || 'collection',
          count: 0
        };
      }
    })
  );

  // Sort collections by count descending, then name
  collectionStats.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  res.json({
    success: true,
    data: {
      databaseName: db.databaseName,
      connectedUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/unipulse',
      readyState: mongoose.connection.readyState === 1 ? 'Connected (Live)' : 'Disconnected',
      totalCollections: collections.length,
      totalDocuments: totalDocs,
      timestamp: new Date().toISOString(),
      collections: collectionStats
    }
  });
});

// GET /api/v1/database/collections/:collectionName
const getCollectionDocuments = asyncHandler(async (req, res) => {
  const { collectionName } = req.params;
  const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);
  const skip = parseInt(req.query.skip, 10) || 0;
  const search = req.query.search ? req.query.search.trim() : '';

  const db = mongoose.connection.db;
  if (!db) {
    throw ApiError.internal('Database connection not established');
  }

  const collection = mongoose.connection.collection(collectionName);
  const total = await collection.countDocuments();

  let query = {};
  if (search) {
    query = {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { registrationNumber: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    };
  }

  const rawDocs = await collection
    .find(query)
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();

  // Clean sensitive fields like password hashes for clean review
  const sanitizedDocs = rawDocs.map((doc) => {
    if (doc.password) {
      return { ...doc, password: '[PROTECTED BCRYPT HASH]' };
    }
    return doc;
  });

  res.json({
    success: true,
    data: {
      collection: collectionName,
      totalCount: total,
      returnedCount: sanitizedDocs.length,
      documents: sanitizedDocs
    }
  });
});

// POST /api/v1/database/launch-compass
const launchCompass = asyncHandler(async (req, res) => {
  const compassPath = `"${process.env.USERPROFILE || 'C:\\Users\\kumar'}\\AppData\\Local\\MongoDBCompass\\MongoDBCompass.exe"`;

  exec(`start "" ${compassPath}`, (err) => {
    if (err) {
      console.warn('Could not launch Compass directly:', err.message);
    }
  });

  res.json({
    success: true,
    message: 'MongoDB Compass launch signal triggered',
    connectionUri: 'mongodb://localhost:27017'
  });
});

module.exports = {
  getDatabaseOverview,
  getCollectionDocuments,
  launchCompass
};
