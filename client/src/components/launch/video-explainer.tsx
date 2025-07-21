import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RotateCcw,
  Maximize,
  Video,
  Clock,
  Eye,
  Share2,
  BookOpen,
  Zap
} from "lucide-react";

interface VideoExplainerProps {
  className?: string;
}

export function VideoExplainer({ className }: VideoExplainerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(180); // 3 minutes
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const videoRef = useRef<HTMLDivElement>(null);
  const progressInterval = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = Math.min(prev + 1, duration);
          setProgress((newTime / duration) * 100);
          if (newTime >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return newTime;
        });
      }, 1000);
    } else {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isPlaying, duration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const restart = () => {
    setCurrentTime(0);
    setProgress(0);
    setIsPlaying(true);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const videoSections = [
    {
      title: "Truth Verification Revolution",
      timestamp: "0:00 - 0:45",
      description: "How GUARDIANCHAIN transforms content verification",
      icon: <Zap className="h-4 w-4" />
    },
    {
      title: "GTT Token Economics", 
      timestamp: "0:45 - 1:30",
      description: "Understanding yield generation and rewards",
      icon: <BookOpen className="h-4 w-4" />
    },
    {
      title: "Platform Demo",
      timestamp: "1:30 - 2:15", 
      description: "Live demonstration of key features",
      icon: <Video className="h-4 w-4" />
    },
    {
      title: "Getting Started",
      timestamp: "2:15 - 3:00",
      description: "Your first steps on GUARDIANCHAIN",
      icon: <Play className="h-4 w-4" />
    }
  ];

  const stats = [
    { label: "Views", value: "12.3K", icon: <Eye className="h-4 w-4" /> },
    { label: "Shares", value: "1.2K", icon: <Share2 className="h-4 w-4" /> },
    { label: "Duration", value: "3:00", icon: <Clock className="h-4 w-4" /> }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center space-x-2">
          <Video className="h-8 w-8 text-purple-500" />
          <h2 className="text-3xl font-bold gradient-text">
            Platform Explainer
          </h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Watch our comprehensive 3-minute overview of GUARDIANCHAIN's revolutionary 
          truth verification platform and GTT token economics.
        </p>
      </motion.div>

      {/* Video Player */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative"
      >
        <Card className="overflow-hidden">
          <div className="relative aspect-video bg-gradient-to-br from-purple-900 via-purple-800 to-green-800">
            {/* Video Placeholder */}
            <div 
              ref={videoRef}
              className="absolute inset-0 flex items-center justify-center bg-black/20"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center space-y-4"
              >
                <div className="relative">
                  <motion.div
                    animate={{ 
                      scale: isPlaying ? [1, 1.1, 1] : 1,
                      rotate: isPlaying ? [0, 360] : 0
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: isPlaying ? Infinity : 0,
                      ease: "linear"
                    }}
                    className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30"
                  >
                    {isPlaying ? (
                      <Pause className="h-8 w-8 text-white" />
                    ) : (
                      <Play className="h-8 w-8 text-white ml-1" />
                    )}
                  </motion.div>
                </div>
                <div className="text-white space-y-2">
                  <h3 className="text-xl font-bold">GUARDIANCHAIN Platform Overview</h3>
                  <p className="text-white/80">3-minute comprehensive walkthrough</p>
                </div>
              </motion.div>
            </div>

            {/* Video Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="space-y-3">
                {/* Progress Bar */}
                <div className="space-y-1">
                  <Progress value={progress} className="h-2" />
                  <div className="flex justify-between text-xs text-white/80">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={togglePlay}
                      className="text-white hover:bg-white/20"
                    >
                      {isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={restart}
                      className="text-white hover:bg-white/20"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={toggleMute}
                      className="text-white hover:bg-white/20"
                    >
                      {isMuted ? (
                        <VolumeX className="h-4 w-4" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={toggleFullscreen}
                    className="text-white hover:bg-white/20"
                  >
                    <Maximize className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Video Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-center text-purple-500">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Video Sections */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-center">Video Chapters</h3>
        <div className="grid gap-3">
          {videoSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-purple-500">
                      {section.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{section.title}</h4>
                        <Badge variant="secondary">{section.timestamp}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {section.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="text-center space-y-4"
      >
        <p className="text-muted-foreground">
          Ready to experience the future of truth verification?
        </p>
        <Button 
          size="lg" 
          onClick={togglePlay}
          className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700"
        >
          {isPlaying ? "Pause Video" : "Watch Explainer"}
          <Play className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  );
}

export default VideoExplainer;