import { useState } from "react";
import {
  Coins,
  TrendingUp,
  Award,
  Shield,
  Users,
  Clock,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  BRAND_NAME,
  BRAND_COLORS,
  STAKING_TIERS,
  EARLY_ADOPTER_REWARDS,
} from "@/lib/constants";

export default function StakePage() {
  const [stakeAmount, setStakeAmount] = useState("");
  const [userStats, setUserStats] = useState({
    balance: 2500,
    staked: 1000,
    rewards: 150,
    tier: "BRONZE",
  });
  const { toast } = useToast();

  const handleStake = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid staking amount",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Staking Initiated",
      description: `Staking ${stakeAmount} GTT in ${BRAND_NAME} protocol`,
    });

    // Simulate staking process
    setTimeout(() => {
      setUserStats((prev) => ({
        ...prev,
        staked: prev.staked + parseFloat(stakeAmount),
        balance: prev.balance - parseFloat(stakeAmount),
      }));
      setStakeAmount("");
      toast({
        title: "Staking Successful!",
        description: `Successfully staked ${stakeAmount} GTT`,
      });
    }, 2000);
  };

  const getTierInfo = (tier: string) => {
    return (
      STAKING_TIERS[tier as keyof typeof STAKING_TIERS] || STAKING_TIERS.BRONZE
    );
  };

  const currentTier = getTierInfo(userStats.tier);

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <Card className="mb-8 bg-gradient-to-r from-purple-900/50 to-green-900/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Coins className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <span className="text-white text-xl font-bold">
                  <span style={{ color: BRAND_COLORS.GUARDIAN }}>GUARDIAN</span>
                  <span style={{ color: BRAND_COLORS.CHAIN }}>CHAIN</span>{" "}
                  Staking Protocol
                </span>
                <p className="text-slate-400 text-sm font-normal">
                  Stake GTT tokens to earn rewards and governance power
                </p>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Available Balance</p>
                  <p className="text-2xl font-bold text-white">
                    {userStats.balance.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500">GTT</p>
                </div>
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Coins className="h-5 w-5 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Staked</p>
                  <p className="text-2xl font-bold text-white">
                    {userStats.staked.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500">GTT</p>
                </div>
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Rewards Earned</p>
                  <p className="text-2xl font-bold text-white">
                    {userStats.rewards.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500">GTT</p>
                </div>
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Award className="h-5 w-5 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Current Tier</p>
                  <p className="text-2xl font-bold text-white">
                    {userStats.tier}
                  </p>
                  <p className="text-xs text-slate-500">
                    {currentTier.multiplier}x rewards
                  </p>
                </div>
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Shield className="h-5 w-5 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Staking Interface */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  <span className="text-white">Stake GTT Tokens</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-slate-400 mb-2 block">
                    Amount to Stake
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Enter GTT amount"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                    <Button
                      variant="outline"
                      onClick={() =>
                        setStakeAmount(userStats.balance.toString())
                      }
                      className="border-slate-600 text-slate-300"
                    >
                      Max
                    </Button>
                  </div>
                </div>

                <div className="bg-slate-700/20 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-3">
                    Staking Benefits
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Current APY</span>
                      <span className="text-green-400 font-semibold">
                        {(currentTier.multiplier * 15).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Governance Power</span>
                      <span className="text-blue-400 font-semibold">
                        +{currentTier.multiplier}x voting weight
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Mint Priority</span>
                      <span className="text-purple-400 font-semibold">
                        Early access
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleStake}
                  disabled={!stakeAmount || parseFloat(stakeAmount) <= 0}
                  className="w-full bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700 text-white font-semibold"
                >
                  Stake GTT Tokens
                </Button>
              </CardContent>
            </Card>

            {/* Early Adopter Rewards */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-400" />
                  <span className="text-white">Early Adopter Rewards</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
                    <h4 className="text-yellow-400 font-semibold mb-2">
                      First 100 Stakers
                    </h4>
                    <p className="text-white text-xl font-bold">
                      {EARLY_ADOPTER_REWARDS.FIRST_100_STAKERS} GTT
                    </p>
                    <p className="text-xs text-slate-400">
                      Bonus reward for early participation
                    </p>
                  </div>
                  <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4">
                    <h4 className="text-green-400 font-semibold mb-2">
                      Referral Bonus
                    </h4>
                    <p className="text-white text-xl font-bold">
                      {EARLY_ADOPTER_REWARDS.REFERRAL_BONUS} GTT
                    </p>
                    <p className="text-xs text-slate-400">
                      Per successful referral
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Staking Tiers */}
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-400" />
                  <span className="text-white">Staking Tiers</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(STAKING_TIERS).map(([tier, config]) => (
                  <div
                    key={tier}
                    className={`p-3 rounded-lg border ${
                      userStats.tier === tier
                        ? "bg-purple-900/30 border-purple-500/50"
                        : "bg-slate-700/30 border-slate-600"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge
                        className="text-white font-semibold"
                        style={{ backgroundColor: config.color }}
                      >
                        {tier}
                      </Badge>
                      <span className="text-sm text-slate-400">
                        {config.multiplier}x rewards
                      </span>
                    </div>
                    <p className="text-sm text-slate-300">
                      Minimum: {config.min.toLocaleString()} GTT
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Protocol Stats */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  <span className="text-white">Protocol Statistics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Total Staked</span>
                  <span className="text-white font-semibold">2.5M GTT</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Total Stakers</span>
                  <span className="text-white font-semibold">1,247</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Avg APY</span>
                  <span className="text-green-400 font-semibold">18.5%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Lock Period</span>
                  <span className="text-white font-semibold">Flexible</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
