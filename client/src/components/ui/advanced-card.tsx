import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface AdvancedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "gradient" | "neon" | "quantum" | "neural";
  withParticles?: boolean;
  withGlow?: boolean;
  animated?: boolean;
}

const cardVariants = {
  default: "bg-card text-card-foreground shadow-md border",
  glass: "bg-white/10 backdrop-blur-md border border-white/20 shadow-xl",
  gradient: "bg-gradient-to-br from-purple-500/20 via-cyan-500/20 to-yellow-500/20 border border-white/20 shadow-lg backdrop-blur-sm",
  neon: "bg-black border-2 border-cyan-400 shadow-cyan-400/50 shadow-lg",
  quantum: "bg-gradient-to-br from-slate-900/80 via-purple-900/80 to-slate-900/80 border border-purple-400/30 shadow-purple-500/25 shadow-xl backdrop-blur-sm",
  neural: "bg-gradient-to-br from-slate-800/90 via-purple-800/90 to-slate-800/90 border border-purple-300/20 shadow-lg backdrop-blur-md",
};

const ParticleBackground: React.FC = () => {
  const particles = Array.from({ length: 20 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute w-1 h-1 bg-white/30 rounded-full"
      initial={{
        x: Math.random() * 400,
        y: Math.random() * 300,
        opacity: 0,
      }}
      animate={{
        x: Math.random() * 400,
        y: Math.random() * 300,
        opacity: [0, 1, 0],
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        repeat: Infinity,
        delay: Math.random() * 2,
      }}
    />
  ));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles}
    </div>
  );
};

const GlowEffect: React.FC<{ variant?: string }> = ({ variant }) => {
  const glowColors = {
    quantum: "bg-purple-500/20",
    neural: "bg-purple-400/15",
    neon: "bg-cyan-400/20",
    gradient: "bg-yellow-400/10",
    default: "bg-primary/10",
  };

  return (
    <div className={cn(
      "absolute -inset-1 rounded-lg blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300",
      glowColors[variant as keyof typeof glowColors] || glowColors.default
    )} />
  );
};

const AdvancedCard = React.forwardRef<HTMLDivElement, AdvancedCardProps>(
  ({ className, variant = "default", withParticles = false, withGlow = false, animated = true, children, ...props }, ref) => {
    const cardContent = (
      <div
        ref={ref}
        className={cn(
          "rounded-lg p-6 relative overflow-hidden group",
          cardVariants[variant],
          className
        )}
        {...props}
      >
        {withGlow && <GlowEffect variant={variant} />}
        {withParticles && <ParticleBackground />}
        
        {/* Quantum shimmer effect */}
        {variant === "quantum" && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        )}
        
        {/* Neural grid pattern */}
        {variant === "neural" && (
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(147,51,234,0.1)_1px,transparent_1px),linear-gradient(rgba(147,51,234,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
          </div>
        )}
        
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );

    if (animated) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {cardContent}
        </motion.div>
      );
    }

    return cardContent;
  }
);

AdvancedCard.displayName = "AdvancedCard";

const AdvancedCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-0 mb-4", className)}
      {...props}
    />
  )
);
AdvancedCardHeader.displayName = "AdvancedCardHeader";

const AdvancedCardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  )
);
AdvancedCardTitle.displayName = "AdvancedCardTitle";

const AdvancedCardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
);
AdvancedCardDescription.displayName = "AdvancedCardDescription";

const AdvancedCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-0", className)} {...props} />
  )
);
AdvancedCardContent.displayName = "AdvancedCardContent";

const AdvancedCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-0 pt-4", className)}
      {...props}
    />
  )
);
AdvancedCardFooter.displayName = "AdvancedCardFooter";

export {
  AdvancedCard,
  AdvancedCardHeader,
  AdvancedCardTitle,
  AdvancedCardDescription,
  AdvancedCardContent,
  AdvancedCardFooter,
};