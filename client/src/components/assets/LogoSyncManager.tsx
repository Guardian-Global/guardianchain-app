import React, { useState, useEffect } from "react";
import {
  Shield,
  RefreshCw,
  Check,
  AlertCircle,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LogoDisplay from "./LogoDisplay";
import VideoDisplay from "./VideoDisplay";
import EnhancedLogoDisplay from "./EnhancedLogoDisplay";

interface PlatformStatus {
  platform: string;
  status: "synced" | "syncing" | "error" | "pending";
  lastSync: string;
  logoVersion: string;
  videoVersion: string;
  icon: React.ReactNode;
}

interface SyncMetrics {
  totalPlatforms: number;
  syncedPlatforms: number;
  lastGlobalSync: string;
  syncAccuracy: number;
}

const LogoSyncManager: React.FC = () => {
  const [isGlobalSync, setIsGlobalSync] = useState(false);
  const [platforms, setPlatforms] = useState<PlatformStatus[]>([
    {
      platform: "Desktop Web",
      status: "synced",
      lastSync: "2 minutes ago",
      logoVersion: "v2.1.0",
      videoVersion: "v1.8.0",
      icon: <Monitor className="h-4 w-4" />,
    },
    {
      platform: "Mobile Web",
      status: "synced",
      lastSync: "2 minutes ago",
      logoVersion: "v2.1.0",
      videoVersion: "v1.8.0",
      icon: <Smartphone className="h-4 w-4" />,
    },
    {
      platform: "Tablet Web",
      status: "synced",
      lastSync: "2 minutes ago",
      logoVersion: "v2.1.0",
      videoVersion: "v1.8.0",
      icon: <Tablet className="h-4 w-4" />,
    },
    {
      platform: "CDN Global",
      status: "synced",
      lastSync: "5 minutes ago",
      logoVersion: "v2.1.0",
      videoVersion: "v1.8.0",
      icon: <Globe className="h-4 w-4" />,
    },
  ]);

  const [metrics, setMetrics] = useState<SyncMetrics>({
    totalPlatforms: 4,
    syncedPlatforms: 4,
    lastGlobalSync: "5 minutes ago",
    syncAccuracy: 100,
  });

  const handleGlobalSync = async () => {
    setIsGlobalSync(true);

    // Simulate sync process
    setPlatforms((prev) =>
      prev.map((p) => ({ ...p, status: "syncing" as const })),
    );

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Update platforms to synced
    setPlatforms((prev) =>
      prev.map((p) => ({
        ...p,
        status: "synced" as const,
        lastSync: "Just now",
        logoVersion: "v2.1.1",
        videoVersion: "v1.8.1",
      })),
    );

    setMetrics((prev) => ({
      ...prev,
      lastGlobalSync: "Just now",
      syncAccuracy: 100,
    }));

    setIsGlobalSync(false);
  };

  const handlePlatformSync = async (platformIndex: number) => {
    setPlatforms((prev) =>
      prev.map((p, i) =>
        i === platformIndex ? { ...p, status: "syncing" as const } : p,
      ),
    );

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setPlatforms((prev) =>
      prev.map((p, i) =>
        i === platformIndex
          ? {
              ...p,
              status: "synced" as const,
              lastSync: "Just now",
              logoVersion: "v2.1.1",
              videoVersion: "v1.8.1",
            }
          : p,
      ),
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "synced":
        return "text-green-400";
      case "syncing":
        return "text-yellow-400";
      case "error":
        return "text-red-400";
      case "pending":
        return "text-gray-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "synced":
        return <Check className="h-4 w-4" />;
      case "syncing":
        return <RefreshCw className="h-4 w-4 animate-spin" />;
      case "error":
        return <AlertCircle className="h-4 w-4" />;
      case "pending":
        return <RefreshCw className="h-4 w-4" />;
      default:
        return <RefreshCw className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Sync Control Panel */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-400" />
            Cross-Platform Logo Synchronization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Metrics Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">
                {metrics.syncedPlatforms}/{metrics.totalPlatforms}
              </div>
              <div className="text-xs text-slate-400">Platforms Synced</div>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">
                {metrics.syncAccuracy}%
              </div>
              <div className="text-xs text-slate-400">Sync Accuracy</div>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-4 text-center">
              <div className="text-lg font-bold text-blue-400">v2.1.1</div>
              <div className="text-xs text-slate-400">Logo Version</div>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-4 text-center">
              <div className="text-lg font-bold text-green-400">v1.8.1</div>
              <div className="text-xs text-slate-400">Video Version</div>
            </div>
          </div>

          {/* Global Sync Control */}
          <div className="flex items-center justify-between p-4 bg-slate-900/30 rounded-lg border border-slate-700">
            <div>
              <h3 className="font-semibold text-white">
                Global Synchronization
              </h3>
              <p className="text-sm text-slate-400">
                Last sync: {metrics.lastGlobalSync}
              </p>
            </div>
            <Button
              onClick={handleGlobalSync}
              disabled={isGlobalSync}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isGlobalSync ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync All Platforms
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Platform Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {platforms.map((platform, index) => (
          <Card
            key={platform.platform}
            className="bg-slate-800/50 border-slate-700"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {platform.icon}
                  <h3 className="font-semibold text-white">
                    {platform.platform}
                  </h3>
                </div>
                <Badge
                  variant="secondary"
                  className={`${getStatusColor(platform.status)} bg-slate-900/50`}
                >
                  <div className="flex items-center gap-1">
                    {getStatusIcon(platform.status)}
                    {platform.status}
                  </div>
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="text-sm text-slate-400">
                  Last sync: {platform.lastSync}
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Logo:</span>
                  <span className="text-green-400">{platform.logoVersion}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Video:</span>
                  <span className="text-green-400">
                    {platform.videoVersion}
                  </span>
                </div>

                {/* Platform-specific logo preview */}
                <div className="flex items-center justify-center py-2 bg-slate-900/30 rounded">
                  <EnhancedLogoDisplay
                    size="sm"
                    variant="full"
                    className="opacity-80"
                  />
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePlatformSync(index)}
                  disabled={platform.status === "syncing"}
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  {platform.status === "syncing" ? (
                    <>
                      <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-3 w-3 mr-2" />
                      Sync Platform
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Live Preview Grid */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">
            Live Cross-Platform Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Desktop Preview */}
            <div className="bg-slate-900/50 rounded-lg p-4 text-center">
              <h4 className="text-sm font-semibold text-white mb-2">Desktop</h4>
              <LogoDisplay type="guardianchain" size="lg" variant="full" />
            </div>

            {/* Mobile Preview */}
            <div className="bg-slate-900/50 rounded-lg p-4 text-center">
              <h4 className="text-sm font-semibold text-white mb-2">Mobile</h4>
              <LogoDisplay type="guardianchain" size="sm" variant="icon" />
            </div>

            {/* Tablet Preview */}
            <div className="bg-slate-900/50 rounded-lg p-4 text-center">
              <h4 className="text-sm font-semibold text-white mb-2">Tablet</h4>
              <LogoDisplay type="guardianchain" size="md" variant="full" />
            </div>

            {/* Video Preview */}
            <div className="bg-slate-900/50 rounded-lg p-4 text-center">
              <h4 className="text-sm font-semibold text-white mb-2">Video</h4>
              <VideoDisplay type="guardianchain" size="sm" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogoSyncManager;
