import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface FuturisticButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  glow?: boolean;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  "data-testid"?: string;
}

export default function FuturisticButton({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  glow = true,
  className,
  onClick,
  disabled,
  "data-testid": testId,
}: FuturisticButtonProps) {
  const baseClasses = "relative overflow-hidden transition-all duration-300 font-semibold uppercase tracking-wider";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-neon-cyan to-neon-purple hover:from-neon-purple hover:to-neon-cyan text-black",
    secondary: "bg-gradient-to-r from-neon-green to-neon-cyan hover:from-neon-cyan hover:to-neon-green text-black",
    danger: "bg-gradient-to-r from-red-500 to-neon-pink hover:from-neon-pink hover:to-red-500 text-white",
    success: "bg-gradient-to-r from-neon-green to-emerald-500 hover:from-emerald-500 hover:to-neon-green text-black",
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const glowClasses = glow ? {
    primary: "shadow-lg shadow-neon-cyan/30 hover:shadow-neon-purple/40",
    secondary: "shadow-lg shadow-neon-green/30 hover:shadow-neon-cyan/40",
    danger: "shadow-lg shadow-red-500/30 hover:shadow-neon-pink/40",
    success: "shadow-lg shadow-neon-green/30 hover:shadow-emerald-500/40",
  } : {};

  return (
    <Button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        glow && glowClasses[variant],
        "before:absolute before:inset-0 before:bg-white/20 before:translate-x-[-100%] before:skew-x-12 before:transition-transform before:duration-700 hover:before:translate-x-[100%]",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={onClick}
      disabled={disabled}
      data-testid={testId}
    >
      <span className="relative z-10 flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4" />}
        {children}
      </span>
    </Button>
  );
}