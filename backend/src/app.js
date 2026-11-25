import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from './config/env.js';
import apiRoutes from './routes/api.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security Headers
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// CORS Configuration
const allowedOrigins = [
  env.FRONTEND_URL,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5000'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, same-origin)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Cross-Origin Request Blocked by CORS policy'));
  },
  credentials: true,
  methods: ['GET', 'HEAD', 'OPTIONS']
}));

// Request Body Parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Logging & Rate Limiting
app.use(requestLogger);
app.use('/api', apiLimiter);

// Serve Frontend Public Static Assets directly if requested (e.g. /images/...)
const frontendPublicPath = path.resolve(__dirname, '../../frontend/public');
app.use(express.static(frontendPublicPath));

// Mount REST API Routes
app.use('/api', apiRoutes);

// Unknown API routes return JSON errors (NOT html)
app.use('/api/*', notFoundHandler);

// Optional Production Frontend Build Serving
const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');
app.use(express.static(frontendDistPath));

// For SPA navigation fallback
app.get('*', (req, res, next) => {
  // If it's an API route that reached here, trigger notFoundHandler
  if (req.originalUrl.startsWith('/api')) {
    return notFoundHandler(req, res, next);
  }
  // Otherwise serve SPA index.html if dist exists
  res.sendFile(path.join(frontendDistPath, 'index.html'), (err) => {
    if (err) {
      // In development, if dist doesn't exist yet, return a clean message
      res.status(200).send('Explore India API Backend is running. Frontend dev server runs on port 3000.');
    }
  });
});

// Centralized Error Handler
app.use(errorHandler);

export default app;
