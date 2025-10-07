// Auto-fix script for admin authentication
const fixAdminAuth = () => {
  console.log('🔧 AUTO-FIXING ADMIN AUTHENTICATION...');
  
  // Clear all auth data
  localStorage.removeItem('adminToken');
  localStorage.removeItem('token');
  sessionStorage.clear();
  
  // Login and store token
  fetch('http://localhost:5000/api/admin/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@hathak.com', password: 'admin123' })
  })
  .then(response => response.json())
  .then(data => {
    if (data.token) {
      localStorage.setItem('adminToken', data.token);
      console.log('✅ Admin authenticated successfully');
      window.location.reload();
    } else {
      console.error('❌ Authentication failed:', data);
    }
  })
  .catch(error => console.error('❌ Error:', error));
};

// Run the fix
fixAdminAuth();
