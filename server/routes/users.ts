/**
 * User Routes
 * GET /api/users/:id - Get user profile
 * PUT /api/users/:id - Update user profile
 * GET /api/users/:id/reputation - Get user reputation by tag
 */

import { Router } from 'express';
import { graphRepository } from '../../src/services/graphRepository';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

/**
 * GET /api/users/:id
 * Get user profile by ID
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const profile = await graphRepository.getUserProfile(id);

    if (!profile) {
      return res.status(404).json({
        error: { message: 'User not found', status: 404 },
      });
    }

    // Remove sensitive data
    const { passwordHash, ...publicProfile } = profile;

    res.json({
      success: true,
      data: { user: publicProfile },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/users/:id
 * Update user profile (owner or admin only)
 */
router.put('/:id', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { bio, avatarUrl } = req.body;

    // Check authorization
    if (req.user!.id !== id && req.user?.role !== 'ADMIN') {
      return res.status(403).json({
        error: { message: 'Not authorized to update this profile', status: 403 },
      });
    }

    const existingUser = await graphRepository.getUserById(id);
    if (!existingUser) {
      return res.status(404).json({
        error: { message: 'User not found', status: 404 },
      });
    }

    // Update user using direct query
    const { neo4jService } = await import('../../src/services/neo4j');
    const updates: string[] = [];
    const params: any = { id };

    if (bio !== undefined) {
      updates.push('u.bio = $bio');
      params.bio = bio;
    }
    if (avatarUrl !== undefined) {
      updates.push('u.avatarUrl = $avatarUrl');
      params.avatarUrl = avatarUrl;
    }

    if (updates.length === 0) {
      return res.status(400).json({
        error: { message: 'No fields to update', status: 400 },
      });
    }

    const query = `
      MATCH (u:User {id: $id})
      SET ${updates.join(', ')}
      RETURN u
    `;

    const result = await neo4jService.writeQuery<{ u: any }>(query, params);
    const updatedUser = graphRepository['mapUser'](result[0].u);

    // Remove password hash from response
    const { passwordHash, ...userWithoutPassword } = updatedUser;

    res.json({
      success: true,
      data: { user: userWithoutPassword },
      message: 'Profile updated successfully',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/users/:id/reputation
 * Get user reputation scores by tag domain
 */
router.get('/:id/reputation', async (req, res, next) => {
  try {
    const { id } = req.params;

    const { neo4jService } = await import('../../src/services/neo4j');

    // Query to get reputation by tag domain
    const query = `
      MATCH (u:User {id: $userId})
      OPTIONAL MATCH (u)-[:OWNS]->(p:Post)-[:TAGGED_WITH]->(t:Tag)
      OPTIONAL MATCH (p)<-[r:RESONATED_WITH]-(other:User)
      WITH t.name as tagName, 
           count(DISTINCT p) as postCount,
           sum(CASE WHEN r.type = 'INSIGHTFUL' THEN other.reputationScore ELSE 0 END) as insightfulScore,
           sum(CASE WHEN r.type = 'ACTIONABLE' THEN other.reputationScore ELSE 0 END) as actionableScore
      WHERE tagName IS NOT NULL
      RETURN tagName, postCount, insightfulScore, actionableScore
      ORDER BY (insightfulScore + actionableScore) DESC
      LIMIT 10
    `;

    const results = await neo4jService.readQuery(query, { userId: id });

    // Get overall user stats
    const user = await graphRepository.getUserById(id);
    if (!user) {
      return res.status(404).json({
        error: { message: 'User not found', status: 404 },
      });
    }

    res.json({
      success: true,
      data: {
        overall: {
          reputationScore: user.reputationScore,
          justiceScore: user.justiceScore,
          isVerified: user.isVerified,
        },
        byTag: results.map((row: any) => ({
          tag: row.tagName,
          postCount: row.postCount,
          insightfulScore: row.insightfulScore,
          actionableScore: row.actionableScore,
          totalScore: row.insightfulScore + row.actionableScore,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
