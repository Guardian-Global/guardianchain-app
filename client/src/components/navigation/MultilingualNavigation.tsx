import { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import { LanguageSelector } from "../LanguageSelector";
import { useAuth } from "../../hooks/useAuth";
import { isRTL, getRTLContainerProps } from "../../utils/rtlSupport";

interface NavItem {
  id: string;
  label: string;
  href: string;
  tier?: string;
  badge?: string;
  icon?: React.ReactNode;
  children?: NavItem[];
}

interface MultilingualNavigationProps {
  items: NavItem[];
  userLanguage?: string;
  onLanguageChange?: (language: string) => void;
}

export function MultilingualNavigation({
  items,
  userLanguage = "en",
  onLanguageChange,
}: MultilingualNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [translations, setTranslations] = useState<Record<string, string>>({});

  const { user } = useAuth();
  const userTier = user?.tier || "EXPLORER";

  // RTL support
  const rtlProps = isRTL(userLanguage) ? getRTLContainerProps() : {};

  // Swipe navigation
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () =>
      !isRTL(userLanguage) ? navigateNext() : navigatePrevious(),
    onSwipedRight: () =>
      !isRTL(userLanguage) ? navigatePrevious() : navigateNext(),
    trackMouse: true,
    trackTouch: true,
  });

  // Section navigation
  const sections = [
    { id: "main", label: "Main", items: items.slice(0, 8) },
    { id: "tools", label: "Tools", items: items.slice(8, 16) },
    { id: "advanced", label: "Advanced", items: items.slice(16) },
  ];

  const navigateNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const navigatePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  // Load translations for current language
  useEffect(() => {
    const loadTranslations = async () => {
      if (userLanguage === "en") {
        setTranslations({});
        return;
      }

      // Mock translation service - replace with actual API
      const mockTranslations: Record<string, Record<string, string>> = {
        es: {
          Dashboard: "Tablero",
          "Create Capsule": "Crear Cápsula",
          Explore: "Explorar",
          Profile: "Perfil",
          Settings: "Configuración",
        },
        fr: {
          Dashboard: "Tableau de bord",
          "Create Capsule": "Créer une capsule",
          Explore: "Explorer",
          Profile: "Profil",
          Settings: "Paramètres",
        },
        ar: {
          Dashboard: "لوحة التحكم",
          "Create Capsule": "إنشاء كبسولة",
          Explore: "استكشاف",
          Profile: "الملف الشخصي",
          Settings: "الإعدادات",
        },
        zh: {
          Dashboard: "仪表板",
          "Create Capsule": "创建胶囊",
          Explore: "探索",
          Profile: "个人资料",
          Settings: "设置",
        },
      };

      setTranslations(mockTranslations[userLanguage] || {});
    };

    loadTranslations();
  }, [userLanguage]);

  const translateText = (text: string) => {
    return translations[text] || text;
  };

  const isItemAccessible = (item: NavItem) => {
    if (!item.tier) return true;

    const tierOrder = ["EXPLORER", "SEEKER", "CREATOR", "SOVEREIGN"];
    const userTierIndex = tierOrder.indexOf(userTier);
    const requiredTierIndex = tierOrder.indexOf(item.tier);

    return userTierIndex >= requiredTierIndex;
  };

  const renderNavItem = (item: NavItem) => {
    const isAccessible = isItemAccessible(item);

    return (
      <div
        key={item.id}
        className={`group relative ${!isAccessible ? "opacity-50" : ""}`}
      >
        <Button
          variant={isAccessible ? "ghost" : "outline"}
          className={`w-full justify-start text-left h-auto p-3 ${
            isRTL(userLanguage) ? "flex-row-reverse" : ""
          }`}
          disabled={!isAccessible}
          onClick={() => isAccessible && (window.location.href = item.href)}
        >
          <div className="flex items-center space-x-3 w-full">
            {item.icon && <span className="text-lg">{item.icon}</span>}
            <div className="flex-1">
              <div className="font-medium">{translateText(item.label)}</div>
              {item.tier && (
                <div className="text-xs text-muted-foreground">
                  {item.tier} tier required
                </div>
              )}
            </div>
            {item.badge && (
              <Badge variant="secondary" className="ml-auto">
                {item.badge}
              </Badge>
            )}
          </div>
        </Button>

        {/* Tier upgrade hint */}
        {!isAccessible && (
          <div className="absolute inset-0 bg-black/5 dark:bg-white/5 rounded-md pointer-events-none" />
        )}
      </div>
    );
  };

  return (
    <div {...rtlProps}>
      {/* Mobile toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Navigation panel */}
      <div
        className={`
        fixed top-0 ${isRTL(userLanguage) ? "right-0" : "left-0"} h-full w-80 
        bg-background border-r border-border
        transform transition-transform duration-300 z-40
        ${isOpen ? "translate-x-0" : isRTL(userLanguage) ? "translate-x-full" : "-translate-x-full"}
        md:translate-x-0 md:relative md:block
      `}
      >
        <div className="flex flex-col h-full">
          {/* Header with language selector */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                {translateText("Navigation")}
              </h2>
              <LanguageSelector
                currentLanguage={userLanguage}
                onLanguageChange={onLanguageChange}
              />
            </div>

            {/* Section navigation */}
            <div className="flex items-center space-x-2" {...swipeHandlers}>
              <Button
                variant="ghost"
                size="icon"
                onClick={navigatePrevious}
                disabled={currentSection === 0}
                className="h-8 w-8"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="flex-1 text-center">
                <div className="text-sm font-medium">
                  {translateText(sections[currentSection]?.label || "Main")}
                </div>
                <div className="text-xs text-muted-foreground">
                  {currentSection + 1} / {sections.length}
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={navigateNext}
                disabled={currentSection === sections.length - 1}
                className="h-8 w-8"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Scrollable navigation items */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-2">
              {sections[currentSection]?.items.map(renderNavItem)}
            </div>
          </ScrollArea>

          {/* Footer with user info */}
          {user && (
            <div className="p-4 border-t border-border">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                  {user.firstName?.[0] || user.email[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {user.firstName || user.email}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {userTier} Tier
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
