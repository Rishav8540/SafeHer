const express = require('express');
const router  = express.Router();
const WhatsappCommunity = require('../models/WhatsappCommunity');
const VolunteerRating   = require('../models/VolunteerRating');
const TrustedContact    = require('../models/TrustedContact');
const { auth }          = require('../middleware/auth');
const nodemailer        = require('nodemailer');

const WHATSAPP_JOIN_LINK = process.env.WHATSAPP_JOIN_LINK || 'https://chat.whatsapp.com/your-community-link';

// ── Email transporter ────────────────────────────────
function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });
}

// ── Distance calculator ──────────────────────────────
function getDistanceKm(lat1, lng1, lat2, lng2) {
  const R    = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a    =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// ── Send invite email ────────────────────────────────
async function sendInviteEmail(contact, user) {
  if (!contact.email) return false;
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('⚠️ Email not configured — check EMAIL_USER and EMAIL_PASS in .env');
    return false;
  }

  const inviteMessage = `You have been added as a trusted contact in SafeHer Women Safety System. Please stay available for emergency situations. Turn ON notifications and be ready to help if someone nearby is in danger. Join here: ${WHATSAPP_JOIN_LINK} Thank you for being a responsible support member.`;

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"SafeHer Safety Network" <${process.env.EMAIL_USER}>`,
      to: contact.email,
      subject: `🛡️ You have been added as a Trusted Contact in SafeHer`,
      html: `
        <div style="background:#1a1a2e;color:white;padding:30px;border-radius:12px;font-family:Arial,sans-serif;max-width:600px">
          <div style="text-align:center;margin-bottom:24px">
            <h1 style="color:#f43f5e;margin:0">🛡️ SafeHer</h1>
            <p style="color:rgba(255,255,255,0.5);margin:4px 0">One Click Protection</p>
          </div>
          <h2 style="color:white">Hello ${contact.name}! 👋</h2>
          <p style="color:rgba(255,255,255,0.8);line-height:1.6">
            <strong style="color:#f43f5e">${user.name}</strong> has added you as a
            <strong>Trusted Emergency Contact</strong> in SafeHer Women Safety App.
          </p>
          <div style="background:rgba(244,63,94,0.1);border:1px solid rgba(244,63,94,0.3);border-radius:10px;padding:16px;margin:20px 0">
            <p style="color:white;margin:0;line-height:1.6">${inviteMessage}</p>
          </div>
          <div style="text-align:center;margin:28px 0">
            <a href="${WHATSAPP_JOIN_LINK}"
               style="background:#25D366;color:white;padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block">
              📱 Join WhatsApp Safety Network
            </a>
          </div>
          <div style="background:rgba(255,255,255,0.05);border-radius:10px;padding:16px;margin-top:20px">
            <h3 style="color:#f43f5e;margin:0 0 12px">What to do next:</h3>
            <p style="color:rgba(255,255,255,0.7);margin:6px 0">✅ Join the WhatsApp community above</p>
            <p style="color:rgba(255,255,255,0.7);margin:6px 0">🔔 Turn ON WhatsApp notifications</p>
            <p style="color:rgba(255,255,255,0.7);margin:6px 0">📞 Stay reachable on: ${contact.phone}</p>
            <p style="color:rgba(255,255,255,0.7);margin:6px 0">🚨 Respond immediately if you get SOS alert</p>
          </div>
          <p style="color:rgba(255,255,255,0.4);font-size:12px;margin-top:24px;text-align:center">
            SafeHer — We cannot force protection, but we can build a system where help is always one click away.
          </p>
        </div>`
    });
    console.log(`✅ Invite email sent to ${contact.email}`);
    return true;
  } catch(e) {
    console.error(`❌ Invite email failed to ${contact.email}:`, e.message);
    return false;
  }
}

// ── @GET /api/whatsapp/status ────────────────────────
router.get('/status', auth, async (req, res) => {
  try {
    let record = await WhatsappCommunity.findOne({ userId: req.user._id });
    if (!record) record = await WhatsappCommunity.create({ userId: req.user._id });
    res.json({ status: record, joinLink: WHATSAPP_JOIN_LINK });
  } catch(err) { res.status(500).json({ message: err.message }); }
});

// ── @POST /api/whatsapp/join ─────────────────────────
router.post('/join', auth, async (req, res) => {
  try {
    const record = await WhatsappCommunity.findOneAndUpdate(
      { userId: req.user._id },
      { joinStatus: 'joined', joinedAt: new Date() },
      { upsert: true, new: true }
    );
    res.json({ record, message: 'Joined SafeHer WhatsApp community!', joinLink: WHATSAPP_JOIN_LINK });
  } catch(err) { res.status(500).json({ message: err.message }); }
});

// ── @POST /api/whatsapp/volunteer ────────────────────
router.post('/volunteer', auth, async (req, res) => {
  try {
    const record = await WhatsappCommunity.findOneAndUpdate(
      { userId: req.user._id },
      { isVolunteer: true, joinStatus: 'joined', joinedAt: new Date() },
      { upsert: true, new: true }
    );
    res.json({ record, message: 'You are now a SafeHer volunteer! Thank you 💖' });
  } catch(err) { res.status(500).json({ message: err.message }); }
});

// ── @POST /api/whatsapp/invite-contacts ─────────────
router.post('/invite-contacts', auth, async (req, res) => {
  try {
    console.log('📧 Invite contacts called by:', req.user.name);
    console.log('📧 EMAIL_USER:', process.env.EMAIL_USER || 'NOT SET');
    console.log('📧 EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET (' + process.env.EMAIL_PASS.length + ' chars)' : 'NOT SET');

    // Check email config first
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('❌ Email not configured in .env');
      return res.status(400).json({
        message: 'Email not configured. Open backend/.env and set EMAIL_USER and EMAIL_PASS'
      });
    }

    const contacts = await TrustedContact.find({ userId: req.user._id, isActive: true });
    console.log('👥 Total contacts found:', contacts.length);

    if (contacts.length === 0) {
      return res.status(400).json({ message: 'No trusted contacts found. Please add contacts first.' });
    }

    const emailContacts = contacts.filter(c => c.email);
    console.log('📧 Contacts with email:', emailContacts.length);
    emailContacts.forEach(c => console.log('  -', c.name, ':', c.email));

    if (emailContacts.length === 0) {
      return res.status(400).json({ message: 'Your contacts do not have email addresses. Please edit contacts and add their emails.' });
    }

    // Send invites one by one
    let sent = 0;
    for (const contact of emailContacts) {
      const ok = await sendInviteEmail(contact, req.user);
      if (ok) sent++;
    }

    console.log('📧 Invites sent:', sent, 'of', emailContacts.length);

    if (sent === 0) {
      return res.status(500).json({
        message: 'Emails failed. Your Gmail App Password may be wrong. Go to Google Account > Security > App Passwords and create a new one.'
      });
    }

    res.json({ message: 'Invite sent to ' + sent + ' of ' + emailContacts.length + ' contacts!', sent });

  } catch(err) {
    console.error('❌ Invite contacts error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// ── @GET /api/whatsapp/nearby ────────────────────────
router.get('/nearby', auth, async (req, res) => {
  try {
    const { lat, lng, radius = 10 } = req.query;
    if (!lat || !lng) return res.json({ helpers: [], count: 0 });

    const volunteers = await WhatsappCommunity.find({
      isVolunteer: true,
      joinStatus:  'joined',
      userId:      { $ne: req.user._id }
    }).populate('userId', 'name phone');

    const nearby = volunteers
      .filter(v => v.lastLocation?.lat)
      .map(v => ({
        name:      v.userId?.name || 'Volunteer',
        distance:  getDistanceKm(parseFloat(lat), parseFloat(lng), v.lastLocation.lat, v.lastLocation.lng).toFixed(1),
        rating:    v.rating || 0,
        helpCount: v.helpCount || 0
      }))
      .filter(v => parseFloat(v.distance) <= parseFloat(radius))
      .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

    res.json({ helpers: nearby, count: nearby.length });
  } catch(err) { res.status(500).json({ message: err.message }); }
});

// ── @PUT /api/whatsapp/location ──────────────────────
router.put('/location', auth, async (req, res) => {
  try {
    const { lat, lng } = req.body;
    await WhatsappCommunity.findOneAndUpdate(
      { userId: req.user._id },
      { lastLocation: { lat, lng, updatedAt: new Date() } },
      { upsert: true }
    );
    res.json({ message: 'Location updated' });
  } catch(err) { res.status(500).json({ message: err.message }); }
});

// ── @POST /api/whatsapp/rate ─────────────────────────
router.post('/rate', auth, async (req, res) => {
  try {
    const { volunteerId, rating, comment, alertId } = req.body;
    if (!volunteerId || !rating) return res.status(400).json({ message: 'Volunteer and rating required' });

    await VolunteerRating.create({ volunteerId, ratedBy: req.user._id, alertId, rating, comment });

    const ratings = await VolunteerRating.find({ volunteerId });
    const avg     = ratings.reduce((s, r) => s + r.rating, 0) / ratings.length;
    await WhatsappCommunity.findOneAndUpdate(
      { userId: volunteerId },
      { rating: avg.toFixed(1), totalRatings: ratings.length }
    );

    res.json({ message: 'Thank you for rating!' });
  } catch(err) { res.status(500).json({ message: err.message }); }
});

// ── @GET /api/whatsapp/volunteers ────────────────────
router.get('/volunteers', auth, async (req, res) => {
  try {
    const volunteers = await WhatsappCommunity.find({ isVolunteer: true })
      .populate('userId', 'name email phone');
    res.json({ volunteers });
  } catch(err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
