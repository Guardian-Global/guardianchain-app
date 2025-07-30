import React from "react";
import { Shield } from "lucide-react";

interface LogoDisplayProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "full" | "icon" | "text" | "main";
  className?: string;
  type?: "guardianchain" | "gtt";
}

export function LogoDisplay({
  size = "md",
  variant = "full",
  className = "",
  type = "guardianchain"
}: LogoDisplayProps) {
  // Use local assets from public/assets/ with cache busting
  const guardianChainLogo = "/assets/GUARDIANCHAIN_logo.png?v=1";
  const gttLogo = "/assets/GTT_logo.png?v=1";
  
  const logoSrc = type === "guardianchain" ? guardianChainLogo : gttLogo;

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

  // Fallback component with enhanced styling
  const FallbackLogo = () => (
    <div className={`${sizeClasses[size]} bg-gradient-to-r from-purple-600 to-green-600 rounded-lg flex items-center justify-center shadow-lg ${className}`}>
      <Shield className="text-white h-4/5 w-4/5" />
    </div>
  );

  const BrandText = () => (
    <span className={`font-bold ${textSizeClasses[size]}`}>
      {type === "guardianchain" ? (
        <>
          <span className="text-purple-400">GUARDIAN</span>
          <span className="text-green-400">CHAIN</span>
        </>
      ) : (
        <span className="text-purple-400">GTT</span>
      )}
    </span>
  );

  return (
    <div className="flex items-center space-x-2">
      {(variant === "full" || variant === "icon" || variant === "main") && (
        <img
          src={logoSrc}
          alt={`${type === "guardianchain" ? "GUARDIANCHAIN" : "GTT"} Logo`}
          className={`${sizeClasses[size]} object-contain transition-all duration-300 hover:scale-105 ${className}`}
          onError={(e) => {
            console.log(`Loading fallback for ${type} logo`);
            const target = e.currentTarget;
            target.style.display = 'none';
            const fallback = target.nextElementSibling;
            if (fallback) fallback.style.display = 'flex';
          }}
          onLoad={() => console.log(`Logo loaded: ${type}`)}
        />
      )}
      {(variant === "full" || variant === "icon" || variant === "main") && (
        <div style={{ display: 'none' }}>
          <FallbackLogo />
        </div>
      )}
      {(variant === "full" || variant === "text") && <BrandText />}
    </div>
  );
}

export default LogoDisplay;