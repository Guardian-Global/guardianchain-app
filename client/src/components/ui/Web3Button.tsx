import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Web3ButtonProps extends ButtonProps {
  web3Variant?: 'quantum' | 'neural' | 'holographic' | 'truth' | 'blockchain';
  glowEffect?: boolean;
}

export function Web3Button({ 
  className, 
  web3Variant = 'quantum', 
  glowEffect = true,
  children,
  ...props 
}: Web3ButtonProps) {
  const web3Variants = {
    quantum: 'bg-gradient-to-r from-purple-600 via-cyan-500 to-yellow-500 hover:from-purple-700 hover:via-cyan-600 hover:to-yellow-600 text-black font-quantum',
    neural: 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white neural-pulse',
    holographic: 'holographic-glass text-white border-white/30 hover:border-white/50',
    truth: 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold',
    blockchain: 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
  };

  const glowClasses = glowEffect ? 'shadow-2xl hover:shadow-cyan-500/25 transition-shadow duration-300' : '';

  return (
    <Button
      className={cn(
        'relative overflow-hidden transform hover:scale-105 transition-all duration-300 font-web3',
        web3Variants[web3Variant],
        glowClasses,
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      {glowEffect && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700" />
      )}
    </Button>
  );
}

export default Web3Button;