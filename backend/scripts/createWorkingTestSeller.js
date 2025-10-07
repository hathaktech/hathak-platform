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

// Create test seller
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
      console.log('✅ Test seller created:', seller.businessName);
    } else {
      console.log('ℹ️ Test seller already exists:', seller.businessName);
    }
    
    return seller;
  } catch (error) {
    console.error('❌ Error creating test seller:', error);
    throw error;
  }
};

// Create test categories
const createTestCategories = async () => {
  try {
    const categories = [
      {
        name: 'Women\'s Fashion',
        slug: 'womens-fashion',
        description: 'Trendy women\'s clothing and accessories',
        isActive: true
      },
      {
        name: 'Men\'s Fashion',
        slug: 'mens-fashion',
        description: 'Stylish men\'s clothing and accessories',
        isActive: true
      },
      {
        name: 'Accessories',
        slug: 'accessories',
        description: 'Fashion accessories for all',
        isActive: true
      }
    ];

    const createdCategories = [];
    for (const categoryData of categories) {
      let category = await Category.findOne({ slug: categoryData.slug });
      if (!category) {
        category = await Category.create(categoryData);
        console.log('✅ Category created:', category.name);
      } else {
        console.log('ℹ️ Category already exists:', category.name);
      }
      createdCategories.push(category);
    }

    return createdCategories;
  } catch (error) {
    console.error('❌ Error creating categories:', error);
    throw error;
  }
};

// Create test products
const createTestProducts = async (sellerId, categories) => {
  try {
    // Clear existing test products
    await Product.deleteMany({ seller: sellerId });
    console.log('🧹 Cleared existing test products');

    const products = [
      {
        name: 'Trendy Summer Dress',
        shortDescription: 'Beautiful floral summer dress perfect for any occasion',
        description: 'This stunning summer dress features a beautiful floral print and flowing silhouette. Made from premium cotton blend fabric, it offers comfort and style. Perfect for brunch dates, garden parties, or casual outings.',
        sku: 'TSD-001',
        price: 49.99,
        compareAtPrice: 69.99,
        primaryImage: { url: '/api/placeholder/400/500', alt: 'Trendy Summer Dress' },
        images: [
          { url: '/api/placeholder/400/500', alt: 'Trendy Summer Dress Front', isPrimary: true, order: 0 },
          { url: '/api/placeholder/400/500', alt: 'Trendy Summer Dress Back', isPrimary: false, order: 1 }
        ],
        category: categories[0]._id, // Women's Fashion
        seller: sellerId,
        status: 'active',
        visibility: 'public',
        type: 'simple',
        trackQuantity: true,
        allowBackorder: false,
        weight: { value: 0.5, unit: 'kg' },
        dimensions: {
          length: 10,
          width: 8,
          height: 1
        },
        features: [
          { name: 'Material', value: '100% Cotton Blend', icon: 'fabric' },
          { name: 'Care', value: 'Machine Washable', icon: 'washing-machine' },
          { name: 'Colors', value: 'Available in 5 Colors', icon: 'palette' },
          { name: 'Sizes', value: 'Sizes XS to XL', icon: 'ruler' }
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
      },
      {
        name: 'Classic Denim Jacket',
        shortDescription: 'Timeless denim jacket for a casual chic look',
        description: 'This classic denim jacket is a wardrobe essential. Made from premium denim with a comfortable fit, it pairs perfectly with any outfit. Features button closure and chest pockets.',
        sku: 'CDJ-002',
        price: 79.99,
        primaryImage: { url: '/api/placeholder/400/500', alt: 'Classic Denim Jacket' },
        images: [
          { url: '/api/placeholder/400/500', alt: 'Classic Denim Jacket Front', isPrimary: true, order: 0 },
          { url: '/api/placeholder/400/500', alt: 'Classic Denim Jacket Back', isPrimary: false, order: 1 }
        ],
        category: categories[0]._id, // Women's Fashion
        seller: sellerId,
        status: 'active',
        visibility: 'public',
        type: 'simple',
        trackQuantity: true,
        allowBackorder: false,
        weight: { value: 0.8, unit: 'kg' },
        dimensions: {
          length: 12,
          width: 10,
          height: 2
        },
        features: [
          { name: 'Material', value: '100% Cotton Denim', icon: 'fabric' },
          { name: 'Closure', value: 'Button Closure', icon: 'buttons' },
          { name: 'Pockets', value: 'Chest Pockets', icon: 'pocket' },
          { name: 'Washes', value: 'Available in 3 Washes', icon: 'palette' }
        ],
        tags: ['denim', 'jacket', 'casual', 'bestseller', 'classic'],
        reviews: {
          averageRating: 4.7,
          totalReviews: 89,
          ratingDistribution: { 5: 65, 4: 20, 3: 3, 2: 1, 1: 0 }
        },
        shipping: {
          freeShipping: true,
          handlingTime: 1,
          internationalShipping: true
        },
        analytics: {
          views: 980,
          wishlistCount: 67,
          clicks: 150,
          conversions: 25
        }
      },
      {
        name: 'Elegant Pearl Necklace',
        shortDescription: 'Sophisticated pearl necklace for special occasions',
        description: 'This elegant pearl necklace features high-quality cultured pearls. Perfect for special occasions, business meetings, or elegant dinners. Comes in a beautiful gift box.',
        sku: 'EPN-003',
        price: 129.99,
        compareAtPrice: 179.99,
        primaryImage: { url: '/api/placeholder/400/500', alt: 'Elegant Pearl Necklace' },
        images: [
          { url: '/api/placeholder/400/500', alt: 'Elegant Pearl Necklace', isPrimary: true, order: 0 },
          { url: '/api/placeholder/400/500', alt: 'Pearl Necklace Detail', isPrimary: false, order: 1 }
        ],
        category: categories[2]._id, // Accessories
        seller: sellerId,
        status: 'active',
        visibility: 'public',
        type: 'simple',
        trackQuantity: true,
        allowBackorder: false,
        weight: { value: 0.2, unit: 'kg' },
        dimensions: {
          length: 16,
          width: 1,
          height: 1
        },
        features: [
          { name: 'Material', value: 'Cultured Pearls', icon: 'gem' },
          { name: 'Clasp', value: 'Sterling Silver Clasp', icon: 'link' },
          { name: 'Length', value: '16-inch Length', icon: 'ruler' },
          { name: 'Packaging', value: 'Gift Box Included', icon: 'gift' }
        ],
        tags: ['pearls', 'necklace', 'jewelry', 'elegant', 'accessories'],
        reviews: {
          averageRating: 4.8,
          totalReviews: 56,
          ratingDistribution: { 5: 45, 4: 10, 3: 1, 2: 0, 1: 0 }
        },
        shipping: {
          freeShipping: false,
          handlingTime: 2,
          internationalShipping: true
        },
        analytics: {
          views: 750,
          wishlistCount: 23,
          clicks: 100,
          conversions: 12
        }
      },
      {
        name: 'Wireless Bluetooth Headphones',
        shortDescription: 'Premium quality wireless headphones with noise cancellation',
        description: 'Experience crystal clear sound with these premium wireless headphones. Features active noise cancellation, 30-hour battery life, and comfortable over-ear design.',
        sku: 'WBH-004',
        price: 199.99,
        compareAtPrice: 249.99,
        primaryImage: { url: '/api/placeholder/400/500', alt: 'Wireless Bluetooth Headphones' },
        images: [
          { url: '/api/placeholder/400/500', alt: 'Wireless Headphones', isPrimary: true, order: 0 },
          { url: '/api/placeholder/400/500', alt: 'Headphones Detail', isPrimary: false, order: 1 }
        ],
        category: categories[1]._id, // Men's Fashion (as electronics)
        seller: sellerId,
        status: 'active',
        visibility: 'public',
        type: 'simple',
        trackQuantity: true,
        allowBackorder: false,
        weight: { value: 0.3, unit: 'kg' },
        dimensions: {
          length: 20,
          width: 18,
          height: 8
        },
        features: [
          { name: 'Battery', value: '30-hour battery life', icon: 'battery' },
          { name: 'Noise Cancellation', value: 'Active noise cancellation', icon: 'volume-x' },
          { name: 'Connectivity', value: 'Bluetooth 5.0', icon: 'bluetooth' },
          { name: 'Comfort', value: 'Over-ear design', icon: 'headphones' }
        ],
        tags: ['headphones', 'wireless', 'bluetooth', 'audio', 'electronics'],
        reviews: {
          averageRating: 4.6,
          totalReviews: 203,
          ratingDistribution: { 5: 150, 4: 40, 3: 10, 2: 2, 1: 1 }
        },
        shipping: {
          freeShipping: true,
          handlingTime: 1,
          internationalShipping: true
        },
        analytics: {
          views: 2100,
          wishlistCount: 89,
          clicks: 350,
          conversions: 45
        }
      },
      {
        name: 'Yoga Mat Premium',
        shortDescription: 'Non-slip yoga mat with carrying strap',
        description: 'Perfect your yoga practice with this premium non-slip yoga mat. Made from eco-friendly materials with excellent grip and cushioning. Includes carrying strap.',
        sku: 'YMP-005',
        price: 39.99,
        primaryImage: { url: '/api/placeholder/400/500', alt: 'Yoga Mat Premium' },
        images: [
          { url: '/api/placeholder/400/500', alt: 'Yoga Mat', isPrimary: true, order: 0 },
          { url: '/api/placeholder/400/500', alt: 'Yoga Mat Detail', isPrimary: false, order: 1 }
        ],
        category: categories[2]._id, // Accessories
        seller: sellerId,
        status: 'active',
        visibility: 'public',
        type: 'simple',
        trackQuantity: true,
        allowBackorder: false,
        weight: { value: 1.2, unit: 'kg' },
        dimensions: {
          length: 180,
          width: 60,
          height: 0.5
        },
        features: [
          { name: 'Material', value: 'Eco-friendly TPE', icon: 'leaf' },
          { name: 'Grip', value: 'Non-slip surface', icon: 'grip-horizontal' },
          { name: 'Thickness', value: '6mm cushioning', icon: 'layers' },
          { name: 'Accessories', value: 'Carrying strap included', icon: 'bag' }
        ],
        tags: ['yoga', 'mat', 'fitness', 'exercise', 'wellness'],
        reviews: {
          averageRating: 4.7,
          totalReviews: 156,
          ratingDistribution: { 5: 120, 4: 30, 3: 5, 2: 1, 1: 0 }
        },
        shipping: {
          freeShipping: true,
          handlingTime: 2,
          internationalShipping: true
        },
        analytics: {
          views: 1450,
          wishlistCount: 67,
          clicks: 280,
          conversions: 38
        }
      }
    ];

    const createdProducts = [];
    for (const productData of products) {
      const product = await Product.create(productData);
      console.log('✅ Product created:', product.name);
      createdProducts.push(product);
    }

    return createdProducts;
  } catch (error) {
    console.error('❌ Error creating products:', error);
    throw error;
  }
};

// Main function to create test data
const createTestData = async () => {
  try {
    await connectDB();

    console.log('🚀 Creating test seller...');
    const seller = await createTestSeller();

    console.log('📂 Creating test categories...');
    const categories = await createTestCategories();

    console.log('🛍️ Creating test products...');
    const products = await createTestProducts(seller._id, categories);

    console.log('\n🎉 Test data created successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Seller: ${seller.businessName} (${seller.email})`);
    console.log(`- Categories: ${categories.length}`);
    console.log(`- Products: ${products.length}`);
    console.log('\n🔑 Test Seller Credentials:');
    console.log(`Email: ${seller.email}`);
    console.log(`Password: password123`);
    console.log('\n🌐 You can now test the marketplace at: http://localhost:3000/HatHakStore');
    console.log('\n📱 Test the seller dashboard at: http://localhost:3000/seller/dashboard');
    console.log('\n🔍 Test the admin panel at: http://localhost:3000/admin');

    process.exit(0);
  } catch (error) {
    console.error('💥 Error creating test data:', error);
    process.exit(1);
  }
};

// Run the script
createTestData();
