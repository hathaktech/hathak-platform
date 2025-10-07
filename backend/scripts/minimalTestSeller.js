import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Seller from '../models/Seller.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

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

// Create minimal test seller
const createTestSeller = async () => {
  try {
    let seller = await Seller.findOne({ email: 'test.seller@hathak.com' });
    
    if (!seller) {
      const hashedPassword = await bcrypt.hash('password123', 12);
      
      seller = await Seller.create({
        businessName: 'Trendy Fashion Store',
        email: 'test.seller@hathak.com',
        password: hashedPassword,
        phone: '+1-555-0123',
        businessType: 'company',
        status: 'approved',
        isActive: true
      });
      console.log('Test seller created:', seller.businessName);
    } else {
      console.log('Test seller already exists:', seller.businessName);
    }
    
    return seller;
  } catch (error) {
    console.error('Error creating test seller:', error);
    throw error;
  }
};

// Create minimal test category
const createTestCategory = async () => {
  try {
    let category = await Category.findOne({ slug: 'womens-fashion' });
    
    if (!category) {
      category = await Category.create({
        name: 'Women\'s Fashion',
        slug: 'womens-fashion',
        description: 'Trendy women\'s clothing and accessories',
        isActive: true
      });
      console.log('Category created:', category.name);
    } else {
      console.log('Category already exists:', category.name);
    }
    
    return category;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

// Create minimal test product
const createTestProduct = async (sellerId, categoryId) => {
  try {
    // Clear existing test products
    await Product.deleteMany({ seller: sellerId });
    console.log('Cleared existing test products');

    const product = await Product.create({
      name: 'Trendy Summer Dress',
      shortDescription: 'Beautiful floral summer dress',
      description: 'This stunning summer dress features a beautiful floral print and flowing silhouette.',
      sku: 'TSD-001',
      price: 49.99,
      compareAtPrice: 69.99,
      primaryImage: { url: '/api/placeholder/400/500', alt: 'Trendy Summer Dress' },
      images: [
        { url: '/api/placeholder/400/500', alt: 'Trendy Summer Dress Front', isPrimary: true, order: 0 }
      ],
      badges: [
        { type: 'new', text: 'New', color: 'green' },
        { type: 'sale', text: 'Sale', color: 'red' }
      ],
      category: categoryId,
      seller: sellerId,
      status: 'active',
      visibility: 'public',
      type: 'simple',
      trackQuantity: true,
      allowBackorder: false,
      weight: { value: 0.5, unit: 'kg' },
      features: [
        { name: 'Material', value: '100% Cotton Blend', icon: 'fabric' },
        { name: 'Care', value: 'Machine Washable', icon: 'washing-machine' }
      ],
      tags: ['summer', 'dress', 'floral', 'casual', 'trendy'],
      reviews: {
        averageRating: 4.5,
        totalReviews: 128,
        ratingDistribution: { 5: 80, 4: 35, 3: 10, 2: 2, 1: 1 }
      },
      shipping: {
        freeShipping: true,
        handlingTime: 1,
        internationalShipping: true
      },
      analytics: {
        views: 1250,
        wishlistCount: 45,
        clicks: 200,
        conversions: 15
      }
    });

    console.log('Product created:', product.name);
    return product;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Main function
const createTestData = async () => {
  try {
    await connectDB();

    console.log('Creating test seller...');
    const seller = await createTestSeller();

    console.log('Creating test category...');
    const category = await createTestCategory();

    console.log('Creating test product...');
    const product = await createTestProduct(seller._id, category._id);

    console.log('\n✅ Test data created successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Seller: ${seller.businessName} (${seller.email})`);
    console.log(`- Category: ${category.name}`);
    console.log(`- Product: ${product.name}`);
    console.log('\n🔑 Test Seller Credentials:');
    console.log(`Email: ${seller.email}`);
    console.log(`Password: password123`);
    console.log('\n🌐 You can now test the marketplace at: http://localhost:3000/HatHakStore');

    process.exit(0);
  } catch (error) {
    console.error('Error creating test data:', error);
    process.exit(1);
  }
};

// Run the script
createTestData();
