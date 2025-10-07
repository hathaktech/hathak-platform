// Test script to verify the API route
const testApiRoute = async () => {
  try {
    console.log('🧪 Testing API route...');
    
    const response = await fetch('/api/admin/buyforme-requests/test-id/purchase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      },
      body: JSON.stringify({
        supplier: 'Test Supplier',
        purchaseOrderNumber: 'TEST-123',
        trackingNumber: 'TRACK-123'
      })
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const text = await response.text();
    console.log('Response body:', text);
    
  } catch (error) {
    console.error('Test error:', error);
  }
};

// Run the test
testApiRoute();
