import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Gift,
  Users,
  Copy,
  Share2,
  Award,
  TrendingUp,
  Target,
  Zap,
} from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function Referral() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [referralCode] = useState("GUARDIAN2025X");

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <Card className="bg-slate-800/50 border-slate-700 max-w-md">
          <CardHeader className="text-center">
            <Gift className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please log in to access referral features.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/api/login">Login to Continue</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const copyReferralLink = () => {
    const referralLink = `https://guardianchain.app/join?ref=${referralCode}`;
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard",
    });
  };

  const shareReferral = () => {
    if (navigator.share) {
      navigator.share({
        title: "Join GuardianChain",
        text: "Join me on GuardianChain - the sovereign truth verification platform!",
        url: `https://guardianchain.app/join?ref=${referralCode}`,
      });
    } else {
      copyReferralLink();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-yellow-900/20 to-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-slate-800/50 bg-slate-800/30 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src="/assets/logo/GUARDIANCHAIN_logo.png"
                alt="GuardianChain"
                className="h-8 w-auto"
              />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Refer & Earn
              </h1>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
            Share Truth, Earn Rewards
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Invite friends to join GuardianChain and earn GTT rewards for every
            successful referral.
          </p>
        </div>

        {/* Referral Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-slate-800/50 to-yellow-900/20 border-slate-700/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-yellow-400" />
                Total Referrals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">12</div>
              <p className="text-xs text-gray-400">Successful invites</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-green-900/20 border-slate-700/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="h-5 w-5 text-green-400" />
                GTT Earned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">480</div>
              <p className="text-xs text-gray-400">From referrals</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-blue-900/20 border-slate-700/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-400" />
                This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">3</div>
              <p className="text-xs text-gray-400">New referrals</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-purple-900/20 border-slate-700/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-400" />
                Next Milestone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">3</div>
              <p className="text-xs text-gray-400">Referrals to bonus</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="invite" className="space-y-6">
          <TabsList className="bg-slate-800/50 border border-slate-700/50">
            <TabsTrigger value="invite">Send Invites</TabsTrigger>
            <TabsTrigger value="rewards">Rewards Program</TabsTrigger>
            <TabsTrigger value="history">Referral History</TabsTrigger>
          </TabsList>

          {/* Send Invites */}
          <TabsContent value="invite" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="h-5 w-5 text-yellow-400" />
                    Your Referral Link
                  </CardTitle>
                  <CardDescription>
                    Share this link to earn GTT rewards
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Referral Code</label>
                    <div className="flex gap-2">
                      <Input
                        value={referralCode}
                        readOnly
                        className="bg-slate-700 border-slate-600 font-mono"
                      />
                      <Button
                        variant="outline"
                        onClick={copyReferralLink}
                        className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-600/20"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Full Referral Link
                    </label>
                    <div className="flex gap-2">
                      <Input
                        value={`https://guardianchain.app/join?ref=${referralCode}`}
                        readOnly
                        className="bg-slate-700 border-slate-600 text-sm"
                      />
                      <Button
                        variant="outline"
                        onClick={copyReferralLink}
                        className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-600/20"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4">
                    <Button
                      onClick={shareReferral}
                      className="bg-gradient-to-r from-yellow-600 to-orange-600"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Link
                    </Button>

                    <Button
                      variant="outline"
                      className="border-blue-500/30 text-blue-400 hover:bg-blue-600/20"
                    >
                      <Gift className="h-4 w-4 mr-2" />
                      Email Invite
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5 text-green-400" />
                    Referral Benefits
                  </CardTitle>
                  <CardDescription>
                    What you and your friends earn
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-xl p-4 border border-green-500/30">
                    <h4 className="font-semibold text-green-400 mb-2">
                      You Earn
                    </h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• 40 GTT per successful referral</li>
                      <li>• 5% of their staking rewards</li>
                      <li>• Tier progress bonuses</li>
                      <li>• Special milestone rewards</li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-4 border border-purple-500/30">
                    <h4 className="font-semibold text-purple-400 mb-2">
                      They Earn
                    </h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• 20 GTT welcome bonus</li>
                      <li>• 10% staking boost (30 days)</li>
                      <li>• Free premium features trial</li>
                      <li>• Priority verification queue</li>
                    </ul>
                  </div>

                  <div className="text-center pt-2">
                    <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-500/30">
                      Limited Time: Double Rewards
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Rewards Program */}
          <TabsContent value="rewards" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-400" />
                  Referral Milestones
                </CardTitle>
                <CardDescription>
                  Unlock special rewards as you refer more guardians
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      milestone: 5,
                      reward: "100 GTT Bonus",
                      badge: "Truth Spreader",
                      unlocked: true,
                    },
                    {
                      milestone: 10,
                      reward: "250 GTT + NFT Avatar",
                      badge: "Network Builder",
                      unlocked: true,
                    },
                    {
                      milestone: 15,
                      reward: "500 GTT + Tier Boost",
                      badge: "Community Leader",
                      unlocked: false,
                    },
                    {
                      milestone: 25,
                      reward: "1000 GTT + Exclusive Access",
                      badge: "Guardian Master",
                      unlocked: false,
                    },
                    {
                      milestone: 50,
                      reward: "2500 GTT + Revenue Share",
                      badge: "Truth Ambassador",
                      unlocked: false,
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-xl border ${
                        item.unlocked
                          ? "bg-green-600/10 border-green-500/30"
                          : "bg-slate-700/30 border-slate-600/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              item.unlocked
                                ? "bg-green-600 text-white"
                                : "bg-slate-600 text-gray-300"
                            }`}
                          >
                            {item.milestone}
                          </div>
                          <div>
                            <p className="font-medium text-white">
                              {item.reward}
                            </p>
                            <p className="text-sm text-gray-400">
                              {item.badge} Badge
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          {item.unlocked ? (
                            <Badge className="bg-green-600/20 text-green-400">
                              Unlocked
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="border-gray-500/30 text-gray-400"
                            >
                              {item.milestone - 12} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Referral History */}
          <TabsContent value="history" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-400" />
                  Referral Activity
                </CardTitle>
                <CardDescription>
                  Track your referral success and earnings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      date: "2025-08-01",
                      user: "alice.eth",
                      status: "Active",
                      earned: "40 GTT",
                      bonus: "Staking: +2.1 GTT",
                    },
                    {
                      date: "2025-07-28",
                      user: "bob_crypto",
                      status: "Active",
                      earned: "40 GTT",
                      bonus: "Staking: +1.8 GTT",
                    },
                    {
                      date: "2025-07-25",
                      user: "charlie99",
                      status: "Pending",
                      earned: "0 GTT",
                      bonus: "Verification pending",
                    },
                    {
                      date: "2025-07-20",
                      user: "diana_dev",
                      status: "Active",
                      earned: "40 GTT",
                      bonus: "Staking: +3.2 GTT",
                    },
                  ].map((referral, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            referral.status === "Active"
                              ? "bg-green-500"
                              : "bg-yellow-500"
                          }`}
                        ></div>
                        <div>
                          <p className="font-medium text-white">
                            {referral.user}
                          </p>
                          <p className="text-sm text-gray-400">
                            {referral.bonus}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p
                          className={`font-semibold ${
                            referral.status === "Active"
                              ? "text-green-400"
                              : "text-yellow-400"
                          }`}
                        >
                          {referral.earned}
                        </p>
                        <p className="text-xs text-gray-400">{referral.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
