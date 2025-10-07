// scripts/fix-missing-request-numbers.js
// This script fixes any existing BuyMe requests that are missing the requestNumber field

import mongoose from 'mongoose';
import BuyMe from '../models/BuyMe.js';
import { config } from 'dotenv';

// Load environment variables
config();

const generateRequestNumber = async () => {
  let requestNumber;
  let isUnique = false;
  
  while (!isUnique) {
    // Generate P + 8 random alphanumeric characters
    const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase();
    requestNumber = `P${randomPart}`;
    
    // Check if this request number already exists
    const existingRequest = await BuyMe.findOne({ requestNumber });
    if (!existingRequest) {
      isUnique = true;
    }
  }
  
  return requestNumber;
};

const fixMissingRequestNumbers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hathak-platform');
    console.log('Connected to MongoDB');

    // Find all BuyMe requests missing requestNumber
    const requestsWithoutNumber = await BuyMe.find({ 
      $or: [
        { requestNumber: { $exists: false } },
        { requestNumber: null },
        { requestNumber: '' }
      ]
    });

    console.log(`Found ${requestsWithoutNumber.length} requests missing requestNumber`);

    if (requestsWithoutNumber.length === 0) {
      console.log('No requests need fixing. All requests already have requestNumber.');
      return;
    }

    // Fix each request
    for (const request of requestsWithoutNumber) {
      const requestNumber = await generateRequestNumber();
      request.requestNumber = requestNumber;
      await request.save();
      console.log(`Fixed request ${request._id} with requestNumber: ${requestNumber}`);
    }

    console.log(`Successfully fixed ${requestsWithoutNumber.length} requests`);
    
  } catch (error) {
    console.error('Error fixing missing request numbers:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the script
fixMissingRequestNumbers();
