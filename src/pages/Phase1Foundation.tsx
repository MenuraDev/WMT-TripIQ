/**
 * Nothing Social - Phase 1 Foundation Implementation
 * 
 * Completed Deliverables:
 * ✅ Project setup with monorepo structure
 * ✅ Neo4j database schema with constraints and indexes
 * ✅ TypeScript type definitions aligned with graph schema
 * ✅ Neo4j connection service with connection pooling
 * ✅ Graph repository with CRUD operations for Users, Tags, Posts
 * ✅ Basic UI shell with role-based navigation
 * ✅ Component library foundation (Button, Sonner toast)
 * 
 * Next Steps for Phase 1 Completion:
 * - Backend API server (Express.js)
 * - User authentication (register, login, JWT)
 * - Tag CRUD API endpoints
 * - Basic post creation API
 * - Simple resonance system implementation
 */

import React from 'react';
import { motion } from 'motion/react';
import { Info, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface PhaseItem {
  task: string;
  status: 'completed' | 'in-progress' | 'pending';
  category: 'infrastructure' | 'database' | 'types' | 'services' | 'ui' | 'api';
}

const phase1Tasks: PhaseItem[] = [
  // Infrastructure
  { task: 'Project setup with Vite + React 19 + TypeScript', status: 'completed', category: 'infrastructure' },
  { task: 'Tailwind CSS 4.1 + shadcn/ui configuration', status: 'completed', category: 'infrastructure' },
  { task: 'Monorepo structure (src/, server/, api/, database/)', status: 'completed', category: 'infrastructure' },
  
  // Database
  { task: 'Neo4j AuraDB instance setup', status: 'pending', category: 'database' },
  { task: 'Database schema with constraints and indexes', status: 'completed', category: 'database' },
  { task: 'Graph schema migration scripts', status: 'completed', category: 'database' },
  
  // Types
  { task: 'TypeScript type definitions (User, Tag, Post, News, Campaign, Badge)', status: 'completed', category: 'types' },
  { task: 'Graph query result types', status: 'completed', category: 'types' },
  
  // Services
  { task: 'Neo4j connection service', status: 'completed', category: 'services' },
  { task: 'Graph repository with CRUD operations', status: 'completed', category: 'services' },
  { task: 'User repository methods', status: 'completed', category: 'services' },
  { task: 'Tag repository methods', status: 'completed', category: 'services' },
  { task: 'Post repository methods', status: 'completed', category: 'services' },
  
  // UI
  { task: 'App shell with role-based navigation', status: 'completed', category: 'ui' },
  { task: 'Basic UI components (Button, Sonner)', status: 'completed', category: 'ui' },
  { task: 'NothingUI component library (Glyph, DotMatrix, NewsTicker)', status: 'completed', category: 'ui' },
  
  // API (Not Yet Started)
  { task: 'Express.js server setup', status: 'pending', category: 'api' },
  { task: 'JWT authentication middleware', status: 'pending', category: 'api' },
  { task: 'User registration endpoint', status: 'pending', category: 'api' },
  { task: 'User login endpoint', status: 'pending', category: 'api' },
  { task: 'Tag CRUD API endpoints', status: 'pending', category: 'api' },
  { task: 'Post creation endpoint', status: 'pending', category: 'api' },
  { task: 'Resonance system API', status: 'pending', category: 'api' },
];

const categories = ['infrastructure', 'database', 'types', 'services', 'ui', 'api'] as const;
const categoryColors: Record<string, string> = {
  infrastructure: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  database: 'bg-green-500/20 text-green-400 border-green-500/30',
  types: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  services: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  ui: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  api: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const statusIcons = {
  completed: <CheckCircle className="w-4 h-4 text-green-400" />,
  'in-progress': <Clock className="w-4 h-4 text-yellow-400" />,
  pending: <AlertCircle className="w-4 h-4 text-gray-500" />,
};

export default function Phase1Foundation() {
  const completedCount = phase1Tasks.filter(t => t.status === 'completed').length;
  const progressPercent = (completedCount / phase1Tasks.length) * 100;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-[0.2em] uppercase glyph-glow">Phase 1: Foundation</h1>
        <p className="text-white/60">Weeks 1-3 • Core infrastructure, authentication, basic tag system</p>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Progress</span>
            <span className="font-medium">{completedCount}/{phase1Tasks.length} tasks ({progressPercent.toFixed(0)}%)</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-green-500 to-emerald-400"
            />
          </div>
        </div>
      </div>

      {/* Milestone */}
      <div className="p-4 border border-white/10 bg-white/5 rounded-lg">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-400 mt-0.5" />
          <div>
            <h3 className="font-medium text-white mb-1">Phase 1 Milestone</h3>
            <p className="text-sm text-white/60">
              Users can register, create tags, and start text-based conversations
            </p>
          </div>
        </div>
      </div>

      {/* Tasks by Category */}
      {categories.map((category) => {
        const categoryTasks = phase1Tasks.filter(t => t.category === category);
        if (categoryTasks.length === 0) return null;

        return (
          <div key={category} className="space-y-3">
            <h2 className="text-lg font-semibold uppercase tracking-wider flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-xs border ${categoryColors[category]}`}>
                {category}
              </span>
            </h2>
            
            <div className="grid gap-2">
              {categoryTasks.map((task, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-3 border rounded-lg flex items-center gap-3 ${
                    task.status === 'completed' 
                      ? 'border-green-500/30 bg-green-500/10' 
                      : task.status === 'in-progress'
                      ? 'border-yellow-500/30 bg-yellow-500/10'
                      : 'border-white/10 bg-white/5'
                  }`}
                >
                  {statusIcons[task.status]}
                  <span className={`text-sm ${
                    task.status === 'completed' 
                      ? 'text-green-300 line-through' 
                      : task.status === 'in-progress'
                      ? 'text-yellow-300'
                      : 'text-white/60'
                  }`}>
                    {task.task}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Next Steps */}
      <div className="p-6 border border-red-500/30 bg-red-500/10 rounded-lg space-y-4">
        <h2 className="text-xl font-semibold text-red-400">Critical Path Items</h2>
        <p className="text-sm text-white/60">
          The following items must be completed to finish Phase 1:
        </p>
        <ul className="space-y-2">
          {phase1Tasks.filter(t => t.status === 'pending').map((task, index) => (
            <li key={index} className="flex items-center gap-2 text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <span className="text-white/80">{task.task}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
