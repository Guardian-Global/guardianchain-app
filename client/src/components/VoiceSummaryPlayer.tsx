import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";

interface VoiceSummaryPlayerProps {
  content: string;
  language?: string;
  className?: string;
}

export default function VoiceSummaryPlayer({
  content,
  language = "en",
  className = "",
}: VoiceSummaryPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const handlePlay = () => {
    // Mock voice synthesis - replace with actual implementation
    setIsPlaying(!isPlaying);
    console.log("Playing voice summary:", content.slice(0, 50) + "...");
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Button
        variant="ghost"
        size="icon"
        onClick={handlePlay}
        className="h-8 w-8"
      >
        {isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsMuted(!isMuted)}
        className="h-8 w-8"
      >
        {isMuted ? (
          <VolumeX className="w-4 h-4" />
        ) : (
          <Volume2 className="w-4 h-4" />
        )}
      </Button>
      <span className="text-sm text-muted-foreground">
        Listen ({language.toUpperCase()})
      </span>
    </div>
  );
}
