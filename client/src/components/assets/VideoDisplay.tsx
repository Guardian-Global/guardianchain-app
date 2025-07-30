import React from "react";

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
  // Local video assets from public/assets/ (note: actual file has typo GAURDIANCHAIN)
  const videoSrc = type === "guardianchain" 
    ? "/assets/GAURDIANCHAIN_logo_video.mp4"
    : "/assets/GTT_logo_video.mp4";

  // Size classes
  const sizeClasses = {
    sm: "h-24 w-24",
    md: "h-32 w-32", 
    lg: "h-48 w-48",
    xl: "h-64 w-64"
  };

  return (
    <video
      src={videoSrc}
      className={`${sizeClasses[size]} object-contain ${className}`}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      controls={controls}
      playsInline
      onError={(e) => {
        console.error(`Failed to load ${type} logo video:`, videoSrc);
      }}
    >
      Your browser does not support the video tag.
    </video>
  );
}

export default VideoDisplay;