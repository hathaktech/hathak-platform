import mongoose from 'mongoose';
import Product from '../models/Product.js';

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

// Test product creation
const testProduct = async () => {
  try {
    // Clear existing test products
    await Product.deleteMany({ sku: 'TEST-001' });
    console.log('Cleared existing test products');

    const product = await Product.create({
      name: 'Test Product',
      shortDescription: 'A test product',
      description: 'This is a test product for testing purposes',
      sku: 'TEST-001',
      price: 29.99,
      category: new mongoose.Types.ObjectId(), // Dummy category ID
      seller: new mongoose.Types.ObjectId(), // Dummy seller ID
      status: 'active',
      visibility: 'public',
      type: 'simple',
      trackQuantity: true,
      allowBackorder: false,
      primaryImage: { url: '/api/placeholder/400/500', alt: 'Test Product' },
      images: [
        { url: '/api/placeholder/400/500', alt: 'Test Product', isPrimary: true, order: 0 }
      ]
    });

    console.log('✅ Product created successfully:', product.name);
    return product;
  } catch (error) {
    console.error('❌ Error creating product:', error);
    throw error;
  }
};

// Main function
const runTest = async () => {
  try {
    await connectDB();
    await testProduct();
    console.log('\n🎉 Test completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('💥 Test failed:', error);
    process.exit(1);
  }
};

// Run the test
runTest();
