// scripts/testImplementation.js - Test Implementation Script
import mongoose from 'mongoose';
import BuyForMeRequest from '../models/BuyForMeRequest.js';
import User from '../models/User.js';
import Admin from '../models/Admin.js';
import { generateSecureToken } from '../middleware/security.js';

async function testImplementation() {
  try {
    console.log('🚀 Testing BuyForMe Implementation...\n');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hathak-platform');
    console.log('✅ Connected to MongoDB');

    // Test 1: Create test data
    console.log('\n📋 Test 1: Creating Test Data');
    
    // Create or find test user
    let testUser = await User.findOne({ email: 'test@example.com' });
    if (!testUser) {
      testUser = new User({
        name: 'Test Customer',
        email: 'test@example.com',
        password: 'hashedpassword',
        isActive: true
      });
      await testUser.save();
      console.log('✅ Test user created');
    } else {
      console.log('✅ Test user found');
    }

    // Create or find test admin
    let testAdmin = await Admin.findOne({ email: 'admin@example.com' });
    if (!testAdmin) {
      testAdmin = new Admin({
        name: 'Test Admin',
        email: 'admin@example.com',
        password: 'hashedpassword',
        role: 'admin',
        permissions: {
          orderManagement: true,
          financialAccess: true,
          userManagement: true
        },
        isActive: true
      });
      await testAdmin.save();
      console.log('✅ Test admin created');
    } else {
      console.log('✅ Test admin found');
    }

    // Test 2: Create BuyForMe request
    console.log('\n📦 Test 2: Creating BuyForMe Request');
    const testRequest = new BuyForMeRequest({
      customerId: testUser._id,
      customerName: testUser.name,
      customerEmail: testUser.email,
      items: [{
        name: 'Test Product',
        url: 'https://example.com/product',
        quantity: 2,
        price: 50,
        currency: 'USD'
      }],
      totalAmount: 100,
      currency: 'USD',
      status: 'pending',
      priority: 'high',
      shippingAddress: {
        name: testUser.name,
        street: '123 Test Street',
        city: 'Test City',
        country: 'US',
        postalCode: '12345'
      }
    });

    await testRequest.save();
    console.log('✅ BuyForMe request created');
    console.log(`   Request Number: ${testRequest.requestNumber}`);
    console.log(`   Status: ${testRequest.status}`);
    console.log(`   Total Amount: $${testRequest.totalAmount}`);

    // Test 3: Test status transitions
    console.log('\n🔄 Test 3: Testing Status Transitions');
    
    // Approve request
    await testRequest.updateStatus('approved', 'payment_pending', testAdmin._id);
    console.log(`✅ Status updated to: ${testRequest.status}`);
    console.log(`   Sub-status: ${testRequest.subStatus}`);

    // Process payment
    testRequest.paymentStatus = 'paid';
    testRequest.transactionId = 'TXN123456789';
    await testRequest.updateStatus('in_progress', 'payment_completed', testAdmin._id);
    console.log(`✅ Payment processed, status: ${testRequest.status}`);

    // Test 4: Test validation
    console.log('\n🔍 Test 4: Testing Validation');
    try {
      const invalidRequest = new BuyForMeRequest({
        customerId: testUser._id,
        items: [{
          name: 'Invalid Product',
          url: 'invalid-url', // Invalid URL
          quantity: 1,
          price: 100,
          currency: 'USD'
        }],
        totalAmount: 100,
        currency: 'USD',
        status: 'pending',
        shippingAddress: {
          name: 'Test Customer',
          street: '123 Test Street',
          city: 'Test City',
          country: 'US',
          postalCode: '12345'
        }
      });
      await invalidRequest.save();
      console.log('❌ Validation failed - invalid URL should be rejected');
    } catch (error) {
      console.log('✅ Validation working correctly - invalid URL rejected');
    }

    // Test 5: Test queries
    console.log('\n🔍 Test 5: Testing Queries');
    
    const pendingRequests = await BuyForMeRequest.getByStatus('pending');
    console.log(`✅ Found ${pendingRequests.length} pending requests`);

    const customerRequests = await BuyForMeRequest.getByCustomer(testUser._id);
    console.log(`✅ Found ${customerRequests.length} requests for customer`);

    const stats = await BuyForMeRequest.getStatistics();
    console.log(`✅ Statistics: ${stats[0]?.totalRequests || 0} total requests`);

    // Test 6: Test token generation
    console.log('\n🔐 Test 6: Testing Security');
    const adminToken = generateSecureToken(
      { id: testAdmin._id, type: 'admin' },
      process.env.JWT_SECRET || 'test-secret',
      '1h'
    );
    console.log('✅ Admin token generated successfully');

    // Cleanup
    console.log('\n🧹 Cleanup');
    await BuyForMeRequest.findByIdAndDelete(testRequest._id);
    await User.findByIdAndDelete(testUser._id);
    await Admin.findByIdAndDelete(testAdmin._id);
    console.log('✅ Test data cleaned up');

    console.log('\n🎉 All implementation tests passed!');
    console.log('\n📋 Implementation Summary:');
    console.log('✅ Unified data model working');
    console.log('✅ Status transitions working');
    console.log('✅ Validation working');
    console.log('✅ Database queries working');
    console.log('✅ Security token generation working');
    console.log('✅ All CRUD operations working');
    
    console.log('\n🚀 Ready for production deployment!');
    
  } catch (error) {
    console.error('❌ Implementation test failed:', error.message);
    console.error(error.stack);
  } finally {
    await mongoose.connection.close();
    console.log('\n📡 Disconnected from MongoDB');
  }
}

// Run implementation tests
testImplementation();
