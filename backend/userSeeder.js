import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";

dotenv.config();

// Set default environment variables if not provided
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hathak-platform';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
process.env.SESSION_SECRET = process.env.SESSION_SECRET || 'your-super-secret-session-key-change-this-in-production';

connectDB();

const sampleUsers = [
  {
    name: "Ali",
    email: "ali@hathak.com",
    password: "20102107",
    role: "admin"
  },
  {
    name: "Test User",
    email: "test@example.com",
    password: "password123",
    role: "user"
  },
  {
    name: "Admin User",
    email: "admin@example.com", 
    password: "admin123",
    role: "admin"
  },
  {
    name: "Alice Johnson",
    email: "alice@example.com",
    password: "secret123",
    role: "user"
  }
];

const importUsers = async () => {
  try {
    // Wait for MongoDB connection to be ready
    await new Promise((resolve) => {
      if (mongoose.connection.readyState === 1) {
        resolve();
      } else {
        mongoose.connection.once('open', resolve);
      }
    });
    
    // Clear existing users
    await User.deleteMany();
    
    // Create users (passwords will be hashed by the pre-save hook)
    const createdUsers = await User.create(sampleUsers);
    
    console.log("✅ Sample users created:");
    createdUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
    });
    
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating users:", err);
    process.exit(1);
  }
};

// Wait a bit for connection to establish, then run import
setTimeout(importUsers, 1000);
