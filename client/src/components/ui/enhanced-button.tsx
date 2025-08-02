import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button, ButtonProps } from '@/components/ui/button';

interface EnhancedButtonProps extends ButtonProps {
  variant?: 'quantum' | 'neural' | 'holographic' | 'glass' | 'neon' | 'gradient' | 'default';
  glow?: boolean;
  pulse?: boolean;
  children: React.ReactNode;
}

export function EnhancedButton({
  variant = 'default',
  glow = false,
  pulse = false,
  className,
  children,
  ...props
}: EnhancedButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'quantum':
        return 'bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white border-none shadow-lg shadow-cyan-500/25';
      case 'neural':
        return 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white border-none shadow-lg shadow-pink-500/25';
      case 'holographic':
        return 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400 text-white border-none shadow-lg shadow-purple-500/25';
      case 'glass':
        return 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 shadow-lg';
      case 'neon':
        return 'bg-transparent border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black shadow-lg shadow-cyan-400/50';
      case 'gradient':
        return 'bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black font-semibold border-none shadow-lg shadow-yellow-500/25';
      default:
        return '';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(glow && 'filter drop-shadow-2xl')}
    >
      <Button
        className={cn(
          getVariantStyles(),
          pulse && 'animate-pulse',
          'transition-all duration-300',
          className
        )}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
}