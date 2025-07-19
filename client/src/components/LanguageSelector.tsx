import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Globe, Check } from "lucide-react";
import { useTranslation, SUPPORTED_LANGUAGES } from "@/lib/i18n";

export default function LanguageSelector() {
  const { currentLanguage, setLanguage, supportedLanguages } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = supportedLanguages.find(lang => lang.code === currentLanguage);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-slate-300 hover:text-white border border-slate-600 hover:border-slate-500 transition-colors"
        >
          <Globe className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline mr-1">{currentLang?.nativeName}</span>
          <span className="text-lg">{currentLang?.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-64 bg-slate-800 border-slate-700 max-h-96 overflow-y-auto"
      >
        <div className="p-2 border-b border-slate-700">
          <div className="text-sm font-medium text-slate-300 mb-1">Select Language</div>
          <div className="text-xs text-slate-400">Available in {supportedLanguages.length} languages</div>
        </div>
        
        {/* Primary Languages (Top Markets) */}
        <div className="p-2">
          <div className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">
            Primary Markets
          </div>
          {SUPPORTED_LANGUAGES.filter(lang => 
            ['en', 'zh', 'ja', 'ko', 'es', 'fr', 'de', 'ru'].includes(lang.code)
          ).map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => {
                setLanguage(language.code);
                setIsOpen(false);
              }}
              className="flex items-center justify-between p-2 hover:bg-slate-700 cursor-pointer rounded"
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{language.flag}</span>
                <div>
                  <div className="font-medium text-slate-200">{language.nativeName}</div>
                  <div className="text-xs text-slate-400">{language.name}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {language.code === 'zh' && (
                  <Badge variant="outline" className="text-xs border-green-600 text-green-400">
                    Major Market
                  </Badge>
                )}
                {language.code === 'ja' && (
                  <Badge variant="outline" className="text-xs border-purple-600 text-purple-400">
                    High Volume
                  </Badge>
                )}
                {currentLanguage === language.code && (
                  <Check className="w-4 h-4 text-green-400" />
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </div>

        {/* Secondary Languages */}
        <div className="p-2 border-t border-slate-700">
          <div className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">
            Additional Markets
          </div>
          {SUPPORTED_LANGUAGES.filter(lang => 
            !['en', 'zh', 'ja', 'ko', 'es', 'fr', 'de', 'ru'].includes(lang.code)
          ).map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => {
                setLanguage(language.code);
                setIsOpen(false);
              }}
              className="flex items-center justify-between p-2 hover:bg-slate-700 cursor-pointer rounded"
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{language.flag}</span>
                <div>
                  <div className="font-medium text-slate-200">{language.nativeName}</div>
                  <div className="text-xs text-slate-400">{language.name}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {language.code === 'ar' && (
                  <Badge variant="outline" className="text-xs border-yellow-600 text-yellow-400">
                    RTL
                  </Badge>
                )}
                {language.code === 'hi' && (
                  <Badge variant="outline" className="text-xs border-blue-600 text-blue-400">
                    Emerging
                  </Badge>
                )}
                {currentLanguage === language.code && (
                  <Check className="w-4 h-4 text-green-400" />
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </div>

        <div className="p-2 border-t border-slate-700">
          <div className="text-xs text-slate-400 text-center">
            GTT Token launching worldwide in Q1 2025
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}