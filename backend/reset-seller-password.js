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

// Reset seller password
const resetSellerPassword = async () => {
  try {
    await connectDB();

    // Find the test seller
    const seller = await Seller.findOne({ email: 'test.seller@hathak.com' });
    
    if (!seller) {
      console.log('❌ Test seller not found');
      return;
    }

    console.log('✅ Test seller found:', seller.businessName);

    // Reset password
    const hashedPassword = await bcrypt.hash('password123', 12);
    seller.password = hashedPassword;
    seller.isActive = true;
    await seller.save();

    console.log('✅ Password reset successfully');
    console.log('🔑 New password: password123');

    // Test the new password
    const isMatch = await seller.matchPassword('password123');
    console.log('🔑 Password match test:', isMatch);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting password:', error);
    process.exit(1);
  }
};

// Run the reset
resetSellerPassword();
