import React from "react";
import { useAssets } from "./AssetProvider";

interface LogoDisplayProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "main" | "icon" | "text" | "full";
  className?: string;
  fallback?: React.ReactNode;
}

export const LogoDisplay: React.FC<LogoDisplayProps> = ({
  size = "md",
  variant = "main",
  className = "",
  fallback,
}) => {
  const { logos, loading, error } = useAssets();

  const sizeClasses = {
    sm: "h-6 w-auto",
    md: "h-8 w-auto",
    lg: "h-12 w-auto",
    xl: "h-16 w-auto",
  };

  if (loading) {
    return (
      <div
        className={`${sizeClasses[size]} bg-slate-700 animate-pulse rounded ${className}`}
      />
    );
  }

  if (error || logos.length === 0) {
    if (fallback) return <>{fallback}</>;

    return (
      <div
        className={`${sizeClasses[size]} flex items-center justify-center bg-gradient-to-r from-purple-600 to-green-500 text-white font-bold text-xs rounded ${className}`}
      >
        GUARDIANCHAIN
      </div>
    );
  }

  // Find the best logo for the variant - prioritize GUARDIANCHAIN and GTT
  let selectedLogo = logos[0]; // Default to first logo

  // Look for specific logo variants with GUARDIANCHAIN priority
  const guardianLogos = logos.filter(
    (logo) =>
      logo.name.toLowerCase().includes("guardianchain") ||
      logo.name.toLowerCase().includes("guardian")
  );

  const gttLogos = logos.filter((logo) =>
    logo.name.toLowerCase().includes("gtt")
  );

  switch (variant) {
    case "main":
    case "full":
      selectedLogo =
        guardianLogos.find(
          (logo) =>
            logo.name.toLowerCase().includes("main") ||
            logo.name.toLowerCase().includes("primary") ||
            logo.name.toLowerCase().includes("full")
        ) ||
        guardianLogos[0] ||
        logos[0];
      break;
    case "icon":
      selectedLogo =
        guardianLogos.find(
          (logo) =>
            logo.name.toLowerCase().includes("icon") ||
            logo.name.toLowerCase().includes("symbol")
        ) ||
        guardianLogos[0] ||
        logos[0];
      break;
    case "text":
      selectedLogo =
        guardianLogos.find(
          (logo) =>
            logo.name.toLowerCase().includes("text") ||
            logo.name.toLowerCase().includes("wordmark")
        ) ||
        guardianLogos[0] ||
        logos[0];
      break;
    case "gtt":
      selectedLogo = gttLogos[0] || logos[0];
      break;
  }

  console.log("🎨 LogoDisplay rendering:", {
    variant,
    selectedLogo: selectedLogo?.name,
    url: selectedLogo?.url,
  });

  return (
    <div className={className}>
      <img
        src={selectedLogo.url}
        alt={`GUARDIANCHAIN ${variant} logo`}
        className={`${sizeClasses[size]} object-contain`}
        onError={(e) => {
          console.error("❌ Failed to load logo:", selectedLogo.url);
          const target = e.target as HTMLImageElement;
          target.style.display = "none";
          if (fallback && target.parentElement) {
            const fallbackContainer = document.createElement("div");
            target.parentElement.appendChild(fallbackContainer);
            // Use React to render fallback
            if (typeof fallback === "string") {
              fallbackContainer.innerHTML = fallback;
            }
          }
        }}
        onLoad={() => {
          console.log(
            "✅ Successfully loaded logo:",
            selectedLogo.name,
            selectedLogo.url
          );
        }}
        style={{ display: "block", maxWidth: "100%", height: "auto" }}
      />
    </div>
  );
};
