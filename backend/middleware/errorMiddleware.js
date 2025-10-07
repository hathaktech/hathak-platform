// middleware/errorMiddleware.js
const errorHandler = (err, req, res, next) => {
  console.error('❌ Error Handler Caught:', {
    message: err.message,
    stack: err.stack,
    name: err.name,
    statusCode: err.statusCode,
    url: req.originalUrl,
    method: req.method
  });

  // Determine status code
  let statusCode = err.statusCode || res.statusCode;
  
  // If statusCode is 200 or not set, default to 500
  if (!statusCode || statusCode === 200) {
    statusCode = 500;
  }

  // Format error response
  const errorResponse = {
    success: false,
    message: err.message || 'Internal server error',
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    ...(process.env.NODE_ENV !== 'production' && { 
      details: {
        name: err.name,
        code: err.code,
        type: err.type
      }
    })
  };

  res.status(statusCode).json(errorResponse);
};

export default errorHandler;
