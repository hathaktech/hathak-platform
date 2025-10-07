// controllers/authController.js
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sanitizeUser } from '../utils/sanitizeUser.js';
import { generateSecureToken } from '../middleware/security.js';

// @desc Register a new user
// @route POST /api/auth/register
export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Default role to 'user' if not provided or not 'admin'
    let userRole = role === 'admin' ? 'admin' : 'user';

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: userRole,
    });

    await user.save();

    // Generate JWT using enhanced token generation
    const token = generateSecureToken(
      { id: user._id, role: user.role, type: 'user' },
      process.env.JWT_SECRET,
      '24h'
    );

    res.status(201).json({
      ...sanitizeUser(user),
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get current user
// @route GET /api/auth/me
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user: sanitizeUser(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Login user
// @route POST /api/auth/login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateSecureToken(
      { id: user._id, role: user.role, type: 'user' },
      process.env.JWT_SECRET,
      '24h'
    );

    res.json({
      ...sanitizeUser(user),
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Logout user
// @route POST /api/auth/logout
export const logoutUser = async (req, res) => {
  try {
    // For JWT-based auth, we can't invalidate the token server-side
    // But we can log the logout event and return success
    // The frontend will handle removing the token from storage
    
    // Optional: You could implement token blacklisting here if needed
    // For now, we'll just return success and let the frontend handle cleanup
    
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
