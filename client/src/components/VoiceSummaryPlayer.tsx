import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Languages,
  Mic,
  Download,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VoiceSummaryPlayerProps {
  text: string;
  language?: string;
  autoTranslate?: boolean;
  showDownload?: boolean;
  className?: string;
}

export default function VoiceSummaryPlayer({
  text,
  language = "en",
  autoTranslate = false,
  showDownload = false,
  className = ""
}: VoiceSummaryPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState(language);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (autoTranslate && language !== "en") {
      translateText();
    }
  }, [text, language, autoTranslate]);

  const translateText = async () => {
    if (language === "en") {
      setTranslatedText(null);
      return;
    }

    try {
      // Mock translation for development - in production would use Google Translate API
      const mockTranslations: Record<string, string> = {
        "es": `Traducción: ${text.substring(0, 100)}...`,
        "fr": `Traduction: ${text.substring(0, 100)}...`,
        "de": `Übersetzung: ${text.substring(0, 100)}...`,
        "zh": `翻译: ${text.substring(0, 50)}...`,
        "ja": `翻訳: ${text.substring(0, 50)}...`,
        "ru": `Перевод: ${text.substring(0, 100)}...`
      };

      setTranslatedText(mockTranslations[language] || text);
    } catch (error) {
      console.error('Translation failed:', error);
      setTranslatedText(text);
    }
  };

  const speak = async () => {
    if (!('speechSynthesis' in window)) {
      toast({
        title: "Voice Not Supported",
        description: "Your browser doesn't support text-to-speech",
        variant: "destructive"
      });
      return;
    }

    const textToSpeak = translatedText || text;
    
    if (speechSynthesis.speaking) {
      if (isPaused) {
        speechSynthesis.resume();
        setIsPaused(false);
        setIsPlaying(true);
        return;
      } else {
        speechSynthesis.cancel();
        setIsPlaying(false);
        setIsPaused(false);
        return;
      }
    }

    setIsGenerating(true);
    
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = isMuted ? 0 : 1;

    // Set voice based on language
    const voices = speechSynthesis.getVoices();
    const languageVoice = voices.find(voice => 
      voice.lang.startsWith(currentLanguage) || 
      voice.lang.startsWith(language)
    );
    if (languageVoice) {
      utterance.voice = languageVoice;
    }

    utterance.onstart = () => {
      setIsGenerating(false);
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsGenerating(false);
      setIsPlaying(false);
      setIsPaused(false);
      toast({
        title: "Voice Generation Failed",
        description: "Unable to generate voice summary",
        variant: "destructive"
      });
    };

    speechRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const pause = () => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const stop = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (speechRef.current) {
      speechRef.current.volume = isMuted ? 1 : 0;
    }
  };

  const downloadAudio = () => {
    toast({
      title: "Download Feature Coming Soon",
      description: "Audio download will be available in the next update",
    });
  };

  const getLanguageLabel = (lang: string) => {
    const labels: Record<string, string> = {
      "en": "English",
      "es": "Español",
      "fr": "Français", 
      "de": "Deutsch",
      "zh": "中文",
      "ja": "日本語",
      "ru": "Русский"
    };
    return labels[lang] || lang.toUpperCase();
  };

  return (
    <Card className={`border-blue-200 bg-blue-50 dark:bg-blue-950 ${className}`}>
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Play/Pause Button */}
            {isGenerating ? (
              <Button size="sm" disabled className="h-8 w-8 p-0">
                <RefreshCw className="w-4 h-4 animate-spin" />
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={isPlaying ? pause : speak}
                className="h-8 w-8 p-0"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>
            )}

            {/* Voice Label */}
            <div className="flex items-center gap-1">
              <Mic className="w-3 h-3 text-blue-600" />
              <span className="text-xs font-medium text-blue-800 dark:text-blue-200">
                Listen to Summary
              </span>
            </div>

            {/* Language Badge */}
            {(autoTranslate || language !== "en") && (
              <Badge variant="outline" className="text-xs">
                <Languages className="w-3 h-3 mr-1" />
                {getLanguageLabel(currentLanguage)}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Mute Toggle */}
            <Button
              size="sm"
              variant="ghost"
              onClick={toggleMute}
              className="h-6 w-6 p-0"
            >
              {isMuted ? (
                <VolumeX className="w-3 h-3" />
              ) : (
                <Volume2 className="w-3 h-3" />
              )}
            </Button>

            {/* Download Button */}
            {showDownload && (
              <Button
                size="sm"
                variant="ghost"
                onClick={downloadAudio}
                className="h-6 w-6 p-0"
              >
                <Download className="w-3 h-3" />
              </Button>
            )}

            {/* Stop Button */}
            {(isPlaying || isPaused) && (
              <Button
                size="sm"
                variant="ghost"
                onClick={stop}
                className="h-6 w-6 p-0"
              >
                <div className="w-2 h-2 bg-current" />
              </Button>
            )}
          </div>
        </div>

        {/* Translated Text Preview */}
        {translatedText && autoTranslate && (
          <div className="mt-2 p-2 bg-white dark:bg-gray-800 rounded text-xs">
            <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
              {translatedText}
            </p>
          </div>
        )}

        {/* Playing Indicator */}
        {isPlaying && (
          <div className="mt-2 flex items-center gap-2">
            <div className="flex gap-1">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-1 h-3 bg-blue-500 animate-pulse"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
            <span className="text-xs text-blue-600">Playing summary...</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}