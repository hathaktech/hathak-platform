// Quick Fix Script - Run this in your browser console
// This will automatically set the admin token and refresh the page

console.log('🔧 Starting admin token setup...');

// Set the admin token
localStorage.setItem('adminToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZGQ1ODgwZTY1YjQwZmUxMTg2MDNjNiIsInJvbGUiOiJhZG1pbiIsInBlcm1pc3Npb25zIjp7InVzZXJNYW5hZ2VtZW50Ijp0cnVlLCJwcm9kdWN0TWFuYWdlbWVudCI6dHJ1ZSwib3JkZXJNYW5hZ2VtZW50Ijp0cnVlLCJmaW5hbmNpYWxBY2Nlc3MiOnRydWUsInN5c3RlbVNldHRpbmdzIjp0cnVlLCJhbmFseXRpY3NBY2Nlc3MiOnRydWUsImNhbkdyYW50UGVybWlzc2lvbnMiOnRydWUsImNhbkNyZWF0ZUFkbWlucyI6dHJ1ZX0sInR5cGUiOiJhZG1pbiIsImlhdCI6MTc1OTMzODg2MywiZXhwIjoxNzU5NDI1MjYzLCJhdWQiOiJoYXRoYWstdXNlcnMiLCJpc3MiOiJoYXRoYWstcGxhdGZvcm0ifQ.LvZsoDh__Z3XDhkUM0Y-OrbhG0gyl8Hyk0jtDQ06kNI');

// Verify the token was set
const token = localStorage.getItem('adminToken');
if (token) {
  console.log('✅ Admin token set successfully!');
  console.log('🔑 Token preview:', token.substring(0, 50) + '...');
  console.log('🔄 Refreshing page to apply changes...');
  
  // Refresh the page
  window.location.reload();
} else {
  console.error('❌ Failed to set admin token');
}
