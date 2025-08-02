import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Languages, Loader2, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { detectUserLanguage, getLabel } from "@/lib/labels";
import { isRTL, getTextDirection } from "@/lib/rtlSupport";

interface TranslateToggleProps {
  summary: string;
  translated?: string;
  targetLanguage?: string;
  showBadge?: boolean;
  className?: string;
}

export default function TranslateToggle({
  summary,
  translated,
  targetLanguage,
  showBadge = true,
  className = ""
}: TranslateToggleProps) {
  const [isTranslated, setIsTranslated] = useState(false);
  const [translatedText, setTranslatedText] = useState(translated || "");
  const [isTranslating, setIsTranslating] = useState(false);
  const [currentLang, setCurrentLang] = useState(targetLanguage || detectUserLanguage());
  const { toast } = useToast();

  useEffect(() => {
    // Auto-translate if user language is not English and we have a summary
    if (currentLang !== "en" && summary && !translatedText) {
      handleTranslate();
    }
  }, [summary, currentLang]);

  const handleTranslate = async () => {
    if (isTranslating) return;
    
    if (isTranslated && translatedText) {
      // Toggle back to original
      setIsTranslated(false);
      return;
    }

    setIsTranslating(true);
    
    try {
      const response = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: summary,
          targetLanguage: currentLang,
          sourceLanguage: 'en'
        }),
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data = await response.json();
      setTranslatedText(data.translatedText);
      setIsTranslated(true);
      
      toast({
        title: getLabel("translation", currentLang),
        description: getLabel("translationComplete", currentLang),
      });
    } catch (error) {
      console.error('Translation error:', error);
      toast({
        title: getLabel("error", currentLang),
        description: getLabel("translationFailed", currentLang),
        variant: "destructive",
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const displayText = isTranslated && translatedText ? translatedText : summary;
  const textDirection = getTextDirection(currentLang);
  const shouldShowToggle = currentLang !== "en" || translatedText;

  return (
    <div className={`space-y-2 ${className}`} dir={textDirection}>
      {/* Translation Controls */}
      {shouldShowToggle && (
        <div className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            {showBadge && (
              <Badge variant={isTranslated ? "default" : "outline"} className="text-xs">
                <Globe className="w-3 h-3 mr-1" />
                {isTranslated ? currentLang.toUpperCase() : "EN"}
              </Badge>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleTranslate}
            disabled={isTranslating}
            className="flex items-center gap-1 text-xs"
          >
            {isTranslating ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Languages className="w-3 h-3" />
            )}
            {isTranslating
              ? getLabel("translating", currentLang)
              : isTranslated
              ? getLabel("original", currentLang)
              : getLabel("translate", currentLang)
            }
          </Button>
        </div>
      )}

      {/* Translated Content */}
      <div 
        className="text-sm text-muted-foreground leading-relaxed"
        style={{ 
          direction: textDirection,
          textAlign: isRTL(currentLang) ? 'right' : 'left'
        }}
      >
        {displayText}
      </div>

      {/* Language Detection Info */}
      {isTranslated && translatedText && (
        <div className="text-xs text-muted-foreground opacity-75">
          {getLabel("translatedFrom", currentLang)} English → {currentLang.toUpperCase()}
        </div>
      )}
    </div>
  );
}