import React from 'react';
import { cn } from '@/lib/utils';

interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
  children: React.ReactNode;
}

export default function GlowButton({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  glow = true,
  className,
  ...props 
}: GlowButtonProps) {
  const baseClasses = "relative font-semibold rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white focus:ring-blue-300",
    secondary: "bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white focus:ring-slate-300",
    accent: "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white focus:ring-green-300",
    danger: "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white focus:ring-red-300"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  const glowStyles = glow ? {
    primary: "hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]",
    secondary: "hover:shadow-[0_0_30px_rgba(100,116,139,0.5)]",
    accent: "hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]",
    danger: "hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]"
  } : {};

  return (
    <button
      {...props}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        glow && glowStyles[variant],
        className
      )}
    >
      <span className="relative z-10">{children}</span>
      {glow && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      )}
    </button>
  );
}