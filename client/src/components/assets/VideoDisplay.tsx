import React, { useState } from "react";
import { useAssets } from "./AssetProvider";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";

interface VideoDisplayProps {
  variant?: "explainer" | "demo" | "main" | "hero";
  autoplay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  className?: string;
  fallback?: React.ReactNode;
}

export const VideoDisplay: React.FC<VideoDisplayProps> = ({
  variant = "main",
  autoplay = false,
  controls = true,
  muted = false,
  loop = false,
  className = "",
  fallback,
}) => {
  const { videos, loading, error } = useAssets();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);

  if (loading) {
    return (
      <div
        className={`bg-slate-800 animate-pulse rounded-lg aspect-video flex items-center justify-center ${className}`}
      >
        <Play className="w-12 h-12 text-slate-600" />
      </div>
    );
  }

  if (error || videos.length === 0) {
    if (fallback) return <>{fallback}</>;

    return (
      <div
        className={`bg-gradient-to-br from-purple-900 to-slate-900 rounded-lg aspect-video flex items-center justify-center text-white ${className}`}
      >
        <div className="text-center">
          <Play className="w-16 h-16 mx-auto mb-4 text-purple-400" />
          <h3 className="text-xl font-bold mb-2">GUARDIANCHAIN</h3>
          <p className="text-slate-300">Video Coming Soon</p>
        </div>
      </div>
    );
  }

  // Find the best video for the variant
  let selectedVideo = videos[0];

  switch (variant) {
    case "explainer":
      selectedVideo =
        videos.find(
          (video) =>
            video.name.toLowerCase().includes("explainer") ||
            video.name.toLowerCase().includes("explain") ||
            video.name.toLowerCase().includes("intro")
        ) || videos[0];
      break;
    case "demo":
      selectedVideo =
        videos.find(
          (video) =>
            video.name.toLowerCase().includes("demo") ||
            video.name.toLowerCase().includes("walkthrough") ||
            video.name.toLowerCase().includes("tutorial")
        ) || videos[0];
      break;
    case "hero":
      selectedVideo =
        videos.find(
          (video) =>
            video.name.toLowerCase().includes("hero") ||
            video.name.toLowerCase().includes("main") ||
            video.name.toLowerCase().includes("landing")
        ) || videos[0];
      break;
    case "main":
      selectedVideo =
        videos.find(
          (video) =>
            video.name.toLowerCase().includes("main") ||
            video.name.toLowerCase().includes("protocol") ||
            video.name.toLowerCase().includes("guardianchain")
        ) || videos[0];
      break;
  }

  const togglePlay = () => {
    if (videoRef) {
      if (isPlaying) {
        videoRef.pause();
      } else {
        videoRef.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef) {
      videoRef.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.requestFullscreen();
      }
    }
  };

  return (
    <div className={`relative group rounded-lg overflow-hidden ${className}`}>
      <video
        ref={setVideoRef}
        src={selectedVideo.url}
        autoPlay={autoplay}
        muted={muted}
        loop={loop}
        controls={false}
        className="w-full h-full object-cover"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={(e) => {
          console.error("Video failed to load:", selectedVideo.url);
          if (fallback) {
            const target = e.target as HTMLVideoElement;
            target.style.display = "none";
          }
        }}
      />

      {controls && (
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4 flex items-center space-x-4">
            <button
              onClick={togglePlay}
              className="bg-white/20 hover:bg-white/30 rounded-full p-2 text-white transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </button>

            <button
              onClick={toggleMute}
              className="bg-white/20 hover:bg-white/30 rounded-full p-2 text-white transition-colors"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>

            <div className="flex-1" />

            <button
              onClick={toggleFullscreen}
              className="bg-white/20 hover:bg-white/30 rounded-full p-2 text-white transition-colors"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <div className="absolute top-4 left-4">
        <div className="bg-black/50 rounded px-2 py-1 text-white text-xs">
          {selectedVideo.name}
        </div>
      </div>
    </div>
  );
};
