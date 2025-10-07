import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Seller from './models/Seller.js';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hathak-platform');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Test seller login
const testSellerLogin = async () => {
  try {
    await connectDB();

    // Find the test seller
    const seller = await Seller.findOne({ email: 'test.seller@hathak.com' });
    
    if (!seller) {
      console.log('❌ Test seller not found');
      return;
    }

    console.log('✅ Test seller found:', seller.businessName);
    console.log('📧 Email:', seller.email);
    console.log('📊 Status:', seller.status);
    console.log('🔐 Is Active:', seller.isActive);

    // Test password match
    const isMatch = await seller.matchPassword('password123');
    console.log('🔑 Password match:', isMatch);

    if (isMatch) {
      console.log('🎉 Seller login test successful!');
    } else {
      console.log('❌ Password does not match');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error testing seller login:', error);
    process.exit(1);
  }
};

// Run the test
testSellerLogin();
