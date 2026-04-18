// Neo4j Schema Definition for Nothing Social
// Run these Cypher queries in Neo4j Browser or via driver initialization

/**
 * 1. CONSTRAINTS & INDEXES
 * Ensures data integrity and query performance for the graph database
 */

-- Create unique constraint for Users
CREATE CONSTRAINT user_id_unique IF NOT EXISTS FOR (u:User) REQUIRE u.id IS UNIQUE;

-- Create unique constraint for Tags (the core coordinate system)
CREATE CONSTRAINT tag_name_unique IF NOT EXISTS FOR (t:Tag) REQUIRE t.name IS UNIQUE;

-- Create unique constraint for Posts
CREATE CONSTRAINT post_id_unique IF NOT EXISTS FOR (p:Post) REQUIRE p.id IS UNIQUE;

-- Create unique constraint for Campaigns
CREATE CONSTRAINT campaign_id_unique IF NOT EXISTS FOR (c:Campaign) REQUIRE c.id IS UNIQUE;

-- Indexes for fast lookups
CREATE INDEX user_email_index IF NOT EXISTS FOR (u:User) ON (u.email);
CREATE INDEX tag_category_index IF NOT EXISTS FOR (t:Tag) ON (t.category);
CREATE INDEX post_created_index IF NOT EXISTS FOR (p:Post) ON (p.createdAt);
CREATE INDEX post_type_index IF NOT EXISTS FOR (p:Post) ON (p.type);
CREATE INDEX news_story_id_index IF NOT EXISTS FOR (n:NewsStory) ON (n.storyId);

/**
 * 2. NODE LABELS DEFINITION
 * 
 * :User - Platform participants
 *   Properties: id, username, email, passwordHash, reputationScore, justiceScore, 
 *               isVerified, createdAt, avatarUrl, bio, walletAddress (future)
 * 
 * :Tag - The atomic unit of context/coordinates
 *   Properties: name, category, description, usageCount, isEphemeral, createdAt
 * 
 * :Post - Content blocks (articles, comments, replies)
 *   Properties: id, type (text|image|video|poll|code), content, mediaUrls, 
 *               mode (PULSE|ARCHIVE), createdAt, expiresAt, editHistory
 * 
 * :NewsStory - Admin-managed living news entries
 *   Properties: storyId, title, summary, status (DRAFT|PUBLISHED|ARCHIVED), 
 *               createdAt, lastUpdated
 * 
 * :NewsUpdate - Chronological updates attached to NewsStories
 *   Properties: updateId, content, timestamp, sourceType (ADMIN|COMMUNITY), 
 *               validationScore
 * 
 * :Campaign - Ad campaign containers
 *   Properties: id, title, budget, startDate, endDate, status, targetTags, 
 *               temporalWindows, rewardType, rewardAmount
 * 
 * :Badge - Reputation/Soulbound tokens
 *   Properties: id, name, description, icon, rarity, mintDate, isTransferable
 * 
 * :Quest - Specific ad engagement actions
 *   Properties: id, campaignId, actionType, completionCriteria, rewardPoints
 */

/**
 * 3. RELATIONSHIP TYPES DEFINITION
 * 
 * (:User)-[:OWNS]->(:Post)
 * (:User)-[:FOLLOWS]->(:Tag)
 * (:User)-[:FOLLOWS]->(:User)
 * (:User)-[:HAS_BADGE]->(:Badge)
 * (:User)-[:COMPLETED_QUEST]->(:Quest)
 * (:User)-[:SERVED_ON_JURY]->(:JuryCase)
 * 
 * (:Post)-[:TAGGED_WITH]->(:Tag)
 * (:Post)-[:REPLY_TO]->(:Post)
 * (:Post)-[:CONTAINS_BLOCK]->(:Post) -- For multi-block posts
 * 
 * (:Post)-[:RESONATED_WITH {type: 'INSIGHTFUL'|'CONTROVERSIAL'|...}]->(:User)
 * 
 * (:NewsStory)-[:HAS_UPDATE]->(:NewsUpdate)
 * (:NewsStory)-[:RELATED_TO]->(:Tag)
 * (:NewsUpdate)-[:ANNOTATED_BY]->(:User)
 * 
 * (:Campaign)-[:TARGETS]->(:Tag)
 * (:Campaign)-[:HAS_QUEST]->(:Quest)
 * (:Quest)-[:COMPLETED_BY]->(:User)
 * 
 * (:Tag)-[:RELATED_TO]->(:Tag) -- Tag fusion graph
 */

/**
 * 4. SAMPLE DATA SEEDING (Optional for Development)
 */

-- Create Admin User
MERGE (admin:User {id: 'admin-001', username: 'nothing_admin', email: 'admin@nothingsocial.com'})
SET admin.reputationScore = 1000,
    admin.isVerified = true,
    admin.role = 'ADMIN';

-- Create Core Tags
MERGE (t1:Tag {name: 'technology', category: 'TOPIC'})
MERGE (t2:Tag {name: 'design', category: 'TOPIC'})
MERGE (t3:Tag {name: 'crypto', category: 'TOPIC'})
MERGE (t4:Tag {name: 'debate', category: 'FORMAT'})
MERGE (t5:Tag {name: 'question', category: 'FORMAT'});

-- Create Relationship between tags (fusion hints)
MERGE (t1)-[:RELATED_TO {strength: 0.8}]->(t2);
