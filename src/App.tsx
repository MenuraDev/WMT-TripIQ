/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutGrid, 
  PenTool, 
  BarChart3, 
  Settings, 
  Users, 
  FileText, 
  Megaphone,
  LogOut,
  Menu,
  X,
  Bell
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Role } from './types';
import { GlyphIcon, DotMatrixText, NewsTicker } from './components/NothingUI';
import { Button } from '../components/ui/button';
import { Toaster } from '../components/ui/sonner';
import { toast } from 'sonner';

// Lazy load pages
const Home = React.lazy(() => import('./pages/Home'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const WriterWorkspace = React.lazy(() => import('./pages/WriterWorkspace'));
const AdManagement = React.lazy(() => import('./pages/AdManagement'));

export default function App() {
  const [role, setRole] = React.useState<Role>('guest');
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const navItems = [
    { id: 'guest', label: 'News', icon: FileText, component: Home },
    { id: 'admin', label: 'Admin', icon: LayoutGrid, component: AdminDashboard },
    { id: 'writer', label: 'Writer', icon: PenTool, component: WriterWorkspace },
    { id: 'ad_manager', label: 'Ads', icon: Megaphone, component: AdManagement },
  ];

  const CurrentPage = navItems.find(item => item.id === role)?.component || Home;

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    toast.success(`Switched to ${newRole.replace('_', ' ')} view`, {
      description: 'Role-based access updated.',
      className: 'dot-matrix'
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-white selection:text-black">
      <Toaster position="bottom-right" theme="dark" />
      
      {/* Top Header */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 sticky top-0 bg-background/80 backdrop-blur-xl z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-white/5 transition-colors"
          >
            <GlyphIcon icon={isSidebarOpen ? X : Menu} />
          </button>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-[0.2em] uppercase glyph-glow">Nothing</h1>
            <DotMatrixText className="text-[10px] opacity-50">News & Tech</DotMatrixText>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <NewsTicker items={[
            "Phone (2a) Plus available now",
            "Ear (open) sets new standard for transparency",
            "Nothing OS 3.0 Beta rollout starting soon",
            "Design Awards 2026: Nothing wins Gold"
          ]} />
          
          <div className="flex items-center gap-4 ml-4">
            <button className="relative p-2 hover:bg-white/5 transition-colors">
              <GlyphIcon icon={Bell} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-nothing-red rounded-full shadow-[0_0_8px_#ff0000]" />
            </button>
            <div className="h-8 w-[1px] bg-white/10" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center bg-white/5">
                <GlyphIcon icon={Users} className="w-4 h-4" />
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-medium uppercase tracking-wider">{role.replace('_', ' ')}</p>
                <p className="text-[10px] opacity-50 dot-matrix">Active Session</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <AnimatePresence mode="wait">
          {isSidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 240, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="h-[calc(100vh-64px)] border-r border-white/10 overflow-hidden sticky top-16 bg-background/50 backdrop-blur-sm"
            >
              <nav className="p-4 flex flex-col gap-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleRoleChange(item.id as Role)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 transition-all duration-300 group relative",
                      role === item.id ? "bg-white text-black" : "hover:bg-white/5 text-white/60 hover:text-white"
                    )}
                  >
                    <GlyphIcon icon={item.icon} className={cn(role === item.id ? "text-black" : "text-white/60 group-hover:text-white")} />
                    <span className="text-sm font-medium uppercase tracking-widest">{item.label}</span>
                    {role === item.id && (
                      <motion.div
                        layoutId="active-nav"
                        className="absolute left-0 w-1 h-full bg-nothing-red"
                      />
                    )}
                  </button>
                ))}
                
                <div className="mt-auto pt-4 border-t border-white/10">
                  <button className="flex items-center gap-3 px-4 py-3 w-full text-white/40 hover:text-white/80 transition-colors">
                    <GlyphIcon icon={Settings} />
                    <span className="text-xs uppercase tracking-widest">Settings</span>
                  </button>
                  <button className="flex items-center gap-3 px-4 py-3 w-full text-white/40 hover:text-nothing-red transition-colors">
                    <GlyphIcon icon={LogOut} />
                    <span className="text-xs uppercase tracking-widest">Sign Out</span>
                  </button>
                </div>
              </nav>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-y-auto h-[calc(100vh-64px)]">
          <React.Suspense fallback={
            <div className="flex items-center justify-center h-full">
              <div className="w-12 h-12 border-2 border-white/10 border-t-white rounded-full animate-spin" />
            </div>
          }>
            <motion.div
              key={role}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <CurrentPage />
            </motion.div>
          </React.Suspense>
        </main>
      </div>
    </div>
  );
}
