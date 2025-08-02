import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Play, Pause, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { LABELS } from "@/utils/labels";

interface VoiceSummaryPlayerProps {
  text: string;
  language?: string;
  autoPlay?: boolean;
  className?: string;
  compact?: boolean;
}

export default function VoiceSummaryPlayer({ 
  text, 
  language = 'en', 
  autoPlay = false, 
  className = "",
  compact = false
}: VoiceSummaryPlayerProps) {
  const { user } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const userLanguage = user?.language || language || 'en';
  const labels = LABELS[userLanguage] || LABELS['en'];

  // Generate audio URL for text-to-speech
  const generateAudioUrl = async (textToSpeak: string) => {
    try {
      setIsLoading(true);
      
      // Use Web Speech API if available
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = language;
        utterance.rate = 0.9;
        utterance.pitch = 1;
        
        utterance.onstart = () => {
          setIsPlaying(true);
          setIsLoading(false);
        };
        
        utterance.onend = () => {
          setIsPlaying(false);
        };
        
        utterance.onerror = () => {
          setIsPlaying(false);
          setIsLoading(false);
        };
        
        speechSynthesis.speak(utterance);
        return;
      }
      
      // Fallback to server-side TTS
      const response = await fetch('/api/ai/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          text: textToSpeak,
          language: language,
          voice: 'neural'
        }),
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        
        if (audioRef.current) {
          audioRef.current.src = url;
          if (autoPlay) {
            audioRef.current.play();
          }
        }
      }
    } catch (error) {
      console.error('Failed to generate audio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayback = async () => {
    if (isPlaying) {
      // Stop current playback
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlaying(false);
    } else {
      // Start playback
      await generateAudioUrl(text);
    }
  };

  // Auto-play effect
  useEffect(() => {
    if (autoPlay && text) {
      generateAudioUrl(text);
    }
  }, [text, autoPlay]);

  // Audio element event handlers
  const handleAudioPlay = () => setIsPlaying(true);
  const handleAudioPause = () => setIsPlaying(false);
  const handleAudioEnded = () => setIsPlaying(false);

  if (!text) return null;

  if (compact) {
    return (
      <Button
        size="sm"
        variant="outline"
        onClick={togglePlayback}
        disabled={isLoading}
        className={className}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Volume2 className="w-4 h-4" />
        )}
      </Button>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        size="sm"
        variant="outline"
        onClick={togglePlayback}
        disabled={isLoading}
        className="flex items-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {labels.loading || "Loading..."}
          </>
        ) : isPlaying ? (
          <>
            <Pause className="w-4 h-4" />
            {labels.pause || "Pause"}
          </>
        ) : (
          <>
            <Volume2 className="w-4 h-4" />
            {labels.listenToSummary || "Listen to Summary"}
          </>
        )}
      </Button>
      
      {audioUrl && (
        <audio
          ref={audioRef}
          onPlay={handleAudioPlay}
          onPause={handleAudioPause}
          onEnded={handleAudioEnded}
          preload="metadata"
        />
      )}
    </div>
  );
}