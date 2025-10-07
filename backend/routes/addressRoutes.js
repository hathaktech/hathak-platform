// routes/addressRoutes.js
import express from 'express';
import {
  getUserAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} from '../controllers/addressController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/addresses - Get all addresses for the authenticated user
router.get('/', getUserAddresses);

// GET /api/addresses/:id - Get a specific address
router.get('/:id', getAddressById);

// POST /api/addresses - Create a new address
router.post('/', createAddress);

// PUT /api/addresses/:id - Update an address
router.put('/:id', updateAddress);

// DELETE /api/addresses/:id - Delete an address
router.delete('/:id', deleteAddress);

// PUT /api/addresses/:id/default - Set an address as default
router.put('/:id/default', setDefaultAddress);

export default router;
