// scripts/createAdminUser.js - Create Admin User Script
import mongoose from 'mongoose';
import Admin from '../models/Admin.js';
import bcrypt from 'bcryptjs';

async function createAdminUser() {
  try {
    console.log('🚀 Creating Admin User...\n');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hathak-platform');
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@hathak.com' });
    if (existingAdmin) {
      console.log('✅ Admin user already exists:', existingAdmin.email);
      console.log('Admin ID:', existingAdmin._id);
      console.log('Admin Role:', existingAdmin.role);
      console.log('Admin Active:', existingAdmin.isActive);
      process.exit(0);
    }

    // Create admin user
    const adminData = {
      name: 'Hathak Admin',
      email: 'admin@hathak.com',
      password: 'admin123', // Will be hashed by pre-save hook
      role: 'admin',
      permissions: {
        userManagement: true,
        productManagement: true,
        orderManagement: true,
        financialAccess: true,
        systemSettings: true,
        analyticsAccess: true,
        canGrantPermissions: true,
        canCreateAdmins: true
      },
      isActive: true
    };

    const admin = new Admin(adminData);
    await admin.save();

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@hathak.com');
    console.log('🔑 Password: admin123');
    console.log('🆔 Admin ID:', admin._id);
    console.log('👤 Role:', admin.role);
    console.log('✅ Active:', admin.isActive);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

// Run the script
createAdminUser();
