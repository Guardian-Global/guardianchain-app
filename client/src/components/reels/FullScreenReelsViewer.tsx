import { useState, useEffect, useRef } from "react";
import { useReels } from "../../hooks/useReels";
import { useCapsules } from "../../hooks/useCapsules";
import { useSwipeable } from "react-swipeable";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import VoiceSummaryPlayer from "../VoiceSummaryPlayer";
import TranslateToggle from "../TranslateToggle";
import {
  ChevronUp,
  ChevronDown,
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react";
import { isRTL, getRTLContainerProps } from "../../utils/rtlSupport";

interface FullScreenReelsViewerProps {
  isOpen: boolean;
  onClose: () => void;
  initialReelIndex?: number;
}

export function FullScreenReelsViewer({
  isOpen,
  onClose,
  initialReelIndex = 0,
}: FullScreenReelsViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialReelIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [userLanguage, setUserLanguage] = useState("en");

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: reels = [] } = useReels();
  const { data: capsules = [] } = useCapsules();

  const currentReel = reels?.[currentIndex];
  const currentCapsule = currentReel?.capsuleIds?.[0]
    ? capsules?.find((c) => c.id === currentReel.capsuleIds[0])
    : null;

  // Auto-detect user language
  useEffect(() => {
    const detectLanguage = () => {
      const stored = localStorage.getItem("preferredLanguage");
      if (stored) return stored;

      const browserLang = navigator.language.split("-")[0];
      return browserLang || "en";
    };
    setUserLanguage(detectLanguage());
  }, []);

  // Swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedUp: () => navigateNext(),
    onSwipedDown: () => navigatePrevious(),
    trackMouse: true,
    trackTouch: true,
  });

  const navigateNext = () => {
    if (reels && currentIndex < reels.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsPlaying(true);
    }
  };

  const navigatePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsPlaying(true);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          navigateNext();
          break;
        case "ArrowDown":
          e.preventDefault();
          navigatePrevious();
          break;
        case " ":
          e.preventDefault();
          setIsPlaying(!isPlaying);
          break;
        case "Escape":
          onClose();
          break;
        case "m":
        case "M":
          setIsMuted(!isMuted);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [isOpen, isPlaying, isMuted, currentIndex]);

  // Auto-play management
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(console.warn);
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, currentIndex]);

  // Video ended handler
  const handleVideoEnd = () => {
    if (reels && currentIndex < reels.length - 1) {
      navigateNext();
    } else {
      setIsPlaying(false);
    }
  };

  if (!isOpen || !reels || !currentReel) return null;

  const rtlProps = isRTL(userLanguage) ? getRTLContainerProps() : {};

  return (
    <div
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      {...swipeHandlers}
      ref={containerRef}
      {...rtlProps}
    >
      {/* Background Video/Content */}
      <div className="relative w-full h-full flex items-center justify-center">
        {currentCapsule?.metadata?.fileUrl ? (
          <video
            ref={videoRef}
            src={currentCapsule.metadata.fileUrl}
            className="w-full h-full object-cover"
            muted={isMuted}
            onEnded={handleVideoEnd}
            onClick={() => setIsPlaying(!isPlaying)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
            <Card className="max-w-md p-6 text-center bg-black/50 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-4">
                {currentReel.name}
              </h2>
              {currentCapsule && (
                <div className="space-y-4 text-white">
                  <p className="text-lg">{currentCapsule.title}</p>
                  <p className="text-sm opacity-90">{currentCapsule.content}</p>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Overlay Controls */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top Controls */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-auto">
            <div className="flex items-center space-x-2">
              <h3 className="text-white font-semibold text-lg">
                {currentReel.name}
              </h3>
              <TranslateToggle
                text={currentReel.name || ""}
                targetLanguage={userLanguage}
                className="text-white"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          {/* Center Play/Pause */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-16 h-16 text-white hover:bg-white/20 opacity-0 hover:opacity-100 transition-opacity"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8" />
              )}
            </Button>
          </div>

          {/* Side Navigation */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 space-y-4 pointer-events-auto">
            <Button
              variant="ghost"
              size="icon"
              onClick={navigatePrevious}
              disabled={currentIndex === 0}
              className="text-white hover:bg-white/20 disabled:opacity-50"
            >
              <ChevronUp className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={navigateNext}
              disabled={!reels || currentIndex === reels.length - 1}
              className="text-white hover:bg-white/20 disabled:opacity-50"
            >
              <ChevronDown className="w-6 h-6" />
            </Button>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-4 left-4 right-4 pointer-events-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Progress Indicator */}
                <div className="flex items-center space-x-1">
                  {reels.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentIndex ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>

                {/* Voice Summary */}
                {currentCapsule && (
                  <VoiceSummaryPlayer
                    content={currentCapsule.content}
                    language={userLanguage}
                    className="text-white"
                  />
                )}
              </div>

              <div className="flex items-center space-x-2">
                {/* Volume Control */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-white hover:bg-white/20"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </Button>

                {/* Reel Counter */}
                <span className="text-white text-sm">
                  {currentIndex + 1} / {reels.length}
                </span>
              </div>
            </div>

            {/* Capsule Info */}
            {currentCapsule && (
              <Card className="mt-4 p-3 bg-black/50 backdrop-blur-sm">
                <div className="text-white space-y-2">
                  <h4 className="font-semibold">{currentCapsule.title}</h4>
                  <p className="text-sm opacity-90 line-clamp-2">
                    {currentCapsule.content}
                  </p>
                  <div className="flex items-center justify-between text-xs opacity-75">
                    <span>
                      Truth Score: {(currentCapsule.truthScore || 0.8) * 100}%
                    </span>
                    <span>{currentCapsule.type}</span>
                    <span>
                      {new Date(currentCapsule.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
