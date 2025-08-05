import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Smartphone } from "lucide-react";
import { usePWAInstallPrompt } from "@/lib/usePWAInstallPrompt";
import { Badge } from "@/components/ui/badge";

interface PWAInstallButtonProps {
  className?: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
}

export default function PWAInstallButton({ 
  className = "", 
  variant = "default",
  size = "default" 
}: PWAInstallButtonProps) {
  const { showInstall, triggerInstall } = usePWAInstallPrompt();

  if (!showInstall) {
    return null;
  }

  const handleInstall = async () => {
    try {
      const outcome = await triggerInstall();
      if (outcome === 'accepted') {
        console.log('PWA installation accepted');
      }
    } catch (error) {
      console.error('PWA installation failed:', error);
    }
  };

  return (
    <div className="relative">
      <Button
        onClick={handleInstall}
        variant={variant}
        size={size}
        className={`inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${className}`}
        data-testid="button-install-pwa"
      >
        <Smartphone className="w-4 h-4" />
        Install App
        <Download className="w-4 h-4" />
      </Button>
      <Badge 
        variant="secondary" 
        className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1.5 py-0.5 animate-pulse"
      >
        NEW
      </Badge>
    </div>
  );
}