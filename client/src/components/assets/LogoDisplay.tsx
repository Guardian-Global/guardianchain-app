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
  // Use local assets from public/assets/
  const guardianChainLogo = "/assets/GUARDIANCHAIN_logo.png";
  const gttLogo = "/assets/GTT_logo.png";
  
  const logoSrc = type === "guardianchain" ? guardianChainLogo : gttLogo;

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
          alt={`${type.toUpperCase()} Logo`}
          className={`${sizeClasses[size]} object-contain ${className}`}
          onError={(e) => {
            // Fallback to gradient logo on error
            e.currentTarget.style.display = 'none';
            const fallback = e.currentTarget.nextElementSibling;
            if (fallback) fallback.style.display = 'flex';
          }}
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