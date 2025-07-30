import React from "react";
import { Shield } from "lucide-react";
import { useBrandingAssets } from "@/hooks/useSupabaseAssets";

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
  const { brandingAssets, isLoading } = useBrandingAssets();

  // Get the highest value branding asset
  const primaryLogo = brandingAssets[0];

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

  // Show loading state
  if (isLoading && showFallback) {
    return (
      <div className="flex items-center space-x-2">
        {(variant === "full" || variant === "icon") && <FallbackLogo />}
        {(variant === "full" || variant === "text") && <BrandText />}
      </div>
    );
  }

  // Use Supabase asset if available
  if (primaryLogo) {
    return (
      <div className="flex items-center space-x-2">
        {(variant === "full" || variant === "icon") && (
          <img
            src={primaryLogo.url}
            alt="GUARDIANCHAIN Logo"
            className={`${sizeClasses[size]} object-contain ${className}`}
            onError={(e) => {
              // Fallback to default logo on error
              if (showFallback) {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling;
                if (fallback) fallback.style.display = 'flex';
              }
            }}
          />
        )}
        {(variant === "full" || variant === "icon") && showFallback && (
          <FallbackLogo />
        )}
        {(variant === "full" || variant === "text") && <BrandText />}
      </div>
    );
  }

  // Fallback when no assets or showFallback is true
  if (showFallback) {
    return (
      <div className="flex items-center space-x-2">
        {(variant === "full" || variant === "icon") && <FallbackLogo />}
        {(variant === "full" || variant === "text") && <BrandText />}
      </div>
    );
  }

  return null;
}

export default EnhancedLogoDisplay;