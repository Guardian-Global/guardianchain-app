import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  RotateCcw,
  ExternalLink
} from "lucide-react";

interface GuardianChainVideoProps {
  autoplay?: boolean;
  showControls?: boolean;
  className?: string;
  onVideoEnd?: () => void;
}

export default function GuardianChainVideo({ 
  autoplay = false, 
  showControls = true, 
  className = "",
  onVideoEnd 
}: GuardianChainVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isMuted, setIsMuted] = useState(true); // Start muted for autoplay
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      onVideoEnd?.();
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('ended', handleEnded);

    // Auto-play if enabled
    if (autoplay) {
      video.play().catch(console.warn);
    }

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('ended', handleEnded);
    };
  }, [autoplay, onVideoEnd]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const restart = () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    video.play();
    setIsPlaying(true);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (!isFullscreen) {
      video.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <Card className={`bg-slate-900/50 border-slate-600 overflow-hidden ${className}`}>
      <CardContent className="p-0">
        <div className="relative group">
          <video
            ref={videoRef}
            className="w-full h-auto max-h-[600px] object-cover"
            muted={isMuted}
            playsInline
            preload="metadata"
            poster="/assets/GUARDIANCHAIN_logo.png"
          >
            <source 
              src="https://mpjgcleldijxkvbuxiqg.supabase.co/storage/v1/object/public/media-assets/GUARDIANCHAIN_PROTOCOL_VIDEO_MAIN.mp4" 
              type="video/mp4" 
            />
            Your browser does not support the video tag.
          </video>

          {/* Video Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            
            {/* Play/Pause Overlay */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  onClick={togglePlay}
                  size="lg"
                  className="bg-purple-600/80 hover:bg-purple-700/80 rounded-full w-20 h-20"
                >
                  <Play className="w-8 h-8 ml-1" />
                </Button>
              </div>
            )}

            {/* Top Controls */}
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                onClick={() => window.open('https://mpjgcleldijxkvbuxiqg.supabase.co/storage/v1/object/public/media-assets/GUARDIANCHAIN_PROTOCOL_VIDEO_MAIN.mp4', '_blank')}
                size="sm"
                variant="ghost"
                className="bg-black/50 hover:bg-black/70 text-white"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>

            {/* Bottom Controls */}
            {showControls && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                
                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="w-full bg-slate-600 rounded-full h-1">
                    <div 
                      className="bg-purple-500 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={togglePlay}
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>

                    <Button
                      onClick={restart}
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>

                    <Button
                      onClick={toggleMute}
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>

                    <div className="text-white text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                  </div>

                  <Button
                    onClick={toggleFullscreen}
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                  >
                    <Maximize className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Video Title Overlay */}
          <div className="absolute top-4 left-4">
            <div className="bg-black/70 px-3 py-1 rounded-lg">
              <h3 className="text-white font-bold text-sm">
                GUARDIANCHAIN Protocol Explainer
              </h3>
            </div>
          </div>
        </div>

        {/* Video Description */}
        <div className="p-4 bg-slate-800/50">
          <h4 className="text-white font-bold mb-2">
            Welcome to GUARDIANCHAIN - Truth Verification Revolution
          </h4>
          <p className="text-slate-300 text-sm">
            Discover how GUARDIANCHAIN is revolutionizing truth verification with GTT tokens, 
            community governance, and blockchain-powered transparency. Learn about our 
            viral launch mechanisms and $100K volume targets.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}