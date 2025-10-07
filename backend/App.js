import express from "express";
import cors from "cors";
import session from "express-session";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import unifiedBuyForMeRoutes from "./routes/unifiedBuyForMeRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import boxContentRoutes from "./routes/boxContentRoutes.js";
import marketplaceRoutes from "./routes/marketplaceRoutes.js";
import sellerRoutes from "./routes/sellerRoutes.js";
import logisticsRoutes from "./routes/logisticsRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import promotionRoutes from "./routes/promotionRoutes.js";
import moderationRoutes from "./routes/moderationRoutes.js";
import trustSafetyRoutes from "./routes/trustSafetyRoutes.js";
import buyForMeCartRoutes from "./routes/buyForMeCartRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";

// Enhanced middleware imports
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { 
  securityHeaders, 
  requestLogger, 
  sanitizeData, 
  securityAudit,
  authLimiter,
  requestLimiter,
  adminLimiter
} from "./middleware/security.js";
import { sanitizeInput } from "./middleware/validation.js";

const app = express();

// Security middleware (must be first)
app.use(securityHeaders);
app.use(requestLogger);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security middleware
app.use(sanitizeData);
app.use(sanitizeInput);
app.use(securityAudit);

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || "your-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'strict'
  }
}));

// Rate limiting
app.use('/api/auth', authLimiter);
app.use('/api/buyme', requestLimiter);
app.use('/api/admin', adminLimiter);

// Test admin login route removed - using proper admin auth routes instead

// Routes
app.use("/api/auth", authRoutes);

app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
// Unified BuyForMe routes (replaces all old BuyForMe routes)
app.use("/api", unifiedBuyForMeRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/box-contents", boxContentRoutes);
app.use("/api/marketplace", marketplaceRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/logistics", logisticsRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/promotions", promotionRoutes);
app.use("/api/moderation", moderationRoutes);
app.use("/api/trust-safety", trustSafetyRoutes);
app.use("/api/buyforme-cart", buyForMeCartRoutes);

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
