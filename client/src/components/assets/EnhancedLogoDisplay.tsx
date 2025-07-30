import React from "react";
import { Shield } from "lucide-react";

interface EnhancedLogoDisplayProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "full" | "icon" | "text";
  className?: string;
  showFallback?: boolean;
}

export function EnhancedLogoDisplay({
  size = "md",
  variant = "full",
  className = "",
  showFallback = true
}: EnhancedLogoDisplayProps) {
  // Use local assets from public/assets/
  const guardianChainLogo = "/assets/GUARDIANCHAIN_logo.png";
  const gttLogo = "/assets/GTT_logo.png";

  // Size classes
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8", 
    lg: "h-12 w-12",
    xl: "h-16 w-16"
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
    xl: "text-2xl"
  };

  // Fallback component
  const FallbackLogo = () => (
    <div className={`${sizeClasses[size]} bg-gradient-to-r from-purple-600 to-green-600 rounded-lg flex items-center justify-center ${className}`}>
      <Shield className="text-white h-4/5 w-4/5" />
    </div>
  );

  const BrandText = () => (
    <span className={`font-bold ${textSizeClasses[size]}`}>
      <span className="text-purple-400">GUARDIAN</span>
      <span className="text-green-400">CHAIN</span>
    </span>
  );

  // Use local GUARDIANCHAIN logo
  return (
    <div className="flex items-center space-x-2">
      {(variant === "full" || variant === "icon") && (
        <img
          src={guardianChainLogo}
          alt="GUARDIANCHAIN Logo"
          className={`${sizeClasses[size]} object-contain ${className}`}
          onError={(e) => {
            // Fallback to GTT logo, then to gradient logo on error
            const target = e.currentTarget;
            if (target.src === guardianChainLogo) {
              target.src = gttLogo;
            } else if (showFallback) {
              target.style.display = 'none';
              const fallback = target.nextElementSibling;
              if (fallback) fallback.style.display = 'flex';
            }
          }}
        />
      )}
      {(variant === "full" || variant === "icon") && showFallback && (
        <div style={{ display: 'none' }}>
          <FallbackLogo />
        </div>
      )}
      {(variant === "full" || variant === "text") && <BrandText />}
    </div>
  );
}

export default EnhancedLogoDisplay;