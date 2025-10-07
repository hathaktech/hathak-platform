import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Seller from '../models/Seller.js';
import ProductVariant from '../models/ProductVariant.js';

// @desc Get products with advanced filtering and search
// @route GET /api/marketplace/products
export const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      category,
      subcategory,
      minPrice,
      maxPrice,
      brand,
      rating,
      features,
      availability,
      sort = 'relevance',
      viewMode = 'grid'
    } = req.query;

    // Build query
    const query = { 
      status: 'active',
      visibility: 'public'
    };

    // Search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
        { 'seller.businessName': { $regex: search, $options: 'i' } }
      ];
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Subcategory filter
    if (subcategory) {
      query.subcategory = subcategory;
    }

    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Brand filter
    if (brand) {
      query['seller.businessName'] = { $in: brand.split(',') };
    }

    // Rating filter
    if (rating) {
      const minRating = Number(rating);
      query['reviews.averageRating'] = { $gte: minRating };
    }

    // Features filter
    if (features) {
      const featureList = features.split(',');
      query['badges.type'] = { $in: featureList };
    }

    // Availability filter
    if (availability) {
      if (availability === 'in-stock') {
        query.$or = [
          { type: 'simple', stock: { $gt: 0 } },
          { type: 'variable', 'variants.inventory.quantity': { $gt: 0 } }
        ];
      } else if (availability === 'low-stock') {
        query.$or = [
          { type: 'simple', stock: { $gt: 0, $lte: 10 } },
          { type: 'variable', 'variants.inventory.quantity': { $gt: 0, $lte: 10 } }
        ];
      }
    }

    // Sort options
    let sortOption = {};
    switch (sort) {
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'price-low':
        sortOption = { price: 1 };
        break;
      case 'price-high':
        sortOption = { price: -1 };
        break;
      case 'rating':
        sortOption = { 'reviews.averageRating': -1 };
        break;
      case 'popular':
        sortOption = { 'analytics.views': -1 };
        break;
      case 'name-asc':
        sortOption = { name: 1 };
        break;
      case 'name-desc':
        sortOption = { name: -1 };
        break;
      case 'relevance':
      default:
        // For relevance, we'll use a combination of factors
        sortOption = { 
          'analytics.views': -1,
          'reviews.averageRating': -1,
          createdAt: -1
        };
        break;
    }

    // Execute query
    const products = await Product.find(query)
      .populate('seller', 'businessName verified rating totalSales')
      .populate('category', 'name slug')
      .populate('variants')
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(query);

    // Transform products for frontend
    const transformedProducts = products.map(product => ({
      _id: product._id,
      name: product.name,
      shortDescription: product.shortDescription,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      primaryImage: product.primaryImage,
      images: product.images,
      badges: product.badges,
      reviews: product.reviews,
      seller: product.seller,
      availability: product.availability,
      shipping: product.shipping,
      analytics: product.analytics,
      createdAt: product.createdAt,
      tags: product.tags
    }));

    res.json({
      products: transformedProducts,
      pagination: {
        totalPages: Math.ceil(total / limit),
        currentPage: Number(page),
        total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      filters: {
        search,
        category,
        subcategory,
        minPrice,
        maxPrice,
        brand,
        rating,
        features,
        availability,
        sort,
        viewMode
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single product with full details
// @route GET /api/marketplace/products/:id
export const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findOne({
      _id: productId,
      status: 'active',
      visibility: 'public'
    })
      .populate('seller', 'businessName verified rating totalSales responseTime location')
      .populate('category', 'name slug')
      .populate('variants')
      .populate('subcategory', 'name slug');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Record view
    await product.recordView();

    // Get related products
    const relatedProducts = await Product.find({
      _id: { $ne: productId },
      category: product.category._id,
      status: 'active',
      visibility: 'public'
    })
      .populate('seller', 'businessName verified')
      .limit(4)
      .select('name price primaryImage reviews');

    res.json({
      product: {
        ...product.toObject(),
        relatedProducts
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get categories with product counts
// @route GET /api/marketplace/categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ status: 'active' })
      .populate('children')
      .sort({ displayOrder: 1, name: 1 });

    // Get product counts for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const productCount = await Product.countDocuments({
          category: category._id,
          status: 'active',
          visibility: 'public'
        });

        return {
          _id: category._id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          image: category.image,
          productCount,
          children: category.children || []
        };
      })
    );

    res.json({ categories: categoriesWithCounts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get featured products
// @route GET /api/marketplace/featured
export const getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    const products = await Product.find({
      status: 'active',
      visibility: 'public',
      'badges.type': { $in: ['featured', 'bestseller', 'trending'] }
    })
      .populate('seller', 'businessName verified rating')
      .populate('category', 'name slug')
      .sort({ 'analytics.views': -1, 'reviews.averageRating': -1 })
      .limit(Number(limit));

    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get trending products
// @route GET /api/marketplace/trending
export const getTrendingProducts = async (req, res) => {
  try {
    const { limit = 8 } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - 7); // Last 7 days

    const products = await Product.find({
      status: 'active',
      visibility: 'public',
      createdAt: { $gte: daysAgo },
      'analytics.views': { $gt: 0 }
    })
      .populate('seller', 'businessName verified rating')
      .populate('category', 'name slug')
      .sort({ 'analytics.views': -1, 'analytics.conversions': -1 })
      .limit(Number(limit));

    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get new arrivals
// @route GET /api/marketplace/new-arrivals
export const getNewArrivals = async (req, res) => {
  try {
    const { limit = 8 } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - 30); // Last 30 days

    const products = await Product.find({
      status: 'active',
      visibility: 'public',
      createdAt: { $gte: daysAgo }
    })
      .populate('seller', 'businessName verified rating')
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get bestsellers
// @route GET /api/marketplace/bestsellers
export const getBestsellers = async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    const products = await Product.find({
      status: 'active',
      visibility: 'public',
      'badges.type': 'bestseller'
    })
      .populate('seller', 'businessName verified rating')
      .populate('category', 'name slug')
      .sort({ 'analytics.conversions': -1, 'reviews.averageRating': -1 })
      .limit(Number(limit));

    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Search products with suggestions
// @route GET /api/marketplace/search
export const searchProducts = async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.length < 2) {
      return res.json({ 
        products: [], 
        suggestions: [],
        categories: [],
        brands: []
      });
    }

    // Search products
    const products = await Product.find({
      $text: { $search: q },
      status: 'active',
      visibility: 'public'
    })
      .populate('seller', 'businessName verified')
      .populate('category', 'name slug')
      .sort({ score: { $meta: 'textScore' } })
      .limit(Number(limit));

    // Get search suggestions
    const suggestions = await Product.aggregate([
      {
        $match: {
          $text: { $search: q },
          status: 'active',
          visibility: 'public'
        }
      },
      {
        $group: {
          _id: '$name',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      }
    ]);

    // Get matching categories
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'category',
          as: 'products'
        }
      },
      {
        $match: {
          'products.name': { $regex: q, $options: 'i' },
          status: 'active'
        }
      },
      {
        $project: {
          name: 1,
          slug: 1,
          productCount: { $size: '$products' }
        }
      },
      {
        $sort: { productCount: -1 }
      },
      {
        $limit: 5
      }
    ]);

    // Get matching brands
    const brands = await Seller.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'seller',
          as: 'products'
        }
      },
      {
        $match: {
          'products.name': { $regex: q, $options: 'i' },
          status: 'approved'
        }
      },
      {
        $project: {
          businessName: 1,
          productCount: { $size: '$products' }
        }
      },
      {
        $sort: { productCount: -1 }
      },
      {
        $limit: 5
      }
    ]);

    res.json({
      products,
      suggestions: suggestions.map(s => s._id),
      categories,
      brands
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get product reviews
// @route GET /api/marketplace/products/:id/reviews
export const getProductReviews = async (req, res) => {
  try {
    const productId = req.params.id;
    const { page = 1, limit = 10, rating } = req.query;

    const query = { product: productId };
    if (rating) {
      query.rating = Number(rating);
    }

    // In a real app, you'd have a separate Review model
    // For now, we'll return mock data
    const reviews = [];
    const total = 0;

    res.json({
      reviews,
      pagination: {
        totalPages: Math.ceil(total / limit),
        currentPage: Number(page),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get seller information
// @route GET /api/marketplace/sellers/:id
export const getSellerInfo = async (req, res) => {
  try {
    const sellerId = req.params.id;

    const seller = await Seller.findById(sellerId)
      .select('-password -bankDetails -documents');

    if (!seller || seller.status !== 'approved') {
      return res.status(404).json({ message: 'Seller not found' });
    }

    // Get seller's products count
    const productCount = await Product.countDocuments({
      seller: sellerId,
      status: 'active',
      visibility: 'public'
    });

    // Get seller's average rating
    const products = await Product.find({
      seller: sellerId,
      status: 'active'
    });

    const totalReviews = products.reduce((sum, product) => sum + product.reviews.totalReviews, 0);
    const totalRating = products.reduce((sum, product) => 
      sum + (product.reviews.averageRating * product.reviews.totalReviews), 0
    );
    const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

    res.json({
      seller: {
        ...seller.toObject(),
        productCount,
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get seller's products
// @route GET /api/marketplace/sellers/:id/products
export const getSellerProducts = async (req, res) => {
  try {
    const sellerId = req.params.id;
    const { page = 1, limit = 20, sort = 'newest' } = req.query;

    const query = {
      seller: sellerId,
      status: 'active',
      visibility: 'public'
    };

    let sortOption = {};
    switch (sort) {
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'price-low':
        sortOption = { price: 1 };
        break;
      case 'price-high':
        sortOption = { price: -1 };
        break;
      case 'rating':
        sortOption = { 'reviews.averageRating': -1 };
        break;
      case 'popular':
        sortOption = { 'analytics.views': -1 };
        break;
    }

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(query);

    res.json({
      products,
      pagination: {
        totalPages: Math.ceil(total / limit),
        currentPage: Number(page),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
