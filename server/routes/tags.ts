/**
 * Tag Routes
 * GET /api/tags - List all tags (with filters)
 * POST /api/tags - Create new tag
 * GET /api/tags/:name - Get tag by name with related tags
 * PUT /api/tags/:name - Update tag
 * DELETE /api/tags/:name - Delete tag (admin only)
 * GET /api/tags/constellation - Get tag constellation for visualization
 */

import { Router, Request } from 'express';
import { graphRepository } from '../../src/services/graphRepository';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

/**
 * GET /api/tags
 * List all tags with optional filtering
 * Query params: category, limit, offset, search
 */
router.get('/', async (req, res, next) => {
  try {
    const { category, limit = '50', offset = '0', search } = req.query;

    // For now, get constellation which returns top tags
    // In production, add more sophisticated filtering to repository
    const tags = await graphRepository.getTagConstellation(parseInt(limit as string));

    // Filter by category if provided
    let filteredTags = tags;
    if (category) {
      filteredTags = tags.filter(t => t.category === category);
    }

    // Search filter
    if (search) {
      const searchTerm = (search as string).toLowerCase();
      filteredTags = filteredTags.filter(t => 
        t.name.toLowerCase().includes(searchTerm)
      );
    }

    res.json({
      success: true,
      data: {
        tags: filteredTags,
        total: filteredTags.length,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/tags/constellation
 * Get tag constellation for force-directed graph visualization
 */
router.get('/constellation', async (req, res, next) => {
  try {
    const { limit = '100' } = req.query;
    const constellation = await graphRepository.getTagConstellation(parseInt(limit as string));

    res.json({
      success: true,
      data: {
        nodes: constellation.map(t => ({
          id: t.id,
          name: t.name,
          category: t.category,
          size: t.size,
          connections: t.connections,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/tags
 * Create a new tag (authenticated users only)
 */
router.post('/', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { name, category, description, isEphemeral } = req.body;

    // Validation
    if (!name || typeof name !== 'string') {
      return res.status(400).json({
        error: { message: 'Tag name is required', status: 400 },
      });
    }

    if (name.length < 2 || name.length > 50) {
      return res.status(400).json({
        error: { message: 'Tag name must be between 2 and 50 characters', status: 400 },
      });
    }

    // Validate category
    const validCategories = ['TOPIC', 'FORMAT', 'LOCATION', 'EVENT', 'COMMUNITY'];
    const tagCategory = (category || 'TOPIC').toUpperCase();
    if (!validCategories.includes(tagCategory)) {
      return res.status(400).json({
        error: { 
          message: `Invalid category. Must be one of: ${validCategories.join(', ')}`, 
          status: 400 
        },
      });
    }

    // Check if tag already exists
    const existingTag = await graphRepository.getTagByName(name.toLowerCase());
    if (existingTag) {
      return res.status(409).json({
        error: { message: 'Tag with this name already exists', status: 409 },
      });
    }

    // Create tag
    const tag = await graphRepository.createTag({
      name: name.toLowerCase(),
      category: tagCategory as any,
      description,
      isEphemeral: isEphemeral || false,
    });

    res.status(201).json({
      success: true,
      data: { tag },
      message: 'Tag created successfully',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/tags/:name
 * Get tag by name with related tags
 */
router.get('/:name', async (req, res, next) => {
  try {
    const { name } = req.params;
    
    const tag = await graphRepository.getTagByName(name.toLowerCase());

    if (!tag) {
      return res.status(404).json({
        error: { message: 'Tag not found', status: 404 },
      });
    }

    res.json({
      success: true,
      data: { tag },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/tags/:name
 * Update tag (admin only or tag creator)
 */
router.put('/:name', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { name } = req.params;
    const { description, category, isEphemeral } = req.body;

    // Check if user is admin
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({
        error: { message: 'Admin access required', status: 403 },
      });
    }

    const existingTag = await graphRepository.getTagByName(name.toLowerCase());
    if (!existingTag) {
      return res.status(404).json({
        error: { message: 'Tag not found', status: 404 },
      });
    }

    // Update tag using direct query (add update method to repository in production)
    const { neo4jService } = await import('../../src/services/neo4j');
    const updates: string[] = [];
    const params: any = { name: name.toLowerCase() };

    if (description !== undefined) {
      updates.push('t.description = $description');
      params.description = description;
    }
    if (category !== undefined) {
      updates.push('t.category = $category');
      params.category = category.toUpperCase();
    }
    if (isEphemeral !== undefined) {
      updates.push('t.isEphemeral = $isEphemeral');
      params.isEphemeral = isEphemeral;
    }

    if (updates.length === 0) {
      return res.status(400).json({
        error: { message: 'No fields to update', status: 400 },
      });
    }

    const query = `
      MATCH (t:Tag {name: $name})
      SET ${updates.join(', ')}
      RETURN t
    `;

    const result = await neo4jService.writeQuery<{ t: any }>(query, params);
    const updatedTag = graphRepository['mapTag'](result[0].t);

    res.json({
      success: true,
      data: { tag: updatedTag },
      message: 'Tag updated successfully',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/tags/:name
 * Delete tag (admin only)
 */
router.delete('/:name', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { name } = req.params;

    // Check if user is admin
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({
        error: { message: 'Admin access required', status: 403 },
      });
    }

    const existingTag = await graphRepository.getTagByName(name.toLowerCase());
    if (!existingTag) {
      return res.status(404).json({
        error: { message: 'Tag not found', status: 404 },
      });
    }

    // Delete tag using direct query
    const { neo4jService } = await import('../../src/services/neo4j');
    const query = `
      MATCH (t:Tag {name: $name})
      DETACH DELETE t
    `;

    await neo4jService.writeQuery(query, { name: name.toLowerCase() });

    res.json({
      success: true,
      message: 'Tag deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
