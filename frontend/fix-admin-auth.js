// Quick fix for admin authentication issue
console.log('🔧 Fixing admin authentication...');

// Clear the invalid token
localStorage.removeItem('adminToken');
console.log('✅ Cleared invalid admin token');

// Show current auth state
console.log('Current admin token:', localStorage.getItem('adminToken') || 'NONE');

// Redirect to login
console.log('🔄 Redirecting to admin login...');
window.location.href = '/admin/login';
