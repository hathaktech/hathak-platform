// test-admin-routes.js
import express from 'express';
import adminAuthRoutes from './routes/adminAuthRoutes.js';

const app = express();
app.use(express.json());

// Test the admin routes
app.use('/api/admin/auth', adminAuthRoutes);

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Admin routes test server is running' });
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log('Admin routes should be available at:');
  console.log('- POST /api/admin/auth/login');
  console.log('- GET /api/admin/auth/me');
  console.log('- POST /api/admin/auth/register');
});
