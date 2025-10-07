// index.js
import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import boxContentRoutes from './routes/boxContentRoutes.js';
import adminAuthRoutes from './routes/adminAuthRoutes.js';
import sellerRoutes from './routes/sellerRoutes.js';
import marketplaceRoutes from './routes/marketplaceRoutes.js';
import buyForMeCartRoutes from './routes/buyForMeCartRoutes.js';
import unifiedBuyForMeRoutes from './routes/unifiedBuyForMeRoutes.js';
import addressRoutes from './routes/addressRoutes.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorMiddleware.js';
import { authMiddleware } from './middleware/authMiddleware.js';

dotenv.config({ path: './.env' });

// Set default environment variables if not provided
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hathak-platform';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
process.env.SESSION_SECRET = process.env.SESSION_SECRET || 'your-super-secret-session-key-change-this-in-production';
process.env.FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
process.env.PORT = process.env.PORT || '5000';

connectDB();

const app = express();

// ------------------ MIDDLEWARE ------------------
app.use(express.json());

// CORS middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    'http://localhost:3001'
  ].filter(Boolean),
  credentials: true
}));

// ------------------ SESSION (for guest cart) ------------------
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'supersecret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // set true in production with HTTPS
  })
);

// ------------------ TEST ROUTE ------------------
app.get('/', (req, res) => res.send('HatHak API Running'));

// ------------------ PUBLIC ROUTES ------------------
app.use('/api/auth', authRoutes);          // login, register

app.use('/api/admin/auth', adminAuthRoutes); // admin auth + management (login public, others authMiddlewareed inside)
app.use('/api/products', productRoutes);  // public products
app.use('/api/seller', sellerRoutes);     // seller routes (login, register public, others authMiddlewareed inside)
app.use('/api/marketplace', marketplaceRoutes); // marketplace routes

// ------------------ PROTECTED ROUTES ------------------
app.use('/api/users', authMiddleware, userRoutes);               // Admin-only inside userRoutes
app.use('/api/notifications', authMiddleware, notificationRoutes); // Admin/owner authMiddlewareion inside notificationRoutes
app.use('/api/orders', authMiddleware, orderRoutes);            // Protected orders
app.use('/api/box-contents', authMiddleware, boxContentRoutes); // Protected box contents
app.use('/api/buyforme-cart', authMiddleware, buyForMeCartRoutes); // Protected BuyForMe cart
app.use('/api', unifiedBuyForMeRoutes);                         // Unified BuyForMe system
app.use('/api/addresses', authMiddleware, addressRoutes); // Protected addresses
app.use('/api/cart', cartRoutes);                        // Guest + logged-in cart, coupon, checkout

// ------------------ 404 & ERROR HANDLER ------------------
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
