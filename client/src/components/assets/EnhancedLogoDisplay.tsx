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

  // Responsive size classes for different devices
  const sizeClasses = {
    sm: "h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6",
    md: "h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 lg:h-10 lg:w-10", 
    lg: "h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 xl:h-16 xl:w-16",
    xl: "h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 lg:h-20 lg:w-20 xl:h-24 xl:w-24"
  };

  // Responsive text size classes
  const textSizeClasses = {
    sm: "text-xs sm:text-sm",
    md: "text-sm sm:text-base md:text-lg",
    lg: "text-base sm:text-lg md:text-xl lg:text-2xl",
    xl: "text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl"
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
        <FallbackLogo />
      )}
      {(variant === "full" || variant === "text") && <BrandText />}
    </div>
  );
}

export default EnhancedLogoDisplay;