/**
 * Graph Query Repository
 * Centralized Neo4j Cypher queries for all domain operations
 */

import { neo4jService } from '../services/neo4j';
import type { 
  User, Tag, Post, NewsStory, Campaign, Badge, 
  JuryCase, ResonanceType, TagConstellationNode 
} from '../types';

export class GraphRepository {
  
  // ==================== USER OPERATIONS ====================
  
  async createUser(userData: Partial<User>): Promise<User> {
    const query = `
      CREATE (u:User {
        id: $id,
        username: $username,
        email: $email,
        passwordHash: $passwordHash,
        reputationScore: $reputationScore,
        justiceScore: $justiceScore,
        isVerified: $isVerified,
        role: $role,
        createdAt: datetime($createdAt)
      })
      RETURN u
    `;
    
    const params = {
      id: userData.id || `user-${Date.now()}`,
      username: userData.username!,
      email: userData.email!,
      passwordHash: userData.passwordHash,
      reputationScore: userData.reputationScore || 0,
      justiceScore: userData.justiceScore || 50,
      isVerified: userData.isVerified || false,
      role: userData.role || 'USER',
      createdAt: new Date().toISOString(),
    };
    
    const result = await neo4jService.writeQuery<{ u: any }>(query, params);
    return this.mapUser(result[0].u);
  }
  
  async getUserById(userId: string): Promise<User | null> {
    const query = `
      MATCH (u:User {id: $userId})
      RETURN u
    `;
    
    const result = await neo4jService.readQuery<{ u: any }>(query, { userId });
    if (!result.length) return null;
    return this.mapUser(result[0].u);
  }
  
  async getUserProfile(userId: string): Promise<any> {
    const query = `
      MATCH (u:User {id: $userId})
      OPTIONAL MATCH (u)-[:OWNS]->(p:Post)
      OPTIONAL MATCH (u)-[:HAS_BADGE]->(b:Badge)
      OPTIONAL MATCH (followers:User)-[:FOLLOWS]->(u)
      OPTIONAL MATCH (u)-[:FOLLOWS]->(following:User)
      RETURN u, 
             count(DISTINCT p) as postCount,
             collect(DISTINCT b) as badges,
             count(DISTINCT followers) as followerCount,
             count(DISTINCT following) as followingCount
    `;
    
    const result = await neo4jService.readQuery(query, { userId });
    if (!result.length) return null;
    
    const row = result[0];
    return {
      ...this.mapUser(row.u),
      postCount: row.postCount,
      badges: row.badges.map((b: any) => this.mapBadge(b)),
      followerCount: row.followerCount,
      followingCount: row.followingCount,
    };
  }
  
  // ==================== TAG OPERATIONS ====================
  
  async createTag(tagData: Partial<Tag>): Promise<Tag> {
    const query = `
      MERGE (t:Tag {name: $name})
      ON CREATE SET
        t.category = $category,
        t.description = $description,
        t.usageCount = 0,
        t.isEphemeral = $isEphemeral,
        t.createdAt = datetime($createdAt)
      RETURN t
    `;
    
    const params = {
      name: tagData.name!.toLowerCase(),
      category: tagData.category || 'TOPIC',
      description: tagData.description,
      isEphemeral: tagData.isEphemeral || false,
      createdAt: new Date().toISOString(),
    };
    
    const result = await neo4jService.writeQuery<{ t: any }>(query, params);
    return this.mapTag(result[0].t);
  }
  
  async getTagConstellation(limit: number = 50): Promise<TagConstellationNode[]> {
    const query = `
      MATCH (t:Tag)
      OPTIONAL MATCH (t)-[r:RELATED_TO]-(related:Tag)
      WITH t, count(r) as connections
      ORDER BY t.usageCount DESC
      LIMIT $limit
      RETURN t.name as id, t.name as name, t.category as category, 
             t.usageCount as size, connections
    `;
    
    const results = await neo4jService.readQuery(query, { limit });
    return results.map((r: any) => ({
      id: r.id,
      name: r.name,
      category: r.category,
      size: r.size,
      connections: r.connections,
    }));
  }
  
  async findOrCreateTags(tagNames: string[]): Promise<Tag[]> {
    const tags: Tag[] = [];
    
    for (const tagName of tagNames) {
      const normalized = tagName.toLowerCase();
      
      // Try to find existing
      const existing = await this.getTagByName(normalized);
      if (existing) {
        tags.push(existing);
        // Increment usage count
        await neo4jService.writeQuery(
          'MATCH (t:Tag {name: $name}) SET t.usageCount = t.usageCount + 1 RETURN t',
          { name: normalized }
        );
      } else {
        // Create new
        const newTag = await this.createTag({
          name: normalized,
          category: 'TOPIC',
          usageCount: 1,
        });
        tags.push(newTag);
      }
    }
    
    return tags;
  }
  
  async getTagByName(name: string): Promise<Tag | null> {
    const query = `
      MATCH (t:Tag {name: $name})
      OPTIONAL MATCH (t)-[r:RELATED_TO]-(related:Tag)
      RETURN t, collect(related) as relatedTags
    `;
    
    const result = await neo4jService.readQuery(query, { name: name.toLowerCase() });
    if (!result.length) return null;
    
    const row = result[0];
    return {
      ...this.mapTag(row.t),
      relatedTags: row.relatedTags
        .filter((t: any) => t !== null)
        .map((t: any) => ({ name: t.name, strength: 0.5 })),
    };
  }
  
  // ==================== POST OPERATIONS ====================
  
  async createPost(postData: {
    authorId: string;
    blocks: any[];
    tags: string[];
    mode: 'PULSE' | 'ARCHIVE';
    parentPostId?: string;
  }): Promise<Post> {
    const postId = `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const expiresAt = postData.mode === 'PULSE' 
      ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      : null;
    
    const queries = [
      {
        query: `
          CREATE (p:Post {
            id: $postId,
            authorId: $authorId,
            blocks: $blocks,
            tags: $tags,
            mode: $mode,
            createdAt: datetime($createdAt),
            expiresAt: $expiresAt,
            replyCount: 0
          })
          RETURN p
        `,
        parameters: {
          postId,
          authorId: postData.authorId,
          blocks: JSON.stringify(postData.blocks),
          tags: postData.tags.map(t => t.toLowerCase()),
          mode: postData.mode,
          createdAt: new Date().toISOString(),
          expiresAt,
        },
      },
      {
        query: `
          MATCH (p:Post {id: $postId})
          MATCH (author:User {id: $authorId})
          CREATE (author)-[:OWNS]->(p)
        `,
        parameters: { postId, authorId: postData.authorId },
      },
      {
        query: `
          MATCH (p:Post {id: $postId})
          UNWIND $tags as tagName
          MATCH (t:Tag {name: tagName})
          CREATE (p)-[:TAGGED_WITH]->(t)
        `,
        parameters: { postId, tags: postData.tags.map(t => t.toLowerCase()) },
      },
    ];
    
    // Add reply relationship if parent exists
    if (postData.parentPostId) {
      queries.push({
        query: `
          MATCH (p:Post {id: $postId})
          MATCH (parent:Post {id: $parentPostId})
          CREATE (p)-[:REPLY_TO]->(parent)
          SET parent.replyCount = parent.replyCount + 1
        `,
        parameters: { postId, parentPostId: postData.parentPostId },
      });
    }
    
    const result = await neo4jService.transaction<{ p: any }>(queries);
    const postNode = result.find(r => r.p)?.p;
    
    if (!postNode) throw new Error('Failed to create post');
    
    return {
      ...this.mapPost(postNode),
      tags: postData.tags,
      replyCount: 0,
      resonanceCounts: { insightful: 0, controversial: 0, actionable: 0, bridge: 0, dissonant: 0, total: 0 },
    };
  }
  
  async getPostById(postId: string): Promise<Post | null> {
    const query = `
      MATCH (p:Post {id: $postId})<-[:OWNS]-(author:User)
      OPTIONAL MATCH (p)-[:TAGGED_WITH]->(t:Tag)
      OPTIONAL MATCH (p)<-[r:RESONATED_WITH]-(users:User)
      RETURN p, author, collect(DISTINCT t) as tags, 
             count(r) as resonanceCount
    `;
    
    const result = await neo4jService.readQuery(query, { postId });
    if (!result.length) return null;
    
    const row = result[0];
    return {
      ...this.mapPost(row.p),
      author: this.mapUser(row.author),
      tags: row.tags.map((t: any) => t.name),
      replyCount: row.p.replyCount || 0,
      resonanceCounts: {
        insightful: 0,
        controversial: 0,
        actionable: 0,
        bridge: 0,
        dissonant: 0,
        total: row.resonanceCount || 0,
      },
    };
  }
  
  async addResonance(postId: string, userId: string, type: ResonanceType): Promise<void> {
    const query = `
      MATCH (p:Post {id: $postId})
      MATCH (u:User {id: $userId})
      MERGE (u)-[r:RESONATED_WITH {postId: $postId}]->(p)
      ON CREATE SET r.type = $type, r.timestamp = datetime()
      ON MATCH SET r.type = $type, r.timestamp = datetime()
    `;
    
    await neo4jService.writeQuery(query, { postId, userId, type });
  }
  
  // ==================== NEWS OPERATIONS ====================
  
  async createNewsStory(storyData: {
    title: string;
    summary: string;
    relatedTags: string[];
  }): Promise<NewsStory> {
    const storyId = `news-${Date.now()}`;
    
    const query = `
      CREATE (n:NewsStory {
        storyId: $storyId,
        title: $title,
        summary: $summary,
        status: 'DRAFT',
        createdAt: datetime(),
        lastUpdated: datetime(),
        relatedTags: $relatedTags
      })
      RETURN n
    `;
    
    const result = await neo4jService.writeQuery<{ n: any }>(query, {
      storyId,
      ...storyData,
    });
    
    return this.mapNewsStory(result[0].n);
  }
  
  async addNewsUpdate(storyId: string, updateData: {
    content: string;
    sourceType: 'ADMIN' | 'COMMUNITY';
    authorId?: string;
  }): Promise<any> {
    const updateId = `update-${Date.now()}`;
    
    const query = `
      MATCH (n:NewsStory {storyId: $storyId})
      CREATE (u:NewsUpdate {
        updateId: $updateId,
        storyId: $storyId,
        content: $content,
        timestamp: datetime(),
        sourceType: $sourceType,
        authorId: $authorId,
        validationScore: 0
      })
      CREATE (n)-[:HAS_UPDATE]->(u)
      SET n.lastUpdated = datetime()
      RETURN u
    `;
    
    return await neo4jService.writeQuery(query, {
      storyId,
      updateId,
      ...updateData,
    });
  }
  
  // ==================== HELPERS ====================
  
  private mapUser(node: any): User {
    if (!node) return null as any;
    const props = node.properties || node;
    return {
      id: props.id,
      username: props.username,
      email: props.email,
      passwordHash: props.passwordHash,
      reputationScore: props.reputationScore || 0,
      justiceScore: props.justiceScore || 50,
      isVerified: props.isVerified || false,
      role: props.role || 'USER',
      createdAt: new Date(props.createdAt),
      avatarUrl: props.avatarUrl,
      bio: props.bio,
      walletAddress: props.walletAddress,
    };
  }
  
  private mapTag(node: any): Tag {
    if (!node) return null as any;
    const props = node.properties || node;
    return {
      name: props.name,
      category: props.category || 'TOPIC',
      description: props.description,
      usageCount: props.usageCount || 0,
      isEphemeral: props.isEphemeral || false,
      createdAt: new Date(props.createdAt),
    };
  }
  
  private mapPost(node: any): Post {
    if (!node) return null as any;
    const props = node.properties || node;
    return {
      id: props.id,
      authorId: props.authorId,
      author: {} as User, // Will be populated separately
      blocks: typeof props.blocks === 'string' ? JSON.parse(props.blocks) : props.blocks,
      tags: props.tags || [],
      mode: props.mode,
      createdAt: new Date(props.createdAt),
      expiresAt: props.expiresAt ? new Date(props.expiresAt) : undefined,
      editHistory: props.editHistory,
      parentPostId: props.parentPostId,
      replyCount: props.replyCount || 0,
      resonanceCounts: { insightful: 0, controversial: 0, actionable: 0, bridge: 0, dissonant: 0, total: 0 },
    };
  }
  
  private mapBadge(node: any): Badge {
    if (!node) return null as any;
    const props = node.properties || node;
    return {
      id: props.id,
      name: props.name,
      description: props.description,
      icon: props.icon,
      rarity: props.rarity || 'COMMON',
      mintDate: new Date(props.mintDate),
      isTransferable: props.isTransferable ?? false,
      metadata: props.metadata,
      blockchainHash: props.blockchainHash,
    };
  }
  
  private mapNewsStory(node: any): NewsStory {
    if (!node) return null as any;
    const props = node.properties || node;
    return {
      storyId: props.storyId,
      title: props.title,
      summary: props.summary,
      status: props.status,
      createdAt: new Date(props.createdAt),
      lastUpdated: new Date(props.lastUpdated),
      relatedTags: props.relatedTags || [],
      updates: [],
    };
  }
}

export const graphRepository = new GraphRepository();
export default graphRepository;
