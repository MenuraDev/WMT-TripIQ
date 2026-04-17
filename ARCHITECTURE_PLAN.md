# Context-First Social Ecosystem: Technical Architecture & Implementation Plan

## Executive Summary

Transforming "Nothing News" from a static news platform into a **dynamic, tag-based social ecosystem** where users create conversations around contextual coordinates, admins curate living news with temporal layers, and advertisers run intelligent, time-aware campaigns.

---

## 1. Core Architectural Shifts

### 1.1 From Hierarchical to Graph-Based Data Model

**Current State:** Relational-style mock data (articles, writers, campaigns)  
**Target State:** Graph database architecture for tag-conversation relationships

```
User --[CREATES]--> Conversation <--[TAGGED_WITH]--> Tag
                         |
                    [CONTAINS]--> Block (Text/Image/Video/Poll)
                         |
                    [RECEIVES]--> Reaction (Insightful/Controversial/Actionable)
                         |
                    [HAS_REPLY]--> Reply (nested blocks)
```

### 1.2 Technology Stack Evolution

| Layer | Current | Proposed Addition | Rationale |
|-------|---------|-------------------|-----------|
| **Database** | None (mock) | **Neo4j** (AuraDB Cloud) | Native graph queries for tag traversal |
| **Storage** | External URLs | **IPFS + Pinata** | Decentralized media, user ownership |
| **Real-time** | None | **Socket.io** | Live reactions, comment streaming |
| **Search** | None | **MeiliSearch** | Fuzzy tag/content discovery |
| **AI Layer** | Prepared (@google/genai) | **LangChain + Gemini** | Summarization, toxicity detection, bridge-building |
| **Auth** | Role switcher | **Clerk** or **NextAuth** | Soulbound badges, reputation tracking |
| **Frontend** | React 19 + Vite | Keep + Add **React Query** | Caching, optimistic updates |
| **State** | Local state | **Zustand** | Global conversation/reputation state |

---

## 2. Detailed Feature Specifications

### 2.1 Conversation Engine: Tag-Based Architecture

#### 2.1.1 Tag System Design

**Tag Types:**
- **System Tags**: Predefined categories (e.g., `#Technology`, `#Design`, `#Debate`)
- **User Tags**: Created by users, require 3+ uses to become "established"
- **Ephemeral Tags**: Auto-expire after 7 days unless adopted
- **Fusion Tags**: Combined tags create unique contexts (`#AI+#Ethics+#Policy` = distinct space)

**Tag Metadata:**
```typescript
interface Tag {
  id: string;
  name: string;
  slug: string;
  type: 'system' | 'user' | 'ephemeral' | 'fusion';
  createdAt: Date;
  usageCount: number;
  relatedTags: string[]; // Graph edges
  trendingScore: number; // Algorithmic velocity
  moderators: string[]; // High-rep users in this tag
}
```

#### 2.1.2 Conversation Structure

**Block-Based Content Model:**
```typescript
interface ConversationBlock {
  id: string;
  type: 'text' | 'image' | 'video' | 'poll' | 'code' | 'embed';
  content: string; // Markdown for text, URL for media
  metadata?: {
    duration?: number; // Video length
    options?: string[]; // Poll choices
    language?: string; // Code syntax
  };
  order: number;
}

interface Conversation {
  id: string;
  authorId: string;
  title: string;
  blocks: ConversationBlock[];
  tags: string[]; // Tag IDs
  type: 'pulse' | 'archive'; // 24h ephemeral vs permanent
  createdAt: Date;
  updatedAt: Date;
  metrics: {
    views: number;
    resonance: {
      insightful: number;
      controversial: number;
      actionable: number;
      bridge: number; // AI-detected common ground
    };
    replyCount: number;
    shareCount: number;
  };
  status: 'active' | 'archived' | 'flagged';
}
```

#### 2.1.3 Resonance Metrics (Beyond Like/Dislike)

**Reaction Types:**
- 💡 **Insightful**: Added new perspective
- 🔥 **Controversial**: Provokes important debate
- ✅ **Actionable**: Practical takeaways
- 🌉 **Bridge**: Finds common ground (AI-assisted)
- ⚠️ **Needs Citation**: Claims require sources (community moderation)

**Reputation Impact:**
- Reactions weighted by responder's tag-domain reputation
- Users earn "Soulbound Badges" per tag (non-transferable)
- Badge levels: Novice → Contributor → Expert → Steward

#### 2.1.4 Visual Reply Trees

**Mind-Map Visualization:**
- Nested replies rendered as expandable branches
- Color-coded by reaction type (green=insightful, red=controversial)
- Collapse/expand by sentiment clusters
- "TL;DR" AI summary for long branches

---

### 2.2 Living News Section: Temporal Layers

#### 2.2.1 Update Stream Architecture

**Single Story, Multiple Versions:**
```typescript
interface NewsStory {
  id: string;
  headline: string;
  adminAuthorId: string;
  timeline: NewsVersion[];
  currentVersionId: string;
  predictions: Prediction[];
  communityAnnotations: Annotation[];
}

interface NewsVersion {
  version: number;
  timestamp: Date;
  content: string;
  changeSummary: string; // What changed and why
  sources: string[];
  editorNote?: string;
}

interface Prediction {
  id: string;
  question: string;
  options: string[];
  resolvedOption?: string;
  userBets: { userId: string; option: string; confidence: number }[];
  resolutionDate?: Date;
}
```

#### 2.2.2 Time-Travel Slider Interface

**UX Features:**
- Horizontal timeline scrubber at bottom of news article
- Drag to see how story evolved (version N → N-1 → N-2)
- Visual diff highlighting added/removed content
- "What We Knew When" mode: Shows only info available at selected date

#### 2.2.3 Community Validation Layer

**Annotation System:**
- High-reputation users can add contextual notes
- Annotations appear as marginalia (side-panel)
- Upvoted annotations become "Community Context"
- Disputed claims get fact-check flags

#### 2.2.4 Prediction Markets

**Interactive Outcomes:**
- Admins attach prediction polls to developing stories
- Users "bet" reputation points (not real money)
- Automatic resolution when outcome confirmed
- Leaderboard for top predictors per category

---

### 2.3 Ad Campaign System: Value Exchange Model

#### 2.3.1 Quest-Based Advertising

**Native Integration:**
```typescript
interface AdQuest {
  id: string;
  campaignId: string;
  title: string;
  description: string;
  requiredTags: string[]; // Show only in relevant conversations
  actionType: 'watch_video' | 'answer_poll' | 'visit_link' | 'share';
  reward: {
    type: 'reputation' | 'badge' | 'token';
    amount: number;
  };
  completionLimit: number; // Max completions per user
  expiresAt: Date;
}
```

**Example:** 
- Tag: `#Fitness` conversation
- Quest: "Watch this 30s workout tip, answer 1 question"
- Reward: 50 reputation points in `#Fitness` tag domain

#### 2.3.2 Temporal Targeting

**Time-Aware Delivery:**
```typescript
interface TemporalRule {
  daysOfWeek: number[]; // 0-6
  hoursStart: number; // 0-23
  hoursEnd: number;
  timezone: string;
  userLocalTime: boolean; // Use user's timezone vs campaign timezone
}

// Example: Coffee brand ads 7-9 AM local time
{
  daysOfWeek: [1, 2, 3, 4, 5],
  hoursStart: 7,
  hoursEnd: 9,
  timezone: 'UTC',
  userLocalTime: true
}
```

#### 2.3.3 Attention Dividend

**User Rewards:**
- Users earn micro-rewards for genuine ad engagement (>15s view, poll completion)
- Rewards convertible to:
  - Platform reputation boosts
  - Premium features (custom themes, analytics)
  - Charity donations (platform matches)
- Anti-fraud: AI detects bot-like behavior, throttles rewards

#### 2.3.4 Dynamic Creative Optimization (DCO)

**Sentiment-Aware Ads:**
- AI analyzes conversation sentiment in real-time
- Ad creative adjusts tone to match context
  - Serious discussion → Informative ad variant
  - Celebratory thread → Enthusiastic variant
- A/B testing per tag environment

---

## 3. Database Schema (Neo4j Graph Model)

### 3.1 Node Labels

```cypher
(:User {
  id, username, email, reputationScore, joinedAt, 
  soulboundBadges: ['badge_id1', 'badge_id2']
})

(:Tag {
  id, name, slug, type, usageCount, trendingScore
})

(:Conversation {
  id, title, type, createdAt, updatedAt, status,
  viewCount, replyCount
})

(:Block {
  id, type, content, order, metadata
})

(:Reaction {
  id, type, createdAt
})

(:NewsStory {
  id, headline, currentVersionId, createdAt
})

(:NewsVersion {
  id, version, content, timestamp, changeSummary
})

(:AdCampaign {
  id, name, status, budget, startDate, endDate
})

(:AdQuest {
  id, title, actionType, rewardAmount, expiresAt
})
```

### 3.2 Relationship Types

```cypher
(:User)-[:CREATED]->(:Conversation)
(:User)-[:AUTHORED]->(:Block)
(:User)-[:REACTED {type: 'insightful'}]->(:Conversation)
(:User)-[:FOLLOWS]->(:Tag)
(:User)-[:EARNED]->(:Badge)

(:Conversation)-[:TAGGED_WITH]->(:Tag)
(:Conversation)-[:CONTAINS]->(:Block)
(:Conversation)-[:HAS_REPLY {parentBlockId}]->(:Block)

(:Tag)-[:RELATED_TO {strength}]->(:Tag) // Co-occurrence weight

(:NewsStory)-[:HAS_VERSION]->(:NewsVersion)
(:User)-[:ANNOTATED]->(:NewsVersion)
(:User)-[:PREDICTED {option, confidence}]->(:Prediction)

(:AdCampaign)-[:HAS_QUEST]->(:AdQuest)
(:AdQuest)-[:TARGETS_TAG]->(:Tag)
(:User)-[:COMPLETED]->(:AdQuest)
```

### 3.3 Key Graph Queries

**Find Related Conversations by Tag Fusion:**
```cypher
MATCH (c:Conversation)-[:TAGGED_WITH]->(t:Tag)
WHERE t.name IN ['AI', 'Ethics', 'Policy']
WITH c, count(t) as tagMatchCount
WHERE tagMatchCount >= 2
RETURN c ORDER BY c.metrics.resonance.insightful DESC
LIMIT 10
```

**Calculate User Reputation in Tag Domain:**
```cypher
MATCH (u:User)-[:CREATED]->(c:Conversation)-[:TAGGED_WITH]->(t:Tag {name: 'AI'})
MATCH (c)<-[:REACTED {type: 'insightful'}]-(other:User)
RETURN u, sum(other.reputationScore) as domainReputation
```

**Find Trending Tag Fusions:**
```cypher
MATCH (t1:Tag)<-[:TAGGED_WITH]-(c:Conversation)-[:TAGGED_WITH]->(t2:Tag)
WHERE t1 <> t2 AND c.createdAt > datetime() - duration({hours: 24})
WITH t1.name + '+' + t2.name as fusion, count(c) as frequency
RETURN fusion, frequency ORDER BY frequency DESC LIMIT 5
```

---

## 4. API Architecture

### 4.1 RESTful Endpoints (Express.js)

```
POST   /api/auth/register          # User registration
POST   /api/auth/login             # JWT authentication
GET    /api/tags                   # List all tags (with filters)
POST   /api/tags                   # Create new tag
GET    /api/tags/:slug/conversations  # Conversations in tag
POST   /api/conversations          # Create conversation
GET    /api/conversations/:id      # Get conversation with blocks
PATCH  /api/conversations/:id      # Update conversation
POST   /api/conversations/:id/blocks   # Add content block
POST   /api/conversations/:id/reactions # Add resonance reaction
GET    /api/users/:id/reputation   # Get user reputation by tag

GET    /api/news                   # List news stories
GET    /api/news/:id/timeline      # Get version history
POST   /api/news/:id/predictions   # Submit prediction
GET    /api/news/:id/annotations   # Get community annotations

GET    /api/ads/campaigns          # List active campaigns
POST   /api/ads/quests/complete    # Submit quest completion
GET    /api/ads/user/rewards       # Get user's earned rewards
```

### 4.2 WebSocket Events (Socket.io)

```javascript
// Client → Server
socket.emit('conversation:join', { conversationId });
socket.emit('reaction:add', { conversationId, type: 'insightful' });
socket.emit('block:create', { conversationId, blockData });

// Server → Client
socket.on('reaction:update', { conversationId, metrics });
socket.on('reply:new', { conversationId, replyData });
socket.on('quest:available', { questData }); // Real-time ad quest
socket.on('news:update', { storyId, newVersion }); // Breaking news alert
```

---

## 5. Frontend Component Architecture

### 5.1 New Page Structure

```
src/pages/
├── Home.tsx                  → Becomes: FeedDashboard.tsx
├── AdminDashboard.tsx        → Enhanced with news timeline editor
├── WriterWorkspace.tsx       → Becomes: ConversationComposer.tsx
├── AdManagement.tsx          → Enhanced with quest builder
├── TagExplorer.tsx           → NEW: Visual tag constellation map
├── NewsTimeline.tsx          → NEW: Living news with time-travel slider
├── UserProfile.tsx           → NEW: Reputation dashboard & badges
└── QuestBoard.tsx            → NEW: Available ad quests
```

### 5.2 Key New Components

**TagConstellation.tsx**
- D3.js force-directed graph of tags
- Node size = usage count, color = trending velocity
- Click to navigate, drag to explore relationships

**ConversationComposer.tsx**
- Block-based editor (add text/image/video/poll blocks)
- Tag selector with autocomplete + creation
- Toggle: Pulse (24h) vs Archive (permanent)
- Preview mode with resonance metric simulation

**ResonanceMeter.tsx**
- Animated visualization of reaction distribution
- Pie chart: Insightful/Controversial/Actionable/Bridge
- Hover to see top contributors per reaction type

**TimeTravelSlider.tsx**
- Horizontal timeline with version markers
- Drag handle to scrub through story history
- Diff viewer showing content changes
- "Freeze Frame" mode: Lock to historical version

**QuestCard.tsx**
- Ad quest display with progress indicator
- Timer for limited-time quests
- Reward preview (reputation/badge/token)
- One-click completion for simple actions

---

## 6. AI Integration Strategy

### 6.1 LangChain Pipeline

**Modules:**

1. **Toxicity Shield** (Pre-post)
   - Analyzes draft for harmful content
   - Suggests constructive rephrasing
   - Flags for human review if confidence > 80%

2. **TL;DR Generator** (Post-creation)
   - Summarizes long conversation threads
   - Updates dynamically as new replies arrive
   - Provides "Key Points" bullet list

3. **Bridge Builder** (During disputes)
   - Detects polarized reply chains
   - Identifies shared premises
   - Generates: "Both sides agree that..." prompt

4. **Sentiment Analyzer** (For DCO ads)
   - Real-time conversation mood detection
   - Returns: { sentiment: 'serious' | 'celebratory' | 'neutral', confidence }
   - Triggers ad creative swap via WebSocket

### 6.2 Implementation Example

```typescript
import { GoogleGenerativeAI } from '@google/genai';
import { ConversationBlock } from './types';

async function generateThreadSummary(blocks: ConversationBlock[]): Promise<string> {
  const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = ai.getGenerativeModel({ model: 'gemini-pro' });
  
  const textBlocks = blocks
    .filter(b => b.type === 'text')
    .map(b => b.content)
    .join('\n---\n');
  
  const prompt = `Summarize this conversation thread in 3 bullet points. 
  Identify the main question, key arguments, and any consensus reached.
  
  ${textBlocks}`;
  
  const result = await model.generateContent(prompt);
  return result.response.text();
}
```

---

## 7. Implementation Roadmap

### Phase 1: Foundation (Weeks 1-3)
- [ ] Set up Neo4j AuraDB instance
- [ ] Implement Clerk authentication
- [ ] Create basic graph schema migration scripts
- [ ] Build Tag CRUD API endpoints
- [ ] Develop TagConstellation visualization component

### Phase 2: Conversations (Weeks 4-6)
- [ ] Block-based conversation composer
- [ ] Resonance reaction system
- [ ] Real-time WebSocket integration (Socket.io)
- [ ] Reply tree visualization (mind-map view)
- [ ] User profile with reputation display

### Phase 3: Living News (Weeks 7-8)
- [ ] News story versioning system
- [ ] Time-travel slider UI component
- [ ] Community annotation marginalia
- [ ] Prediction market mechanics
- [ ] Admin timeline editor

### Phase 4: Ad Ecosystem (Weeks 9-10)
- [ ] Quest-based ad campaign builder
- [ ] Temporal targeting engine
- [ ] Attention dividend reward tracker
- [ ] DCO sentiment analysis integration
- [ ] QuestBoard component

### Phase 5: AI Polish (Weeks 11-12)
- [ ] Toxicity shield pre-post filter
- [ ] TL;DR auto-summaries
- [ ] Bridge builder for disputes
- [ ] Sentiment-aware ad delivery
- [ ] Performance optimization & caching

---

## 8. Security & Moderation

### 8.1 Content Moderation Pipeline

```
User Draft → Toxicity AI Check → 
  ├─ Safe: Auto-publish
  ├─ Borderline: Queue for human review + notify user
  └─ Harmful: Reject + educational message + strike record
```

### 8.2 Rate Limiting

- **New users** (<7 days): 5 conversations/day, 20 replies/day
- **Established users**: 20 conversations/day, 100 replies/day
- **Tag stewards**: Unlimited in their domain
- Adaptive limits based on community reports

### 8.3 Data Privacy

- GDPR compliance: Right to deletion, data export
- Encrypted media storage (IPFS + encryption layer)
- Anonymous reaction aggregation (no public reaction-by-user)
- Opt-in for AI analysis (users can disable summarization)

---

## 9. Success Metrics

| Metric | Target (3 months) | Measurement |
|--------|------------------|-------------|
| **Daily Active Users** | 5,000 | Unique logins/day |
| **Conversations Created** | 500/day | New conversations |
| **Tag Adoption Rate** | 40% | Users creating/following tags |
| **Average Session Duration** | 12 minutes | Time on platform |
| **Resonance Engagement** | 60% | Users giving reactions |
| **Quest Completion Rate** | 25% | Ad quests completed/impressions |
| **News Return Visitors** | 35% | Users checking story updates |
| **Toxicity Reduction** | 70% | Flagged content vs total |

---

## 10. Next Steps

### Immediate Actions:
1. **Approve architecture plan** (this document)
2. **Set up development environment:**
   ```bash
   npm install neo4j-driver socket.io-client @clerk/clerk-react meilisearch zustand
   ```
3. **Create Neo4j AuraDB free tier account**
4. **Configure Clerk application**
5. **Begin Phase 1 implementation**

### Open Questions for Your Input:
1. **Token economics**: Should attention dividends be tradable tokens or platform-only points?
2. **Moderation appeals**: Should there be a community jury system for disputed flags?
3. **News monetization**: Should premium news tiers exist (ad-free, early access)?
4. **Badge portability**: Should soulbound badges be NFTs on a testnet for future interoperability?

---

## Appendix A: File Structure (Proposed)

```
/workspace
├── src/
│   ├── App.tsx                    # Updated with new routes
│   ├── types.ts                   # Expanded type definitions
│   ├── constants.ts               # Reduced to system defaults
│   ├── lib/
│   │   ├── neo4j.ts               # Database connection
│   │   ├── socket.ts              # WebSocket client
│   │   ├── ai.ts                  # LangChain pipelines
│   │   └── utils.ts
│   ├── hooks/
│   │   ├── useConversation.ts
│   │   ├── useReputation.ts
│   │   ├── useTagGraph.ts
│   │   └── useQuests.ts
│   ├── components/
│   │   ├── NothingUI.tsx          # Keep existing themed components
│   │   ├── TagConstellation.tsx   # NEW
│   │   ├── ConversationComposer.tsx # NEW
│   │   ├── ResonanceMeter.tsx     # NEW
│   │   ├── TimeTravelSlider.tsx   # NEW
│   │   ├── QuestCard.tsx          # NEW
│   │   └── MindMapReplies.tsx     # NEW
│   └── pages/
│       ├── FeedDashboard.tsx      # Renamed from Home
│       ├── TagExplorer.tsx        # NEW
│       ├── ConversationView.tsx   # NEW
│       ├── NewsTimeline.tsx       # NEW
│       ├── AdminDashboard.tsx     # Enhanced
│       ├── UserProfile.tsx        # NEW
│       └── QuestBoard.tsx         # NEW
├── server/
│   ├── index.ts                   # Express + Socket.io server
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── tags.ts
│   │   ├── conversations.ts
│   │   ├── news.ts
│   │   └── ads.ts
│   ├── neo4j/
│   │   ├── schema.cypher          # Database initialization
│   │   └── queries.ts             # Reusable query functions
│   └── ai/
│       ├── toxicity.ts
│       ├── summarization.ts
│       └── bridge-builder.ts
├── package.json                   # Updated dependencies
└── .env.example                   # Environment variable template
```

---

**Document Version:** 1.0  
**Last Updated:** 2026-04-11  
**Status:** Ready for Implementation Planning
