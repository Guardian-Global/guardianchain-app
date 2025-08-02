import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Vault,
  TrendingUp,
  Clock,
  Shield,
  Coins,
  Award,
  Zap,
  Target,
  BarChart3,
  DollarSign,
  Users,
  Calendar,
  Star,
} from "lucide-react";

interface TruthVaultData {
  contractAddress: string;
  totalStaked: string;
  userStake: string;
  pendingRewards: string;
  apy: string;
  lockPeriod: number;
  lastRewardClaim: string;
}

interface MemoryCapsule {
  id: string;
  type: "photo" | "video" | "song" | "poem" | "message" | "data";
  name: string;
  stakeAmount: string;
  stakingPeriod: number;
  currentValue: string;
  projectedValue: string;
  yieldEarned: string;
  createdAt: string;
}

export default function TruthVaultYieldManager() {
  const [vaultData, setVaultData] = useState<TruthVaultData>({
    contractAddress: "0x1Ad81D7A2e954B502A543b672876f6f3603d072",
    totalStaked: "12,500,000",
    userStake: "2,450",
    pendingRewards: "186",
    apy: "9.2",
    lockPeriod: 100,
    lastRewardClaim: "2 days ago",
  });

  const [memoryCapsules, setMemoryCapsules] = useState<MemoryCapsule[]>([
    {
      id: "1",
      type: "photo",
      name: "Family Portrait 2025",
      stakeAmount: "250",
      stakingPeriod: 100,
      currentValue: "4,225",
      projectedValue: "42,250",
      yieldEarned: "125",
      createdAt: "3 months ago",
    },
    {
      id: "2",
      type: "video",
      name: "Wedding Anniversary",
      stakeAmount: "400",
      stakingPeriod: 50,
      currentValue: "2,840",
      projectedValue: "18,760",
      yieldEarned: "89",
      createdAt: "6 months ago",
    },
    {
      id: "3",
      type: "message",
      name: "Birthday Message 2625",
      stakeAmount: "15",
      stakingPeriod: 600,
      currentValue: "1,250",
      projectedValue: "1,500,000",
      yieldEarned: "45",
      createdAt: "1 month ago",
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const getTypeIcon = (type: string) => {
    const icons = {
      photo: "📸",
      video: "🎥",
      song: "🎵",
      poem: "📝",
      message: "💌",
      data: "💾",
    };
    return icons[type as keyof typeof icons] || "📄";
  };

  const getTypeColor = (type: string) => {
    const colors = {
      photo: "text-purple-400",
      video: "text-blue-400",
      song: "text-green-400",
      poem: "text-yellow-400",
      message: "text-pink-400",
      data: "text-cyan-400",
    };
    return colors[type as keyof typeof colors] || "text-slate-400";
  };

  const calculateROI = (current: string, initial: string) => {
    const currentValue = parseFloat(current.replace(",", ""));
    const initialValue = parseFloat(initial.replace(",", ""));
    return (((currentValue - initialValue) / initialValue) * 100).toFixed(1);
  };

  const handleClaimRewards = async () => {
    setIsLoading(true);
    // Simulate TruthVault contract interaction
    setTimeout(() => {
      setVaultData((prev) => ({
        ...prev,
        pendingRewards: "0",
        lastRewardClaim: "Just now",
      }));
      setIsLoading(false);
    }, 2000);
  };

  const handleStakeCapsule = async (capsuleId: string, amount: string) => {
    setIsLoading(true);
    // Simulate staking additional GTT to memory capsule
    setTimeout(() => {
      setMemoryCapsules((prev) =>
        prev.map((capsule) =>
          capsule.id === capsuleId
            ? {
                ...capsule,
                stakeAmount: (
                  parseFloat(capsule.stakeAmount) + parseFloat(amount)
                ).toString(),
                currentValue: (
                  parseFloat(capsule.currentValue.replace(",", "")) +
                  parseFloat(amount) * 1.5
                ).toLocaleString(),
              }
            : capsule,
        ),
      );
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      {/* TruthVault Overview */}
      <Card className="bg-gradient-to-r from-purple-900/30 to-green-900/30 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-3">
            <Vault className="h-6 w-6 text-purple-400" />
            <span>TruthVault Yield Manager</span>
            <Badge className="bg-green-600/20 text-green-400">
              LIVE CONTRACT
            </Badge>
          </CardTitle>
          {/* TruthVault Demo Video */}
          <div className="mt-4">
            <div className="relative rounded-lg overflow-hidden bg-slate-800/50 border border-slate-600">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-auto"
                style={{ maxHeight: "200px" }}
              >
                <source
                  src="/capsule_mint_sealed_staked_video.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
              <div className="absolute bottom-2 left-2 right-2">
                <div className="text-white text-xs font-medium">
                  Smart Contract Integration
                </div>
                <div className="text-slate-300 text-xs">
                  Live yield tracking and reward distribution
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-slate-800/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-400 mb-2">
                {vaultData.totalStaked} GTT
              </div>
              <p className="text-slate-400 text-sm">Total Value Locked</p>
            </div>

            <div className="text-center p-4 bg-slate-800/50 rounded-lg">
              <div className="text-2xl font-bold text-white mb-2">
                {vaultData.userStake} GTT
              </div>
              <p className="text-slate-400 text-sm">Your Total Stake</p>
            </div>

            <div className="text-center p-4 bg-slate-800/50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-400 mb-2">
                {vaultData.pendingRewards} GTT
              </div>
              <p className="text-slate-400 text-sm">Pending Rewards</p>
            </div>

            <div className="text-center p-4 bg-slate-800/50 rounded-lg">
              <div className="text-2xl font-bold text-green-400 mb-2">
                {vaultData.apy}%
              </div>
              <p className="text-slate-400 text-sm">Current APY</p>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button
              onClick={handleClaimRewards}
              disabled={isLoading || parseFloat(vaultData.pendingRewards) === 0}
              className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
            >
              <Award className="h-4 w-4 mr-2" />
              Claim {vaultData.pendingRewards} GTT Rewards
            </Button>

            <div className="text-sm text-slate-400">
              Last claim: {vaultData.lastRewardClaim}
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-slate-500">
              Contract: {vaultData.contractAddress}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Memory Capsules Portfolio */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-3">
            <Shield className="h-6 w-6 text-blue-400" />
            <span>Memory Capsules Portfolio</span>
            <Badge className="bg-blue-600/20 text-blue-400">
              {memoryCapsules.length} ACTIVE
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {memoryCapsules.map((capsule) => (
              <div
                key={capsule.id}
                className="p-6 bg-slate-700/30 rounded-lg border border-slate-600"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Capsule Info */}
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="text-2xl">
                        {getTypeIcon(capsule.type)}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">
                          {capsule.name}
                        </h3>
                        <p className={`text-sm ${getTypeColor(capsule.type)}`}>
                          {capsule.type.toUpperCase()} • {capsule.createdAt}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Staking Period:</span>
                        <span className="text-white">
                          {capsule.stakingPeriod} years
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Initial Stake:</span>
                        <span className="text-white">
                          {capsule.stakeAmount} GTT
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div>
                    <h4 className="text-white font-medium mb-4">Performance</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Current Value:</span>
                        <span className="text-green-400 font-bold">
                          {capsule.currentValue} GTT
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Projected Value:</span>
                        <span className="text-purple-400 font-bold">
                          {capsule.projectedValue} GTT
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Yield Earned:</span>
                        <span className="text-yellow-400 font-bold">
                          {capsule.yieldEarned} GTT
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">ROI:</span>
                        <span className="text-green-400 font-bold">
                          +
                          {calculateROI(
                            capsule.currentValue,
                            capsule.stakeAmount,
                          )}
                          %
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div>
                    <h4 className="text-white font-medium mb-4">Actions</h4>
                    <div className="space-y-3">
                      <Button
                        size="sm"
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        onClick={() => handleStakeCapsule(capsule.id, "100")}
                        disabled={isLoading}
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        Boost Stake (+100 GTT)
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-blue-500 text-blue-400"
                      >
                        <BarChart3 className="h-4 w-4 mr-2" />
                        View Analytics
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-green-500 text-green-400"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Share Legacy
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Staking Progress</span>
                    <span className="text-slate-300">
                      {Math.min(
                        ((Date.now() - new Date().getTime()) /
                          (capsule.stakingPeriod * 365 * 24 * 60 * 60 * 1000)) *
                          100,
                        5,
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                  <Progress
                    value={Math.min(
                      ((Date.now() - new Date().getTime()) /
                        (capsule.stakingPeriod * 365 * 24 * 60 * 60 * 1000)) *
                        100,
                      5,
                    )}
                    className="h-2"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Time remaining: {capsule.stakingPeriod - 1} years, 11 months
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Capsule */}
          <div className="mt-8 text-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700"
            >
              <Vault className="h-5 w-5 mr-2" />
              Create New Memory Capsule
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Yield Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white mb-2">$127,500</div>
            <p className="text-slate-400 text-sm">Total Portfolio Value</p>
            <p className="text-green-400 text-xs font-medium">+15.2% (30d)</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white mb-2">67 Years</div>
            <p className="text-slate-400 text-sm">Average Lock Period</p>
            <p className="text-yellow-400 text-xs font-medium">
              Long-term focus
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6 text-center">
            <Award className="h-8 w-8 text-purple-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white mb-2">259 GTT</div>
            <p className="text-slate-400 text-sm">Total Yield Earned</p>
            <p className="text-purple-400 text-xs font-medium">This month</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
