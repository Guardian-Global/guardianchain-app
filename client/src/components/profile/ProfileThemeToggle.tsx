import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { 
  Sun, 
  Moon, 
  Monitor, 
  Palette,
  Settings,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProfileThemeToggleProps {
  userId: string;
  isOwner?: boolean;
}

type ThemeOption = "light" | "dark" | "system";
type ColorScheme = "default" | "purple" | "blue" | "green" | "orange";

export default function ProfileThemeToggle({ userId, isOwner = false }: ProfileThemeToggleProps) {
  const [theme, setTheme] = useState<ThemeOption>("system");
  const [colorScheme, setColorScheme] = useState<ColorScheme>("default");
  const [isChanged, setIsChanged] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved theme preferences
    const savedTheme = localStorage.getItem(`profile-theme-${userId}`) as ThemeOption;
    const savedColorScheme = localStorage.getItem(`profile-color-${userId}`) as ColorScheme;
    
    if (savedTheme) setTheme(savedTheme);
    if (savedColorScheme) setColorScheme(savedColorScheme);
  }, [userId]);

  const themeOptions = [
    {
      value: "light" as const,
      label: "Light",
      icon: Sun,
      description: "Light theme",
    },
    {
      value: "dark" as const,
      label: "Dark", 
      icon: Moon,
      description: "Dark theme",
    },
    {
      value: "system" as const,
      label: "System",
      icon: Monitor,
      description: "Follow system",
    },
  ];

  const colorSchemes = [
    { value: "default" as const, label: "Default", color: "bg-brand-primary" },
    { value: "purple" as const, label: "Purple", color: "bg-purple-500" },
    { value: "blue" as const, label: "Blue", color: "bg-blue-500" },
    { value: "green" as const, label: "Green", color: "bg-green-500" },
    { value: "orange" as const, label: "Orange", color: "bg-orange-500" },
  ];

  const handleThemeChange = (newTheme: ThemeOption) => {
    setTheme(newTheme);
    setIsChanged(true);
    
    if (isOwner) {
      // Apply theme immediately for owner
      applyTheme(newTheme, colorScheme);
    }
  };

  const handleColorSchemeChange = (newColorScheme: ColorScheme) => {
    setColorScheme(newColorScheme);
    setIsChanged(true);
    
    if (isOwner) {
      // Apply color scheme immediately for owner
      applyTheme(theme, newColorScheme);
    }
  };

  const applyTheme = (themeValue: ThemeOption, colorValue: ColorScheme) => {
    // Apply theme to document
    if (themeValue === "dark") {
      document.documentElement.classList.add("dark");
    } else if (themeValue === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      // System theme
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }

    // Apply color scheme
    document.documentElement.setAttribute("data-color-scheme", colorValue);
  };

  const savePreferences = () => {
    if (!isOwner) return;

    localStorage.setItem(`profile-theme-${userId}`, theme);
    localStorage.setItem(`profile-color-${userId}`, colorScheme);
    
    applyTheme(theme, colorScheme);
    setIsChanged(false);
    
    toast({
      title: "Theme Saved",
      description: "Your theme preferences have been saved",
    });
  };

  const resetToDefaults = () => {
    setTheme("system");
    setColorScheme("default");
    setIsChanged(true);
    
    if (isOwner) {
      applyTheme("system", "default");
    }
  };

  if (!isOwner) {
    return (
      <Card className="bg-brand-secondary border-brand-surface">
        <CardContent className="p-6 text-center">
          <Settings className="w-8 h-8 text-brand-light/30 mx-auto mb-3" />
          <p className="text-brand-light/60 text-sm">
            Theme settings are only available to profile owners
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-brand-secondary border-brand-surface">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-brand-light flex items-center gap-2">
            <Palette className="w-5 h-5 text-brand-accent" />
            Theme Settings
          </CardTitle>
          
          {isChanged && (
            <Badge variant="outline" className="text-brand-warning border-brand-warning">
              Unsaved Changes
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Theme Selection */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-brand-light">Theme Mode</h4>
          
          <ToggleGroup
            type="single"
            value={theme}
            onValueChange={(value) => value && handleThemeChange(value as ThemeOption)}
            className="grid grid-cols-3 gap-2"
          >
            {themeOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <ToggleGroupItem
                  key={option.value}
                  value={option.value}
                  className="flex flex-col gap-2 p-3 h-auto bg-brand-surface border-brand-light/20 hover:bg-brand-light/10 data-[state=on]:bg-brand-primary data-[state=on]:text-white"
                  data-testid={`theme-${option.value}`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-xs">{option.label}</span>
                </ToggleGroupItem>
              );
            })}
          </ToggleGroup>
        </div>

        {/* Color Scheme Selection */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-brand-light">Color Scheme</h4>
          
          <div className="grid grid-cols-5 gap-2">
            {colorSchemes.map((scheme) => (
              <button
                key={scheme.value}
                onClick={() => handleColorSchemeChange(scheme.value)}
                className={`
                  relative p-3 rounded-lg border transition-all duration-200
                  ${colorScheme === scheme.value 
                    ? 'border-brand-primary bg-brand-primary/20' 
                    : 'border-brand-light/20 hover:border-brand-light/40'
                  }
                `}
                data-testid={`color-${scheme.value}`}
              >
                <div className={`w-6 h-6 rounded-full mx-auto ${scheme.color}`} />
                <div className="text-xs text-brand-light mt-1 truncate">
                  {scheme.label}
                </div>
                
                {colorScheme === scheme.value && (
                  <CheckCircle className="absolute -top-1 -right-1 w-4 h-4 text-brand-primary bg-brand-secondary rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t border-brand-light/10">
          <Button
            onClick={savePreferences}
            disabled={!isChanged}
            className="bg-brand-primary hover:bg-brand-primary/80 flex-1"
            data-testid="button-save-theme"
          >
            <CheckCircle className="w-3 h-3 mr-2" />
            Save Changes
          </Button>
          
          <Button
            onClick={resetToDefaults}
            variant="outline"
            className="border-brand-light/20 hover:bg-brand-light/10 text-brand-light"
            data-testid="button-reset-theme"
          >
            Reset
          </Button>
        </div>

        <div className="text-xs text-brand-light/50 text-center">
          Changes are applied immediately and saved to your browser
        </div>
      </CardContent>
    </Card>
  );
}