// test-admin-routes-simple.js
import express from 'express';

const app = express();
app.use(express.json());

// Simple test route
app.post('/api/admin/auth/login', (req, res) => {
  console.log('Admin login route hit!');
  res.json({ message: 'Admin login route is working' });
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log('Test admin login route available at: POST http://localhost:5001/api/admin/auth/login');
});
