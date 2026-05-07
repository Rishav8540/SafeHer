const express = require('express');
const router  = express.Router();
const EmergencyAlert = require('../models/EmergencyAlert');
const TrustedContact = require('../models/TrustedContact');
const { auth }       = require('../middleware/auth');
const nodemailer     = require('nodemailer');

// ── Pre-verified emergency team ───────────────────────
const EMERGENCY_TEAM = [
  { name: 'Rishabh',      phone: '+917061622057', email: 'rishavkumargupta7061@gmail.com'  },
  { name: 'Bipul Mishra', phone: '+919934240760', email: 'helloji5642@gmail.com'            },
  { name: 'Jahid',        phone: '+919984010727', email: 'ansarijahid9984@gmail.com'        },
  { name: 'Sumit',        phone: '+919122777671', email: 'sumitguptaofficial9122@gmail.com' },
];

// ── Twilio ────────────────────────────────────────────
let twilioClient = null;
try {
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    const twilio = require('twilio');
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    console.log('✅ Twilio loaded');
  }
} catch(e) { console.log('⚠️ Twilio not available:', e.message); }

// ── Email ─────────────────────────────────────────────
function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });
}

async function sendEmail(contact, user, location) {
  if (!contact.email || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) return false;
  const mapsLink = (location?.lat && location?.lng)
    ? `https://maps.google.com/?q=${location.lat},${location.lng}`
    : null;
  try {
    await createTransporter().sendMail({
      from:    `"SafeHer Emergency" <${process.env.EMAIL_USER}>`,
      to:      contact.email,
      subject: `🚨 EMERGENCY ALERT from ${user.name} — RESPOND IMMEDIATELY`,
      html: `
        <div style="background:#1a1a2e;color:white;padding:30px;border-radius:10px;font-family:Arial">
          <h1 style="color:#ff4757">🚨 EMERGENCY SOS ALERT</h1>
          <p><strong>${user.name}</strong> needs help RIGHT NOW!</p>
          <p><strong>📞 Phone:</strong> ${user.phone || 'Not provided'}</p>
          <p><strong>🕐 Time:</strong> ${new Date().toLocaleString()}</p>
          ${mapsLink
            ? `<p><a href="${mapsLink}" style="background:#ff4757;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:bold">📍 View Live Location</a></p>`
            : '<p>Location not available</p>'
          }
          <p style="color:#ff4757;font-weight:bold;font-size:18px">PLEASE RESPOND IMMEDIATELY!</p>
          <p>- SafeHer Emergency System</p>
        </div>`
    });
    console.log(`✅ Email sent to ${contact.email}`);
    return true;
  } catch(e) {
    console.error(`❌ Email failed to ${contact.email}:`, e.message);
    return false;
  }
}

// ── SMS ───────────────────────────────────────────────
async function sendSMS(contact, user, location) {
  if (!twilioClient || !contact.phone) return false;
  const mapsLink = (location?.lat && location?.lng)
    ? `https://maps.google.com/?q=${location.lat},${location.lng}`
    : 'Location unavailable';
  try {
    await twilioClient.messages.create({
      body: `🚨 EMERGENCY! ${user.name} needs help NOW!\nCall: ${user.phone || 'unknown'}\n📍 ${mapsLink}\n- SafeHer`,
      from: process.env.TWILIO_PHONE,
      to:   contact.phone.startsWith('+') ? contact.phone : `+91${contact.phone}`
    });
    console.log(`✅ SMS sent to ${contact.phone}`);
    return true;
  } catch(e) {
    console.error(`❌ SMS failed to ${contact.phone}:`, e.message);
    return false;
  }
}

// ── CALL — English + Hindi ────────────────────────────
async function makeCall(contact, user) {
  if (!twilioClient || !contact.phone) return false;

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice" language="en-IN" rate="slow">Emergency! Emergency! Emergency!</Say>
  <Pause length="1"/>
  <Say voice="alice" language="en-IN" rate="slow">This is SafeHer Women Safety Application.</Say>
  <Pause length="1"/>
  <Say voice="alice" language="en-IN" rate="slow">${user.name} is in danger. Go and help her! She needs your help right now!</Say>
  <Pause length="2"/>
  <Say voice="alice" language="hi-IN" rate="slow">Yeh SafeHer suraksha application hai.</Say>
  <Pause length="1"/>
  <Say voice="alice" language="hi-IN" rate="slow">${user.name} ko tumhari zaroorat hai. Jaldi jao. Usse bachao!</Say>
  <Pause length="1"/>
  <Say voice="alice" language="hi-IN" rate="slow">Uski jaan khatre mein hai. Jaldi karo. Bachao use!</Say>
  <Pause length="2"/>
  <Say voice="alice" language="en-IN" rate="slow">Emergency! Go and help her immediately!</Say>
  <Pause length="1"/>
  <Say voice="alice" language="hi-IN" rate="slow">Jaldi jao! Bachao use! Jaldi karo!</Say>
</Response>`;

  const toNumber = contact.phone.startsWith('+') ? contact.phone : `+91${contact.phone}`;

  try {
    await twilioClient.calls.create({
      twiml,
      from: process.env.TWILIO_PHONE,
      to:   toNumber
    });
    console.log(`✅ Call made to ${contact.phone}`);
    return true;
  } catch(e) {
    console.error(`❌ Call failed to ${contact.phone}:`, e.message);
    return false;
  }
}

// ── @POST /api/alerts/sos ─────────────────────────────
router.post('/sos', auth, async (req, res) => {
  try {
    const { lat, lng, address, type = 'SOS' } = req.body;
    const location = { lat, lng };

    // Get user contacts
    const userContacts = await TrustedContact.find({
      userId: req.user._id, isActive: true
    });

    // Merge with emergency team — no duplicates
    const allPhones     = new Set(userContacts.map(c => c.phone));
    const extraContacts = EMERGENCY_TEAM.filter(e => !allPhones.has(e.phone));
    const allContacts   = [...userContacts, ...extraContacts];

    console.log(`🚨 SOS by ${req.user.name} — ${allContacts.length} contacts`);

    // Save alert
    const alert = await EmergencyAlert.create({
      userId:   req.user._id,
      type,
      location: { lat, lng, address },
      notifiedContacts: allContacts.map(c => ({
        name: c.name, phone: c.phone, email: c.email
      }))
    });

    // Send email + SMS to ALL contacts at once
    allContacts.forEach(contact => {
      sendEmail(contact, req.user, location);
      sendSMS(contact, req.user, location);
    });

    // Make calls one by one with 4 second gap
    (async () => {
      for (let i = 0; i < allContacts.length; i++) {
        if (i > 0) {
          await new Promise(r => setTimeout(r, 4000));
        }
        await makeCall(allContacts[i], req.user);
      }
    })();

    // Respond immediately — don't wait for calls
    res.status(201).json({
      alert,
      message:          `Emergency alert sent to ${allContacts.length} contacts!`,
      contactsNotified: allContacts.length
    });

  } catch(err) {
    console.error('SOS error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// ── @GET /api/alerts/history ──────────────────────────
router.get('/history', auth, async (req, res) => {
  try {
    const alerts = await EmergencyAlert.find({ userId: req.user._id })
      .sort({ createdAt: -1 }).limit(20);
    res.json({ alerts });
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});

// ── @PUT /api/alerts/:id/resolve ──────────────────────
router.put('/:id/resolve', auth, async (req, res) => {
  try {
    const alert = await EmergencyAlert.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { status: 'RESOLVED', resolvedAt: new Date() },
      { new: true }
    );
    res.json({ alert, message: 'Alert resolved' });
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
