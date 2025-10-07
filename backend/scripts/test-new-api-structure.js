// scripts/test-new-api-structure.js
// Test script to verify the new API structure works correctly
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import BuyForMeRequest from '../models/BuyForMeRequest.js';

// Load environment variables
dotenv.config();

const testNewStructure = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hathak-platform');
    console.log('✅ Connected to MongoDB');

    // Test 1: Get all requests individual format
    console.log('\n🔍 Test 1: Individual Requests Format');
    const individualRequests = await BuyForMeRequest.find({})
      .sort({ createdAt: -1 })
      .limit(5);

    console.log(`📊 Found ${individualRequests.length} requests`);
    individualRequests.forEach((req, index) => {
      console.log(`  ${index + 1}. ${req.requestNumber} - ${req.customerName}`);
      console.log(`     Items: ${req.items.length} (${req.items.map(item => `${item.name} (${item.quantity}x)`).join(', ')})`);
      console.log(`     Amount: $${req.totalAmount.toFixed(2)}`);
      console.log(`     Batch: ${req.batchId || 'NO_BATCH'}`);
    });

    // Test 2: Customer grouping simulation
    console.log('\n🔍 Test 2: Customer Grouping Simulation');
    const customerGroups = await BuyForMeRequest.aggregate([
      {
        $group: {
          _id: '$customerId',
          customerName: { $first: '$customerName' },
          customerEmail: { $first: '$customerEmail' },
          requestCount: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' },
          latestRequest: { $max: '$createdAt' },
          requestNumbers: { $addToSet: '$requestNumber' },
          batchIds: { $addToSet: '$batchId' }
        }
      },
      { $sort: { latestRequest: -1 } }
    ]);

    console.log(`👥 Found ${customerGroups.length} unique customers`);
    customerGroups.forEach((customer, index) => {
      console.log(`  ${index + 1}. ${customer.customerName} (${customer.customerEmail})`);
      console.log(`     Requests: ${customer.requestCount}`);
      console.log(`     Total Amount: $${customer.totalAmount.toFixed(2)}`);
      console.log(`     Request IDs: ${customer.requestNumbers.join(', ')}`);
      console.log(`     Batches: ${customer.batchIds.filter(Boolean).join(', ') || 'None'}`);
    });

    // Test 3: Batch grouping simulation
    console.log('\n🔍 Test 3: Batch Grouping Simulation');
    const batchGroups = await BuyForMeRequest.aggregate([
      { $match: { batchId: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: '$batchId',
          customerName: { $first: '$customerName' },
          requestCount: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' },
          requests: {
            $push: {
              requestNumber: '$requestNumber',
              itemName: { $first: '$items.name' },
              status: '$status'
            }
          }
        }
      },
      { $sort: { requestCount: -1 } }
    ]);

    console.log(`📦 Found ${batchGroups.length} batches`);
    batchGroups.forEach((batch, index) => {
      console.log(`  ${index + 1}. Batch: ${batch._id}`);
      console.log(`     Customer: ${batch.customerName}`);
      console.log(`     Requests: ${batch.requestCount}`);
      console.log(`     Total: $${batch.totalAmount.toFixed(2)}`);
      batch.requests.forEach(req => {
        console.log(`       - ${req.requestNumber}: ${req.itemName} (${req.status})`);
      });
    });

    // Test 4: Check request numbers are unique
    console.log('\n🔍 Test 4: Request Number Uniqueness');
    const requestNumbers = await BuyForMeRequest.distinct('requestNumber');
    const duplicateCheck = await BuyForMeRequest.aggregate([
      {
        $group: {
          _id: '$requestNumber',
          count: { $sum: 1 }
        }
      },
      { $match: { count: { $gt: 1 } } }
    ]);

    console.log(`📊 Total unique request numbers: ${requestNumbers.length}`);
    console.log(`🔍 Duplicate request numbers: ${duplicateCheck.length}`);
    
    if (duplicateCheck.length === 0) {
      console.log('✅ All request numbers are unique!');
    } else {
      console.log('❌ Found duplicate request numbers:', duplicateCheck);
    }

    // Test 5: Verify all requests have proper BFM format
    console.log('\n🔍 Test 5: BFM Number Format Validation');
    const invalidFormatRequests = await BuyForMeRequest.find({
      requestNumber: { $not: /^BFM\d{8}$/ }
    });

    console.log(`📊 Total requests with invalid BFM format: ${invalidFormatRequests.length}`);
    
    if (invalidFormatRequests.length === 0) {
      console.log('✅ All request numbers follow BFM format!');
    } else {
      console.log('❌ Found requests with invalid BFM format:', invalidFormatRequests.map(r => r.requestNumber));
    }

    console.log('\n🎉 API Structure Test Completed Successfully!');

  } catch (error) {
    console.error('❌ Error testing API structure:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the test
testNewStructure();
