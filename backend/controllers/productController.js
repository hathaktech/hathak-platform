// controllers/productController.js
import Product from '../models/Product.js';

// GET all products (public + optional filters) with dynamic orderLink
export const getAllProducts = async (req, res) => {
  try {
    const { type, category, minPrice, maxPrice } = req.query;
    const filter = {};

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (minPrice || maxPrice) filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);

    const products = await Product.find(filter);

    const BASE_URL = 'http://localhost:3000'; // adjust to your environment
    const productsWithLinks = products.map((product) => ({
      _id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      type: product.type,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      // Fully dynamic order link
      orderLink: `${BASE_URL}/orders/from-product/${product._id}`,
    }));

    res.json(productsWithLinks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET single product by ID with dynamic orderLink
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const BASE_URL = 'http://localhost:3000';
    res.json({
      _id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      type: product.type,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      // Fully dynamic order link
      orderLink: `${BASE_URL}/orders/from-product/${product._id}`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE product (admin only)
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, type } = req.body;
    const newProduct = new Product({
      name,
      description,
      price,
      stock,
      category,
      type,
      createdBy: req.user._id,
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE product (admin only)
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const { name, description, price, stock, category, type } = req.body;

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (stock !== undefined) product.stock = stock;
    if (category !== undefined) product.category = category;
    if (type !== undefined) product.type = type;

    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE product (admin only)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await product.remove();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
