import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Download, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after a delay
      setTimeout(() => {
        if (!localStorage.getItem('pwa-prompt-dismissed')) {
          setShowPrompt(true);
        }
      }, 10000); // Show after 10 seconds
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      console.log('PWA was installed');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
    
    // Show again after 7 days
    setTimeout(() => {
      localStorage.removeItem('pwa-prompt-dismissed');
    }, 7 * 24 * 60 * 60 * 1000);
  };

  // Don't show if already installed or no prompt available
  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
      <Card className="bg-gradient-to-r from-hsl(217,33%,17%) to-hsl(220,39%,11%) border-[#00ffe1]/30 shadow-2xl">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center">
              <Smartphone className="w-6 h-6 text-[#00ffe1] mr-2" />
              <h3 className="font-semibold text-[#00ffe1]">Install GuardianChain</h3>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleDismiss}
              className="text-hsl(180,100%,70%) hover:text-[#ff00d4] p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <p className="text-sm text-hsl(180,100%,70%) mb-4">
            Install our app for faster access, offline support, and native mobile experience.
          </p>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleInstall}
              className="flex-1 bg-gradient-to-r from-[#00ffe1] to-[#ff00d4] hover:opacity-90 text-black font-semibold"
            >
              <Download className="w-4 h-4 mr-2" />
              Install
            </Button>
            <Button 
              variant="outline"
              onClick={handleDismiss}
              className="border-hsl(217,33%,24%) text-hsl(180,100%,70%) hover:bg-hsl(220,39%,11%)/50"
            >
              Later
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}