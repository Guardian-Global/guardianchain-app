import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import CapsuleClaimButton from "@/components/web3/capsule-claim-button";
import { apiRequest } from "@/lib/queryClient";
import { getYieldTier } from "@shared/utils/roi";
import {
  Eye,
  Share2,
  CheckCircle,
  TrendingUp,
  Coins,
  Trophy,
  Calendar,
  Target,
  Wallet,
} from "lucide-react";
import type { Capsule } from "@shared/schema";

interface CapsuleAnalyticsProps {
  capsule: Capsule;
  showClaimButton?: boolean;
  walletAddress?: string;
}

interface AnalyticsData {
  capsuleId: number;
  metrics: {
    views: number;
    shares: number;
    verifications: number;
    truthYield: number;
    gttReward: number;
    griefScore: number;
    status: string;
    minted: boolean;
  };
  growth: {
    daysActive: number;
    dailyViewRate: number;
    dailyShareRate: number;
    yieldGrowthRate: number;
  };
  timestamps: {
    created: string;
    lastUpdated: string;
  };
}

export default function CapsuleAnalytics({
  capsule,
  showClaimButton = true,
  walletAddress,
}: CapsuleAnalyticsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isClaimingYield, setIsClaimingYield] = useState(false);

  // Fetch analytics data
  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ["/api/analytics", capsule.id],
    queryFn: async () => {
      const response = await apiRequest(
        "GET",
        `/api/analytics/${capsule.id}/analytics`,
      );
      return response.json();
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Claim yield mutation
  const claimYieldMutation = useMutation({
    mutationFn: async () => {
      if (!walletAddress) throw new Error("Wallet address required");

      const response = await apiRequest(
        "POST",
        `/api/analytics/${capsule.id}/claim-yield`,
        {
          walletAddress,
        },
      );
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Yield Claimed Successfully!",
        description: `${data.claimAmount} GTT tokens claimed for "${capsule.title}"`,
      });

      // Refresh analytics and related queries
      queryClient.invalidateQueries({
        queryKey: ["/api/analytics", capsule.id],
      });
      queryClient.invalidateQueries({ queryKey: ["/api/capsules"] });
    },
    onError: (error: any) => {
      toast({
        title: "Claim Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleClaimYield = () => {
    setIsClaimingYield(true);
    claimYieldMutation.mutate();
    setIsClaimingYield(false);
  };

  if (isLoading || !analytics) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto" />
        </CardContent>
      </Card>
    );
  }

  const { metrics, growth } = analytics;
  const yieldTier = getYieldTier(metrics.truthYield);
  const canClaim =
    metrics.truthYield >= 1.0 && showClaimButton && walletAddress;
  const isCreator = true; // In production, check if current user is capsule creator

  return (
    <div className="space-y-4">
      {/* Yield Overview */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-400" />
            Truth Yield Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Yield Tier Badge */}
            <div className="flex items-center gap-3">
              <Badge className={`${yieldTier.color} text-white px-3 py-1`}>
                {yieldTier.tier}
              </Badge>
              <span className="text-sm text-slate-400">
                {yieldTier.description}
              </span>
            </div>

            {/* Main Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-white">
                  {metrics.truthYield}
                </div>
                <div className="text-xs text-slate-400">Truth Yield</div>
              </div>
              <div className="bg-slate-900 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-400">
                  {metrics.gttReward}
                </div>
                <div className="text-xs text-slate-400">GTT Reward</div>
              </div>
              <div className="bg-slate-900 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {metrics.griefScore}
                </div>
                <div className="text-xs text-slate-400">Grief Score</div>
              </div>
              <div className="bg-slate-900 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {growth.daysActive}
                </div>
                <div className="text-xs text-slate-400">Days Active</div>
              </div>
            </div>

            {/* Claim Button */}
            {canClaim && isCreator && (
              <Button
                onClick={handleClaimYield}
                disabled={isClaimingYield || claimYieldMutation.isPending}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <Wallet className="h-4 w-4 mr-2" />
                {isClaimingYield
                  ? "Claiming..."
                  : `Claim ${metrics.gttReward} GTT`}
              </Button>
            )}

            {!canClaim && isCreator && (
              <div className="text-center text-sm text-slate-400">
                {metrics.truthYield < 1.0
                  ? "Minimum 1.0 yield required to claim"
                  : "Connect wallet to claim yield"}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Engagement Metrics */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-400" />
            Engagement Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Eye className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-lg font-semibold text-white">
                  {metrics.views}
                </div>
                <div className="text-sm text-slate-400">Views</div>
                <div className="text-xs text-slate-500">
                  +{growth.dailyViewRate.toFixed(1)}/day
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <Share2 className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-lg font-semibold text-white">
                  {metrics.shares}
                </div>
                <div className="text-sm text-slate-400">Shares</div>
                <div className="text-xs text-slate-500">
                  +{growth.dailyShareRate.toFixed(1)}/day
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-purple-600 p-2 rounded-lg">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-lg font-semibold text-white">
                  {metrics.verifications}
                </div>
                <div className="text-sm text-slate-400">Verifications</div>
                <div className="text-xs text-slate-500">
                  Community validated
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Growth Trends */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-400" />
            Performance Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Daily Yield Growth</span>
              <span className="font-semibold text-green-400">
                +{growth.yieldGrowthRate.toFixed(2)}/day
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400">Status</span>
              <Badge
                className={
                  metrics.status === "sealed"
                    ? "bg-purple-600"
                    : metrics.status === "verified"
                      ? "bg-green-600"
                      : "bg-blue-600"
                }
              >
                {metrics.status === "sealed"
                  ? "Veritas Sealed"
                  : metrics.status === "verified"
                    ? "Truth Verified"
                    : "Pending Review"}
              </Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400">NFT Minted</span>
              <span
                className={`font-semibold ${
                  metrics.minted ? "text-green-400" : "text-slate-400"
                }`}
              >
                {metrics.minted ? "Yes" : "No"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400">Created</span>
              <span className="text-slate-300">
                {new Date(analytics.timestamps.created).toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Yield Breakdown */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-yellow-400" />
            Yield Composition
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">
                Views ({metrics.views} × 0.5)
              </span>
              <span className="text-white">
                {(metrics.views * 0.5).toFixed(1)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">
                Shares ({metrics.shares} × 1.5)
              </span>
              <span className="text-white">
                {(metrics.shares * 1.5).toFixed(1)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">
                Verifications ({metrics.verifications} × 3.0)
              </span>
              <span className="text-white">
                {(metrics.verifications * 3.0).toFixed(1)}
              </span>
            </div>
            {metrics.minted && (
              <div className="flex justify-between">
                <span className="text-slate-400">NFT Minted (1 × 10.0)</span>
                <span className="text-white">10.0</span>
              </div>
            )}
            {metrics.status === "sealed" && (
              <div className="flex justify-between">
                <span className="text-slate-400">Veritas Sealed (1 × 5.0)</span>
                <span className="text-white">5.0</span>
              </div>
            )}
            <div className="border-t border-slate-600 pt-2 flex justify-between font-semibold">
              <span className="text-slate-300">Total Yield</span>
              <span className="text-green-400">{metrics.truthYield}</span>
            </div>
          </div>

          {/* Web3 GTT Claim Integration */}
          {showClaimButton && walletAddress && (
            <div className="mt-4 pt-4 border-t border-slate-700">
              <CapsuleClaimButton
                capsule={capsule}
                isCreator={true}
                showDetails={false}
              />
            </div>
          )}

          {/* Fallback for Demo when no wallet */}
          {showClaimButton && !walletAddress && (
            <div className="mt-4 pt-4 border-t border-slate-700">
              <Button
                disabled
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 opacity-50"
              >
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet to Claim GTT
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
