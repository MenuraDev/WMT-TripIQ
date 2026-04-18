/**
 * Nothing Social - Express.js API Server
 * Phase 1: Foundation
 * 
 * Core Features:
 * - RESTful API endpoints
 * - JWT Authentication
 * - User registration/login
 * - Tag CRUD operations
 * - Post creation and resonance
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { neo4jService } from '../src/services/neo4j';
import { graphRepository } from '../src/services/graphRepository';
import authRoutes from './routes/auth';
import tagRoutes from './routes/tags';
import postRoutes from './routes/posts';
import userRoutes from './routes/users';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', async (req, res) => {
  const dbHealthy = await neo4jService.healthCheck();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: dbHealthy ? 'connected' : 'disconnected',
    version: '0.1.0',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal server error',
      status: err.status || 500,
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: `Route ${req.method} ${req.path} not found`,
      status: 404,
    },
  });
});

// Start server
async function startServer() {
  try {
    // Connect to Neo4j
    await neo4jService.connect();
    console.log('✅ Database connected');

    // Start HTTP server
    app.listen(PORT, () => {
      console.log(`🚀 Nothing Social API running on port ${PORT}`);
      console.log(`📝 Health check: http://localhost:${PORT}/health`);
      console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`);
      console.log(`🏷️  Tag endpoints: http://localhost:${PORT}/api/tags`);
      console.log(`📝 Post endpoints: http://localhost:${PORT}/api/posts`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await neo4jService.disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  await neo4jService.disconnect();
  process.exit(0);
});

startServer();

export default app;
