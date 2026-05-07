const mongoose = require('mongoose');

const trustedContactSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  relation: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, default: '' },
  priority: { type: Number, default: 1 }, // 1=high, 2=medium, 3=low
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TrustedContact', trustedContactSchema);
