import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Wallet,
  Zap,
  CheckCircle,
  AlertTriangle,
  Smartphone,
  Shield,
  Globe,
  Coins,
  Link,
  Sparkles,
} from "lucide-react";

interface MicroInteraction {
  id: string;
  name: string;
  status: "idle" | "connecting" | "verifying" | "connected" | "error";
  progress: number;
  message: string;
}

const WALLET_MICRO_INTERACTIONS: MicroInteraction[] = [
  {
    id: "metamask-detect",
    name: "MetaMask Detection",
    status: "idle",
    progress: 0,
    message: "Scanning for wallet extensions...",
  },
  {
    id: "network-verify",
    name: "Network Verification",
    status: "idle",
    progress: 0,
    message: "Verifying blockchain network...",
  },
  {
    id: "address-confirm",
    name: "Address Confirmation",
    status: "idle",
    progress: 0,
    message: "Confirming wallet address...",
  },
  {
    id: "balance-check",
    name: "Balance Check",
    status: "idle",
    progress: 0,
    message: "Checking GTT token balance...",
  },
  {
    id: "permission-grant",
    name: "Permission Grant",
    status: "idle",
    progress: 0,
    message: "Requesting wallet permissions...",
  },
];

export default function MicroInteractionWalletConnection() {
  const [interactions, setInteractions] = useState(WALLET_MICRO_INTERACTIONS);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStep, setConnectionStep] = useState(0);

  const simulateConnection = async () => {
    setIsConnecting(true);
    setConnectionStep(0);

    for (let i = 0; i < interactions.length; i++) {
      setConnectionStep(i);

      // Update current interaction to connecting
      setInteractions((prev) =>
        prev.map((interaction, idx) =>
          idx === i
            ? { ...interaction, status: "connecting" as const, progress: 0 }
            : interaction,
        ),
      );

      // Simulate progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        setInteractions((prev) =>
          prev.map((interaction, idx) =>
            idx === i ? { ...interaction, progress } : interaction,
          ),
        );
      }

      // Mark as connected
      setInteractions((prev) =>
        prev.map((interaction, idx) =>
          idx === i
            ? {
                ...interaction,
                status: "connected" as const,
                progress: 100,
                message: getSuccessMessage(interaction.id),
              }
            : interaction,
        ),
      );

      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    setIsConnecting(false);
  };

  const getSuccessMessage = (id: string): string => {
    const messages = {
      "metamask-detect": "MetaMask detected and ready",
      "network-verify": "Connected to Polygon network",
      "address-confirm": "Wallet address confirmed",
      "balance-check": "GTT balance: 1,247.89 tokens",
      "permission-grant": "All permissions granted",
    };
    return messages[id] || "Connection successful";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "connecting":
        return <Zap className="h-4 w-4 text-blue-400 animate-pulse" />;
      case "verifying":
        return <Shield className="h-4 w-4 text-yellow-400 animate-spin" />;
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default:
        return <Globe className="h-4 w-4 text-gray-400" />;
    }
  };

  const resetConnection = () => {
    setInteractions(
      WALLET_MICRO_INTERACTIONS.map((interaction) => ({
        ...interaction,
        status: "idle" as const,
        progress: 0,
        message: interaction.message,
      })),
    );
    setIsConnecting(false);
    setConnectionStep(0);
  };

  const overallProgress =
    interactions.reduce((sum, interaction) => sum + interaction.progress, 0) /
    interactions.length;

  const allConnected = interactions.every(
    (interaction) => interaction.status === "connected",
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Micro-Interaction Wallet Connection
        </h1>
        <p className="text-xl text-slate-300">
          Advanced wallet connection with detailed micro-interaction feedback
        </p>
      </div>

      {/* Connection Control */}
      <Card className="bg-slate-800/50 border-blue-500/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            <Wallet className="h-6 w-6 text-blue-400" />
            Enhanced Wallet Connection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-400">
                {Math.round(overallProgress)}%
              </p>
              <p className="text-sm text-slate-400">Connection Progress</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-400">
                {interactions.filter((i) => i.status === "connected").length}
              </p>
              <p className="text-sm text-slate-400">Steps Complete</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-purple-400">
                {interactions.length}
              </p>
              <p className="text-sm text-slate-400">Total Steps</p>
            </div>
          </div>

          {isConnecting && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Overall Progress</span>
                <span className="text-white font-semibold">
                  {Math.round(overallProgress)}%
                </span>
              </div>
              <Progress value={overallProgress} className="h-3" />
              <p className="text-center text-sm text-blue-400 animate-pulse">
                Step {connectionStep + 1} of {interactions.length}:{" "}
                {interactions[connectionStep]?.name}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={simulateConnection}
              disabled={isConnecting}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
            >
              {isConnecting ? (
                <>
                  <Zap className="mr-2 h-5 w-5 animate-spin" />
                  CONNECTING...
                </>
              ) : allConnected ? (
                <>
                  <CheckCircle className="mr-2 h-5 w-5" />
                  CONNECTED
                </>
              ) : (
                <>
                  <Wallet className="mr-2 h-5 w-5" />
                  CONNECT WALLET
                </>
              )}
            </Button>

            <Button
              onClick={resetConnection}
              variant="outline"
              className="border-slate-600 text-white px-8 py-3"
              disabled={isConnecting}
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Reset Connection
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Micro-Interactions List */}
      <div className="grid grid-cols-1 gap-4">
        {interactions.map((interaction, index) => (
          <Card
            key={interaction.id}
            className={`border transition-all duration-300 ${
              interaction.status === "connected"
                ? "bg-green-900/20 border-green-500/50"
                : interaction.status === "connecting"
                  ? "bg-blue-900/20 border-blue-500/50 animate-pulse"
                  : interaction.status === "error"
                    ? "bg-red-900/20 border-red-500/50"
                    : "bg-slate-800/50 border-slate-700"
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(interaction.status)}
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">
                      {interaction.name}
                    </h3>
                    <p className="text-sm text-slate-400">
                      {interaction.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Badge
                    className={`text-xs ${
                      interaction.status === "connected"
                        ? "bg-green-600"
                        : interaction.status === "connecting"
                          ? "bg-blue-600"
                          : interaction.status === "error"
                            ? "bg-red-600"
                            : "bg-gray-600"
                    }`}
                  >
                    {interaction.status.toUpperCase()}
                  </Badge>

                  {interaction.status === "connecting" && (
                    <div className="w-16">
                      <Progress value={interaction.progress} className="h-2" />
                    </div>
                  )}

                  <span className="text-sm text-slate-400 w-12 text-right">
                    {interaction.progress}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Success State */}
      {allConnected && (
        <Card className="bg-gradient-to-r from-green-900/50 to-blue-900/50 border-green-500/50">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Wallet Successfully Connected!
            </h2>
            <p className="text-green-400 text-lg mb-6">
              All micro-interactions completed successfully
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <p className="text-white font-semibold">Network</p>
                <p className="text-green-400">Polygon</p>
              </div>
              <div className="text-center">
                <p className="text-white font-semibold">Address</p>
                <p className="text-green-400">0x...239db</p>
              </div>
              <div className="text-center">
                <p className="text-white font-semibold">GTT Balance</p>
                <p className="text-green-400">1,247.89</p>
              </div>
              <div className="text-center">
                <p className="text-white font-semibold">Status</p>
                <p className="text-green-400">Ready</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
