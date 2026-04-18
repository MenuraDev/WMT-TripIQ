# Nothing Social - Project Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Neo4j Database (v5.x recommended)
- Git

### 1. Install Dependencies

```bash
npm install
```

### 2. Neo4j Database Setup

#### Option A: Local Installation
1. Download Neo4j Desktop from https://neo4j.com/download/
2. Create a new DBMS instance
3. Start the database
4. Note your connection details (URI, username, password)

#### Option B: Docker
```bash
docker run \
  --name neo4j-nothing-social \
  -p 7474:7474 -p 7687:7687 \
  -d \
  -e NEO4J_AUTH=neo4j/password \
  neo4j:5
```

#### Initialize Schema
1. Open Neo4j Browser at http://localhost:7474
2. Copy contents from `database/schema.cypher`
3. Paste and execute in the browser console

### 3. Environment Configuration

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password
```

### 4. Start Development Server

```bash
npm run dev
```

The app will be available at http://localhost:5173

---

## 📁 Project Structure

```
/workspace
├── src/
│   ├── components/
│   │   ├── ui/              # Base UI components (buttons, inputs)
│   │   ├── layout/          # Layout components (Header, Footer)
│   │   └── features/        # Feature-specific components
│   │       ├── feed/        # Constellation feed, post composer
│   │       ├── news/        # Living news, time-travel slider
│   │       ├── ads/         # Quest campaigns, ad manager
│   │       ├── jury/        # Jury deck, voting interface
│   │       └── profile/     # User profiles, badges
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility libraries
│   ├── pages/               # Page components
│   ├── services/            # API & database services
│   │   ├── neo4j.ts         # Neo4j connection service
│   │   └── graphRepository.ts # Graph query repository
│   ├── store/               # State management (Zustand)
│   ├── types/               # TypeScript type definitions
│   ├── App.tsx              # Main application component
│   └── main.tsx             # Entry point
├── database/
│   └── schema.cypher        # Neo4j schema & seed data
├── public/                  # Static assets
├── .env.example             # Environment template
└── package.json
```

---

## 🗄️ Database Schema Overview

### Core Nodes
- **User**: Platform participants with reputation scores
- **Tag**: Contextual coordinates for content organization
- **Post**: Content blocks (text, media, polls)
- **NewsStory**: Admin-managed living news
- **NewsUpdate**: Chronological story updates
- **Campaign**: Ad campaign containers
- **Quest**: Engagement actions for rewards
- **Badge**: Reputation/soulbound tokens

### Key Relationships
- `(:User)-[:OWNS]->(:Post)`
- `(:Post)-[:TAGGED_WITH]->(:Tag)`
- `(:Post)-[:REPLY_TO]->(:Post)`
- `(:Post)-[:RESONATED_WITH {type}]->(:User)`
- `(:NewsStory)-[:HAS_UPDATE]->(:NewsUpdate)`
- `(:Campaign)-[:TARGETS]->(:Tag)`
- `(:User)-[:HAS_BADGE]->(:Badge)`

---

## 🔧 Development Commands

```bash
# Development
npm run dev              # Start Vite dev server

# Build
npm run build            # Production build
npm run preview          # Preview production build

# Linting & Formatting
npm run lint             # ESLint check
npm run format           # Prettier format

# Database
npm run db:init          # Initialize Neo4j schema
npm run db:seed          # Seed sample data

# Testing (future)
npm run test             # Run tests
npm run test:coverage    # Test with coverage
```

---

## 🎨 Design System

### Color Palette
- **Background**: `#000000` (Pure Black)
- **Foreground**: `#FFFFFF` (Pure White)
- **Accent**: `#FF0000` (Nothing Red)
- **Glass**: `rgba(255, 255, 255, 0.05)` with backdrop blur

### Typography
- **Sans**: Inter, Geist Variable
- **Mono**: JetBrains Mono, Space Mono

### Key Components
- **GlyphIcon**: Icon wrapper with glow effects
- **GlassCard**: Frosted glass containers
- **LEDStatus**: Status indicators (red/green/amber)
- **DotMatrixText**: Technical-style text

---

## 📡 API Architecture

### Service Layer
- `neo4jService`: Direct database connection
- `graphRepository`: Centralized Cypher queries

### Future Extensions
- REST API endpoints (Express)
- WebSocket server (Socket.io)
- GraphQL layer (optional)

---

## 🔐 Security Considerations

1. **Authentication**: JWT-based (to be implemented)
2. **Authorization**: Role-based access control
3. **Rate Limiting**: Configurable per endpoint
4. **Input Validation**: Zod schemas (to be added)
5. **CORS**: Restricted to allowed origins

---

## 🚧 Phase 1 Implementation Checklist

- [x] Project structure setup
- [x] Neo4j schema definition
- [x] Database service layer
- [x] Type definitions
- [ ] Basic UI components (Button, Input, Card)
- [ ] Tag constellation visualization
- [ ] Post composer with block editor
- [ ] User registration flow
- [ ] Authentication system

---

## 📚 Resources

- [Neo4j Documentation](https://neo4j.com/docs/)
- [Cypher Query Language](https://neo4j.com/docs/cypher-manual/current/)
- [React 19 Docs](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

MIT License - See LICENSE file for details
