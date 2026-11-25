export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const isDev = process.env.NODE_ENV === 'development';

  // Do not leak stack traces or internal SQL in production
  const response = {
    success: false,
    message: err.message || 'Internal Server Error'
  };

  if (isDev && err.stack) {
    response.stack = err.stack;
  }

  // Handle specific database connection errors cleanly
  if (err.code === 'ECONNREFUSED' || err.code === 'PROTOCOL_CONNECTION_LOST') {
    return res.status(503).json({
      success: false,
      message: 'Database service is currently unavailable. Please ensure MySQL is running.'
    });
  }

  res.status(statusCode).json(response);
}

export function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`
  });
}

export default {
  errorHandler,
  notFoundHandler
};
