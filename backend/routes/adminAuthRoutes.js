// routes/adminAuthRoutes.js
import express from 'express';
import { body } from 'express-validator';
import { 
  registerAdmin, 
  loginAdmin, 
  getCurrentAdmin,
  getAllAdmins,
  updateAdminPermissions,
  deleteAdmin,
  changePassword
} from '../controllers/adminAuthController.js';
import validateRequest from '../middleware/validateRequest.js';
import { 
  adminAuthMiddleware, 
  requireAdminRole, 
  requirePermission,
  canManageAdmins 
} from '../middleware/adminAuthMiddleware.js';

const router = express.Router();

// Public routes
// Login admin
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validateRequest,
  loginAdmin
);

// Protected routes
// Get current admin
router.get('/me', adminAuthMiddleware, getCurrentAdmin);

// Change password
router.put(
  '/change-password',
  adminAuthMiddleware,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
  ],
  validateRequest,
  changePassword
);

// Admin management routes (admin role only)
// Register new admin
router.post(
  '/register',
  adminAuthMiddleware,
  canManageAdmins,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['admin', 'manager', 'employee', 'worker']).withMessage('Valid role required')
  ],
  validateRequest,
  registerAdmin
);

// Get all admins
router.get('/admins', adminAuthMiddleware, requirePermission('canCreateAdmins'), getAllAdmins);

// Update admin permissions
router.put(
  '/permissions/:id',
  adminAuthMiddleware,
  canManageAdmins,
  [
    body('permissions').optional().isObject().withMessage('Permissions must be an object'),
    body('role').optional().isIn(['admin', 'manager', 'employee', 'worker']).withMessage('Valid role required'),
    body('isActive').optional().isBoolean().withMessage('isActive must be boolean')
  ],
  validateRequest,
  updateAdminPermissions
);

// Delete admin
router.delete('/:id', adminAuthMiddleware, canManageAdmins, deleteAdmin);

export default router;
