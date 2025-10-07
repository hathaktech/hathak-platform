// scripts/check-current-data.js
// Simple script to check current BuyForMe requests structure
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import BuyForMeRequest from '../models/BuyForMeRequest.js';

// Load environment variables
dotenv.config();

const checkCurrentData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hathak-platform');
    console.log('✅ Connected to MongoDB');

    // Get total count
    const totalRequests = await BuyForMeRequest.countDocuments();
    console.log(`📊 Total BuyForMe requests: ${totalRequests}`);

    if (totalRequests === 0) {
      console.log('📭 No requests found in database');
      return;
    }

    // Find requests with multiple items
    const multiItemRequests = await BuyForMeRequest.find({
      $expr: { $gt: [{ $size: { $ifNull: ["$items", []] } }, 1] }
    });

    // Find requests with single items
    const singleItemRequests = await BuyForMeRequest.find({
      $expr: { $eq: [{ $size: { $ifNull: ["$items", []] } }, 1] }
    });

    // Find requests with no items (corrupted data)
    const noItemRequests = await BuyForMeRequest.find({
      $or: [
        { items: { $exists: false } },
        { items: null },
        { items: [] }
      ]
    });

    console.log('\n📈 Request Structure Analysis:');
    console.log(`📊 Single item requests: ${singleItemRequests.length}`);
    console.log(`📦 Multi-item requests: ${multiItemRequests.length}`);
    console.log(`❌ No items requests: ${noItemRequests.length}`);
    console.log(`🔍 Total: ${singleItemRequests.length + multiItemRequests.length + noItemRequests.length}`);

    // Show sample multi-item requests if any
    if (multiItemRequests.length > 0) {
      console.log('\n🔍 Sample multi-item requests that need migration:');
      multiItemRequests.slice(0, 3).forEach((req, index) => {
        console.log(`  ${index + 1}. Request: ${req.requestNumber || 'NO_NUMBER'} - ${req.customerName}`);
        console.log(`     Items: ${req.items.length} (${req.items.map(item => `${item.name} (${item.quantity}x)`).join(', ')})`);
        console.log(`     Total: $${req.totalAmount.toFixed(2)}`);
        console.log(`     Status: ${req.status}`);
      });
      
      if (multiItemRequests.length > 3) {
        console.log(`     ... and ${multiItemRequests.length - 3} more`);
      }
    }

    // Show status distribution
    const statusCounts = await BuyForMeRequest.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          avgItems: { $avg: { $size: { $ifNull: ['$items', []] } } }
        }
      },
      { $sort: { count: -1 } }
    ]);

    console.log('\n📊 Status Distribution:');
    statusCounts.forEach(status => {
      console.log(`  ${status._id || 'NULL'}: ${status.count} requests (avg ${status.avgItems.toFixed(1)} items)`);
    });

  } catch (error) {
    console.error('❌ Error checking data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the check
checkCurrentData();
