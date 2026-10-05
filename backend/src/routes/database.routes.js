const express = require('express');
const router = express.Router();
const {
  getDatabaseOverview,
  getCollectionDocuments,
  launchCompass
} = require('../controllers/database.controller');

router.get('/overview', getDatabaseOverview);
router.get('/collections/:collectionName', getCollectionDocuments);
router.post('/launch-compass', launchCompass);

module.exports = router;
