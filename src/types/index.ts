/**
 * TypeScript Type Definitions for Nothing Social
 * Aligned with Neo4j Graph Schema
 */

// ==================== USER TYPES ====================

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash?: string;
  reputationScore: number;
  justiceScore: number;
  isVerified: boolean;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
  createdAt: Date;
  avatarUrl?: string;
  bio?: string;
  walletAddress?: string; // Future NFT integration
}

export interface UserProfile extends User {
  followerCount: number;
  followingCount: number;
  postCount: number;
  badges: Badge[];
}

// ==================== TAG TYPES ====================

export type TagCategory = 'TOPIC' | 'FORMAT' | 'LOCATION' | 'EVENT' | 'COMMUNITY';

export interface Tag {
  name: string;
  category: TagCategory;
  description?: string;
  usageCount: number;
  isEphemeral: boolean;
  createdAt: Date;
  relatedTags?: RelatedTag[];
}

export interface RelatedTag {
  name: string;
  strength: number; // 0-1 similarity score
}

export interface TagFusion {
  tags: string[];
  conversationCount: number;
}

// ==================== POST & CONTENT TYPES ====================

export type PostType = 'text' | 'image' | 'video' | 'poll' | 'code' | 'link';
export type PostMode = 'PULSE' | 'ARCHIVE'; // PULSE = 24h expiry, ARCHIVE = permanent

export interface ContentBlock {
  id: string;
  type: PostType;
  content: string; // Text content or caption
  mediaUrls?: string[]; // For image/video
  pollOptions?: PollOption[];
  codeLanguage?: string;
}

export interface PollOption {
  id: string;
  text: string;
  voteCount: number;
}

export interface Post {
  id: string;
  authorId: string;
  author: User;
  blocks: ContentBlock[];
  tags: string[];
  mode: PostMode;
  createdAt: Date;
  expiresAt?: Date;
  editHistory?: EditEntry[];
  parentPostId?: string; // For replies
  replyCount: number;
  resonanceCounts: ResonanceCounts;
  userResonance?: ResonanceType; // Current user's reaction
}

export interface EditEntry {
  timestamp: Date;
  previousContent: string;
  reason?: string;
}

// ==================== RESONANCE METRICS ====================

export type ResonanceType = 'INSIGHTFUL' | 'CONTROVERSIAL' | 'ACTIONABLE' | 'BRIDGE' | 'DISSONANT';

export interface ResonanceCounts {
  insightful: number;
  controversial: number;
  actionable: number;
  bridge: number;
  dissonant: number;
  total: number;
}

export interface Resonance {
  postId: string;
  userId: string;
  type: ResonanceType;
  timestamp: Date;
}

// ==================== NEWS TYPES ====================

export type NewsStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type UpdateSourceType = 'ADMIN' | 'COMMUNITY';

export interface NewsStory {
  storyId: string;
  title: string;
  summary: string;
  status: NewsStatus;
  createdAt: Date;
  lastUpdated: Date;
  relatedTags: string[];
  updates: NewsUpdate[];
  predictionMarket?: PredictionMarket;
}

export interface NewsUpdate {
  updateId: string;
  storyId: string;
  content: string;
  timestamp: Date;
  sourceType: UpdateSourceType;
  authorId?: string;
  validationScore: number; // Community validation score
  annotations?: Annotation[];
}

export interface Annotation {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: Date;
  upvotes: number;
}

export interface PredictionMarket {
  question: string;
  options: PredictionOption[];
  resolutionDate?: Date;
  resolvedOutcome?: string;
}

export interface PredictionOption {
  id: string;
  text: string;
  probability: number; // 0-1
  betVolume: number;
}

// ==================== AD & CAMPAIGN TYPES ====================

export type CampaignStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'EXPIRED';
export type RewardType = 'POINTS' | 'BADGE' | 'DISCOUNT' | 'NFT';

export interface TemporalWindow {
  dayOfWeek: number[]; // 0-6 (Sunday-Saturday)
  hourStart: number; // 0-23
  hourEnd: number; // 0-23
  timezone: string;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  budget: number;
  spent: number;
  startDate: Date;
  endDate: Date;
  status: CampaignStatus;
  targetTags: string[];
  temporalWindows: TemporalWindow[];
  rewardType: RewardType;
  rewardAmount: number;
  quests: Quest[];
  metrics: CampaignMetrics;
}

export interface Quest {
  id: string;
  campaignId: string;
  actionType: 'VIEW' | 'CLICK' | 'ENGAGE' | 'SHARE' | 'COMPLETE_POLL';
  title: string;
  description: string;
  completionCriteria: string;
  rewardPoints: number;
  completedBy?: string[]; // User IDs
}

export interface CampaignMetrics {
  impressions: number;
  clicks: number;
  engagements: number;
  questCompletions: number;
  conversionRate: number;
  costPerEngagement: number;
}

// ==================== BADGE & REPUTATION TYPES ====================

export type BadgeRarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // SVG or emoji
  rarity: BadgeRarity;
  mintDate: Date;
  isTransferable: boolean; // false = Soulbound
  metadata?: Record<string, any>;
  blockchainHash?: string; // Future NFT
}

export interface UserBadge extends Badge {
  earnedDate: Date;
  context?: string; // Why it was earned
}

// ==================== JURY SYSTEM TYPES ====================

export type JuryCaseStatus = 'PENDING' | 'IN_REVIEW' | 'RESOLVED' | 'APPEALED';
export type JuryVote = 'UPHOLD' | 'VIOLATE' | 'FLAG';
export type ViolationType = 'SPAM' | 'HATE_SPEECH' | 'MISINFORMATION' | 'HARASSMENT' | 'OTHER';

export interface JuryCase {
  caseId: string;
  reportedPostId: string;
  reportedUserId: string;
  reporterId: string;
  violationType: ViolationType;
  reason: string;
  status: JuryCaseStatus;
  createdAt: Date;
  jurors: JurorAssignment[];
  verdict?: JuryVerdict;
  resolvedAt?: Date;
}

export interface JurorAssignment {
  userId: string;
  assignedAt: Date;
  votedAt?: Date;
  vote?: JuryVote;
  reasoning?: string;
}

export interface JuryVerdict {
  decision: 'GUILTY' | 'NOT_GUILTY';
  voteBreakdown: {
    uphold: number;
    violate: number;
    flag: number;
  };
  penalty?: JuryPenalty;
}

export interface JuryPenalty {
  type: 'WARNING' | 'REPUTATION_DEDUCTION' | 'TEMP_BAN' | 'PERMANENT_BAN';
  durationHours?: number;
  reputationDeduction?: number;
  reason: string;
}

// ==================== PLATFORM POINTS TYPES ====================

export interface PointTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'EARN' | 'SPEND' | 'TRANSFER';
  source: 'QUEST' | 'POST_RESONANCE' | 'JURY_SERVICE' | 'BADGE_MINT' | 'AD_REWARD';
  timestamp: Date;
  balanceAfter: number;
  metadata?: Record<string, any>;
}

export interface UserPoints {
  userId: string;
  total: number;
  available: number;
  locked: number; // For staking or pending rewards
  lifetimeEarned: number;
  lifetimeSpent: number;
}

// ==================== GRAPH QUERY RESULT TYPES ====================

export interface TagConstellationNode {
  id: string;
  name: string;
  category: TagCategory;
  x?: number;
  y?: number;
  z?: number;
  size: number; // Based on usageCount
  connections: number;
}

export interface ThreadTree {
  rootPost: Post;
  replies: Post[];
  depth: number;
  totalParticipants: number;
}

export interface UserNetwork {
  userId: string;
  followers: string[];
  following: string[];
  mutualConnections: string[];
}
