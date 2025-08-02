import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Vault,
  TrendingUp,
  Coins,
  Shield,
  Clock,
  Zap,
  Target,
  Award,
  Lock,
  Unlock,
  ArrowUpRight,
  ArrowDownRight,
  Calculator,
  BarChart3,
  DollarSign,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface YieldVault {
  id: string;
  name: string;
  totalValueLocked: number;
  apy: number;
  userStaked: number;
  userRewards: number;
  riskLevel: "low" | "medium" | "high";
  strategy: string;
  lockPeriod: number; // in days
  minDeposit: number;
  maxCapacity: number;
  currentCapacity: number;
}

interface UserYieldData {
  totalStaked: number;
  totalRewards: number;
  totalClaimed: number;
  currentAPY: number;
  griefScoreMultiplier: number;
  nextClaimDate: string;
  vaults: YieldVault[];
}

export default function YieldVaultPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<
    "overview" | "vaults" | "strategies"
  >("overview");
  const [selectedVault, setSelectedVault] = useState<string | null>(null);
  const [stakeAmount, setStakeAmount] = useState("");

  const {
    data: yieldData,
    isLoading,
    refetch,
  } = useQuery<UserYieldData>({
    queryKey: ["/api/yield-vault/user-data", user?.id],
    enabled: !!user?.id,
  });

  const stakeMutation = useMutation({
    mutationFn: async ({
      vaultId,
      amount,
    }: {
      vaultId: string;
      amount: number;
    }) => {
      return apiRequest("POST", "/api/yield-vault/stake", { vaultId, amount });
    },
    onSuccess: () => {
      toast({
        title: "Stake Successful",
        description: "Your GTT tokens have been staked in the yield vault.",
      });
      setStakeAmount("");
      setSelectedVault(null);
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Staking Failed",
        description: "There was an error staking your tokens.",
        variant: "destructive",
      });
    },
  });

  const defaultYieldData: UserYieldData = {
    totalStaked: 50000,
    totalRewards: 6150,
    totalClaimed: 2500,
    currentAPY: 12.3,
    griefScoreMultiplier: 1.25,
    nextClaimDate: "2025-08-15T00:00:00Z",
    vaults: [
      {
        id: "gtt-core",
        name: "GTT Core Vault",
        totalValueLocked: 2400000,
        apy: 12.3,
        userStaked: 25000,
        userRewards: 3075,
        riskLevel: "low",
        strategy: "Core staking with grief score multiplier",
        lockPeriod: 30,
        minDeposit: 1000,
        maxCapacity: 10000000,
        currentCapacity: 2400000,
      },
      {
        id: "gtt-premium",
        name: "GTT Premium Vault",
        totalValueLocked: 890000,
        apy: 18.5,
        userStaked: 15000,
        userRewards: 2775,
        riskLevel: "medium",
        strategy: "Enhanced yield with DeFi integrations",
        lockPeriod: 90,
        minDeposit: 10000,
        maxCapacity: 2000000,
        currentCapacity: 890000,
      },
      {
        id: "gtt-sovereign",
        name: "GTT Sovereign Vault",
        totalValueLocked: 450000,
        apy: 25.0,
        userStaked: 10000,
        userRewards: 300,
        riskLevel: "high",
        strategy: "Advanced strategies with governance rewards",
        lockPeriod: 365,
        minDeposit: 50000,
        maxCapacity: 1000000,
        currentCapacity: 450000,
      },
    ],
  };

  const data = yieldData || defaultYieldData;

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-green-600 bg-green-50 border-green-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "high":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatTokens = (amount: number) => {
    return new Intl.NumberFormat("en-US").format(amount) + " GTT";
  };

  const calculateProjectedRewards = (
    amount: number,
    apy: number,
    days: number,
  ) => {
    return amount * (apy / 100) * (days / 365);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-32 bg-gray-200 dark:bg-gray-700 rounded"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Vault className="w-16 h-16 text-blue-500 mr-4" />
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
              GTT Yield Vault
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto">
            Maximize your GTT yield through sophisticated staking strategies.
            Earn rewards based on grief score, platform usage, and vault
            performance.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm">
            {["overview", "vaults", "strategies"].map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "ghost"}
                onClick={() => setActiveTab(tab as any)}
                className="mx-1"
              >
                {tab === "overview" && <BarChart3 className="w-4 h-4 mr-2" />}
                {tab === "vaults" && <Vault className="w-4 h-4 mr-2" />}
                {tab === "strategies" && <Target className="w-4 h-4 mr-2" />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Portfolio Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Total Staked
                      </p>
                      <p className="text-2xl font-bold">
                        {formatTokens(data.totalStaked)}
                      </p>
                      <p className="text-sm text-blue-600">
                        ≈ {formatCurrency(data.totalStaked * 0.0075)}
                      </p>
                    </div>
                    <Lock className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Total Rewards
                      </p>
                      <p className="text-2xl font-bold">
                        {formatTokens(data.totalRewards)}
                      </p>
                      <p className="text-sm text-green-600">
                        +
                        {((data.totalRewards / data.totalStaked) * 100).toFixed(
                          1,
                        )}
                        %
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Current APY
                      </p>
                      <p className="text-2xl font-bold">
                        {data.currentAPY.toFixed(1)}%
                      </p>
                      <p className="text-sm text-purple-600">
                        ×{data.griefScoreMultiplier} grief bonus
                      </p>
                    </div>
                    <Zap className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Claimed
                      </p>
                      <p className="text-2xl font-bold">
                        {formatTokens(data.totalClaimed)}
                      </p>
                      <p className="text-sm text-orange-600">
                        Lifetime earnings
                      </p>
                    </div>
                    <Award className="w-8 h-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Active Vaults Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Vault className="w-5 h-5 mr-2" />
                  Your Active Vaults
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.vaults
                    .filter((v) => v.userStaked > 0)
                    .map((vault) => (
                      <div
                        key={vault.id}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`p-2 rounded-lg ${getRiskColor(vault.riskLevel)}`}
                          >
                            <Vault className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{vault.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {vault.strategy}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-lg font-bold">
                            {formatTokens(vault.userStaked)}
                          </div>
                          <div className="text-sm text-green-600">
                            Rewards: {formatTokens(vault.userRewards)}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-lg font-bold text-purple-600">
                            {vault.apy}% APY
                          </div>
                          <Badge className={getRiskColor(vault.riskLevel)}>
                            {vault.riskLevel.toUpperCase()} RISK
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Yield Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">
                      Performance chart coming soon
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "vaults" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.vaults.map((vault) => (
                <Card
                  key={vault.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{vault.name}</CardTitle>
                      <Badge className={getRiskColor(vault.riskLevel)}>
                        {vault.riskLevel.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-1">
                        {vault.apy}%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        APY
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>TVL:</span>
                        <span className="font-semibold">
                          {formatCurrency(vault.totalValueLocked)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Min Deposit:</span>
                        <span>{formatTokens(vault.minDeposit)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Lock Period:</span>
                        <span>{vault.lockPeriod} days</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Your Stake:</span>
                        <span className="font-semibold">
                          {formatTokens(vault.userStaked)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Capacity</span>
                        <span>
                          {(
                            (vault.currentCapacity / vault.maxCapacity) *
                            100
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                      <Progress
                        value={
                          (vault.currentCapacity / vault.maxCapacity) * 100
                        }
                        className="h-2"
                      />
                    </div>

                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {vault.strategy}
                    </p>

                    <div className="flex space-x-2">
                      <Button
                        className="flex-1"
                        onClick={() => setSelectedVault(vault.id)}
                        disabled={vault.currentCapacity >= vault.maxCapacity}
                      >
                        <ArrowUpRight className="w-4 h-4 mr-1" />
                        Stake
                      </Button>
                      {vault.userStaked > 0 && (
                        <Button variant="outline" className="flex-1">
                          <ArrowDownRight className="w-4 h-4 mr-1" />
                          Unstake
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Staking Modal */}
            {selectedVault && (
              <Card className="max-w-md mx-auto">
                <CardHeader>
                  <CardTitle>
                    Stake in{" "}
                    {data.vaults.find((v) => v.id === selectedVault)?.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Stake Amount (GTT)
                    </label>
                    <Input
                      type="number"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      placeholder="Enter amount to stake"
                    />
                  </div>

                  {stakeAmount && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h4 className="font-semibold mb-2">Projected Rewards</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Daily:</span>
                          <span>
                            {calculateProjectedRewards(
                              Number(stakeAmount),
                              data.vaults.find((v) => v.id === selectedVault)
                                ?.apy || 0,
                              1,
                            ).toFixed(2)}{" "}
                            GTT
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Monthly:</span>
                          <span>
                            {calculateProjectedRewards(
                              Number(stakeAmount),
                              data.vaults.find((v) => v.id === selectedVault)
                                ?.apy || 0,
                              30,
                            ).toFixed(2)}{" "}
                            GTT
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Annually:</span>
                          <span>
                            {calculateProjectedRewards(
                              Number(stakeAmount),
                              data.vaults.find((v) => v.id === selectedVault)
                                ?.apy || 0,
                              365,
                            ).toFixed(2)}{" "}
                            GTT
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button
                      onClick={() =>
                        stakeMutation.mutate({
                          vaultId: selectedVault,
                          amount: Number(stakeAmount),
                        })
                      }
                      disabled={!stakeAmount || stakeMutation.isPending}
                      className="flex-1"
                    >
                      {stakeMutation.isPending ? "Staking..." : "Confirm Stake"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedVault(null)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === "strategies" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Yield Strategies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="p-6 border-2 border-green-200 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 text-green-800 dark:text-green-400">
                      Conservative Strategy
                    </h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Focus on GTT Core Vault</li>
                      <li>• 30-day lock periods</li>
                      <li>• Stable 12-15% APY</li>
                      <li>• Low risk, consistent returns</li>
                    </ul>
                    <div className="mt-4">
                      <Badge className="bg-green-100 text-green-800">
                        Recommended for beginners
                      </Badge>
                    </div>
                  </div>

                  <div className="p-6 border-2 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 text-yellow-800 dark:text-yellow-400">
                      Balanced Strategy
                    </h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Mix of Core and Premium vaults</li>
                      <li>• 30-90 day lock periods</li>
                      <li>• 15-20% APY potential</li>
                      <li>• Medium risk, balanced approach</li>
                    </ul>
                    <div className="mt-4">
                      <Badge className="bg-yellow-100 text-yellow-800">
                        Most popular
                      </Badge>
                    </div>
                  </div>

                  <div className="p-6 border-2 border-red-200 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 text-red-800 dark:text-red-400">
                      Aggressive Strategy
                    </h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Focus on Sovereign vault</li>
                      <li>• 365-day lock periods</li>
                      <li>• 20-25% APY potential</li>
                      <li>• High risk, maximum returns</li>
                    </ul>
                    <div className="mt-4">
                      <Badge className="bg-red-100 text-red-800">
                        For experienced users
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Grief Score Optimization */}
            <Card>
              <CardHeader>
                <CardTitle>Grief Score Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Boost Your Multiplier
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded">
                        <span>Create Quality Capsules</span>
                        <Badge>+0.1x</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded">
                        <span>Verify Others' Content</span>
                        <Badge>+0.05x</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded">
                        <span>Participate in Governance</span>
                        <Badge>+0.2x</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded">
                        <span>Long-term Staking</span>
                        <Badge>+0.3x</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <h4 className="font-semibold mb-3">
                      Your Current Multiplier
                    </h4>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-purple-600 mb-2">
                        {data.griefScoreMultiplier}x
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        This multiplier is applied to all your yield earnings
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
