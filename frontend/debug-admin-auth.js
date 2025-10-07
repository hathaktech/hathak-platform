// Debug script to check admin authentication
const debugAdminAuth = () => {
  console.log('🔍 Admin Authentication Debug');
  
  // Check localStorage
  const adminToken = localStorage.getItem('adminToken');
  console.log('Admin Token:', adminToken ? `${adminToken.substring(0, 20)}...` : 'NOT FOUND');
  
  // Check if admin context is available
  if (window.adminAuthContext) {
    console.log('Admin Context:', window.adminAuthContext);
  }
  
  // Test token validity
  if (adminToken) {
    fetch('/api/admin/auth/me', {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log('Token validation response:', response.status);
      return response.json();
    })
    .then(data => {
      console.log('Token validation data:', data);
    })
    .catch(error => {
      console.error('Token validation error:', error);
    });
  }
  
  // Clear invalid token
  console.log('💡 To fix: Clear localStorage and login again');
  console.log('Run: localStorage.removeItem("adminToken"); window.location.reload();');
};

// Run debug
debugAdminAuth();
