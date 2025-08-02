import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Languages, Loader2 } from "lucide-react";

interface TranslateToggleProps {
  text: string;
  targetLanguage?: string;
  className?: string;
}

export default function TranslateToggle({
  text,
  targetLanguage = "en",
  className = "",
}: TranslateToggleProps) {
  const [isTranslating, setIsTranslating] = useState(false);
  const [isTranslated, setIsTranslated] = useState(false);

  const handleTranslate = async () => {
    setIsTranslating(true);

    // Mock translation - replace with actual API call
    setTimeout(() => {
      setIsTranslating(false);
      setIsTranslated(!isTranslated);
    }, 1000);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleTranslate}
      disabled={isTranslating}
      className={`${className} text-xs`}
    >
      {isTranslating ? (
        <Loader2 className="w-3 h-3 animate-spin mr-1" />
      ) : (
        <Languages className="w-3 h-3 mr-1" />
      )}
      {isTranslated ? `Translated (${targetLanguage})` : "Translate"}
    </Button>
  );
}
