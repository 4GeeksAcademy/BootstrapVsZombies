
/**
 * Bootstrap vs Zombies - Backend Server
 * 
 * Express.js server providing RESTful API for the educational game.
 * Handles user authentication, score tracking, and game analytics.
 * 
 * Educational Architecture Goals:
 * - Demonstrate full-stack development patterns
 * - Show API design best practices
 * - Implement secure authentication workflows
 * - Provide real-time game data persistence
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import route handlers
import authRoutes from './routes/auth';
import gameRoutes from './routes/game';
import leaderboardRoutes from './routes/leaderboard';
import userRoutes from './routes/user';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';

// Load environment variables
dotenv.config();

/**
 * Express Application Setup
 * Configures middleware, routes, and error handling for the API server
 */
const app = express();
const PORT = process.env.PORT || 3001;

/**
 * Security Middleware Configuration
 * Implements best practices for API security and rate limiting
 */

// Helmet for security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration for frontend communication
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

/**
 * Request Processing Middleware
 * Handles JSON parsing, logging, and request preprocessing
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(requestLogger);

/**
 * API Route Registration
 * Organizes endpoints by functional domain for maintainability
 */

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    message: 'Bootstrap vs Zombies API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API route prefixes
app.use('/api/auth', authRoutes);         // Authentication endpoints
app.use('/api/game', gameRoutes);         // Game session management
app.use('/api/leaderboard', leaderboardRoutes); // Score tracking
app.use('/api/user', userRoutes);         // User profile management

/**
 * Error Handling Middleware
 * Centralized error processing and response formatting
 */
app.use(errorHandler);

// 404 handler for unmatched routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested endpoint ${req.originalUrl} does not exist`,
    availableEndpoints: [
      '/health',
      '/api/auth/*',
      '/api/game/*',
      '/api/leaderboard/*',
      '/api/user/*'
    ]
  });
});

/**
 * Server Startup
 * Initialize database connections and start listening for requests
 */
const startServer = async () => {
  try {
    // Initialize database connection here when implemented
    console.log('🔌 Database connection established');
    
    app.listen(PORT, () => {
      console.log(`🚀 Bootstrap vs Zombies API Server running on port ${PORT}`);
      console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/health`);
      console.log(`🧟‍♂️ Ready to defend against zombie hordes!`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});

startServer();
