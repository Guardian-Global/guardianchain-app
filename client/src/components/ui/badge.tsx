import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Cyberpunk Badge component with neon glow effects
const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-quantum font-semibold transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/80 shadow-neon animate-glow-pulse",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/80 shadow-neon-magenta",
        outline: "text-foreground border border-neon-cyan shadow-neon",
        "neon-cyan": "bg-gradient-to-r from-neon-cyan/20 to-neon-cyan/10 text-neon-cyan border border-neon-cyan shadow-neon animate-glow-pulse",
        "neon-magenta": "bg-gradient-to-r from-neon-magenta/20 to-neon-magenta/10 text-neon-magenta border border-neon-magenta shadow-neon-magenta animate-glow-pulse",
        "neon-purple": "bg-gradient-to-r from-neon-purple/20 to-neon-purple/10 text-neon-purple border border-neon-purple shadow-neon-purple animate-glow-pulse",
        "neon-green": "bg-gradient-to-r from-neon-green/20 to-neon-green/10 text-neon-green border border-neon-green shadow-neon animate-glow-pulse",
        "animated": "bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-purple bg-[length:200%_200%] animate-gradient-shift text-white shadow-2xl animate-pulse",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
