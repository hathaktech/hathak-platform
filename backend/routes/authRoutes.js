// routes/authRoutes.js
import express from 'express';
import { body } from 'express-validator';
import { registerUser, loginUser, getCurrentUser, logoutUser } from '../controllers/authController.js';
import validateRequest from '../middleware/validateRequest.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Register new user
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars')
  ],
  validateRequest,
  registerUser
);

// Login user
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validateRequest,
  loginUser
);

// Get current user
router.get('/me', authMiddleware, getCurrentUser);

// Logout user
router.post('/logout', authMiddleware, logoutUser);

export default router;
