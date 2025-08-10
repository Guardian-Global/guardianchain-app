import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-base font-bold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow-lg",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-black neon-glow hover:from-cyan-300 hover:to-pink-400 border-glow",
        destructive:
          "bg-gradient-to-r from-red-500 to-pink-500 text-white neon-glow border-glow hover:from-red-400 hover:to-pink-400",
        outline:
          "border-2 border-cyan-400 bg-background/80 text-cyan-200 hover:bg-cyan-900/10 glass-morphism",
        secondary:
          "bg-gradient-to-r from-purple-700 to-cyan-700 text-white neon-glow border-glow-purple",
        ghost: "hover:bg-cyan-900/10 text-cyan-300",
        link: "text-cyan-400 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-6 py-3 text-lg",
        sm: "h-10 rounded-lg px-4 text-base",
        lg: "h-14 rounded-2xl px-10 text-xl",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
