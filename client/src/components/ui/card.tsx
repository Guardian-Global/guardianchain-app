import * as React from "react"
import { cn } from "@/lib/utils"

// Cyberpunk Card components with glass morphism and neon effects
export function Card({ 
  children, 
  className = "", 
  variant = "default",
  ...props 
}: {
  children: React.ReactNode,
  className?: string,
  variant?: "default" | "glass" | "neon-cyan" | "neon-magenta" | "neon-purple",
  [key: string]: any
}) {
  const variantStyles = {
    default: "bg-card text-card-foreground border border-border shadow-glass",
    glass: "bg-card/80 backdrop-blur border border-white/10 shadow-glass",
    "neon-cyan": "bg-card/80 backdrop-blur border border-neon-cyan shadow-neon text-card-foreground",
    "neon-magenta": "bg-card/80 backdrop-blur border border-pinkpunk shadow-electric text-card-foreground",
    "neon-purple": "bg-card/80 backdrop-blur border border-electric shadow-electric text-card-foreground"
  };

  return (
    <div
      className={cn(
        "rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "", ...props }: any) {
  return (
    <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "", ...props }: any) {
  return (
    <h3
      className={cn("text-2xl font-display font-semibold leading-none tracking-tight bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-purple bg-clip-text text-transparent", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = "", ...props }: any) {
  return (
    <p className={cn("text-sm text-muted-foreground font-web3", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = "", ...props }: any) {
  return (
    <div className={cn("p-6 pt-0", className)} {...props}>
      {children}
    </div>
  );
}
