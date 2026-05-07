const express = require('express');
const router = express.Router();
const TrustedContact = require('../models/TrustedContact');
const { auth } = require('../middleware/auth');

// @GET /api/contacts
router.get('/', auth, async (req, res) => {
  try {
    const contacts = await TrustedContact.find({ userId: req.user._id, isActive: true }).sort('priority');
    res.json({ contacts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @POST /api/contacts
router.post('/', auth, async (req, res) => {
  try {
    const { name, relation, phone, email, priority } = req.body;
    if (!name || !relation || !phone)
      return res.status(400).json({ message: 'Name, relation and phone required' });

    const contact = await TrustedContact.create({ 
      userId: req.user._id, name, relation, phone, email, priority 
    });
    res.status(201).json({ contact, message: 'Contact added successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @PUT /api/contacts/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const contact = await TrustedContact.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.json({ contact, message: 'Contact updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @DELETE /api/contacts/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    await TrustedContact.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isActive: false }
    );
    res.json({ message: 'Contact removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
