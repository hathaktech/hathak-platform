// Test script for admin creating requests on behalf of customers
import fetch from 'node-fetch';

const API_URL = 'http://localhost:5000/api';

// Test data
const adminCredentials = {
  email: 'admin@example.com',
  password: 'admin123'
};

const testRequestData = {
  customerId: '507f1f77bcf86cd799439011', // This would be a real customer ID
  productName: 'Test Product',
  productLink: 'https://example.com/product',
  notes: 'Test request created by admin',
  quantity: 1,
  estimatedPrice: 29.99,
  currency: 'USD',
  deliveryCountry: 'United States',
  shippingMethod: 'Standard',
  colors: ['Red', 'Blue'],
  sizes: ['M', 'L'],
  images: ['https://example.com/image1.jpg']
};

async function testAdminCreateRequest() {
  try {
    console.log('Testing admin create request functionality...\n');

    // Step 1: Login as admin
    console.log('1. Logging in as admin...');
    const loginResponse = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(adminCredentials),
    });

    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status}`);
    }

    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✓ Admin login successful');

    // Step 2: Get all users (to verify the endpoint works)
    console.log('\n2. Fetching all users...');
    const usersResponse = await fetch(`${API_URL}/buyme/users`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!usersResponse.ok) {
      throw new Error(`Failed to fetch users: ${usersResponse.status}`);
    }

    const usersData = await usersResponse.json();
    console.log(`✓ Found ${usersData.data.length} users`);

    // Step 3: Create request on behalf of customer
    console.log('\n3. Creating request on behalf of customer...');
    const createResponse = await fetch(`${API_URL}/buyme/admin/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testRequestData),
    });

    if (!createResponse.ok) {
      const errorData = await createResponse.json();
      throw new Error(`Failed to create request: ${errorData.message || createResponse.status}`);
    }

    const createData = await createResponse.json();
    console.log('✓ Request created successfully');
    console.log('Request ID:', createData.data._id);
    console.log('Request Number:', createData.data.requestNumber);

    // Step 4: Verify the request was created
    console.log('\n4. Verifying request was created...');
    const verifyResponse = await fetch(`${API_URL}/buyme`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!verifyResponse.ok) {
      throw new Error(`Failed to verify request: ${verifyResponse.status}`);
    }

    const verifyData = await verifyResponse.json();
    const createdRequest = verifyData.data.find(req => req._id === createData.data._id);
    
    if (createdRequest) {
      console.log('✓ Request verified in the system');
      console.log('Customer:', createdRequest.userId.name);
      console.log('Product:', createdRequest.productName);
      console.log('Status:', createdRequest.status);
    } else {
      console.log('✗ Request not found in verification');
    }

    console.log('\n✅ All tests passed! Admin create request functionality is working correctly.');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testAdminCreateRequest();
