/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface GlyphIconProps {
  icon: LucideIcon;
  className?: string;
  size?: number;
}

export const GlyphIcon: React.FC<GlyphIconProps> = ({ 
  icon: Icon, 
  className,
  size = 20 
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "relative flex items-center justify-center",
        "transition-all duration-300",
        className
      )}
    >
      <Icon 
        size={size} 
        className={cn(
          "drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]",
          className
        )} 
      />
      <div className="absolute inset-0 bg-white/5 blur-md opacity-0 hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
};

interface DotMatrixTextProps {
  children: React.ReactNode;
  className?: string;
  animated?: boolean;
}

export const DotMatrixText: React.FC<DotMatrixTextProps> = ({ 
  children, 
  className,
  animated = true 
}) => {
  return (
    <span 
      className={cn(
        "font-mono tracking-widest",
        "bg-gradient-to-r from-white via-white/80 to-white/60 bg-clip-text text-transparent",
        animated && "animate-pulse",
        className
      )}
      style={{
        textShadow: animated ? '0 0 10px rgba(255,255,255,0.5)' : 'none'
      }}
    >
      {children}
    </span>
  );
};

interface NewsTickerProps {
  items: string[];
  speed?: number;
  className?: string;
}

export const NewsTicker: React.FC<NewsTickerProps> = ({ 
  items, 
  speed = 50,
  className 
}) => {
  const duplicatedItems = [...items, ...items];
  
  return (
    <div className={cn("overflow-hidden whitespace-nowrap relative w-64 md:w-96", className)}>
      <motion.div
        className="flex gap-8"
        animate={{ x: [0, -50] }}
        transition={{
          repeat: Infinity,
          duration: speed,
          ease: "linear"
        }}
      >
        {duplicatedItems.map((item, index) => (
          <span 
            key={index} 
            className="text-xs font-mono text-white/60 uppercase tracking-wider"
          >
            {item}
          </span>
        ))}
      </motion.div>
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
};

interface ResonanceButtonProps {
  type: 'insightful' | 'controversial' | 'actionable' | 'bridge' | 'dissonant';
  count?: number;
  onClick?: () => void;
}

const resonanceColors = {
  insightful: 'from-blue-500 to-cyan-500',
  controversial: 'from-orange-500 to-red-500',
  actionable: 'from-green-500 to-emerald-500',
  bridge: 'from-purple-500 to-pink-500',
  dissonant: 'from-gray-500 to-slate-500'
};

export const ResonanceButton: React.FC<ResonanceButtonProps> = ({ 
  type, 
  count = 0,
  onClick 
}) => {
  const labels = {
    insightful: 'Insightful',
    controversial: 'Controversial',
    actionable: 'Actionable',
    bridge: 'Bridge',
    dissonant: 'Dissonant'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider",
        "bg-gradient-to-r",
        resonanceColors[type],
        "text-white shadow-lg",
        "hover:shadow-xl transition-shadow duration-300"
      )}
    >
      {labels[type]} ({count})
    </motion.button>
  );
};

interface TagConstellationNodeProps {
  label: string;
  x: number;
  y: number;
  size?: number;
  connections?: number[];
  onClick?: () => void;
}

export const TagConstellationNode: React.FC<TagConstellationNodeProps> = ({
  label,
  x,
  y,
  size = 40,
  connections = [],
  onClick
}) => {
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
    >
      <circle
        cx={x}
        cy={y}
        r={size / 2}
        fill="rgba(255,255,255,0.1)"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1"
        className="cursor-pointer hover:fill-white/20 transition-colors"
        onClick={onClick}
      />
      <text
        x={x}
        y={y + size / 2 + 15}
        textAnchor="middle"
        className="fill-white/60 text-xs font-mono cursor-pointer hover:fill-white transition-colors"
        onClick={onClick}
      >
        {label}
      </text>
    </motion.g>
  );
};
