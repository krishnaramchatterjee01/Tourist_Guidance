export function requestLogger(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    // Log API requests without sensitive query/body parameters
    const sanitizedUrl = req.originalUrl.split('?')[0];
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[API] ${req.method} ${sanitizedUrl} ${res.statusCode} - ${duration}ms`);
    }
  });
  next();
}

export default requestLogger;
