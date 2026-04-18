/**
 * Post Routes
 * GET /api/posts - List posts (with filters)
 * POST /api/posts - Create new post
 * GET /api/posts/:id - Get post by ID
 * DELETE /api/posts/:id - Delete post
 * POST /api/posts/:id/resonance - Add resonance reaction
 */

import { Router } from 'express';
import { graphRepository } from '../../src/services/graphRepository';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

/**
 * GET /api/posts
 * List posts with optional filtering
 * Query params: tags, authorId, mode, limit, offset
 */
router.get('/', async (req, res, next) => {
  try {
    const { tags, authorId, mode, limit = '20', offset = '0' } = req.query;

    // Build query based on filters
    const { neo4jService } = await import('../../src/services/neo4j');
    
    let whereClauses: string[] = [];
    let params: any = { limit: parseInt(limit as string), offset: parseInt(offset as string) };

    if (tags) {
      const tagArray = (tags as string).split(',').map(t => t.toLowerCase().trim());
      whereClauses.push('ALL(tag IN $tags WHERE tag IN p.tags)');
      params.tags = tagArray;
    }

    if (authorId) {
      whereClauses.push('p.authorId = $authorId');
      params.authorId = authorId;
    }

    if (mode) {
      whereClauses.push('p.mode = $mode');
      params.mode = mode;
    }

    // Only show non-expired posts
    whereClauses.push('(p.expiresAt IS NULL OR p.expiresAt > datetime())');

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const query = `
      MATCH (p:Post)<-[:OWNS]-(author:User)
      OPTIONAL MATCH (p)-[:TAGGED_WITH]->(t:Tag)
      ${whereClause}
      WITH p, author, collect(DISTINCT t) as tags
      ORDER BY p.createdAt DESC
      SKIP $offset
      LIMIT $limit
      RETURN p, author, [tag in tags | tag.name] as tagNames
    `;

    const result = await neo4jService.readQuery(query, params);

    const posts = result.map((row: any) => ({
      id: row.p.id,
      authorId: row.p.authorId,
      author: {
        id: row.author.properties.id,
        username: row.author.properties.username,
      },
      blocks: typeof row.p.blocks === 'string' ? JSON.parse(row.p.blocks) : row.p.blocks,
      tags: row.tagNames || [],
      mode: row.p.mode,
      createdAt: new Date(row.p.createdAt),
      expiresAt: row.p.expiresAt ? new Date(row.p.expiresAt) : undefined,
      replyCount: row.p.replyCount || 0,
      resonanceCounts: {
        insightful: 0,
        controversial: 0,
        actionable: 0,
        bridge: 0,
        dissonant: 0,
        total: 0,
      },
    }));

    res.json({
      success: true,
      data: {
        posts,
        total: posts.length,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/posts/:id
 * Get single post by ID
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await graphRepository.getPostById(id);

    if (!post) {
      return res.status(404).json({
        error: { message: 'Post not found', status: 404 },
      });
    }

    res.json({
      success: true,
      data: { post },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/posts
 * Create a new post (authenticated users only)
 */
router.post('/', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { blocks, tags, mode, parentPostId } = req.body;

    // Validation
    if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
      return res.status(400).json({
        error: { message: 'Post must have at least one content block', status: 400 },
      });
    }

    if (!tags || !Array.isArray(tags) || tags.length === 0) {
      return res.status(400).json({
        error: { message: 'Post must have at least one tag', status: 400 },
      });
    }

    const validModes = ['PULSE', 'ARCHIVE'];
    const postMode = (mode || 'ARCHIVE').toUpperCase();
    if (!validModes.includes(postMode)) {
      return res.status(400).json({
        error: { 
          message: `Invalid mode. Must be one of: ${validModes.join(', ')}`, 
          status: 400 
        },
      });
    }

    // Validate block structure
    for (const block of blocks) {
      if (!block.type || !block.content) {
        return res.status(400).json({
          error: { message: 'Each block must have a type and content', status: 400 },
        });
      }
    }

    // Find or create tags
    await graphRepository.findOrCreateTags(tags);

    // Create post
    const post = await graphRepository.createPost({
      authorId: req.user!.id,
      blocks,
      tags,
      mode: postMode as 'PULSE' | 'ARCHIVE',
      parentPostId,
    });

    res.status(201).json({
      success: true,
      data: { post },
      message: 'Post created successfully',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/posts/:id
 * Delete post (author or admin only)
 */
router.delete('/:id', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    const post = await graphRepository.getPostById(id);

    if (!post) {
      return res.status(404).json({
        error: { message: 'Post not found', status: 404 },
      });
    }

    // Check authorization
    if (post.authorId !== req.user!.id && req.user?.role !== 'ADMIN') {
      return res.status(403).json({
        error: { message: 'Not authorized to delete this post', status: 403 },
      });
    }

    // Delete post using direct query
    const { neo4jService } = await import('../../src/services/neo4j');
    const query = `
      MATCH (p:Post {id: $id})
      DETACH DELETE p
    `;

    await neo4jService.writeQuery(query, { id });

    res.json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/posts/:id/resonance
 * Add resonance reaction to a post
 */
router.post('/:id/resonance', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { type } = req.body;

    // Validate resonance type
    const validTypes = ['INSIGHTFUL', 'CONTROVERSIAL', 'ACTIONABLE', 'BRIDGE', 'DISSONANT'];
    if (!type || !validTypes.includes(type.toUpperCase())) {
      return res.status(400).json({
        error: { 
          message: `Invalid resonance type. Must be one of: ${validTypes.join(', ')}`, 
          status: 400 
        },
      });
    }

    // Check if post exists
    const post = await graphRepository.getPostById(id);
    if (!post) {
      return res.status(404).json({
        error: { message: 'Post not found', status: 404 },
      });
    }

    // Add resonance
    await graphRepository.addResonance(id, req.user!.id, type.toUpperCase() as any);

    // Get updated post with resonance counts
    const updatedPost = await graphRepository.getPostById(id);

    res.json({
      success: true,
      data: { 
        post: updatedPost,
        resonance: {
          postId: id,
          userId: req.user!.id,
          type: type.toUpperCase(),
        }
      },
      message: 'Resonance added successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
