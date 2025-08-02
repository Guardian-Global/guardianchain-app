import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Languages, Globe } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isRTL } from "@/utils/rtlSupport";
import { LABELS } from "@/utils/labels";

const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
  { code: "he", name: "Hebrew", nativeName: "עברית", flag: "🇮🇱" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "th", name: "Thai", nativeName: "ไทย", flag: "🇹🇭" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳" },
  {
    code: "id",
    name: "Indonesian",
    nativeName: "Bahasa Indonesia",
    flag: "🇮🇩",
  },
  { code: "ms", name: "Malay", nativeName: "Bahasa Melayu", flag: "🇲🇾" },
  { code: "tl", name: "Filipino", nativeName: "Filipino", flag: "🇵🇭" },
  { code: "sw", name: "Swahili", nativeName: "Kiswahili", flag: "🇹🇿" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷" },
  { code: "pl", name: "Polish", nativeName: "Polski", flag: "🇵🇱" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", flag: "🇳🇱" },
];

interface LanguageSelectorProps {
  compact?: boolean;
  showFlag?: boolean;
  className?: string;
}

export default function LanguageSelector({
  compact = false,
  showFlag = true,
  className = "",
}: LanguageSelectorProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const currentLanguage = user?.language || "en";
  const selectedLang =
    SUPPORTED_LANGUAGES.find((lang) => lang.code === currentLanguage) ||
    SUPPORTED_LANGUAGES[0];
  const isRTLLayout = isRTL(currentLanguage);
  const labels = LABELS[currentLanguage] || LABELS["en"];

  const updateLanguageMutation = useMutation({
    mutationFn: async (language: string) => {
      return apiRequest("PUT", "/api/user/language", { language });
    },
    onSuccess: (data, language) => {
      toast({
        title: labels.success || "Success",
        description:
          labels.languageUpdated || "Language preference updated successfully",
      });
      // Invalidate user data to refresh language
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });

      // Force page reload to apply RTL changes
      setTimeout(() => {
        window.location.reload();
      }, 500);
    },
    onError: (error: any) => {
      toast({
        title: labels.error || "Error",
        description: error.message || "Failed to update language preference",
        variant: "destructive",
      });
    },
  });

  const handleLanguageChange = (languageCode: string) => {
    if (languageCode !== currentLanguage) {
      updateLanguageMutation.mutate(languageCode);
    }
  };

  if (compact) {
    return (
      <Select value={currentLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger className={`w-auto min-w-[120px] ${className}`}>
          <SelectValue>
            <div className="flex items-center gap-2">
              {showFlag && <span>{selectedLang.flag}</span>}
              <span>{selectedLang.nativeName}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {SUPPORTED_LANGUAGES.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              <div className="flex items-center gap-2">
                {showFlag && <span>{lang.flag}</span>}
                <span>{lang.nativeName}</span>
                {isRTL(lang.code) && (
                  <Badge variant="secondary" className="text-xs">
                    RTL
                  </Badge>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <div className={`space-y-4 ${className}`} dir={isRTLLayout ? "rtl" : "ltr"}>
      <div className="flex items-center gap-2">
        <Globe className="w-5 h-5" />
        <h3 className="text-lg font-semibold">
          {labels.languageSettings || "Language Settings"}
        </h3>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium mb-2 block">
            {labels.preferredLanguage || "Preferred Language"}
          </label>
          <Select
            value={currentLanguage}
            onValueChange={handleLanguageChange}
            disabled={updateLanguageMutation.isPending}
          >
            <SelectTrigger className="w-full">
              <SelectValue>
                <div className="flex items-center gap-3">
                  <span className="text-lg">{selectedLang.flag}</span>
                  <div className="flex flex-col items-start">
                    <span className="font-medium">
                      {selectedLang.nativeName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {selectedLang.name}
                    </span>
                  </div>
                  {isRTL(selectedLang.code) && (
                    <Badge variant="outline" className="text-xs">
                      RTL
                    </Badge>
                  )}
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  <div className="flex items-center gap-3 py-1">
                    <span className="text-lg">{lang.flag}</span>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{lang.nativeName}</span>
                      <span className="text-xs text-muted-foreground">
                        {lang.name}
                      </span>
                    </div>
                    {isRTL(lang.code) && (
                      <Badge variant="outline" className="text-xs ml-auto">
                        RTL
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="p-3 bg-muted rounded-lg">
          <div className="flex items-start gap-2">
            <Languages className="w-4 h-4 mt-0.5 text-muted-foreground" />
            <div className="text-sm text-muted-foreground">
              <p>
                {labels.languageNote ||
                  "Changing your language will update the interface and enable auto-translation for content."}
              </p>
              {isRTL(currentLanguage) && (
                <p className="mt-1 font-medium">
                  {labels.rtlNote ||
                    "Right-to-left layout is active for this language."}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
