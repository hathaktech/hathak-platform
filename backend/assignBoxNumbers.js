import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

// Generate unique 6-digit box number
const generateBoxNumber = async () => {
  let boxNumber;
  let isUnique = false;
  
  while (!isUnique) {
    // Generate a 6-digit number
    boxNumber = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Check if this box number already exists
    const existingUser = await User.findOne({ boxNumber });
    if (!existingUser) {
      isUnique = true;
    }
  }
  
  return boxNumber;
};

const assignBoxNumbers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all users without box numbers
    const usersWithoutBoxNumbers = await User.find({ 
      $or: [
        { boxNumber: { $exists: false } },
        { boxNumber: null },
        { boxNumber: '' }
      ]
    });

    console.log(`Found ${usersWithoutBoxNumbers.length} users without box numbers`);

    // Assign box numbers to each user
    for (const user of usersWithoutBoxNumbers) {
      const boxNumber = await generateBoxNumber();
      user.boxNumber = boxNumber;
      await user.save();
      console.log(`Assigned box number ${boxNumber} to user ${user.email}`);
    }

    console.log('Box number assignment completed successfully');
  } catch (error) {
    console.error('Error assigning box numbers:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
assignBoxNumbers();
