// tests/setup.js - Test Setup Configuration
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Set test environment
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/hathak-test';

// Global test setup
beforeAll(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to test database');
  } catch (error) {
    console.error('Failed to connect to test database:', error);
  }
});

// Global test teardown
afterAll(async () => {
  try {
    await mongoose.connection.close();
    console.log('Disconnected from test database');
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
});

// Clean up after each test
afterEach(async () => {
  try {
    // Clean up test data
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  } catch (error) {
    console.error('Error cleaning up test data:', error);
  }
});

// Increase timeout for database operations
jest.setTimeout(30000);
