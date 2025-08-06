import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface EnhancedButtonProps extends Omit<ButtonProps, 'variant' | 'size'> {
  variant?: 'quantum' | 'neural' | 'holographic' | 'glass' | 'neon' | 'gradient' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  glow?: boolean;
  pulse?: boolean;
  shimmer?: boolean;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles = {
  quantum: 'quantum-field text-black font-quantum border-0 shadow-lg shadow-yellow-500/25',
  neural: 'bg-gradient-to-br from-purple-600/80 to-blue-600/80 text-white font-cyber border border-cyan-500/30 neural-pulse',
  holographic: 'holographic-glass text-cyan-300 font-web3 border border-white/20 backdrop-blur-xl',
  glass: 'glass-effect text-white font-web3 border border-white/10 backdrop-blur-lg',
  neon: 'bg-black text-cyan-400 font-cyber border-2 border-cyan-400/50 shadow-lg shadow-cyan-400/25',
  gradient: 'bg-gradient-to-r from-cyan-500 via-purple-500 to-yellow-500 text-black font-quantum border-0',
  outline: 'bg-transparent text-cyan-300 font-cyber border-2 border-cyan-500/50 hover:bg-cyan-500/10'
};

const sizeStyles = {
  xs: 'px-3 py-1.5 text-xs',
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
  xl: 'px-12 py-6 text-xl'
};

export function EnhancedButton({
  className,
  variant = 'quantum',
  size = 'md',
  glow = false,
  pulse = false,
  shimmer = false,
  icon,
  rightIcon,
  children,
  ...props
}: EnhancedButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Button
        className={cn(
          'relative overflow-hidden transition-all duration-300 font-medium',
          'transform hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-offset-2',
          variantStyles[variant],
          sizeStyles[size],
          glow && 'animate-glow-pulse',
          pulse && 'animate-pulse',
          shimmer && 'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700',
          className
        )}
        {...props}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {children}
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </span>
        {shimmer && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700" />
        )}
      </Button>
    </motion.div>
  );
}

export default EnhancedButton;