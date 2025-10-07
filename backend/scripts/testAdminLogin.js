// scripts/testAdminLogin.js - Test Admin Login
import mongoose from 'mongoose';
import Admin from '../models/Admin.js';

async function testAdminLogin() {
  try {
    console.log('🧪 Testing Admin Login...\n');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hathak-platform');
    console.log('✅ Connected to MongoDB');

    // Find admin user
    const admin = await Admin.findOne({ email: 'admin@hathak.com' });
    if (!admin) {
      console.log('❌ Admin user not found');
      process.exit(1);
    }

    console.log('✅ Admin user found:');
    console.log('📧 Email:', admin.email);
    console.log('👤 Name:', admin.name);
    console.log('🆔 ID:', admin._id);
    console.log('👑 Role:', admin.role);
    console.log('✅ Active:', admin.isActive);
    console.log('🔐 Password hash:', admin.password.substring(0, 20) + '...');

    // Test password
    const testPassword = 'admin123';
    const isMatch = await admin.matchPassword(testPassword);
    console.log('🔑 Password test:', isMatch ? '✅ CORRECT' : '❌ INCORRECT');

    if (!isMatch) {
      console.log('💡 Creating new admin with correct password...');
      
      // Delete old admin
      await Admin.deleteOne({ email: 'admin@hathak.com' });
      
      // Create new admin
      const newAdmin = new Admin({
        name: 'Hathak Admin',
        email: 'admin@hathak.com',
        password: 'admin123',
        role: 'admin',
        isActive: true
      });
      
      await newAdmin.save();
      console.log('✅ New admin created with password: admin123');
      
      // Test new password
      const newIsMatch = await newAdmin.matchPassword('admin123');
      console.log('🔑 New password test:', newIsMatch ? '✅ CORRECT' : '❌ INCORRECT');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error testing admin login:', error);
    process.exit(1);
  }
}

// Run the script
testAdminLogin();
