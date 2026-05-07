const mongoose = require('mongoose');

const emergencyAlertSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['SOS', 'POLICE', 'TRUSTED_CONTACTS', 'CHECKIN_MISSED', 'VOICE_TRIGGER'],
    required: true 
  },
  status: { type: String, enum: ['ACTIVE', 'RESOLVED', 'CANCELLED'], default: 'ACTIVE' },
  location: {
    lat: { type: Number },
    lng: { type: Number },
    address: { type: String, default: 'Location unavailable' }
  },
  message: { type: String, default: 'Emergency SOS triggered' },
  notifiedContacts: [{ 
    name: String, 
    phone: String, 
    email: String,
    notifiedAt: { type: Date, default: Date.now }
  }],
  resolvedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EmergencyAlert', emergencyAlertSchema);
