/**
 * SafeHer Database Seeder
 * Run: node seeder.js
 * This creates an admin user and sample data for testing.
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const TrustedContact = require('./models/TrustedContact');
const EmergencyAlert = require('./models/EmergencyAlert');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/safeher';

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await TrustedContact.deleteMany({});
    await EmergencyAlert.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create Admin User
    const admin = await User.create({
      name: 'SafeHer Admin',
      email: 'admin@safeher.com',
      password: 'admin123',
      phone: '+91-9999999999',
      isAdmin: true,
      bloodGroup: 'O+',
      address: 'New Delhi, India',
    });
    console.log('👤 Admin created: admin@safeher.com / admin123');

    // Create Demo User
    const demoUser = await User.create({
      name: 'Priya Sharma',
      email: 'priya@example.com',
      password: 'demo123',
      phone: '+91-8888888888',
      bloodGroup: 'A+',
      address: 'Mumbai, Maharashtra, India',
      medicalInfo: 'Allergic to penicillin',
    });
    console.log('👩 Demo user created: priya@example.com / demo123');

    // Create Trusted Contacts for demo user
    const contacts = await TrustedContact.insertMany([
      { userId: demoUser._id, name: 'Rahul Sharma', relation: 'Brother', phone: '+91-7777777777', email: 'rahul@example.com', priority: 1 },
      { userId: demoUser._id, name: 'Sunita Sharma', relation: 'Mother', phone: '+91-6666666666', email: 'sunita@example.com', priority: 1 },
      { userId: demoUser._id, name: 'Anjali Singh', relation: 'Friend', phone: '+91-5555555555', email: 'anjali@example.com', priority: 2 },
      { userId: demoUser._id, name: 'Vikram Sharma', relation: 'Father', phone: '+91-4444444444', email: 'vikram@example.com', priority: 1 },
    ]);
    console.log(`📞 Created ${contacts.length} trusted contacts`);

    // Create Sample Emergency Alerts
    await EmergencyAlert.insertMany([
      {
        userId: demoUser._id,
        type: 'SOS',
        status: 'RESOLVED',
        location: { lat: 19.076, lng: 72.877, address: 'Andheri, Mumbai' },
        message: 'Test SOS alert',
        notifiedContacts: [{ name: 'Rahul Sharma', phone: '+91-7777777777', email: 'rahul@example.com' }],
        resolvedAt: new Date(),
      },
      {
        userId: demoUser._id,
        type: 'TRUSTED_CONTACTS',
        status: 'RESOLVED',
        location: { lat: 19.085, lng: 72.888, address: 'Bandra, Mumbai' },
        message: 'Check-in missed alert',
        notifiedContacts: [
          { name: 'Rahul Sharma', phone: '+91-7777777777', email: 'rahul@example.com' },
          { name: 'Sunita Sharma', phone: '+91-6666666666', email: 'sunita@example.com' },
        ],
        resolvedAt: new Date(),
      },
    ]);
    console.log('🚨 Created sample emergency alerts');

    console.log('\n✅ ================================');
    console.log('   SafeHer Database Seeded!');
    console.log('================================');
    console.log('🔑 Admin Login:');
    console.log('   Email:    admin@safeher.com');
    console.log('   Password: admin123');
    console.log('');
    console.log('👩 Demo User Login:');
    console.log('   Email:    priya@example.com');
    console.log('   Password: demo123');
    console.log('================================\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeder error:', err.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();
