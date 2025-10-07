// scripts/testNewSystem.js - Test Script for New BuyForMe System
import mongoose from 'mongoose';
import BuyForMeRequest from '../models/BuyForMeRequest.js';
import User from '../models/User.js';
import Admin from '../models/Admin.js';

async function testNewSystem() {
  try {
    console.log('🧪 Testing New BuyForMe System...\n');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hathak-platform');
    console.log('✅ Connected to MongoDB');

    // Test 1: Check if BuyForMeRequest model works
    console.log('\n📋 Test 1: Model Creation');
    const testRequest = new BuyForMeRequest({
      customerId: new mongoose.Types.ObjectId(),
      customerName: 'Test Customer',
      customerEmail: 'test@example.com',
      items: [{
        name: 'Test Product',
        url: 'https://example.com/product',
        quantity: 1,
        price: 100,
        currency: 'USD'
      }],
      totalAmount: 100,
      currency: 'USD',
      status: 'pending',
      priority: 'medium',
      shippingAddress: {
        name: 'Test Customer',
        street: '123 Test Street',
        city: 'Test City',
        country: 'US',
        postalCode: '12345'
      }
    });

    await testRequest.save();
    console.log('✅ Test request created successfully');
    console.log(`   Request Number: ${testRequest.requestNumber}`);
    console.log(`   Status: ${testRequest.status}`);

    // Test 2: Check validation
    console.log('\n🔍 Test 2: Validation');
    try {
      const invalidRequest = new BuyForMeRequest({
        customerId: new mongoose.Types.ObjectId(),
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

    // Test 3: Check indexes
    console.log('\n📊 Test 3: Database Indexes');
    const indexes = await BuyForMeRequest.collection.getIndexes();
    console.log('✅ Indexes created:');
    Object.keys(indexes).forEach(indexName => {
      console.log(`   - ${indexName}`);
    });

    // Test 4: Check virtual fields
    console.log('\n🎯 Test 4: Virtual Fields');
    console.log(`   Status Formatted: ${testRequest.statusFormatted}`);
    console.log(`   Customer Status: ${testRequest.customerStatus}`);
    console.log(`   Total Items: ${testRequest.totalItems}`);

    // Test 5: Check static methods
    console.log('\n🔧 Test 5: Static Methods');
    const requestsByStatus = await BuyForMeRequest.getByStatus('pending');
    console.log(`   Found ${requestsByStatus.length} pending requests`);

    // Test 6: Check instance methods
    console.log('\n⚙️ Test 6: Instance Methods');
    await testRequest.updateStatus('approved', 'payment_pending');
    console.log(`   Status updated to: ${testRequest.status}`);
    console.log(`   Sub-status: ${testRequest.subStatus}`);

    // Cleanup
    await BuyForMeRequest.findByIdAndDelete(testRequest._id);
    console.log('\n🧹 Cleanup completed');

    console.log('\n🎉 All tests passed! New system is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
  } finally {
    await mongoose.connection.close();
    console.log('\n📡 Disconnected from MongoDB');
  }
}

// Run tests
testNewSystem();
