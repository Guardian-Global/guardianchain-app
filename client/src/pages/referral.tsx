import { useState } from "react";
import {
  Share2,
  Users,
  Gift,
  Copy,
  Check,
  Star,
  TrendingUp,
  Award,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  BRAND_NAME,
  BRAND_COLORS,
  EARLY_ADOPTER_REWARDS,
} from "@/lib/constants";

export default function ReferralPage() {
  const [referralCode] = useState("GUARDIAN-X7K9M");
  const [copied, setCopied] = useState(false);
  const [userStats, setUserStats] = useState({
    totalReferrals: 12,
    activeReferrals: 8,
    totalEarned: 1200,
    pendingRewards: 300,
    rank: 47,
  });
  const { toast } = useToast();

  const copyReferralCode = () => {
    navigator.clipboard.writeText(
      `https://guardianchain.app/register?ref=${referralCode}`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Link Copied!",
      description: "Referral link has been copied to clipboard",
    });
  };

  const leaderboard = [
    {
      rank: 1,
      name: "TruthSeeker42",
      referrals: 156,
      earned: 15600,
      badge: "DIAMOND",
    },
    {
      rank: 2,
      name: "VerifyGuru",
      referrals: 134,
      earned: 13400,
      badge: "PLATINUM",
    },
    {
      rank: 3,
      name: "ChainGuardian",
      referrals: 98,
      earned: 9800,
      badge: "GOLD",
    },
    {
      rank: 4,
      name: "CryptoTruth",
      referrals: 87,
      earned: 8700,
      badge: "GOLD",
    },
    {
      rank: 5,
      name: "BlockchainBob",
      referrals: 76,
      earned: 7600,
      badge: "SILVER",
    },
  ];

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "DIAMOND":
        return "bg-cyan-600";
      case "PLATINUM":
        return "bg-slate-600";
      case "GOLD":
        return "bg-yellow-600";
      case "SILVER":
        return "bg-gray-600";
      default:
        return "bg-bronze-600";
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <Card className="mb-8 bg-gradient-to-r from-purple-900/50 to-green-900/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Share2 className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <span className="text-white text-xl font-bold">
                  <span style={{ color: BRAND_COLORS.GUARDIAN }}>GUARDIAN</span>
                  <span style={{ color: BRAND_COLORS.CHAIN }}>CHAIN</span>{" "}
                  Referral Program
                </span>
                <p className="text-slate-400 text-sm font-normal">
                  Earn {EARLY_ADOPTER_REWARDS.REFERRAL_BONUS} GTT for every
                  successful referral
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
                  <p className="text-sm text-slate-400">Total Referrals</p>
                  <p className="text-2xl font-bold text-white">
                    {userStats.totalReferrals}
                  </p>
                </div>
                <Users className="h-5 w-5 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Active Referrals</p>
                  <p className="text-2xl font-bold text-white">
                    {userStats.activeReferrals}
                  </p>
                </div>
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Earned</p>
                  <p className="text-2xl font-bold text-white">
                    {userStats.totalEarned}
                  </p>
                  <p className="text-xs text-slate-500">GTT</p>
                </div>
                <Gift className="h-5 w-5 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Leaderboard Rank</p>
                  <p className="text-2xl font-bold text-white">
                    #{userStats.rank}
                  </p>
                </div>
                <Award className="h-5 w-5 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Referral Tools */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-blue-400" />
                  <span className="text-white">Your Referral Link</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-slate-400 mb-2 block">
                    Share this link to earn rewards
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={`https://guardianchain.app/register?ref=${referralCode}`}
                      readOnly
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                    <Button
                      onClick={copyReferralCode}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="bg-slate-700/20 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-3">
                    How It Works
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        1
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          Share Your Link
                        </p>
                        <p className="text-slate-400 text-sm">
                          Send your referral link to friends and colleagues
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        2
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          They Join & Verify
                        </p>
                        <p className="text-slate-400 text-sm">
                          New users register and complete wallet verification
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-yellow-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        3
                      </div>
                      <div>
                        <p className="text-white font-medium">Earn Rewards</p>
                        <p className="text-slate-400 text-sm">
                          Receive {EARLY_ADOPTER_REWARDS.REFERRAL_BONUS} GTT for
                          each successful referral
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rewards Program */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-yellow-400" />
                  <span className="text-white">Bonus Rewards</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-purple-900/20 border border-purple-600/30 rounded-lg p-4">
                    <h4 className="text-purple-400 font-semibold mb-2">
                      Truth Pioneer Badge
                    </h4>
                    <p className="text-white text-lg font-bold">
                      10+ Referrals
                    </p>
                    <p className="text-xs text-slate-400">
                      Exclusive NFT badge for top referrers
                    </p>
                  </div>
                  <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4">
                    <h4 className="text-green-400 font-semibold mb-2">
                      Volume Bonus
                    </h4>
                    <p className="text-white text-lg font-bold">+50% GTT</p>
                    <p className="text-xs text-slate-400">
                      Extra rewards for active referrals
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-600/30 rounded-lg p-4">
                  <h4 className="text-yellow-400 font-semibold mb-2">
                    Early Adopter Special
                  </h4>
                  <p className="text-white text-lg font-bold">
                    First 100 Users: 2x Rewards
                  </p>
                  <p className="text-xs text-slate-400">
                    Double GTT rewards for early program participants
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Leaderboard */}
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-400" />
                  <span className="text-white">Top Referrers</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {leaderboard.map((user, index) => (
                  <div
                    key={user.rank}
                    className={`p-3 rounded-lg border ${
                      index < 3
                        ? "bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-yellow-600/30"
                        : "bg-slate-700/30 border-slate-600"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                            index === 0
                              ? "bg-yellow-600"
                              : index === 1
                                ? "bg-gray-400"
                                : index === 2
                                  ? "bg-orange-600"
                                  : "bg-slate-600"
                          }`}
                        >
                          {user.rank}
                        </div>
                        <span className="text-white font-medium">
                          {user.name}
                        </span>
                      </div>
                      <Badge
                        className={`text-white ${getBadgeColor(user.badge)}`}
                      >
                        {user.badge}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">
                        {user.referrals} referrals
                      </span>
                      <span className="text-green-400 font-semibold">
                        {user.earned} GTT
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Your Progress */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-purple-400" />
                  <span className="text-white">Your Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Truth Pioneer Badge</span>
                    <span className="text-green-400">Earned ✓</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Volume Bonus</span>
                    <span className="text-green-400">Active ✓</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Top 50 Rank</span>
                    <span className="text-yellow-400">Progress: 47/50</span>
                  </div>
                </div>

                <div className="bg-slate-700/20 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">
                      Next Milestone
                    </span>
                    <span className="text-sm text-white">15 referrals</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-green-500 h-2 rounded-full"
                      style={{
                        width: `${(userStats.totalReferrals / 15) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {15 - userStats.totalReferrals} more referrals to unlock
                    Diamond Badge
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
