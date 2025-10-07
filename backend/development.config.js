// Development Configuration for Performance Optimization
export const devConfig = {
  // Database optimization
  database: {
    maxPoolSize: 5,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    bufferCommands: false,
    bufferMaxEntries: 0
  },
  
  // Server optimization
  server: {
    keepAliveTimeout: 5000,
    headersTimeout: 6000,
    requestTimeout: 10000
  },
  
  // CORS optimization
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
  },
  
  // Session optimization
  session: {
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }
};



