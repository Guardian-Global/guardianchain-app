import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { base } from "wagmi/chains";
import {
  Gift,
  Coins,
  CheckCircle,
  AlertTriangle,
  Clock,
  Wallet,
  Zap,
  Trophy,
  Star,
  Network,
  ExternalLink,
} from "lucide-react";

interface AirdropData {
  eligible: boolean;
  amount: number;
  claimed: boolean;
  eligibilityReason?: string;
  capsuleCount: number;
  joinDate: string;
  tier: string;
  bonusMultiplier: number;
}

export default function Claim() {
  const [customWallet, setCustomWallet] = useState("");
  const [claimProgress, setClaimProgress] = useState(0);
  const { address, isConnected } = useAccount();
  const currentChainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { toast } = useToast();

  const walletToCheck = customWallet || address;

  // Fetch airdrop eligibility
  const { data: airdropData, isLoading: loadingAirdrop, refetch } = useQuery({
    queryKey: ["/api/airdrop", walletToCheck],
    enabled: !!walletToCheck,
  });

  // Claim mutation
  const claimMutation = useMutation({
    mutationFn: async () => {
      if (!walletToCheck) throw new Error("No wallet address");
      
      return apiRequest("/api/claim", {
        method: "POST",
        body: { wallet: walletToCheck },
      });
    },
    onSuccess: (data) => {
      toast({
        title: "GTT Claimed Successfully!",
        description: `You've claimed ${data.amount} GTT tokens on Base network`,
      });
      setClaimProgress(100);
      refetch();
      queryClient.invalidateQueries({ queryKey: ["/api/airdrop"] });
    },
    onError: (error) => {
      toast({
        title: "Claim Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      setClaimProgress(0);
    },
  });

  const handleSwitchToBase = async () => {
    try {
      await switchChain({ chainId: base.id });
      toast({
        title: "Network switched",
        description: "Connected to Base network",
      });
    } catch (error) {
      toast({
        title: "Failed to switch network",
        description: "Please switch to Base manually in your wallet",
        variant: "destructive",
      });
    }
  };

  const handleClaim = async () => {
    if (currentChainId !== base.id) {
      toast({
        title: "Wrong Network",
        description: "Please switch to Base network to claim GTT",
        variant: "destructive",
      });
      return;
    }

    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to claim GTT",
        variant: "destructive",
      });
      return;
    }

    setClaimProgress(25);
    await claimMutation.mutateAsync();
  };

  const renderEligibilityCard = () => {
    if (!airdropData) return null;

    const { eligible, amount, claimed, eligibilityReason, capsuleCount, tier, bonusMultiplier } = airdropData;

    if (claimed) {
      return (
        <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <CheckCircle className="w-5 h-5" />
              Already Claimed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-600 dark:text-green-300">
              You've already claimed your {amount} GTT airdrop on Base network.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.open("https://basescan.org", "_blank")}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View on Basescan
            </Button>
          </CardContent>
        </Card>
      );
    }

    if (!eligible) {
      return (
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
              <AlertTriangle className="w-5 h-5" />
              Not Eligible
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-orange-600 dark:text-orange-300 mb-4">
              {eligibilityReason || "You're not eligible for the GTT airdrop."}
            </p>
            <div className="space-y-2 text-sm">
              <p>Eligibility requirements:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                <li>Minimum 1 capsule minted on GuardianChain</li>
                <li>Account created before airdrop snapshot</li>
                <li>Valid wallet address</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
            <Gift className="w-5 h-5" />
            Eligible for Airdrop
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <Coins className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="font-semibold text-lg">{amount.toLocaleString()} GTT</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Base Allocation</p>
              </div>
            </div>
            <Badge variant="default" className="bg-blue-600">
              <Star className="w-3 h-3 mr-1" />
              {tier} Tier
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-purple-500" />
              <span>{capsuleCount} Capsules</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-500" />
              <span>{bonusMultiplier}x Bonus</span>
            </div>
          </div>

          {currentChainId !== base.id ? (
            <Alert>
              <Network className="w-4 h-4" />
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <span>Switch to Base network to claim GTT</span>
                  <Button onClick={handleSwitchToBase} size="sm" variant="outline">
                    Switch to Base
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          ) : (
            <Button
              onClick={handleClaim}
              disabled={claimMutation.isPending || !isConnected}
              className="w-full"
              size="lg"
            >
              {claimMutation.isPending ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Claiming GTT...
                </>
              ) : (
                <>
                  <Gift className="w-4 h-4 mr-2" />
                  Claim {amount.toLocaleString()} GTT
                </>
              )}
            </Button>
          )}

          {claimProgress > 0 && claimProgress < 100 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Claim Progress</span>
                <span>{claimProgress}%</span>
              </div>
              <Progress value={claimProgress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              GTT Airdrop Portal
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Claim your GuardianChain Truth Tokens on Base network
            </p>
          </div>

          {/* Wallet Input */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Check Eligibility
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Wallet Address
                  </label>
                  <Input
                    value={customWallet}
                    onChange={(e) => setCustomWallet(e.target.value)}
                    placeholder={address || "Enter wallet address to check eligibility"}
                    className="w-full"
                  />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isConnected 
                    ? `Connected wallet: ${address?.slice(0, 6)}...${address?.slice(-4)}`
                    : "Connect wallet or enter address manually"
                  }
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Loading State */}
          {loadingAirdrop && walletToCheck && (
            <Card>
              <CardContent className="py-8">
                <div className="flex items-center justify-center space-x-2">
                  <Clock className="w-5 h-5 animate-spin" />
                  <span>Checking eligibility...</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Eligibility Results */}
          {airdropData && renderEligibilityCard()}

          {/* Airdrop Info */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Base Network Airdrop Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <p><strong>Total Allocation:</strong> 250,000 GTT</p>
                  <p><strong>Network:</strong> Base (Chain ID: 8453)</p>
                  <p><strong>Eligibility Period:</strong> 30 days</p>
                </div>
                <div className="space-y-2">
                  <p><strong>Min Requirement:</strong> 1 Capsule</p>
                  <p><strong>Coinbase Bonus:</strong> +50%</p>
                  <p><strong>Gas Costs:</strong> ~$0.01</p>
                </div>
              </div>
              <Alert>
                <Gift className="w-4 h-4" />
                <AlertDescription>
                  Base users enjoy ultra-low gas costs and instant settlement. 
                  Coinbase Wallet users receive a 50% bonus on their airdrop allocation.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}