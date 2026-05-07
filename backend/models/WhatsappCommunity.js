const mongoose = require('mongoose');

const whatsappCommunitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  joinStatus: { type: String, enum: ['joined', 'not_joined', 'pending'], default: 'not_joined' },
  isVolunteer: { type: Boolean, default: false },
  volunteerVerified: { type: Boolean, default: false },
  lastLocation: {
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 },
    updatedAt: { type: Date, default: Date.now }
  },
  helpCount: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  joinedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WhatsappCommunity', whatsappCommunitySchema);
