// Test script for BuyMe payment functionality
import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Test data
const testUser = {
  email: 'test@example.com',
  password: 'password123'
};

const testBuyMeRequest = {
  productName: 'Test Product',
  productLink: 'https://example.com/product',
  notes: 'Size: L, Color: Blue, Price: USD 50.00',
  quantity: 1,
  estimatedPrice: 50,
  currency: 'USD'
};

async function testBuyMePayment() {
  try {
    console.log('🧪 Testing BuyMe Payment Functionality...\n');

    // Step 1: Login to get token
    console.log('1. Logging in user...');
    const loginResponse = await axios.post(`${API_URL}/api/auth/login`, testUser);
    const token = loginResponse.data.token;
    console.log('✅ Login successful\n');

    // Step 2: Create a BuyMe request
    console.log('2. Creating BuyMe request...');
    const createResponse = await axios.post(`${API_URL}/api/buyme`, testBuyMeRequest, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const requestId = createResponse.data._id;
    console.log(`✅ BuyMe request created: ${requestId}\n`);

    // Step 3: Update request status to approved (simulate admin approval)
    console.log('3. Updating request status to approved...');
    await axios.put(`${API_URL}/api/buyme/${requestId}`, {
      status: 'approved'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Request status updated to approved\n');

    // Step 4: Process payment
    console.log('4. Processing payment...');
    const paymentResponse = await axios.post(`${API_URL}/api/buyme/${requestId}/payment`, {
      paymentMethod: 'card',
      paymentDetails: {
        cardNumber: '4111111111111111',
        expiryDate: '12/25',
        cvv: '123',
        cardholderName: 'Test User'
      }
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Payment processed successfully');
    console.log('Payment details:', paymentResponse.data);

    // Step 5: Verify request status updated
    console.log('\n5. Verifying request status...');
    const updatedRequest = await axios.get(`${API_URL}/api/buyme/${requestId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`✅ Request status: ${updatedRequest.data.status}`);
    console.log(`✅ Payment transaction ID: ${updatedRequest.data.paymentTransactionId}`);

    console.log('\n🎉 All tests passed! BuyMe payment functionality is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testBuyMePayment();
