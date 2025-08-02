import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Wifi,
  WifiOff,
  Database,
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

interface SystemStatus {
  network: "online" | "offline" | "slow";
  database: "healthy" | "warning" | "error";
  blockchain: "synced" | "syncing" | "disconnected";
  verification: "active" | "paused" | "maintenance";
}

const StatusIndicator = () => {
  const [status, setStatus] = useState<SystemStatus>({
    network: "online",
    database: "healthy",
    blockchain: "synced",
    verification: "active",
  });
  const [isExpanded, setIsExpanded] = useState(false);

  // Simulate status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStatus((prev) => ({
        ...prev,
        network: Math.random() > 0.95 ? "slow" : "online",
        blockchain: Math.random() > 0.98 ? "syncing" : "synced",
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getNetworkIcon = () => {
    switch (status.network) {
      case "offline":
        return <WifiOff className="h-3 w-3 text-red-400" />;
      case "slow":
        return <Wifi className="h-3 w-3 text-yellow-400" />;
      default:
        return <Wifi className="h-3 w-3 text-green-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    if (
      status.includes("healthy") ||
      status.includes("active") ||
      status.includes("synced") ||
      status.includes("online")
    ) {
      return "bg-green-500";
    }
    if (
      status.includes("warning") ||
      status.includes("slow") ||
      status.includes("syncing") ||
      status.includes("paused")
    ) {
      return "bg-yellow-500";
    }
    return "bg-red-500";
  };

  const overallStatus = Object.values(status).some(
    (s) =>
      s.includes("error") ||
      s.includes("offline") ||
      s.includes("disconnected"),
  )
    ? "error"
    : Object.values(status).some(
          (s) =>
            s.includes("warning") ||
            s.includes("slow") ||
            s.includes("syncing") ||
            s.includes("paused"),
        )
      ? "warning"
      : "healthy";

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className="cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {!isExpanded ? (
          <Badge
            variant="outline"
            className={`${getStatusColor(overallStatus)} text-white border-transparent animate-pulse`}
          >
            {getNetworkIcon()}
            <span className="ml-1 text-xs">
              {overallStatus === "healthy"
                ? "All Systems"
                : overallStatus === "warning"
                  ? "Degraded"
                  : "Issues"}
            </span>
          </Badge>
        ) : (
          <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-lg p-4 min-w-64 animate-in slide-in-from-top-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">
                System Status
              </h3>
              <div
                className={`w-2 h-2 rounded-full ${getStatusColor(overallStatus)}`}
              />
            </div>

            <div className="space-y-2">
              {/* Network Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getNetworkIcon()}
                  <span className="text-xs text-slate-300">Network</span>
                </div>
                <Badge
                  variant="outline"
                  className={`text-xs ${getStatusColor(status.network)} text-white border-transparent`}
                >
                  {status.network}
                </Badge>
              </div>

              {/* Database Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="h-3 w-3 text-slate-400" />
                  <span className="text-xs text-slate-300">Database</span>
                </div>
                <Badge
                  variant="outline"
                  className={`text-xs ${getStatusColor(status.database)} text-white border-transparent`}
                >
                  {status.database}
                </Badge>
              </div>

              {/* Blockchain Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-3 w-3 text-slate-400" />
                  <span className="text-xs text-slate-300">Blockchain</span>
                </div>
                <Badge
                  variant="outline"
                  className={`text-xs ${getStatusColor(status.blockchain)} text-white border-transparent`}
                >
                  {status.blockchain}
                </Badge>
              </div>

              {/* Verification Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-slate-400" />
                  <span className="text-xs text-slate-300">Verification</span>
                </div>
                <Badge
                  variant="outline"
                  className={`text-xs ${getStatusColor(status.verification)} text-white border-transparent`}
                >
                  {status.verification}
                </Badge>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-700">
              <p className="text-xs text-slate-500">
                Last updated: {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusIndicator;
