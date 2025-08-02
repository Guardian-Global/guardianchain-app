import { useState, useEffect, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Heart,
  Share,
  ChevronLeft,
  ChevronRight,
  Zap,
  Eye,
} from "lucide-react";
import { useSwipeable } from "react-swipeable";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import VoiceSummaryPlayer from "@/components/VoiceSummaryPlayer";
import TranslateToggle from "@/components/TranslateToggle";
import { isRTL, getRTLContainerProps } from "@/utils/rtlSupport";
import { LABELS } from "@/utils/labels";

interface ReelCapsule {
  id: string;
  title: string;
  summary: string;
  mediaUrl?: string;
  voiceoverUrl?: string;
  truthScore: number;
  views: number;
  likes: number;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  tags: string[];
  createdAt: string;
  language?: string;
  translatedSummary?: string;
}

interface ReelSwiperProps {
  reelId?: string;
  autoplay?: boolean;
  fullscreen?: boolean;
}

export default function ReelSwiper({
  reelId,
  autoplay = true,
  fullscreen = true,
}: ReelSwiperProps) {
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isMuted, setIsMuted] = useState(false);
  const [isVoiceoverPlaying, setIsVoiceoverPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoplayTimerRef = useRef<NodeJS.Timeout>();

  const userLanguage = user?.language || "en";
  const isRTLLayout = isRTL(userLanguage);

  // Fetch reel capsules
  const { data: reelCapsules = [], isLoading } = useQuery({
    queryKey: ["/api/reels", reelId || "featured"],
    queryFn: async () => {
      const response = await fetch(`/api/reels/${reelId || "featured"}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch reels");
      return response.json();
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const currentCapsule = reelCapsules[currentIndex];

  // Auto-advance timer
  useEffect(() => {
    if (autoplay && isPlaying && reelCapsules.length > 1) {
      autoplayTimerRef.current = setTimeout(() => {
        nextReel();
      }, 6000); // 6 seconds per reel
    }

    return () => {
      if (autoplayTimerRef.current) {
        clearTimeout(autoplayTimerRef.current);
      }
    };
  }, [currentIndex, isPlaying, autoplay, reelCapsules.length]);

  // Handle video and audio playback
  useEffect(() => {
    if (currentCapsule && videoRef.current) {
      const video = videoRef.current;

      if (isPlaying) {
        video.play().catch(console.error);
      } else {
        video.pause();
      }

      video.muted = isMuted;
    }
  }, [currentCapsule, isPlaying, isMuted]);

  // Handle voiceover playback
  useEffect(() => {
    if (currentCapsule?.voiceoverUrl && audioRef.current) {
      const audio = audioRef.current;
      audio.src = currentCapsule.voiceoverUrl;

      if (autoplay && !isMuted) {
        audio.play().catch(console.error);
        setIsVoiceoverPlaying(true);
      }

      audio.onended = () => setIsVoiceoverPlaying(false);
      audio.onerror = () => setIsVoiceoverPlaying(false);

      return () => {
        audio.pause();
        audio.currentTime = 0;
      };
    }
  }, [currentCapsule, autoplay, isMuted]);

  const nextReel = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % reelCapsules.length);
  }, [reelCapsules.length]);

  const previousReel = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + reelCapsules.length) % reelCapsules.length,
    );
  }, [reelCapsules.length]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleVoiceover = () => {
    if (audioRef.current) {
      if (isVoiceoverPlaying) {
        audioRef.current.pause();
        setIsVoiceoverPlaying(false);
      } else {
        audioRef.current.play().catch(console.error);
        setIsVoiceoverPlaying(true);
      }
    }
  };

  // Swipe handlers for mobile
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => (!isRTLLayout ? nextReel() : previousReel()),
    onSwipedRight: () => (!isRTLLayout ? previousReel() : nextReel()),
    onSwipedUp: () => nextReel(),
    onSwipedDown: () => previousReel(),
    trackMouse: false,
    trackTouch: true,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!currentCapsule) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            {LABELS[userLanguage]?.noReelsAvailable || "No Reels Available"}
          </h2>
          <p className="text-gray-400">
            {LABELS[userLanguage]?.createFirstReel ||
              "Create your first reel to get started"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative ${fullscreen ? "min-h-screen" : "h-[600px]"} bg-black overflow-hidden`}
      {...swipeHandlers}
      {...getRTLContainerProps(isRTLLayout)}
    >
      {/* Background Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        loop
        muted={isMuted}
        playsInline
        autoPlay={autoplay}
        poster="/assets/default-reel-poster.jpg"
      >
        <source
          src={currentCapsule.mediaUrl || "/assets/default-reel-video.mp4"}
          type="video/mp4"
        />
      </video>

      {/* Audio Element for Voiceover */}
      <audio ref={audioRef} preload="metadata" />

      {/* Overlay Content */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20">
        {/* Top Bar */}
        <div
          className={`absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-20 ${isRTLLayout ? "flex-row-reverse" : ""}`}
        >
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-purple-600/80 text-white">
              {currentIndex + 1} / {reelCapsules.length}
            </Badge>
            <Badge variant="secondary" className="bg-green-600/80 text-white">
              <Eye className="w-3 h-3 mr-1" />
              {currentCapsule.views}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={toggleMute}
              className="text-white hover:bg-white/20"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={togglePlayPause}
              className="text-white hover:bg-white/20"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Navigation Arrows */}
        <Button
          variant="ghost"
          size="lg"
          onClick={previousReel}
          className={`absolute top-1/2 -translate-y-1/2 ${isRTLLayout ? "right-4" : "left-4"} text-white hover:bg-white/20 z-10`}
        >
          {isRTLLayout ? (
            <ChevronRight className="w-6 h-6" />
          ) : (
            <ChevronLeft className="w-6 h-6" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="lg"
          onClick={nextReel}
          className={`absolute top-1/2 -translate-y-1/2 ${isRTLLayout ? "left-4" : "right-4"} text-white hover:bg-white/20 z-10`}
        >
          {isRTLLayout ? (
            <ChevronLeft className="w-6 h-6" />
          ) : (
            <ChevronRight className="w-6 h-6" />
          )}
        </Button>

        {/* Bottom Content */}
        <div
          className={`absolute bottom-0 left-0 right-0 p-6 space-y-4 ${isRTLLayout ? "text-right" : "text-left"}`}
        >
          {/* Capsule Info */}
          <div className="space-y-2">
            <h1 className="text-white text-2xl font-bold leading-tight">
              {currentCapsule.title}
            </h1>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {currentCapsule.author.name.charAt(0)}
                  </span>
                </div>
                <span className="text-white font-medium">
                  {currentCapsule.author.name}
                </span>
              </div>

              <Badge className="bg-yellow-500/80 text-black">
                <Zap className="w-3 h-3 mr-1" />
                {currentCapsule.truthScore}% Truth
              </Badge>
            </div>
          </div>

          {/* Summary with Translation */}
          <div className="space-y-2">
            <TranslateToggle
              summary={currentCapsule.summary}
              translated={currentCapsule.translatedSummary}
              className="text-white/90 text-sm leading-relaxed"
            />
          </div>

          {/* Voice Summary Player */}
          <div className="flex items-center gap-4">
            <VoiceSummaryPlayer
              text={
                currentCapsule.language !== userLanguage
                  ? currentCapsule.translatedSummary || currentCapsule.summary
                  : currentCapsule.summary
              }
              language={userLanguage}
              autoPlay={false}
              className="text-white"
            />

            {currentCapsule.voiceoverUrl && (
              <Button
                size="sm"
                variant="outline"
                onClick={toggleVoiceover}
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                {isVoiceoverPlaying ? (
                  <Pause className="w-4 h-4 mr-2" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                {LABELS[userLanguage]?.voiceover || "Voiceover"}
              </Button>
            )}
          </div>

          {/* Action Buttons */}
          <div
            className={`flex items-center gap-4 ${isRTLLayout ? "flex-row-reverse" : ""}`}
          >
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20"
            >
              <Heart className="w-4 h-4 mr-2" />
              {currentCapsule.likes}
            </Button>

            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20"
            >
              <Share className="w-4 h-4 mr-2" />
              {LABELS[userLanguage]?.share || "Share"}
            </Button>
          </div>

          {/* Progress Indicator */}
          <div className="flex gap-1">
            {reelCapsules.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  index === currentIndex ? "bg-white" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
