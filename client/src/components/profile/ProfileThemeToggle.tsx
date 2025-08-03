import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Monitor } from "lucide-react";

type Theme = "light" | "dark" | "system";

export default function ProfileThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    // Get saved theme from localStorage
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
    
    // Apply theme on mount
    applyTheme(savedTheme || "system");
  }, []);

  const applyTheme = (selectedTheme: Theme) => {
    const root = document.documentElement;
    
    if (selectedTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.toggle("dark", systemTheme === "dark");
    } else {
      root.classList.toggle("dark", selectedTheme === "dark");
    }
    
    localStorage.setItem("theme", selectedTheme);
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const themes = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ] as const;

  return (
    <Card className="bg-brand-secondary border-brand-surface w-64">
      <CardHeader>
        <CardTitle className="text-brand-light flex items-center gap-2">
          <Monitor className="w-5 h-5 text-brand-accent" />
          Theme Preference
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          {themes.map((themeOption) => {
            const Icon = themeOption.icon;
            const isActive = theme === themeOption.value;
            
            return (
              <Button
                key={themeOption.value}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => handleThemeChange(themeOption.value)}
                className={`
                  flex flex-col items-center gap-1 h-auto p-3 transition-all
                  ${isActive 
                    ? "bg-brand-primary text-white border-brand-primary" 
                    : "border-brand-light/20 text-brand-light hover:bg-brand-light/10"
                  }
                `}
                data-testid={`theme-${themeOption.value}`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs">{themeOption.label}</span>
              </Button>
            );
          })}
        </div>
        
        <div className="text-xs text-brand-light/60 text-center">
          {theme === "system" 
            ? "Following system preference" 
            : `Using ${theme} mode`
          }
        </div>
      </CardContent>
    </Card>
  );
}