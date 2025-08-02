import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const enhancedButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl",
        quantum: "bg-gradient-to-r from-purple-600 via-cyan-500 to-yellow-500 text-white hover:from-purple-700 hover:via-cyan-600 hover:to-yellow-600 shadow-2xl border border-white/20",
        neural: "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white hover:from-slate-800 hover:via-purple-800 hover:to-slate-800 shadow-purple-500/25 shadow-lg border border-purple-400/30",
        holographic: "bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-white hover:from-cyan-500 hover:via-purple-600 hover:to-pink-600 shadow-lg hover:shadow-2xl backdrop-blur-sm",
        glass: "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 shadow-xl",
        neon: "bg-black border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-300 shadow-cyan-400/50 shadow-lg glow-animation",
        gradient: "bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 shadow-lg",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm hover:shadow-md",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm hover:shadow-md",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
        "icon-lg": "h-12 w-12",
      },
      animation: {
        none: "",
        pulse: "animate-pulse",
        bounce: "hover:animate-bounce",
        scale: "hover:scale-105 active:scale-95",
        glow: "hover:animate-pulse hover:shadow-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "scale",
    },
  }
);

export interface EnhancedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof enhancedButtonVariants> {
  asChild?: boolean;
  withMotion?: boolean;
  motionProps?: any;
}

const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ className, variant, size, animation, asChild = false, withMotion = true, motionProps, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    const buttonContent = (
      <Comp
        className={cn(enhancedButtonVariants({ variant, size, animation, className }))}
        ref={ref}
        {...props}
      >
        {/* Quantum effect overlay for quantum variant */}
        {variant === "quantum" && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        )}
        
        {/* Neural pattern for neural variant */}
        {variant === "neural" && (
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.3),transparent)] animate-pulse" />
          </div>
        )}
        
        {children}
      </Comp>
    );

    if (withMotion) {
      return (
        <motion.div
          whileHover={{ scale: animation === "scale" ? 1.05 : 1 }}
          whileTap={{ scale: animation === "scale" ? 0.95 : 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          {...motionProps}
        >
          {buttonContent}
        </motion.div>
      );
    }

    return buttonContent;
  }
);

EnhancedButton.displayName = "EnhancedButton";

export { EnhancedButton, enhancedButtonVariants };