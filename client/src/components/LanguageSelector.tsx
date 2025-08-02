import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { detectUserLanguage } from "@/lib/rtlSupport";

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk' }
];

interface LanguageSelectorProps {
  className?: string;
  variant?: "button" | "select";
  onLanguageChange?: (language: string) => void;
}

export default function LanguageSelector({ 
  className,
  variant = "select",
  onLanguageChange 
}: LanguageSelectorProps) {
  const [currentLanguage, setCurrentLanguage] = useState(detectUserLanguage());
  const [isUpdating, setIsUpdating] = useState(false);

  const handleLanguageChange = async (languageCode: string) => {
    if (languageCode === currentLanguage) return;
    
    setIsUpdating(true);
    
    try {
      // Store in localStorage for immediate use
      localStorage.setItem('userLanguage', languageCode);
      
      // Call API to update user preference
      const response = await fetch('/api/user/preferred-language', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ preferredLanguage: languageCode }),
      });

      if (response.ok) {
        setCurrentLanguage(languageCode);
        onLanguageChange?.(languageCode);
        
        // Reload the page to apply RTL/LTR changes
        window.location.reload();
      } else {
        console.error('Failed to update language preference');
      }
    } catch (error) {
      console.error('Error updating language preference:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getCurrentLanguageName = () => {
    const lang = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage);
    return lang?.nativeName || lang?.name || 'English';
  };

  if (variant === "button") {
    return (
      <Button
        variant="outline"
        size="sm"
        className={cn(
          "flex items-center gap-2 min-w-[120px]",
          className
        )}
        disabled={isUpdating}
      >
        <Globe className="w-4 h-4" />
        <span>{getCurrentLanguageName()}</span>
      </Button>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Globe className="w-4 h-4 text-muted-foreground" />
      <Select
        value={currentLanguage}
        onValueChange={handleLanguageChange}
        disabled={isUpdating}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Language" />
        </SelectTrigger>
        <SelectContent>
          {SUPPORTED_LANGUAGES.map((language) => (
            <SelectItem key={language.code} value={language.code}>
              <div className="flex items-center justify-between w-full">
                <span>{language.nativeName}</span>
                {language.code === currentLanguage && (
                  <Check className="w-4 h-4 ml-2" />
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}