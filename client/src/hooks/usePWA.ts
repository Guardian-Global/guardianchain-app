import { useState, useEffect } from "react";

interface PWAHook {
  isInstallable: boolean;
  isInstalled: boolean;
  isOffline: boolean;
  installApp: () => Promise<void>;
  isLoading: boolean;
}

export function usePWA(): PWAHook {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isLoading, setIsLoading] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<unknown>(null);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    // Listen for app installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    // Listen for online/offline events
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const installApp = async (): Promise<void> => {
    if (!deferredPrompt) {
      throw new Error("App installation not available");
    }

    setIsLoading(true);

    try {
      if (
        deferredPrompt &&
        typeof deferredPrompt === "object" &&
        "prompt" in deferredPrompt &&
        typeof (deferredPrompt as any).prompt === "function" &&
        "userChoice" in deferredPrompt
      ) {
        await (deferredPrompt as any).prompt();
        const userChoice = await (deferredPrompt as any).userChoice;
        if (userChoice && userChoice.outcome === "accepted") {
          // App was installed
        }
      }

      if (outcome === "accepted") {
        console.log("✅ User accepted PWA install");
        setIsInstalled(true);
      } else {
        console.log("❌ User dismissed PWA install");
      }

      setDeferredPrompt(null);
      setIsInstallable(false);
    } catch (error) {
      console.error("❌ PWA installation error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isInstallable,
    isInstalled,
    isOffline,
    installApp,
    isLoading,
  };
}
