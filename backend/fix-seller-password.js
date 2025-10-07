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

// Fix seller password
const fixSellerPassword = async () => {
  try {
    await connectDB();

    // Find the test seller
    const seller = await Seller.findOne({ email: 'test.seller@hathak.com' });
    
    if (!seller) {
      console.log('❌ Test seller not found');
      return;
    }

    console.log('✅ Test seller found:', seller.businessName);

    // Hash password manually and update directly in database
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    // Update password directly without triggering pre-save hook
    await Seller.updateOne(
      { email: 'test.seller@hathak.com' },
      { 
        $set: { 
          password: hashedPassword,
          isActive: true
        } 
      }
    );

    console.log('✅ Password fixed successfully');

    // Test the password
    const updatedSeller = await Seller.findOne({ email: 'test.seller@hathak.com' });
    const isMatch = await updatedSeller.matchPassword('password123');
    console.log('🔑 Password match test:', isMatch);

    if (isMatch) {
      console.log('🎉 Seller login should work now!');
    } else {
      console.log('❌ Password still does not match');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing password:', error);
    process.exit(1);
  }
};

// Run the fix
fixSellerPassword();
