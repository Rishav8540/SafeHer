const express = require('express');
const router = express.Router();
const User = require('../models/User');
const EmergencyAlert = require('../models/EmergencyAlert');
const TrustedContact = require('../models/TrustedContact');
const { adminAuth } = require('../middleware/auth');

// @GET /api/admin/stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const [totalUsers, totalAlerts, activeAlerts, totalContacts] = await Promise.all([
      User.countDocuments(),
      EmergencyAlert.countDocuments(),
      EmergencyAlert.countDocuments({ status: 'ACTIVE' }),
      TrustedContact.countDocuments({ isActive: true })
    ]);
    res.json({ totalUsers, totalAlerts, activeAlerts, totalContacts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @GET /api/admin/users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @GET /api/admin/alerts
router.get('/alerts', adminAuth, async (req, res) => {
  try {
    const alerts = await EmergencyAlert.find()
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 }).limit(50);
    res.json({ alerts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @PUT /api/admin/users/:id/toggle
router.put('/users/:id/toggle', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.isActive = !user.isActive;
    await user.save();
    res.json({ user, message: `User ${user.isActive ? 'activated' : 'deactivated'}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Locations stub
const locationsRouter = express.Router();
locationsRouter.get('/', (req, res) => res.json({ locations: [] }));

module.exports = router;
