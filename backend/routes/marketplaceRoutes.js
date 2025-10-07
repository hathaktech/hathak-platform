import express from 'express';
import {
  getProducts,
  getProductById,
  getCategories,
  getFeaturedProducts,
  getTrendingProducts,
  getNewArrivals,
  getBestsellers,
  searchProducts,
  getProductReviews,
  getSellerInfo,
  getSellerProducts
} from '../controllers/marketplaceController.js';

const router = express.Router();

// Public marketplace routes
router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.get('/products/:id/reviews', getProductReviews);
router.get('/categories', getCategories);
router.get('/featured', getFeaturedProducts);
router.get('/trending', getTrendingProducts);
router.get('/new-arrivals', getNewArrivals);
router.get('/bestsellers', getBestsellers);
router.get('/search', searchProducts);
router.get('/sellers/:id', getSellerInfo);
router.get('/sellers/:id/products', getSellerProducts);

export default router;
