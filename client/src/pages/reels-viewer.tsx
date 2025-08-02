import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX,
  Maximize2,
  Minimize2,
  Heart,
  Share,
  Info,
  ArrowLeft
} from "lucide-react";
import { Link, useLocation } from "wouter";
import VoiceSummaryPlayer from "@/components/VoiceSummaryPlayer";
import TranslateToggle from "@/components/TranslateToggle";
import { detectUserLanguage, getLabel } from "@/lib/labels";
import { isRTL, getRTLContainerProps } from "@/lib/rtlSupport";
import { cn } from "@/lib/utils";

interface Reel {
  id: string;
  name: string;
  description: string;
  capsuleIds: string[];
  playCount: number;
  likeCount: number;
  language: string;
}

interface Capsule {
  id: string;
  title: string;
  description: string;
  summary: string;
  truthScore: number;
  mediaType: string;
  mediaUrl?: string;
  createdAt: string;
}

export default function ReelsViewer() {
  const [location, navigate] = useLocation();
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [currentCapsuleIndex, setCurrentCapsuleIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const userLang = detectUserLanguage();
  const containerProps = getRTLContainerProps(userLang);

  // Fetch user reels
  const { data: reels = [], isLoading: reelsLoading } = useQuery<Reel[]>({
    queryKey: ["/api/reels"],
  });

  // Fetch capsules for current reel
  const { data: capsules = [], isLoading: capsulesLoading } = useQuery<Capsule[]>({
    queryKey: ["/api/capsules/owned"],
  });

  const currentReel = reels[currentReelIndex];
  const currentCapsule = capsules[currentCapsuleIndex];

  // Auto-advance timer
  useEffect(() => {
    if (isPlaying && !capsulesLoading && capsules.length > 0) {
      intervalRef.current = setInterval(() => {
        handleNext();
      }, 6000); // 6 seconds per capsule

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [isPlaying, currentCapsuleIndex, capsules.length]);

  const handleNext = () => {
    if (capsules.length === 0) return;
    
    if (currentCapsuleIndex < capsules.length - 1) {
      setCurrentCapsuleIndex(prev => prev + 1);
    } else {
      // Move to next reel or loop back to first
      if (currentReelIndex < reels.length - 1) {
        setCurrentReelIndex(prev => prev + 1);
        setCurrentCapsuleIndex(0);
      } else {
        setCurrentReelIndex(0);
        setCurrentCapsuleIndex(0);
      }
    }
  };

  const handlePrevious = () => {
    if (currentCapsuleIndex > 0) {
      setCurrentCapsuleIndex(prev => prev - 1);
    } else {
      // Move to previous reel
      if (currentReelIndex > 0) {
        setCurrentReelIndex(prev => prev - 1);
        setCurrentCapsuleIndex(capsules.length - 1);
      } else {
        setCurrentReelIndex(reels.length - 1);
        setCurrentCapsuleIndex(capsules.length - 1);
      }
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  if (reelsLoading || capsulesLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mb-4"></div>
          <p className="text-lg">{getLabel("loading", userLang)}...</p>
        </div>
      </div>
    );
  }

  if (!reels.length || !capsules.length) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center space-y-4">
          <h2 className="text-2xl font-bold">{getLabel("noReels", userLang)}</h2>
          <p className="text-gray-400">{getLabel("createReelsFirst", userLang)}</p>
          <Link href="/reels">
            <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-black">
              {getLabel("createReels", userLang)}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "relative min-h-screen bg-black overflow-hidden",
        isFullscreen ? "fixed inset-0 z-50" : "",
        containerProps.className
      )}
      dir={containerProps.dir}
    >
      {/* Background Video/Media */}
      <div className="absolute inset-0 flex items-center justify-center">
        {currentCapsule?.mediaUrl && currentCapsule.mediaType === 'video' ? (
          <video
            src={currentCapsule.mediaUrl}
            className="w-full h-full object-cover"
            autoPlay
            muted={isMuted}
            loop
            playsInline
          />
        ) : currentCapsule?.mediaUrl && currentCapsule.mediaType === 'image' ? (
          <img
            src={currentCapsule.mediaUrl}
            alt={currentCapsule.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-6xl font-bold mb-4">📰</div>
              <h1 className="text-4xl font-bold mb-2">{currentCapsule?.title}</h1>
              <p className="text-xl opacity-80">{getLabel("textCapsule", userLang)}</p>
            </div>
          </div>
        )}
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header Controls */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
          <Link href="/reels">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {getLabel("back", userLang)}
            </Button>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowInfo(!showInfo)}
              className="text-white hover:bg-white/20"
            >
              <Info className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="text-white hover:bg-white/20"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex items-end">
          <div className="w-full p-6 bg-gradient-to-t from-black/80 to-transparent">
            {/* Reel Progress */}
            <div className="mb-4">
              <div className="flex gap-1 mb-2">
                {capsules.map((_, index: number) => (
                  <div
                    key={index}
                    className={cn(
                      "h-1 flex-1 rounded-full",
                      index === currentCapsuleIndex ? "bg-white" : "bg-white/30"
                    )}
                  />
                ))}
              </div>
              <div className="text-white/80 text-sm">
                {currentReelIndex + 1}/{reels.length} • {currentCapsuleIndex + 1}/{capsules.length}
              </div>
            </div>

            {/* Content Info */}
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  {currentCapsule?.title}
                </h1>
                <Badge className="bg-purple-600 text-white">
                  {getLabel("truthScore", userLang)}: {currentCapsule?.truthScore || 0}%
                </Badge>
              </div>

              {/* Translation Toggle */}
              {currentCapsule?.summary && (
                <TranslateToggle
                  summary={currentCapsule.summary}
                  targetLanguage={userLang}
                  className="text-white"
                />
              )}

              {/* Voice Player */}
              {currentCapsule?.summary && (
                <VoiceSummaryPlayer
                  text={currentCapsule.summary}
                  language={userLang}
                  autoTranslate={userLang !== "en"}
                  showDownload={true}
                />
              )}

              {/* Additional Info Panel */}
              {showInfo && (
                <Card className="bg-black/60 border-white/20">
                  <CardContent className="p-4 text-white">
                    <h3 className="font-semibold mb-2">{getLabel("reelInfo", userLang)}</h3>
                    <p className="text-sm text-white/80 mb-2">
                      {currentReel?.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-white/60">
                      <span>{getLabel("plays", userLang)}: {currentReel?.playCount}</span>
                      <span>{getLabel("likes", userLang)}: {currentReel?.likeCount}</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-t from-black/50 to-transparent">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevious}
              className="text-white hover:bg-white/20"
            >
              <SkipBack className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-white hover:bg-white/20"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleNext}
              className="text-white hover:bg-white/20"
            >
              <SkipForward className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMuted(!isMuted)}
              className="text-white hover:bg-white/20"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <Heart className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <Share className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}