import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";

interface VideoSectionProps {
  videoUrl?: string;
  title?: string;
  description?: string;
}

export default function VideoSection({ 
  videoUrl = "/GUARDIANCHAIN_PROTOCOL_VIDEO_MAIN.mp4",
  title = "Experience the GUARDIANCHAIN Protocol",
  description = "Watch how our decentralized truth verification system revolutionizes content integrity and creator rewards"
}: VideoSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);

  const handlePlayPause = () => {
    if (videoRef) {
      if (isPlaying) {
        videoRef.pause();
      } else {
        videoRef.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef) {
      videoRef.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (videoRef) {
      if (videoRef.requestFullscreen) {
        videoRef.requestFullscreen();
      }
    }
  };

  const handleVideoLoad = (video: HTMLVideoElement | null) => {
    if (video) {
      setVideoRef(video);
      video.muted = isMuted;
    }
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-gray-50 via-purple-50/30 to-green-50/30 dark:from-gray-900 dark:via-purple-900/10 dark:to-green-900/10">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-green-600 bg-clip-text text-transparent">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        <Card className="overflow-hidden shadow-2xl">
          <CardContent className="p-0">
            <div className="relative group">
              {/* Video Element */}
              <video
                ref={(video) => handleVideoLoad(video)}
                className="w-full h-auto aspect-video object-cover"
                poster="/api/placeholder/1200/675" // Placeholder for video thumbnail
                preload="metadata"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onLoadedData={(e) => {
                  const target = e.target as HTMLVideoElement;
                  if (target) {
                    handleVideoLoad(target);
                  }
                }}
              >
                <source src={videoUrl} type="video/mp4" />
                <p className="text-center p-8">
                  Your browser does not support the video tag. 
                  <a href={videoUrl} className="text-purple-600 hover:underline ml-1">
                    Download the video instead
                  </a>
                </p>
              </video>

              {/* Video Overlay Controls */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="flex items-center gap-4">
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={handlePlayPause}
                    className="rounded-full h-16 w-16 p-0 bg-white/90 hover:bg-white shadow-lg"
                  >
                    {isPlaying ? (
                      <Pause className="h-8 w-8 text-gray-900" />
                    ) : (
                      <Play className="h-8 w-8 text-gray-900 ml-1" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Bottom Controls Bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handlePlayPause}
                      className="text-white hover:bg-white/20 h-8 w-8 p-0"
                    >
                      {isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMuteToggle}
                      className="text-white hover:bg-white/20 h-8 w-8 p-0"
                    >
                      {isMuted ? (
                        <VolumeX className="h-4 w-4" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleFullscreen}
                    className="text-white hover:bg-white/20 h-8 w-8 p-0"
                  >
                    <Maximize className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700 text-white px-8 py-6 text-lg"
              onClick={() => window.location.href = "/dashboard"}
            >
              Launch GUARDIANCHAIN App
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="px-8 py-6 text-lg"
              onClick={() => window.location.href = "/how-it-works"}
            >
              Learn How It Works
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">10M+</div>
              <div className="text-sm text-muted-foreground">GTT Yield Pool</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">99.9%</div>
              <div className="text-sm text-muted-foreground">Truth Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">24/7</div>
              <div className="text-sm text-muted-foreground">Global Operations</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}