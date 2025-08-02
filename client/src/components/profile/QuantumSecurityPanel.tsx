import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Shield,
  Lock,
  Key,
  Eye,
  Fingerprint,
  Brain,
  Zap,
  Timer,
  Globe,
  Cpu,
  Radio,
  Waves,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
} from "lucide-react";

interface SecurityMetrics {
  encryptionStrength: number;
  biometricAccuracy: number;
  neuralPatternMatch: number;
  quantumEntanglement: number;
  ghostModeEfficiency: number;
  temporalLockSecurity: number;
}

interface ThreatDetection {
  id: string;
  type: "behavioral" | "network" | "temporal" | "quantum";
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  timestamp: string;
  blocked: boolean;
}

export default function QuantumSecurityPanel() {
  const { toast } = useToast();
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics>({
    encryptionStrength: 94,
    biometricAccuracy: 98,
    neuralPatternMatch: 92,
    quantumEntanglement: 87,
    ghostModeEfficiency: 89,
    temporalLockSecurity: 96,
  });

  const [threatDetections, setThreatDetections] = useState<ThreatDetection[]>([
    {
      id: "1",
      type: "behavioral",
      severity: "medium",
      description: "Unusual typing pattern detected from unknown device",
      timestamp: "2025-01-01T12:30:00Z",
      blocked: true,
    },
    {
      id: "2",
      type: "network",
      severity: "high",
      description: "Potential man-in-the-middle attack intercepted",
      timestamp: "2025-01-01T11:15:00Z",
      blocked: true,
    },
    {
      id: "3",
      type: "quantum",
      severity: "low",
      description: "Quantum decoherence detected - automatically corrected",
      timestamp: "2025-01-01T10:45:00Z",
      blocked: false,
    },
  ]);

  const [isRunningDiagnostic, setIsRunningDiagnostic] = useState(false);
  const [lastScanTime, setLastScanTime] = useState(new Date());

  const runSecurityDiagnostic = async () => {
    setIsRunningDiagnostic(true);

    // Simulate security scan
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      // Update metrics during scan
      setSecurityMetrics((prev) => ({
        ...prev,
        encryptionStrength: Math.min(
          100,
          prev.encryptionStrength + Math.random() * 2,
        ),
        biometricAccuracy: Math.max(
          90,
          prev.biometricAccuracy + (Math.random() - 0.5) * 2,
        ),
        neuralPatternMatch: Math.min(
          100,
          prev.neuralPatternMatch + Math.random() * 3,
        ),
        quantumEntanglement: Math.max(
          85,
          prev.quantumEntanglement + (Math.random() - 0.3) * 2,
        ),
      }));
    }

    setIsRunningDiagnostic(false);
    setLastScanTime(new Date());

    toast({
      title: "Quantum Security Scan Complete",
      description: "All systems operating within optimal parameters",
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "text-green-400 border-green-400";
      case "medium":
        return "text-yellow-400 border-yellow-400";
      case "high":
        return "text-orange-400 border-orange-400";
      case "critical":
        return "text-red-400 border-red-400";
      default:
        return "text-slate-400 border-slate-400";
    }
  };

  const getThreatIcon = (type: string) => {
    switch (type) {
      case "behavioral":
        return Brain;
      case "network":
        return Globe;
      case "temporal":
        return Timer;
      case "quantum":
        return Cpu;
      default:
        return Shield;
    }
  };

  const getOverallSecurityScore = () => {
    const values = Object.values(securityMetrics);
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  };

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <Card className="bg-black/40 border-blue-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-blue-400 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Quantum Security Status</span>
            </div>
            <Badge
              className={`${getOverallSecurityScore() > 90 ? "bg-green-600/20 text-green-400" : "bg-yellow-600/20 text-yellow-400"}`}
            >
              {getOverallSecurityScore()}% Secure
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Security Metrics */}
            {Object.entries(securityMetrics).map(([key, value]) => {
              const icons = {
                encryptionStrength: Lock,
                biometricAccuracy: Fingerprint,
                neuralPatternMatch: Brain,
                quantumEntanglement: Zap,
                ghostModeEfficiency: Eye,
                temporalLockSecurity: Timer,
              };

              const Icon = icons[key as keyof typeof icons];
              const label = key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase());

              return (
                <div key={key} className="p-4 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon className="h-4 w-4 text-blue-400" />
                    <span className="text-slate-300 text-sm">{label}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-bold">{value}%</span>
                      {value > 95 ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : value > 85 ? (
                        <AlertTriangle className="h-4 w-4 text-yellow-400" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-400" />
                      )}
                    </div>
                    <Progress value={value} className="h-2" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-slate-400">
              Last scan: {lastScanTime.toLocaleString()}
            </div>
            <Button
              onClick={runSecurityDiagnostic}
              disabled={isRunningDiagnostic}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isRunningDiagnostic ? (
                <>
                  <Activity className="h-4 w-4 mr-2 animate-pulse" />
                  Scanning...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Run Diagnostic
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Threat Detection */}
      <Card className="bg-black/40 border-red-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-red-400 flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Threat Detection & Response</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {threatDetections.map((threat) => {
              const ThreatIcon = getThreatIcon(threat.type);

              return (
                <div
                  key={threat.id}
                  className={`p-4 rounded-lg border ${getSeverityColor(threat.severity)} bg-slate-800/30`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <ThreatIcon
                        className={`h-5 w-5 mt-1 ${getSeverityColor(threat.severity).split(" ")[0]}`}
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-medium">
                            {threat.type.toUpperCase()} Threat
                          </span>
                          <Badge
                            variant="secondary"
                            className={`text-xs ${getSeverityColor(threat.severity)}`}
                          >
                            {threat.severity}
                          </Badge>
                        </div>
                        <p className="text-slate-300 text-sm mt-1">
                          {threat.description}
                        </p>
                        <p className="text-slate-400 text-xs mt-2">
                          {new Date(threat.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {threat.blocked ? (
                        <Badge className="bg-green-600/20 text-green-400">
                          Blocked
                        </Badge>
                      ) : (
                        <Badge className="bg-blue-600/20 text-blue-400">
                          Mitigated
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Active Protections */}
      <Card className="bg-black/40 border-green-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <span>Active Protection Protocols</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                name: "Quantum Encryption",
                icon: Lock,
                status: "active",
                description: "Post-quantum cryptographic protection",
              },
              {
                name: "Biometric Validation",
                icon: Fingerprint,
                status: "active",
                description: "Multi-factor biometric authentication",
              },
              {
                name: "Neural Monitoring",
                icon: Brain,
                status: "active",
                description: "Behavioral pattern analysis",
              },
              {
                name: "Ghost Protocol",
                icon: Eye,
                status: "standby",
                description: "Advanced anonymization layer",
              },
              {
                name: "Temporal Locks",
                icon: Timer,
                status: "active",
                description: "Time-based access restrictions",
              },
              {
                name: "Quantum Entanglement",
                icon: Zap,
                status: "active",
                description: "Entangled key distribution",
              },
              {
                name: "Data Obfuscation",
                icon: Waves,
                status: "active",
                description: "Pattern scrambling protection",
              },
              {
                name: "Social Recovery",
                icon: Globe,
                status: "configured",
                description: "Distributed recovery system",
              },
            ].map((protocol) => {
              const Icon = protocol.icon;

              return (
                <div
                  key={protocol.name}
                  className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5 text-green-400" />
                    <div>
                      <p className="text-white font-medium">{protocol.name}</p>
                      <p className="text-slate-400 text-xs">
                        {protocol.description}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={`${
                      protocol.status === "active"
                        ? "bg-green-600/20 text-green-400"
                        : protocol.status === "standby"
                          ? "bg-yellow-600/20 text-yellow-400"
                          : "bg-blue-600/20 text-blue-400"
                    }`}
                  >
                    {protocol.status}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
