const mongoose = require('mongoose');

const volunteerRatingSchema = new mongoose.Schema({
  volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ratedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  alertId: { type: mongoose.Schema.Types.ObjectId, ref: 'EmergencyAlert' },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('VolunteerRating', volunteerRatingSchema);
