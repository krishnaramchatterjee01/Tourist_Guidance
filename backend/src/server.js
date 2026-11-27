import app from './app.js';
import { env } from './config/env.js';
import { testConnection } from './config/db.js';
import imageScheduler from './services/images/imageScheduler.js';

const PORT = env.PORT || 5000;

const server = app.listen(PORT, async () => {
  console.log('====================================================');
  console.log(`Explore India REST API Server running on port ${PORT}`);
  console.log(`Environment: ${env.NODE_ENV}`);
  console.log(`Health Check: http://localhost:${PORT}/api/health`);
  console.log(`Readiness:   http://localhost:${PORT}/api/ready`);
  console.log('====================================================');

  // Perform non-blocking DB connectivity check
  const dbCheck = await testConnection();
  if (dbCheck.connected) {
    console.log('[MySQL] Database connection pool verified successfully.');
    // Start background image verification scheduler
    imageScheduler.start();
  } else {
    console.warn(`[MySQL Warning] Database connection pending: ${dbCheck.error}`);
    console.warn('[MySQL Warning] Ensure MySQL is running on 3306 and .env credentials are valid.');
  }
});

// Graceful Shutdown Handling
function shutdown(signal) {
  console.log(`\nReceived ${signal}. Gracefully shutting down Express server...`);
  imageScheduler.stop();
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });

  // Force close after 5 seconds if still pending
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 5000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

export default server;
