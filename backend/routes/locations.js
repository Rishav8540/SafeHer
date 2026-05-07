const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');

// Simple stub - extend with real socket.io for live tracking
router.get('/', auth, (req, res) => {
  res.json({ location: req.user.lastLocation });
});

module.exports = router;
