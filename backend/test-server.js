// test-server.js
import axios from 'axios';

const testBackend = async () => {
  try {
    console.log('Testing backend server...');
    
    // Test if server is running
    const response = await axios.get('http://localhost:5000/api/auth/login', {
      timeout: 5000
    });
    console.log('Server is running, response:', response.status);
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Backend server is not running on port 5000');
    } else if (error.response?.status === 404) {
      console.log('✅ Backend server is running, but endpoint not found (expected for GET request)');
    } else {
      console.log('Backend server error:', error.message);
    }
  }
  
  try {
    // Test admin routes
    const adminResponse = await axios.get('http://localhost:5000/api/admin/auth/login', {
      timeout: 5000
    });
    console.log('Admin routes accessible, response:', adminResponse.status);
  } catch (error) {
    if (error.response?.status === 404) {
      console.log('❌ Admin routes not found - this is the problem!');
    } else {
      console.log('Admin routes error:', error.message);
    }
  }
};

testBackend();
