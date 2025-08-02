import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Languages, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { LABELS } from "@/utils/labels";

interface TranslateToggleProps {
  summary: string;
  translated?: string;
  className?: string;
  showButton?: boolean;
  autoTranslate?: boolean;
}

export default function TranslateToggle({ 
  summary, 
  translated, 
  className = "",
  showButton = true,
  autoTranslate = false
}: TranslateToggleProps) {
  const { user } = useAuth();
  const [isTranslated, setIsTranslated] = useState(false);
  const [translatedText, setTranslatedText] = useState(translated || "");
  const [isLoading, setIsLoading] = useState(false);
  
  const userLanguage = user?.language || 'en';
  const labels = LABELS[userLanguage] || LABELS['en'];
  const shouldAutoTranslate = autoTranslate && userLanguage !== 'en';

  // Auto-translate if user language is not English
  useEffect(() => {
    if (shouldAutoTranslate && !translatedText && summary) {
      translateText();
    }
  }, [summary, userLanguage, shouldAutoTranslate]);

  const translateText = async () => {
    if (isLoading || !summary) return;
    
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          text: summary,
          targetLanguage: userLanguage,
          sourceLanguage: 'auto'
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setTranslatedText(data.translatedText);
        if (shouldAutoTranslate) {
          setIsTranslated(true);
        }
      }
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTranslation = () => {
    if (!translatedText && !isLoading) {
      translateText();
    }
    if (translatedText) {
      setIsTranslated(!isTranslated);
    }
  };

  const displayText = isTranslated && translatedText ? translatedText : summary;

  return (
    <div className="space-y-2">
      <p className={className}>
        {displayText}
      </p>
      
      {showButton && userLanguage !== 'en' && (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={toggleTranslation}
            disabled={isLoading}
            className="text-xs flex items-center gap-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                {labels.translate || "Translating..."}
              </>
            ) : (
              <>
                <Languages className="w-3 h-3" />
                {isTranslated ? (labels.original || "Original") : (labels.translate || "Translate")}
              </>
            )}
          </Button>
          
          {translatedText && (
            <span className="text-xs text-muted-foreground">
              {isTranslated ? `${labels.translated || "Translated"} (${userLanguage})` : "English"}
            </span>
          )}
        </div>
      )}
    </div>
  );
}