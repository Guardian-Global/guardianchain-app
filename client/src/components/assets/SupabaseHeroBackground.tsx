import React from "react";
import { useHeroAssets, useBackgroundAssets } from "@/hooks/useSupabaseAssets";

interface SupabaseHeroBackgroundProps {
  children: React.ReactNode;
  overlay?: boolean;
  className?: string;
  fallbackGradient?: string;
}

export function SupabaseHeroBackground({
  children,
  overlay = true,
  className = "",
  fallbackGradient = "from-slate-900 via-purple-900/20 to-slate-900",
}: SupabaseHeroBackgroundProps) {
  const { heroAssets } = useHeroAssets();
  const { backgroundAssets } = useBackgroundAssets();

  // Get the highest value hero or background asset
  const backgroundAsset = heroAssets[0] || backgroundAssets[0];

  const backgroundStyle = backgroundAsset
    ? {
        backgroundImage: `url(${backgroundAsset.url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }
    : {};

  return (
    <div
      className={`relative min-h-screen ${!backgroundAsset ? `bg-gradient-to-br ${fallbackGradient}` : ""} ${className}`}
      style={backgroundStyle}
    >
      {/* Overlay */}
      {overlay && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default SupabaseHeroBackground;
