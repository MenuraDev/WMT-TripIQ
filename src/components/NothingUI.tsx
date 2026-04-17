import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { LucideIcon, Zap, Cpu } from 'lucide-react';

interface GlyphIconProps {
  icon: LucideIcon;
  className?: string;
  glow?: boolean;
}

export const GlyphIcon = ({ icon: Icon, className, glow = false }: GlyphIconProps) => {
  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <Icon className={cn("w-5 h-5 transition-all duration-300", glow && "glyph-glow")} strokeWidth={1.5} />
    </div>
  );
};

interface DotMatrixTextProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export const DotMatrixText = ({ children, className, animate = false }: DotMatrixTextProps) => {
  return (
    <span className={cn("dot-matrix", className)}>
      {animate ? (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
        >
          {children}
        </motion.span>
      ) : children}
    </span>
  );
};

export const GlassCard = ({ children, className, hover = true }: { children: React.ReactNode; className?: string; hover?: boolean }) => {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.01, backgroundColor: 'rgba(255,255,255,0.08)' } : {}}
      className={cn("glass-card p-6 relative group overflow-hidden", className)}
    >
      {/* Subtle glyph pattern on hover */}
      {hover && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none">
          <div className="absolute top-2 right-2"><GlyphIcon icon={Zap} /></div>
          <div className="absolute bottom-2 left-2"><GlyphIcon icon={Cpu} /></div>
        </div>
      )}
      {children}
    </motion.div>
  );
};

export const NewsTicker = ({ items }: { items: string[] }) => {
  return (
    <div className="led-ticker">
      <motion.div
        animate={{ x: [0, -1000] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="inline-block"
      >
        {items.map((item, i) => (
          <span key={i} className="mx-8 dot-matrix text-sm text-white/80">
            <span className="text-nothing-red mr-2">●</span>
            {item}
          </span>
        ))}
        {/* Duplicate for seamless loop */}
        {items.map((item, i) => (
          <span key={`dup-${i}`} className="mx-8 dot-matrix text-sm text-white/80">
            <span className="text-nothing-red mr-2">●</span>
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export const LEDStatus = ({ status }: { status: 'red' | 'green' | 'amber' }) => {
  const colors = {
    red: 'bg-red-500 shadow-[0_0_8px_#ef4444]',
    green: 'bg-green-500 shadow-[0_0_8px_#22c55e]',
    amber: 'bg-amber-500 shadow-[0_0_8px_#f59e0b]'
  };
  return <div className={cn("w-2 h-2 rounded-full", colors[status])} />;
};
