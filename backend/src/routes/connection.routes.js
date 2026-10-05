const express = require('express');
const router = express.Router();
const {
  sendRequest, respondToRequest, getMyConnections,
  getIncomingRequests, getOutgoingRequests, getConnectionStatus
} = require('../controllers/connection.controller');
const auth = require('../middleware/auth');

router.use(auth);
router.get('/my', getMyConnections);
router.get('/requests/incoming', getIncomingRequests);
router.get('/requests/outgoing', getOutgoingRequests);
router.get('/status/:userId', getConnectionStatus);
router.post('/request/:userId', sendRequest);
router.patch('/:id/respond', respondToRequest);

module.exports = router;
