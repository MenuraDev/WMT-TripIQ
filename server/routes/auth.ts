/**
 * Authentication Routes
 * POST /api/auth/register - Register new user
 * POST /api/auth/login - Login user
 * POST /api/auth/logout - Logout user (client-side token removal)
 * GET /api/auth/me - Get current user profile
 */

import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { graphRepository } from '../../src/services/graphRepository';
import { generateToken, authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

/**
 * POST /api/auth/register
 * Register a new user account
 */
router.post('/register', async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        error: { message: 'Username, email, and password are required', status: 400 },
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: { message: 'Password must be at least 8 characters', status: 400 },
      });
    }

    if (username.length < 3 || username.length > 30) {
      return res.status(400).json({
        error: { message: 'Username must be between 3 and 30 characters', status: 400 },
      });
    }

    // Check if user already exists
    const existingUser = await graphRepository.getUserById(email); // Try by email first
    
    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await graphRepository.createUser({
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      username,
      email,
      passwordHash,
      role: 'USER',
      isVerified: false,
      reputationScore: 0,
      justiceScore: 50,
    });

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });

    // Remove password hash from response
    const { passwordHash: _, ...userWithoutPassword } = user;

    res.status(201).json({
      success: true,
      data: {
        user: userWithoutPassword,
        token,
      },
      message: 'User registered successfully',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/login
 * Authenticate user and return JWT token
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: { message: 'Email and password are required', status: 400 },
      });
    }

    // Find user by email - need to query differently since we don't have email index in repo
    // For now, we'll use a simple approach - in production, add getUserByEmail to repository
    const query = `
      MATCH (u:User {email: $email})
      RETURN u
    `;
    const { neo4jService } = await import('../../src/services/neo4j');
    const result = await neo4jService.readQuery<{ u: any }>(query, { email });

    if (!result.length) {
      return res.status(401).json({
        error: { message: 'Invalid email or password', status: 401 },
      });
    }

    const userNode = result[0].u;
    const user = {
      id: userNode.properties.id,
      username: userNode.properties.username,
      email: userNode.properties.email,
      passwordHash: userNode.properties.passwordHash,
      role: userNode.properties.role,
      reputationScore: userNode.properties.reputationScore,
      isVerified: userNode.properties.isVerified,
    };

    // Verify password
    const validPassword = await bcrypt.compare(password, user.passwordHash!);
    if (!validPassword) {
      return res.status(401).json({
        error: { message: 'Invalid email or password', status: 401 },
      });
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });

    // Remove password hash from response
    const { passwordHash: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token,
      },
      message: 'Login successful',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/auth/me
 * Get current authenticated user profile
 */
router.get('/me', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const user = await graphRepository.getUserById(req.user!.id);

    if (!user) {
      return res.status(404).json({
        error: { message: 'User not found', status: 404 },
      });
    }

    // Remove password hash from response
    const { passwordHash: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/logout
 * Logout (handled client-side by removing token)
 */
router.post('/logout', authenticateToken, async (req: AuthRequest, res) => {
  res.json({
    success: true,
    message: 'Logout successful. Please remove the token from your client storage.',
  });
});

export default router;
