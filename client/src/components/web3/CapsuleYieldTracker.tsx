import React, { useState, useEffect } from "react";
import { useAccount, useContractRead } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, Award, Share2, Copy, ExternalLink } from "lucide-react";
import { BRAND_COLORS, BRAND_NAME } from "@/lib/constants";
import { CAPSULE_FACTORY_V2_ABI, getContractAddress } from "@/lib/contracts";

interface YieldData {
  totalYield: bigint;
  emotionalScore: number;
  createdAt: bigint;
  yieldHistory: Array<{ timestamp: bigint; amount: bigint }>;
  isSealed: boolean;
}

interface CapsuleYieldTrackerProps {
  capsuleId?: string;
  embedded?: boolean;
}

export default function CapsuleYieldTracker({ capsuleId, embedded = false }: CapsuleYieldTrackerProps) {
  const { chainId } = useAccount();
  const { toast } = useToast();
  const [inputCapsuleId, setInputCapsuleId] = useState(capsuleId || "");
  const [showShareModal, setShowShareModal] = useState(false);
  
  const factoryAddress = getContractAddress(chainId || 31337, "factory");
  const currentCapsuleId = capsuleId || inputCapsuleId;

  // Read capsule data
  const { data: capsuleData, isLoading } = useContractRead({
    address: factoryAddress,
    abi: CAPSULE_FACTORY_V2_ABI,
    functionName: "getCapsule",
    args: [BigInt(currentCapsuleId || 0)],
    enabled: !!currentCapsuleId && parseInt(currentCapsuleId) > 0,
  });

  // Read yield info
  const { data: yieldInfo } = useContractRead({
    address: factoryAddress,
    abi: CAPSULE_FACTORY_V2_ABI,
    functionName: "getCapsuleYield",
    args: [BigInt(currentCapsuleId || 0)],
    enabled: !!currentCapsuleId && parseInt(currentCapsuleId) > 0,
  });

  const generateEmbedCode = () => {
    const embedUrl = `${window.location.origin}/embed/capsule?id=${currentCapsuleId}`;
    return `<iframe src="${embedUrl}" width="400" height="300" frameborder="0"></iframe>`;
  };

  const generateShareUrl = () => {
    return `${window.location.origin}/capsule/${currentCapsuleId}`;
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    });
  };

  const formatYield = (yieldAmount: bigint | undefined) => {
    if (!yieldAmount) return "0.00";
    return (Number(yieldAmount) / 1e18).toFixed(4);
  };

  const calculateProgress = (current: number, max: number = 100) => {
    return Math.min((current / max) * 100, 100);
  };

  if (isLoading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-600 rounded w-3/4"></div>
            <div className="h-20 bg-slate-600 rounded"></div>
            <div className="h-4 bg-slate-600 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${embedded ? 'p-4' : ''}`}>
      {!embedded && !capsuleId && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <TrendingUp className="w-5 h-5" style={{ color: BRAND_COLORS.GUARDIAN }} />
              Capsule Yield Tracker
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Enter Capsule ID"
                value={inputCapsuleId}
                onChange={(e) => setInputCapsuleId(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
              <Button
                onClick={() => setInputCapsuleId(inputCapsuleId)}
                style={{ backgroundColor: BRAND_COLORS.GUARDIAN }}
              >
                Track
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {currentCapsuleId && (
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-purple-500/30">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-white mb-2">
                  Capsule #{currentCapsuleId} Yield Performance
                </CardTitle>
                <div className="flex gap-2">
                  <Badge 
                    variant={capsuleData?.[4] ? "default" : "secondary"}
                    className={capsuleData?.[4] ? "bg-green-600" : "bg-yellow-600"}
                  >
                    {capsuleData?.[4] ? "Sealed" : "Unsealed"}
                  </Badge>
                  <Badge variant="outline" className="border-purple-400 text-purple-300">
                    Capsule NFT
                  </Badge>
                </div>
              </div>
              {!embedded && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowShareModal(true)}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Yield Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-700/30 rounded-lg p-4">
                <div className="text-sm text-slate-400 mb-1">Total GTT Yielded</div>
                <div className="text-2xl font-bold text-white">
                  {formatYield(yieldInfo?.[0])} GTT
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  ≈ ${(parseFloat(formatYield(yieldInfo?.[0])) * 0.85).toFixed(2)} USD
                </div>
              </div>
              
              <div className="bg-slate-700/30 rounded-lg p-4">
                <div className="text-sm text-slate-400 mb-1">Emotional Resonance</div>
                <div className="text-2xl font-bold text-white">
                  {yieldInfo?.[1] ? Number(yieldInfo[1]) : 0}/100
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2 mt-2">
                  <div 
                    className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-green-500"
                    style={{ width: `${yieldInfo?.[1] ? Number(yieldInfo[1]) : 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-slate-700/30 rounded-lg p-4">
                <div className="text-sm text-slate-400 mb-1">Truth Score</div>
                <div className="text-2xl font-bold text-white">
                  {capsuleData?.[3] ? Number(capsuleData[3]) : 0}%
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Award className="w-3 h-3 text-yellow-500" />
                  <span className="text-xs text-slate-500">
                    {Number(capsuleData?.[3] || 0) > 80 ? "High Quality" : "Growing"}
                  </span>
                </div>
              </div>
            </div>

            {/* Performance Chart Placeholder */}
            <div className="bg-slate-700/20 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-3">Yield Performance</h4>
              <div className="h-32 bg-gradient-to-r from-purple-600/20 to-green-600/20 rounded flex items-end justify-between p-4">
                {[20, 35, 45, 55, 70, 85, 90].map((height, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-t from-purple-500 to-green-500 w-8 rounded-t opacity-80"
                    style={{ height: `${height}%` }}
                  ></div>
                ))}
              </div>
              <div className="text-xs text-slate-400 mt-2">
                7-day yield progression showing emotional impact and truth verification
              </div>
            </div>

            {/* Capsule Details */}
            <div className="space-y-3">
              <Separator className="bg-slate-600" />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Creator:</span>
                  <span className="text-white ml-2">
                    {capsuleData?.[0] ? `${(capsuleData[0] as string).slice(0, 6)}...${(capsuleData[0] as string).slice(-4)}` : "Unknown"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Created:</span>
                  <span className="text-white ml-2">
                    {capsuleData?.[2] ? new Date(Number(capsuleData[2]) * 1000).toLocaleDateString() : "Unknown"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {!embedded && (
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`/capsule/${currentCapsuleId}`, '_blank')}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Full Details
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(generateShareUrl(), "Share URL")}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <Card className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-white font-semibold mb-4">Share Capsule Yield Tracker</h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm text-slate-400">Share URL</label>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={generateShareUrl()}
                    readOnly
                    className="bg-slate-700 border-slate-600 text-white text-xs"
                  />
                  <Button
                    size="sm"
                    onClick={() => copyToClipboard(generateShareUrl(), "Share URL")}
                  >
                    Copy
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="text-sm text-slate-400">Embed Code</label>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={generateEmbedCode()}
                    readOnly
                    className="bg-slate-700 border-slate-600 text-white text-xs"
                  />
                  <Button
                    size="sm"
                    onClick={() => copyToClipboard(generateEmbedCode(), "Embed Code")}
                  >
                    Copy
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button
                onClick={() => setShowShareModal(false)}
                variant="outline"
                className="flex-1 border-slate-600 text-slate-300"
              >
                Close
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}