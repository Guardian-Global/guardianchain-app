import React from 'react';
import { cn } from '@/lib/utils';

interface CardGlassProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'quantum' | 'neural' | 'holographic';
  children: React.ReactNode;
}

export function CardGlass({ 
  className, 
  variant = 'default', 
  children, 
  ...props 
}: CardGlassProps) {
  const variants = {
    default: 'glass-effect border-white/10',
    quantum: 'quantum-field border-yellow-500/30 backdrop-blur-xl',
    neural: 'bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20 border-cyan-500/30 neural-pulse backdrop-blur-xl',
    holographic: 'holographic-glass border-white/20'
  };

  return (
    <div
      className={cn(
        'rounded-2xl border p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default CardGlass;