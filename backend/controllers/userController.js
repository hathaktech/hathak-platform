// controllers/userController.js
import User from '../models/User.js';
import { sanitizeUser } from '../utils/sanitizeUser.js';

// GET all users (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    const safeUsers = users.map(sanitizeUser);
    res.json(safeUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET user by ID (Admin or owner)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (req.user.role !== 'admin' && req.user._id.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    res.json(sanitizeUser(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE user (public)
export const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json(sanitizeUser(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE user (Admin or owner)
export const updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (req.user.role !== 'admin' && req.user._id.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    if (req.user.role === 'admin') user.role = role || user.role;

    await user.save();
    res.json(sanitizeUser(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE user (Admin only)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.remove();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
