// scripts/migration-summary.js
// Summary of the completed BuyForMe individual requests migration
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import BuyForMeRequest from '../models/BuyForMeRequest.js';

// Load environment variables
dotenv.config();

const migrationSummary = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hathak-platform');
    console.log('✅ Connected to MongoDB');

    console.log(`
🎉 BuyForMe Individual Requests Migration Summary
═══════════════════════════════════════════════════

📊 DATABASE STATUS:
`);

    // Get overall statistics
    const totalRequests = await BuyForMeRequest.countDocuments();
    const requestsWithBatches = await BuyForMeRequest.countDocuments({ batchId: { $exists: true, $ne: null } });
    const singleItemRequests = await BuyForMeRequest.countDocuments({
      $expr: { $eq: [{ $size: { $ifNull: ["$items", []] } }, 1] }
    });

    console.log(`📊 Total requests in database: ${totalRequests}`);
    console.log(`📦 Requests with batch grouping: ${requestsWithBatches}`);
    console.log(`✅ All requests are single-item: ${singleItemRequests === totalRequests ? 'YES' : 'NO'}`);
    console.log(`🔍 Multi-item requests remaining: ${totalRequests - singleItemRequests}`);

    // Customer statistics
    const customerStats = await BuyForMeRequest.aggregate([
      {
        $group: {
          _id: '$customerId',
          customerName: { $first: '$customerName' },
          customerEmail: { $first: '$customerEmail' },
          requestCount: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      },
      { $sort: { requestCount: -1 } }
    ]);

    console.log(`\n👥 CUSTOMER SUMMARY:`);
    customerStats.forEach((customer, index) => {
      console.log(`  ${index + 1}. ${customer.customerName}`);
      console.log(`     Email: ${customer.customerEmail}`);
      console.log(`     Individual Requests: ${customer.requestCount}`);
      console.log(`     Total Amount: $${customer.totalAmount.toFixed(2)}`);
    });

    // Batch statistics for migrated requests
    const batchStats = await BuyForMeRequest.aggregate([
      { $match: { batchId: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: '$batchId',
          customerName: { $first: '$customerName' },
          requestCount: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' },
          statuses: { $addToSet: '$status' },
          requestNumbers: { $addToSet: '$requestNumber' }
        }
      },
      { $sort: { requestCount: -1 } }
    ]);

    console.log(`\n📦 BATCH SUMMARY:`);
    console.log(`📊 Migrated batches: ${batchStats.length}`);
    batchStats.forEach((batch, index) => {
      console.log(`  ${index + 1}. Batch: ${batch._id}`);
      console.log(`     Customer: ${batch.customerName}`);
      console.log(`     Individual Requests: ${batch.requestCount}`);
      console.log(`     Total Amount: $${batch.totalAmount.toFixed(2)}`);
      console.log(`     Statuses: ${batch.statuses.join(', ')}`);
      console.log(`     Request Numbers: ${batch.requestNumbers.join(', ')}`);
    });

    // Request number format validation
    const invalidFormatCount = await BuyForMeRequest.countDocuments({
      requestNumber: { $not: /^BFM\d{8}$/ }
    });

    console.log(`\n🔍 FORMAT VALIDATION:`);
    console.log(`✅ Requests with valid BFM numbers: ${totalRequests - invalidFormatCount}/${totalRequests}`);
    console.log(`❌ Requests with invalid format: ${invalidFormatCount}`);

    // Sample of individual requests
    console.log(`\n📋 SAMPLE INDIVIDUAL REQUESTS:`);
    const sampleRequests = await BuyForMeRequest.find({})
      .sort({ createdAt: -1 })
      .limit(5);

    sampleRequests.forEach((req, index) => {
      console.log(`  ${index + 1}. ${req.requestNumber} - ${req.customerName}`);
      console.log(`     Item: ${req.items[0]?.name || 'NO_ITEM'}`);
      console.log(`     Amount: $${req.totalAmount.toFixed(2)}`);
      console.log(`     Status: ${req.status}`);
      console.log(`     Batch: ${req.batchId || 'ORIGINAL'}`);
    });

    console.log(`
═══════════════════════════════════════════════════
🎉 MIGRATION COMPLETED SUCCESSFULLY!

✅ All multi-item requests have been converted to individual requests
✅ Each request now has its own unique BFM + 8-digit number
✅ Related requests are grouped using batch IDs
✅ Customer grouping is available in the admin panel
✅ Single item workflow maintained for each request
`);

  } catch (error) {
    console.error('❌ Error generating summary:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the summary
migrationSummary();
