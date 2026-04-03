const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('../src/models/Admin');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('DB Connected for seeding...');

    // Delete existing admin to clear everything
    await Admin.deleteMany({ email: 'admin@sarkarisetu.com' });
    console.log('Purged existing seed record.');

    const admin = await Admin.create({
      name: 'Super Admin',
      email: 'admin@sarkarisetu.com',
      password: 'Admin@123',
      role: 'super_admin'
    });

    console.log('Seeded New Admin Instance:');
    console.log('Email:', admin.email);
    console.log('Password (Raw): Admin@123');
    
    process.exit(0);
  } catch (err) {
    console.error('Seed Failed:', err);
    process.exit(1);
  }
};

seed();
