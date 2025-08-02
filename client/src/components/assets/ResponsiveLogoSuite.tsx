import React from "react";
import LogoDisplay from "./LogoDisplay";
import VideoDisplay from "./VideoDisplay";
import EnhancedLogoDisplay from "./EnhancedLogoDisplay";

interface ResponsiveLogoSuiteProps {
  showVideo?: boolean;
  showStatic?: boolean;
  showEnhanced?: boolean;
  logoType?: "guardianchain" | "gtt";
  className?: string;
}

export function ResponsiveLogoSuite({
  showVideo = true,
  showStatic = true,
  showEnhanced = false,
  logoType = "guardianchain",
  className = "",
}: ResponsiveLogoSuiteProps) {
  return (
    <div className={`responsive-logo-suite ${className}`}>
      {/* Mobile First Approach - Stack vertically on small screens */}
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
        {/* Static Logo - Always visible */}
        {showStatic && (
          <div className="logo-static">
            <LogoDisplay
              size="lg"
              variant="full"
              type={logoType}
              className="transition-all duration-300 hover:scale-105"
            />
          </div>
        )}

        {/* Video Logo - Hidden on very small screens, visible on sm+ */}
        {showVideo && (
          <div className="logo-video hidden sm:block">
            <VideoDisplay
              type={logoType}
              size="md"
              className="transition-all duration-300 hover:scale-105 rounded-lg shadow-lg"
              autoPlay={true}
              loop={true}
              muted={true}
            />
          </div>
        )}

        {/* Enhanced Logo - For special use cases */}
        {showEnhanced && (
          <div className="logo-enhanced">
            <EnhancedLogoDisplay
              size="lg"
              variant="full"
              className="transition-all duration-300 hover:scale-105"
            />
          </div>
        )}
      </div>

      {/* Responsive breakpoint indicators for development */}
      <div className="mt-4 text-center text-xs text-slate-500 opacity-50">
        <span className="sm:hidden">Mobile View</span>
        <span className="hidden sm:inline md:hidden">Small View</span>
        <span className="hidden md:inline lg:hidden">Medium View</span>
        <span className="hidden lg:inline xl:hidden">Large View</span>
        <span className="hidden xl:inline">Extra Large View</span>
      </div>
    </div>
  );
}

export default ResponsiveLogoSuite;
