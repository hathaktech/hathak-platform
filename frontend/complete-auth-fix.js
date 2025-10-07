// Complete Admin Authentication Fix Script
console.log('🔧 COMPLETE ADMIN AUTHENTICATION FIX');
console.log('=====================================');

// Step 1: Clear all authentication data
console.log('Step 1: Clearing all authentication data...');
localStorage.removeItem('adminToken');
localStorage.removeItem('token');
sessionStorage.clear();
console.log('✅ All auth data cleared');

// Step 2: Show current state
console.log('Step 2: Current authentication state...');
console.log('Admin token:', localStorage.getItem('adminToken') || 'NONE');
console.log('User token:', localStorage.getItem('token') || 'NONE');

// Step 3: Test backend admin login
console.log('Step 3: Testing backend admin login...');
fetch('http://localhost:5000/api/admin/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'admin@hathak.com',
    password: 'admin123'
  })
})
.then(response => {
  console.log('Backend login response:', response.status);
  return response.json();
})
.then(data => {
  if (data.token) {
    console.log('✅ Backend login successful!');
    console.log('Token preview:', data.token.substring(0, 20) + '...');
    console.log('Admin name:', data.admin.name);
    
    // Step 4: Store token and redirect
    console.log('Step 4: Storing token and redirecting...');
    localStorage.setItem('adminToken', data.token);
    console.log('✅ Token stored in localStorage');
    
    // Redirect to admin login page to trigger auth context
    console.log('🔄 Redirecting to admin login...');
    window.location.href = '/admin/login';
  } else {
    console.error('❌ Backend login failed:', data);
  }
})
.catch(error => {
  console.error('❌ Backend login error:', error);
  console.log('💡 Make sure backend is running on port 5000');
});

console.log('=====================================');
console.log('After login, try the "Mark as Purchased" button again!');
