const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer setup for profile images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/profiles');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// @PUT /api/users/profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, phone, address, bloodGroup, medicalInfo } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, address, bloodGroup, medicalInfo },
      { new: true }
    );
    res.json({ user, message: 'Profile updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @POST /api/users/profile-image
router.post('/profile-image', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const imageUrl = `/uploads/profiles/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(req.user._id, { profileImage: imageUrl }, { new: true });
    res.json({ user, imageUrl, message: 'Profile image updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @PUT /api/users/location
router.put('/location', auth, async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { lastLocation: { lat, lng, updatedAt: new Date() } },
      { new: true }
    );
    res.json({ user, message: 'Location updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
