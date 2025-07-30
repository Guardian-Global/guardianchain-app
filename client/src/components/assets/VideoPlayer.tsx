import React, { useRef, useEffect } from "react";

interface VideoPlayerProps {
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  className?: string;
  poster?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  autoplay = true,
  loop = true,
  muted = true,
  controls = false,
  className = "",
  poster = "/assets/logo.png"
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && autoplay) {
      videoRef.current.play().catch(console.error);
    }
  }, [autoplay]);

  return (
    <video
      ref={videoRef}
      autoPlay={autoplay}
      loop={loop}
      muted={muted}
      controls={controls}
      poster={poster}
      className={`w-full h-full object-cover ${className}`}
      onError={(e) => {
        console.warn("Video failed to load:", e);
        // Fallback to poster image if video fails
      }}
    >
      <source src="/assets/logo-video.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoPlayer;