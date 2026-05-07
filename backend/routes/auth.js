const express  = require('express');
const router   = express.Router();
const jwt      = require('jsonwebtoken');
const User     = require('../models/User');
const { auth } = require('../middleware/auth');
const nodemailer = require('nodemailer');

// ── Generate JWT ─────────────────────────────────────
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ── Send welcome email to new user ───────────────────
async function sendWelcomeEmail(user) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });
    await transporter.sendMail({
      from: `"SafeHer" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `🛡️ Welcome to SafeHer, ${user.name}!`,
      html: `
        <div style="background:#1a1a2e;color:white;padding:30px;border-radius:12px;font-family:Arial">
          <h1 style="color:#f43f5e">🛡️ Welcome to SafeHer!</h1>
          <p>Hello <strong>${user.name}</strong>,</p>
          <p>Your account has been created successfully. You are now protected by SafeHer.</p>
          <div style="background:rgba(244,63,94,0.1);border:1px solid rgba(244,63,94,0.3);border-radius:10px;padding:16px;margin:20px 0">
            <h3 style="color:#f43f5e;margin:0 0 10px">Next Steps:</h3>
            <p style="margin:6px 0">✅ Add your trusted contacts (brother, father, friends)</p>
            <p style="margin:6px 0">📍 Enable GPS location in the app</p>
            <p style="margin:6px 0">💬 Join our WhatsApp Safety Network</p>
            <p style="margin:6px 0">🚨 Test the SOS button to make sure it works</p>
          </div>
          <p style="color:rgba(255,255,255,0.5);font-size:12px">
            SafeHer — One Click Protection. We are always here for you.
          </p>
        </div>`
    });
    console.log(`✅ Welcome email sent to ${user.email}`);
  } catch(e) {
    console.log('⚠️ Welcome email failed:', e.message);
  }
}

// ── @POST /api/auth/register ─────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: 'Please fill all required fields' });

    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists)
      return res.status(400).json({ message: 'This email is already registered. Please login.' });

    const user = await User.create({ name, email: email.toLowerCase(), password, phone });

    // Send welcome email in background
    sendWelcomeEmail(user);

    res.status(201).json({
      token: generateToken(user._id),
      user,
      message: 'Account created successfully! Welcome to SafeHer 💖'
    });

  } catch(err) {
    console.error('Register error:', err.message);
    res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
});

// ── @POST /api/auth/login ────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Please enter email and password' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return res.status(401).json({ message: 'No account found with this email' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: 'Wrong password. Please try again.' });

    if (!user.isActive)
      return res.status(401).json({ message: 'Account is deactivated. Contact support.' });

    res.json({
      token: generateToken(user._id),
      user,
      message: 'Login successful!'
    });

  } catch(err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
});

// ── @GET /api/auth/me ────────────────────────────────
router.get('/me', auth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
