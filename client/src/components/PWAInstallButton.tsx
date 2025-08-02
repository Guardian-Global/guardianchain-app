import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Smartphone, X, Wifi, WifiOff } from "lucide-react";
import { usePWA } from "@/hooks/usePWA";

export default function PWAInstallButton() {
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const { canInstall, isInstalled, isOnline, installApp } = usePWA();

  const handleInstallClick = async () => {
    const success = await installApp();
    if (!success) {
      localStorage.setItem('pwa-install-dismissed', 'true');
    }
    setShowInstallBanner(false);
  };

  const dismissBanner = () => {
    setShowInstallBanner(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Show offline indicator if not online
  if (!isOnline) {
    return (
      <div className="flex items-center gap-2 text-xs text-orange-600 dark:text-orange-400">
        <WifiOff className="w-3 h-3" />
        <span className="hidden md:inline">Offline</span>
      </div>
    );
  }

  // Don't show anything if already installed
  if (isInstalled) {
    return (
      <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
        <Smartphone className="w-3 h-3" />
        <span className="hidden md:inline">Installed</span>
      </div>
    );
  }

  // Compact button for topbar/header
  if (!showInstallBanner && canInstall) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleInstallClick}
        className="hidden md:flex items-center gap-2 text-xs"
      >
        <Download className="w-3 h-3" />
        Install App
      </Button>
    );
  }

  // Full install banner
  if (showInstallBanner && canInstall) {
    return (
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:max-w-sm bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg p-4 z-50">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
            <Smartphone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
              Install GuardianChain
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
              Get faster access and offline support for your truth vault
            </p>
            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                onClick={handleInstallClick}
                className="text-xs h-7"
              >
                Install
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={dismissBanner}
                className="text-xs h-7"
              >
                Not now
              </Button>
            </div>
          </div>
          <button
            onClick={dismissBanner}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return null;
}