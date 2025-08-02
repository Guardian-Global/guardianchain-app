import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AdvancedCardProps {
  variant?: 'quantum' | 'neural' | 'holographic' | 'glass' | 'gradient' | 'minimal';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  glow?: boolean;
  hover?: boolean;
  border?: boolean;
  children: React.ReactNode;
  className?: string;
}

const variantStyles = {
  quantum: 'quantum-field backdrop-blur-xl border border-yellow-500/30',
  neural: 'bg-gradient-to-br from-purple-900/40 via-blue-900/40 to-cyan-900/40 backdrop-blur-xl border border-cyan-500/30 neural-pulse',
  holographic: 'holographic-glass backdrop-blur-xl border border-white/20',
  glass: 'glass-effect backdrop-blur-lg border border-white/10',
  gradient: 'bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-yellow-500/10 backdrop-blur-xl border border-gradient',
  minimal: 'bg-white/5 backdrop-blur-sm border border-white/5'
};

const sizeStyles = {
  sm: 'p-4 rounded-lg',
  md: 'p-6 rounded-xl',
  lg: 'p-8 rounded-2xl',
  xl: 'p-12 rounded-3xl'
};

export function AdvancedCard({
  className,
  variant = 'quantum',
  size = 'md',
  glow = false,
  hover = true,
  border = true,
  children
}: AdvancedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={hover ? { scale: 1.02, y: -5 } : undefined}
      className={cn(
        'relative transition-all duration-300',
        variantStyles[variant],
        sizeStyles[size],
        glow && 'shadow-2xl',
        hover && 'hover:shadow-3xl',
        className
      )}
    >
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden rounded-inherit">
        <div className="absolute -top-4 -left-4 w-8 h-8 bg-cyan-400/20 rounded-full animate-float" />
        <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-purple-400/20 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 -left-2 w-4 h-4 bg-yellow-400/20 rounded-full animate-float" style={{ animationDelay: '2s' }} />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Glow Effect */}
      {glow && (
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-yellow-500/20 blur-xl rounded-inherit" />
      )}
    </motion.div>
  );
}

export default AdvancedCard;