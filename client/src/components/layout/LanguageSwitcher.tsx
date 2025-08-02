import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, Check } from "lucide-react";

interface Language {
  code: string;
  name: string;
  flag: string;
  nativeName: string;
}

const supportedLanguages: Language[] = [
  { code: "en", name: "English", flag: "🇺🇸", nativeName: "English" },
  { code: "es", name: "Spanish", flag: "🇪🇸", nativeName: "Español" },
  { code: "fr", name: "French", flag: "🇫🇷", nativeName: "Français" },
  { code: "de", name: "German", flag: "🇩🇪", nativeName: "Deutsch" },
  { code: "ja", name: "Japanese", flag: "🇯🇵", nativeName: "日本語" },
  { code: "ko", name: "Korean", flag: "🇰🇷", nativeName: "한국어" },
  { code: "zh", name: "Chinese", flag: "🇨🇳", nativeName: "中文" },
  { code: "pt", name: "Portuguese", flag: "🇧🇷", nativeName: "Português" },
  { code: "ru", name: "Russian", flag: "🇷🇺", nativeName: "Русский" },
  { code: "ar", name: "Arabic", flag: "🇸🇦", nativeName: "العربية" },
];

const LanguageSwitcher = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(
    supportedLanguages.find((lang) => lang.code === "en") ||
      supportedLanguages[0],
  );

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);

    // Store preference in localStorage
    localStorage.setItem("guardianchain_language", language.code);

    // Here you would typically integrate with i18n library
    // For example with react-i18next:
    // i18n.changeLanguage(language.code);

    // For demo purposes, we'll just show the selection
    console.log(`Language changed to: ${language.name} (${language.code})`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-slate-400 hover:text-white"
        >
          <Globe className="h-4 w-4 mr-2" />
          <span className="text-sm">{currentLanguage.flag}</span>
          <span className="hidden sm:inline ml-1">
            {currentLanguage.code.toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56 bg-slate-800 border-slate-700"
      >
        <div className="px-2 py-1.5 text-xs font-medium text-slate-400 uppercase tracking-wider">
          Select Language
        </div>

        {supportedLanguages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language)}
            className="flex items-center justify-between cursor-pointer hover:bg-slate-700 text-slate-300 hover:text-white"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{language.flag}</span>
              <div>
                <div className="font-medium">{language.name}</div>
                <div className="text-xs text-slate-500">
                  {language.nativeName}
                </div>
              </div>
            </div>

            {currentLanguage.code === language.code && (
              <Check className="h-4 w-4 text-green-400" />
            )}
          </DropdownMenuItem>
        ))}

        <div className="border-t border-slate-700 mt-1 pt-1">
          <div className="px-2 py-1.5 text-xs text-slate-500">
            More languages coming soon
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
