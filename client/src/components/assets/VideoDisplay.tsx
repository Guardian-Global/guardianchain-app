import React from "react";
import { Shield } from "lucide-react";

interface VideoDisplayProps {
  type?: "guardianchain" | "gtt";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
}

export function VideoDisplay({
  type = "guardianchain",
  size = "md",
  className = "",
  autoPlay = true,
  loop = true,
  muted = true,
  controls = false
}: VideoDisplayProps) {
  // Local video assets from public/assets/ with cache busting
  const videoSrc = type === "guardianchain" 
    ? "/assets/GAURDIANCHAIN_logo_video.mp4?v=1"
    : "/assets/GTT_logo_video.mp4?v=1";

  // Responsive size classes for video display
  const sizeClasses = {
    sm: "h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24",
    md: "h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 lg:h-36 lg:w-36", 
    lg: "h-32 w-32 sm:h-40 sm:w-40 md:h-48 md:w-48 lg:h-56 lg:w-56 xl:h-64 xl:w-64",
    xl: "h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-72 lg:w-72 xl:h-80 xl:w-80"
  };

  // Fallback component with animated gradient
  const FallbackVideo = () => (
    <div className={`${sizeClasses[size]} bg-gradient-to-r ${type === "guardianchain" ? "from-purple-600 to-green-600" : "from-green-600 to-blue-600"} rounded-lg flex items-center justify-center shadow-lg animate-pulse ${className}`}>
      <Shield className="text-white h-4/5 w-4/5" />
    </div>
  );

  return <FallbackVideo />;
}

export default VideoDisplay;