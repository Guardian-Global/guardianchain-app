import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GlowButtonProps extends ButtonProps {
  glowColor?: 'blue' | 'purple' | 'cyan' | 'yellow' | 'green' | 'red';
  intensity?: 'low' | 'medium' | 'high';
}

export function GlowButton({ 
  className, 
  glowColor = 'cyan', 
  intensity = 'medium',
  children,
  ...props 
}: GlowButtonProps) {
  const glowColors = {
    blue: 'shadow-blue-500/50 hover:shadow-blue-500/75',
    purple: 'shadow-purple-500/50 hover:shadow-purple-500/75',
    cyan: 'shadow-cyan-500/50 hover:shadow-cyan-500/75',
    yellow: 'shadow-yellow-500/50 hover:shadow-yellow-500/75',
    green: 'shadow-green-500/50 hover:shadow-green-500/75',
    red: 'shadow-red-500/50 hover:shadow-red-500/75'
  };

  const intensities = {
    low: 'shadow-lg',
    medium: 'shadow-xl',
    high: 'shadow-2xl'
  };

  return (
    <Button
      className={cn(
        'relative overflow-hidden transform hover:scale-105 transition-all duration-300 font-web3',
        'bg-gradient-to-r from-gray-900 to-black border border-white/20',
        'hover:border-white/40 text-white',
        intensities[intensity],
        glowColors[glowColor],
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700" />
    </Button>
  );
}

export default GlowButton;