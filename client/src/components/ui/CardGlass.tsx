import React from 'react';
import { cn } from '@/lib/utils';

interface CardGlassProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}

export default function CardGlass({ 
  children, 
  className,
  hover = true,
  gradient = false
}: CardGlassProps) {
  return (
    <div className={cn(
      "backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl transition-all duration-500",
      gradient 
        ? "bg-gradient-to-br from-white/10 to-white/5" 
        : "bg-white/5",
      hover && "hover:bg-white/10 hover:border-white/20 hover:shadow-[0_8px_32px_rgba(255,255,255,0.1)] hover:-translate-y-1",
      className
    )}>
      <div className="relative z-10 p-6">
        {children}
      </div>
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10 rounded-2xl" />
      )}
    </div>
  );
}