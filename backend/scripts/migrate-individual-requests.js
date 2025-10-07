// scripts/migrate-individual-requests.js
// Migration script to convert multi-item BuyForMe requests to individual requests
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import BuyForMeRequest from '../models/BuyForMeRequest.js';

// Load environment variables
dotenv.config();

// Generate unique batch ID
const generateBatchId = () => {
  return `BATCH-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Generate unique request number (BFM + 8 digits)
const generateRequestNumber = async () => {
  let requestNumber;
  let isUnique = false;
  
  while (!isUnique) {
    // Generate random 8-digit number
    const randomNumber = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
    requestNumber = `BFM${randomNumber}`;
    
    // Check if this request number already exists
    const existingRequest = await BuyForMeRequest.findOne({ requestNumber });
    if (!existingRequest) {
      isUnique = true;
    }
  }
  
  return requestNumber;
};

// Function to backup existing data
const backupExistingData = async () => {
  console.log('🔄 Creating backup of existing data...');
  
  const requests = await BuyForMeRequest.find({});
  const backupData = requests.map(req => ({
    originalId: req._id,
    originalRequestNumber: req.requestNumber,
    customerId: req.customerId,
    customerName: req.customerName,
    customerEmail: req.customerEmail,
    items: req.items,
    totalAmount: req.totalAmount,
    status: req.status,
    priority: req.priority,
    createdAt: req.createdAt,
    // Store all other fields for restoration if needed
    originalData: req.toObject()
  }));
  
  console.log(`📦 Backup created for ${backupData.length} requests`);
  return backupData;
};

// Main migration function
const migrateToIndividualRequests = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hathak-platform');
    console.log('✅ Connected to MongoDB');

    // Create backup first
    const backupData = await backupExistingData();
    
    // Find all multi-item requests (requests with more than 1 item)
    const multiItemRequests = await BuyForMeRequest.find({
      $expr: { $gt: [{ $size: { $ifNull: ["$items", []] } }, 1] }
    });

    console.log(`🔍 Found ${multiItemRequests.length} multi-item requests to migrate`);

    if (multiItemRequests.length === 0) {
      console.log('✅ No multi-item requests found. Migration not needed.');
      return;
    }

    const migrationResults = {
      successCount: 0,
      errorCount: 0,
      errors: []
    };

    // Process each multi-item request
    for (const request of multiItemRequests) {
      try {
        console.log(`\n📦 Processing request: ${request.requestNumber} (${request.items.length} items)`);
        
        // Generate batch ID for grouping these individual requests
        const batchId = generateBatchId();
        const originalRequestNumber = request.requestNumber;
        
        // Save the original request as a backup reference (optional)
        const originalRequestBackup = request.toObject();
        
        // Create individual requests for each item
        const individualRequests = [];
        
        for (let i = 0; i < request.items.length; i++) {
          const item = request.items[i];
          const itemTotalAmount = item.price * item.quantity;
          
          // Generate unique request number for this individual item
          const individualRequestNumber = await generateRequestNumber();
          
          // Create new individual request
          const individualRequest = new BuyForMeRequest({
            customerId: request.customerId,
            customerName: request.customerName,
            customerEmail: request.customerEmail,
            items: [item], // Single item
            totalAmount: itemTotalAmount,
            requestNumber: individualRequestNumber,
            shippingAddress:request.shippingAddress,
            notes: request.notes || '',
            priority: request.priority || 'medium',
            status: request.status || 'pending',
            reviewStatus: request.reviewStatus || 'pending',
            paymentStatus: request.paymentStatus || 'pending',
            
            // Batch information for grouping
            batchId: batchId,
            originalBatchNumber: originalRequestNumber,
            
            // Copy other relevant fields
            subStatus: request.subStatus,
            adminNotes: request.adminNotes,
            photos: request.photos,
            reviewComments: request.reviewComments,
            rejectionReason: request.rejectionReason,
            
            // Copy modification and change requirements
            modifiedByUser: request.modifiedByUser,
            modifiedByAdmin: request.modifiedByAdmin,
            adminModificationDate: request.adminModificationDate,
            adminModificationNote: request.adminModificationNote,
            lastModifiedByAdmin: request.lastModifiedByAdmin,
            originalValues: request.originalValues,
            modificationHistory: request.modificationHistory,
            
            // Copy workflow data
            changeRequirements: request.changeRequirements,
            changesDeadline: request.changesDeadline,
            changesPriority: request.changesPriority,
            changesRequestedBy: request.changesRequestedBy,
            changesRequestedAt: request.changesRequestedAt,
            changesRequestComments: request.changesRequestComments,
            changesRequestAttachments: request.changesRequestAttachments,
            
            // Copy packaging info
            packagingOptions: request.packagingOptions,
            selectedPackaging: request.selectedPackaging,
            packagingDeadline: request.packagingDeadline,
            packagingInstructions: request.packagingInstructions,
            
            // Copy inspection details
            inspectionDetails: request.inspectionDetails,
            
            // Preserve timestamps
            createdAt: request.createdAt,
            updatedAt: new Date()
          });
          
          await individualRequest.save();
          individualRequests.push(individualRequest);
          
          console.log(`  ✅ Created individual request ${individualRequestNumber} for item: ${item.name}`);
        }
        
        // Delete the original multi-item request after successful individual creation
        await BuyForMeRequest.deleteOne({ _id: request._id });
        
        console.log(`  🗑️  Deleted original request: ${originalRequestNumber}`);
        console.log(`  📊 Created ${individualRequests.length} individual requests in batch: ${batchId}`);
        
        migrationResults.successCount++;
        
      } catch (error) {
        console.error(`❌ Error processing request ${request.requestNumber}:`, error.message);
        migrationResults.errorCount++;
        migrationResults.errors.push({
          requestNumber: request.requestNumber,
          error: error.message
        });
      }
    }
    
    console.log('\n📊 Migration Summary:');
    console.log(`✅ Successfully migrated: ${migrationResults.successCount} requests`);
    console.log(`❌ Errors encountered: ${migrationResults.errorCount}`);
    
    if (migrationResults.errors.length > 0) {
      console.log('\n🔍 Detailed errors:');
      migrationResults.errors.forEach(error => {
        console.log(`  - ${error.requestNumber}: ${error.error}`);
      });
    }
    
    // Verify migration
    const remainingMultiItemRequests = await BuyForMeRequest.find({
      $expr: { $gt: [{ $size: { $ifNull: ["$items", []] } }, 1] }
    });
    
    const totalIndividualRequests = await BuyForMeRequest.countDocuments();
    
    console.log('\n🔍 Post-migration verification:');
    console.log(`📊 Total individual requests in database: ${totalIndividualRequests}`);
    console.log(`📦 Remaining multi-item requests: ${remainingMultiItemRequests.length}`);
    
    if (remainingMultiItemRequests.length === 0) {
      console.log('🎉 Migration completed successfully! All multi-item requests converted to individual requests.');
    } else {
      console.log('⚠️  Some multi-item requests still remain. Please review the errors above.');
    }
    
  } catch (error) {
    console.error('💥 Migration failed:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Function to verify migration data
const verifyMigration = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hathak-platform');
    console.log('✅ Connected to MongoDB for verification');
    
    // Check for any remaining multi-item requests
    const multiItemRequests = await BuyForMeRequest.find({
      $expr: { $gt: [{ $size: { $ifNull: ["$items", []] } }, 1] }
    });
    
    console.log(`📊 Remaining multi-item requests: ${multiItemRequests.length}`);
    
    // Show statistics
    const totalRequests = await BuyForMeRequest.countDocuments();
    const batchStats = await BuyForMeRequest.aggregate([
      {
        $group: {
          _id: '$batchId',
          requestCount: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' },
          customers: { $addToSet: '$customerName' }
        }
      },
      { $sort: { requestCount: -1 } }
    ]);
    
    console.log('\n📈 Migration Statistics:');
    console.log(`📊 Total requests in database: ${totalRequests}`);
    console.log(`📦 Different batches: ${batchStats.length}`);
    
    console.log('\n🔍 Batch Details:');
    batchStats.forEach((batch, index) => {
      console.log(`  ${index + 1}. Batch ID: ${batch._id || 'ORIGINAL (no batch)'}`);
      console.log(`     - Requests: ${batch.requestCount}`);
      console.log(`     - Total Amount: $${batch.totalAmount.toFixed(2)}`);
      console.log(`     - Customers: ${batch.customers.length}`);
    });
    
  } catch (error) {
    console.error('❌ Verification failed:', error);
  } finally {
    await mongoose.connection.close();
  }
};

// Command line interface
const command = process.argv[2];

if (command === 'verify') {
  console.log('🔍 Running migration verification...');
  verifyMigration();
} else if (command === 'migrate') {
  console.log('🚀 Starting migration to individual requests...');
  migrateToIndividualRequests();
} else {
  console.log(`
📖 BuyForMe Individual Requests Migration Script

Usage:
  node migrate-individual-requests.js migrate    - Run the migration
  node migrate-individual-requests.js verify     - Verify migration results

This script will:
1. 🔍 Find all multi-item BuyForMe requests
2. 🛡️  Create backup of existing data
3. 🔄 Convert each item into an individual request with unique BFM numbers
4. 📦 Group related requests using batch IDs
5. 🗑️  Remove original multi-item requests
  `);
}
