import React from "react";
import { usePWA } from "@/hooks/usePWA";
import { Badge } from "@/components/ui/badge";
import { WifiOff, Wifi } from "lucide-react";

export default function OfflineIndicator() {
  const { isOffline } = usePWA();

  if (!isOffline) {
    return null;
  }

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <Badge className="bg-red-600/90 text-white border-none backdrop-blur-sm px-3 py-1">
        <WifiOff className="w-4 h-4 mr-2" />
        You're offline - Some features may be limited
      </Badge>
    </div>
  );
}
