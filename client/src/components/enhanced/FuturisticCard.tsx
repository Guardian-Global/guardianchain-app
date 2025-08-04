import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FuturisticCardProps {
  children: React.ReactNode;
  title?: string;
  variant?: "glass" | "cosmic" | "neon" | "quantum";
  glow?: boolean;
  className?: string;
  "data-testid"?: string;
}

export default function FuturisticCard({
  children,
  title,
  variant = "glass",
  glow = true,
  className,
  "data-testid": testId,
}: FuturisticCardProps) {
  const variantClasses = {
    glass: "bg-glass-light backdrop-blur-xl border-white/10",
    cosmic: "bg-gradient-to-br from-cosmic-deep to-cosmic-nebula border-cosmic-border",
    neon: "bg-cosmic-surface border-neon-cyan/30",
    quantum: "bg-gradient-to-br from-cosmic-void to-cosmic-surface border-neon-purple/30",
  };

  const glowClasses = glow ? {
    glass: "shadow-xl shadow-neon-cyan/10",
    cosmic: "shadow-xl shadow-neon-purple/20",
    neon: "shadow-xl shadow-neon-cyan/30 border-glow",
    quantum: "shadow-xl shadow-neon-purple/30 border-glow-purple",
  } : {};

  return (
    <Card
      className={cn(
        "transition-all duration-300 hover:scale-[1.02]",
        variantClasses[variant],
        glow && glowClasses[variant],
        className
      )}
      data-testid={testId}
    >
      {title && (
        <CardHeader>
          <CardTitle className="text-gradient-quantum font-display text-xl">
            {title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={title ? "pt-0" : "p-6"}>
        {children}
      </CardContent>
    </Card>
  );
}