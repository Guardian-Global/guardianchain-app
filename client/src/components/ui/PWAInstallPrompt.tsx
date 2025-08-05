import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Smartphone, Download } from "lucide-react";
import { usePWAInstallPrompt } from "@/lib/usePWAInstallPrompt";

interface PWAInstallPromptProps {
  onDismiss?: () => void;
}

export default function PWAInstallPrompt({ onDismiss }: PWAInstallPromptProps) {
  const { showInstall, triggerInstall } = usePWAInstallPrompt();
  const [dismissed, setDismissed] = useState(false);

  if (!showInstall || dismissed) {
    return null;
  }

  const handleInstall = async () => {
    try {
      const outcome = await triggerInstall();
      if (outcome === 'accepted') {
        console.log('PWA installation accepted');
        setDismissed(true);
        onDismiss?.();
      }
    } catch (error) {
      console.error('PWA installation failed:', error);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <Card className="fixed bottom-6 right-6 z-50 w-80 bg-gradient-to-br from-slate-800 to-slate-900 border-cyan-500/30 shadow-2xl animate-slide-up">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-cyan-400" />
            Install GuardianChain
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            className="h-6 w-6 text-slate-400 hover:text-white"
            data-testid="button-dismiss-pwa-prompt"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-300">
          Install GuardianChain as an app for faster access and better performance. Works offline too!
        </p>
        
        <div className="flex flex-col gap-2">
          <Button
            onClick={handleInstall}
            className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white"
            data-testid="button-install-pwa-prompt"
          >
            <Download className="w-4 h-4 mr-2" />
            Install Now
          </Button>
          
          <Button
            variant="outline"
            onClick={handleDismiss}
            className="w-full text-slate-300 border-slate-600 hover:bg-slate-700"
            data-testid="button-maybe-later-pwa"
          >
            Maybe Later
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}