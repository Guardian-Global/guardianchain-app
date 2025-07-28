import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Copy, Gift, Users, Zap, Check, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface AirdropStatus {
  claimed: boolean;
  amount: string;
  claimDate?: string;
  eligible: boolean;
  eligibilityReason: string;
}

interface ReferralData {
  code: string;
  totalReferrals: number;
  totalRewards: string;
  pendingRewards: string;
  referralLink: string;
  recentReferrals: Array<{
    address: string;
    joinDate: string;
    rewardEarned: string;
    status: "pending" | "completed";
  }>;
}

export default function AirdropPage() {
  const { toast } = useToast();
  const [referralCode, setReferralCode] = useState("");
  const [walletAddress, setWalletAddress] = useState("");

  // Fetch airdrop status
  const { data: airdropStatus, isLoading: airdropLoading } =
    useQuery<AirdropStatus>({
      queryKey: ["/api/airdrop/status"],
      queryFn: async () => {
        // Mock data for demo - replace with actual API call
        return {
          claimed: false,
          amount: "100",
          eligible: true,
          eligibilityReason: "Early platform user",
        };
      },
    });

  // Fetch referral data
  const { data: referralData, isLoading: referralLoading } =
    useQuery<ReferralData>({
      queryKey: ["/api/referral/data"],
      queryFn: async () => {
        // Mock data for demo - replace with actual API call
        return {
          code: "GUARD1234",
          totalReferrals: 8,
          totalRewards: "400",
          pendingRewards: "150",
          referralLink: "https://guardianchain.app/signup?ref=GUARD1234",
          recentReferrals: [
            {
              address: "0x1234...5678",
              joinDate: "2025-01-15",
              rewardEarned: "50",
              status: "completed",
            },
            {
              address: "0x9876...4321",
              joinDate: "2025-01-20",
              rewardEarned: "50",
              status: "pending",
            },
          ],
        };
      },
    });

  // Claim airdrop mutation
  const claimAirdropMutation = useMutation({
    mutationFn: async (address: string) => {
      return apiRequest("POST", "/api/airdrop/claim", { address });
    },
    onSuccess: () => {
      toast({
        title: "Airdrop Claimed!",
        description: "Successfully claimed 100 GTT tokens",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/airdrop/status"] });
    },
    onError: (error: any) => {
      toast({
        title: "Claim Failed",
        description: error.message || "Failed to claim airdrop",
        variant: "destructive",
      });
    },
  });

  // Generate referral code mutation
  const generateReferralMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/referral/generate", {});
    },
    onSuccess: () => {
      toast({
        title: "Referral Code Generated",
        description: "Your unique referral code has been created",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/referral/data"] });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate referral code",
        variant: "destructive",
      });
    },
  });

  const handleClaimAirdrop = () => {
    if (!walletAddress) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet or enter your address",
        variant: "destructive",
      });
      return;
    }
    claimAirdropMutation.mutate(walletAddress);
  };

  const copyReferralLink = () => {
    if (referralData?.referralLink) {
      navigator.clipboard.writeText(referralData.referralLink);
      toast({
        title: "Copied!",
        description: "Referral link copied to clipboard",
      });
    }
  };

  const shareOnTwitter = () => {
    if (referralData?.referralLink) {
      const tweetText = `Join me on GUARDIANCHAIN and earn GTT tokens! 🚀\n\nSign up with my referral link and we both get 50 GTT tokens when you start staking.\n\n${referralData.referralLink}\n\n#GUARDIANCHAIN #GTT #DeFi`;
      const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        tweetText
      )}`;
      window.open(tweetUrl, "_blank");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-green-600 bg-clip-text text-transparent">
          GTT Airdrop & Referrals
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Claim your free GTT tokens and earn rewards by inviting friends to
          join GUARDIANCHAIN
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Airdrop Section */}
        <Card className="border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
              <Gift className="h-6 w-6" />
              GTT Token Airdrop
            </CardTitle>
            <CardDescription>
              Claim your free GTT tokens for being an early GUARDIANCHAIN
              supporter
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {airdropLoading ? (
              <div className="space-y-4">
                <div className="h-20 bg-muted animate-pulse rounded-lg" />
                <div className="h-10 bg-muted animate-pulse rounded" />
              </div>
            ) : airdropStatus ? (
              <>
                <div className="text-center space-y-2">
                  <div className="text-6xl font-bold text-purple-600">
                    {airdropStatus.amount}
                  </div>
                  <div className="text-2xl font-semibold text-muted-foreground">
                    GTT Tokens
                  </div>
                  <Badge
                    variant={airdropStatus.eligible ? "default" : "secondary"}
                    className="mt-2"
                  >
                    {airdropStatus.eligible ? "Eligible" : "Not Eligible"}
                  </Badge>
                </div>

                {airdropStatus.eligible && !airdropStatus.claimed && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="wallet-address">Wallet Address</Label>
                      <Input
                        id="wallet-address"
                        placeholder="0x... or connect wallet"
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                      />
                    </div>

                    <Button
                      onClick={handleClaimAirdrop}
                      disabled={claimAirdropMutation.isPending}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      size="lg"
                    >
                      {claimAirdropMutation.isPending ? (
                        "Claiming..."
                      ) : (
                        <>
                          <Gift className="h-5 w-5 mr-2" />
                          Claim Airdrop
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {airdropStatus.claimed && (
                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center text-green-600">
                      <Check className="h-8 w-8" />
                    </div>
                    <p className="text-lg font-semibold text-green-600">
                      Airdrop Claimed!
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Claimed on {airdropStatus.claimDate}
                    </p>
                  </div>
                )}

                {!airdropStatus.eligible && (
                  <div className="text-center space-y-2">
                    <p className="text-lg font-semibold text-muted-foreground">
                      Not Eligible
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {airdropStatus.eligibilityReason}
                    </p>
                  </div>
                )}
              </>
            ) : null}
          </CardContent>
        </Card>

        {/* Referral Section */}
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <Users className="h-6 w-6" />
              Referral Program
            </CardTitle>
            <CardDescription>
              Earn 50 GTT for each friend you refer, and they get 50 GTT too!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {referralLoading ? (
              <div className="space-y-4">
                <div className="h-20 bg-muted animate-pulse rounded-lg" />
                <div className="h-10 bg-muted animate-pulse rounded" />
              </div>
            ) : referralData ? (
              <>
                {/* Referral Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {referralData.totalReferrals}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Referrals
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {referralData.totalRewards}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      GTT Earned
                    </div>
                  </div>
                </div>

                {/* Referral Code */}
                <div className="space-y-2">
                  <Label>Your Referral Code</Label>
                  <div className="flex gap-2">
                    <Input
                      value={referralData.code}
                      readOnly
                      className="font-mono"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        navigator.clipboard.writeText(referralData.code);
                        toast({
                          title: "Copied!",
                          description: "Referral code copied",
                        });
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Referral Link */}
                <div className="space-y-2">
                  <Label>Your Referral Link</Label>
                  <div className="flex gap-2">
                    <Input
                      value={referralData.referralLink}
                      readOnly
                      className="text-xs"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={copyReferralLink}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Share Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={shareOnTwitter}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Share on Twitter
                  </Button>
                  <Button variant="outline" onClick={copyReferralLink}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                  </Button>
                </div>

                {/* Pending Rewards */}
                {referralData.pendingRewards !== "0" && (
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-600" />
                      <span className="font-semibold">Pending Rewards</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {referralData.pendingRewards} GTT will be distributed when
                      your referrals complete their first stake
                    </p>
                  </div>
                )}

                {/* Recent Referrals */}
                {referralData.recentReferrals.length > 0 && (
                  <div className="space-y-2">
                    <Label>Recent Referrals</Label>
                    <div className="space-y-2">
                      {referralData.recentReferrals.map((referral, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <p className="font-mono text-sm">
                              {referral.address}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {referral.joinDate}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              {referral.rewardEarned} GTT
                            </p>
                            <Badge
                              variant={
                                referral.status === "completed"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {referral.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  No referral code generated yet
                </p>
                <Button
                  onClick={() => generateReferralMutation.mutate()}
                  disabled={generateReferralMutation.isPending}
                >
                  Generate Referral Code
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* How it Works */}
      <Card>
        <CardHeader>
          <CardTitle>How the Referral Program Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto">
                <span className="text-xl font-bold text-purple-600">1</span>
              </div>
              <h3 className="font-semibold">Share Your Link</h3>
              <p className="text-sm text-muted-foreground">
                Share your unique referral link with friends and on social media
              </p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto">
                <span className="text-xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="font-semibold">Friends Join & Stake</h3>
              <p className="text-sm text-muted-foreground">
                When they sign up and make their first stake, you both get
                rewarded
              </p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                <span className="text-xl font-bold text-green-600">3</span>
              </div>
              <h3 className="font-semibold">Earn GTT Tokens</h3>
              <p className="text-sm text-muted-foreground">
                Receive 50 GTT tokens for each successful referral automatically
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
