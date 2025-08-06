import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Coins,
  Clock,
  TrendingUp,
  Wallet,
  CheckCircle,
  AlertCircle,
  Calculator,
  Zap,
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface ClaimStatus {
  griefTier: number;
  yieldAmount: number;
  canClaim: boolean;
  nextClaimTime?: string;
  cooldownHours: number;
}

interface ClaimHistory {
  id: string;
  griefTier: number;
  amount: number;
  timestamp: string;
  transactionHash: string;
}

export default function GTTYieldClaimInterface() {
  const [selectedTier, setSelectedTier] = useState<number>(1);
  const [walletConnected, setWalletConnected] = useState(false);
  const [userAddress, setUserAddress] = useState<string>("");
  const { toast } = useToast();

  // Get claim status for all tiers
  const { data: claimStatuses, isLoading } = useQuery<ClaimStatus[]>({
    queryKey: ["/api/gtt/claim-status"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Get user's claim history
  const { data: claimHistory } = useQuery<ClaimHistory[]>({
    queryKey: ["/api/gtt/claim-history"],
    enabled: walletConnected,
  });

  // Get current GTT balance
  const { data: balance } = useQuery<{ balance: number; formatted: string }>({
    queryKey: ["/api/gtt/balance"],
    enabled: walletConnected,
    refetchInterval: 10000,
  });

  // Claim yield mutation
  const claimYieldMutation = useMutation({
    mutationFn: async (griefTier: number) => {
      const response = await apiRequest("POST", "/api/gtt/claim-yield", {
        griefTier,
      });
      return response.json();
    },
    onSuccess: (result) => {
      toast({
        title: "Yield Claimed Successfully!",
        description: `${result.amount} GTT tokens have been transferred to your wallet.`,
      });
      // Refresh data
      window.location.reload();
    },
    onError: (error) => {
      toast({
        title: "Claim Failed",
        description:
          error.message || "Failed to claim yield. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Connect wallet
  const connectWallet = async () => {
    try {
      if (typeof window !== "undefined" && window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setUserAddress(accounts[0]);
        setWalletConnected(true);
        toast({
          title: "Wallet Connected",
          description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
        });
      } else {
        toast({
          title: "MetaMask Not Found",
          description: "Please install MetaMask to claim GTT yields.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet.",
        variant: "destructive",
      });
    }
  };

  const handleClaim = (griefTier: number) => {
    if (!walletConnected) {
      connectWallet();
      return;
    }
    claimYieldMutation.mutate(griefTier);
  };

  const getGriefTierColor = (tier: number) => {
    switch (tier) {
      case 1:
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case 2:
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case 3:
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case 4:
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case 5:
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-brand-surface text-brand-light border-brand-surface";
    }
  };

  const getGriefTierDescription = (tier: number) => {
    switch (tier) {
      case 1:
        return "Light reflection and personal memories";
      case 2:
        return "Moderate emotional significance";
      case 3:
        return "Substantial personal or community impact";
      case 4:
        return "Deep emotional trauma or major revelations";
      case 5:
        return "Profound grief, major truth, or historical significance";
      default:
        return "Unknown tier";
    }
  };

  const formatTimeRemaining = (timestamp: string) => {
    const now = new Date();
    const claimTime = new Date(timestamp);
    const diff = claimTime.getTime() - now.getTime();

    if (diff <= 0) return "Available now";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m remaining`;
  };

  const calculateTotalEarnings = () => {
    if (!claimHistory) return 0;
    return claimHistory.reduce((total, claim) => total + claim.amount, 0);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-brand-secondary border-brand-surface">
        <CardHeader>
          <CardTitle className="text-brand-light font-brand flex items-center gap-2">
            <Coins className="w-6 h-6 text-brand-warning" />
            GTT Yield Claiming Interface
          </CardTitle>
          <p className="text-brand-light/60">
            Claim GTT token yields based on your grief tier contributions to the
            GuardianChain ecosystem.
          </p>
        </CardHeader>
      </Card>

      {/* Wallet Status */}
      <Card className="bg-brand-secondary border-brand-surface">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wallet className="w-5 h-5 text-brand-light/60" />
              <div>
                <p className="text-sm text-brand-light">
                  {walletConnected
                    ? `Connected: ${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`
                    : "Wallet Not Connected"}
                </p>
                {balance && (
                  <p className="text-xs text-brand-light/60">
                    Balance: {balance.formatted} GTT
                  </p>
                )}
              </div>
            </div>
            {!walletConnected && (
              <Button
                onClick={connectWallet}
                className="bg-brand-primary hover:bg-brand-primary/90"
              >
                Connect Wallet
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      {walletConnected && claimHistory && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-brand-secondary border-brand-surface">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-brand-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-brand-light">
                {calculateTotalEarnings()}
              </div>
              <p className="text-sm text-brand-light/60">Total GTT Earned</p>
            </CardContent>
          </Card>
          <Card className="bg-brand-secondary border-brand-surface">
            <CardContent className="p-6 text-center">
              <Zap className="w-8 h-8 text-brand-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-brand-light">
                {claimHistory.length}
              </div>
              <p className="text-sm text-brand-light/60">Total Claims</p>
            </CardContent>
          </Card>
          <Card className="bg-brand-secondary border-brand-surface">
            <CardContent className="p-6 text-center">
              <Calculator className="w-8 h-8 text-brand-warning mx-auto mb-2" />
              <div className="text-2xl font-bold text-brand-light">
                {claimHistory.length > 0
                  ? Math.round(calculateTotalEarnings() / claimHistory.length)
                  : 0}
              </div>
              <p className="text-sm text-brand-light/60">Avg GTT Per Claim</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Grief Tier Claims */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5].map((tier) => {
          const tierStatus = claimStatuses?.find((s) => s.griefTier === tier);
          const yieldAmount = tier * 10; // 10 GTT per tier

          return (
            <Card
              key={tier}
              className="bg-brand-secondary border-brand-surface"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge className={getGriefTierColor(tier)}>
                    Grief Tier {tier}
                  </Badge>
                  <div className="text-right">
                    <div className="text-lg font-bold text-brand-warning">
                      {yieldAmount} GTT
                    </div>
                    <div className="text-xs text-brand-light/60">
                      Yield Amount
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-brand-light/80">
                  {getGriefTierDescription(tier)}
                </p>

                {tierStatus && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-brand-light/60">Status:</span>
                      <div className="flex items-center gap-1">
                        {tierStatus.canClaim ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-brand-accent" />
                            <span className="text-brand-accent">Available</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-4 h-4 text-brand-warning" />
                            <span className="text-brand-warning">Cooldown</span>
                          </>
                        )}
                      </div>
                    </div>

                    {!tierStatus.canClaim && tierStatus.nextClaimTime && (
                      <div className="text-xs text-brand-light/60">
                        Next claim:{" "}
                        {formatTimeRemaining(tierStatus.nextClaimTime)}
                      </div>
                    )}
                  </div>
                )}

                <Button
                  onClick={() => handleClaim(tier)}
                  disabled={
                    !walletConnected ||
                    (tierStatus && !tierStatus.canClaim) ||
                    claimYieldMutation.isPending
                  }
                  className="w-full bg-brand-accent hover:bg-brand-accent/90 disabled:opacity-50"
                >
                  {claimYieldMutation.isPending
                    ? "Claiming..."
                    : !walletConnected
                      ? "Connect Wallet"
                      : tierStatus && !tierStatus.canClaim
                        ? "On Cooldown"
                        : `Claim ${yieldAmount} GTT`}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Claim History */}
      {walletConnected && claimHistory && claimHistory.length > 0 && (
        <Card className="bg-brand-secondary border-brand-surface">
          <CardHeader>
            <CardTitle className="text-brand-light font-brand">
              Recent Claims
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {claimHistory.slice(0, 5).map((claim) => (
                <div
                  key={claim.id}
                  className="flex items-center justify-between p-3 bg-brand-surface rounded-vault"
                >
                  <div className="flex items-center gap-3">
                    <Badge className={getGriefTierColor(claim.griefTier)}>
                      Tier {claim.griefTier}
                    </Badge>
                    <div>
                      <p className="text-sm text-brand-light font-medium">
                        {claim.amount} GTT
                      </p>
                      <p className="text-xs text-brand-light/60">
                        {new Date(claim.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-brand-light/60 font-mono">
                      {claim.transactionHash.slice(0, 8)}...
                      {claim.transactionHash.slice(-6)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card className="bg-brand-secondary border-brand-surface">
        <CardHeader>
          <CardTitle className="text-brand-light font-brand">
            How It Works
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-brand-light/80">
            <div>
              <h4 className="font-medium text-brand-light mb-2">
                Grief Tier System
              </h4>
              <ul className="space-y-1">
                <li>• Tier 1-5 based on emotional weight</li>
                <li>• Higher tiers = more GTT yield</li>
                <li>• 10 GTT tokens per tier level</li>
                <li>• 24-hour cooldown between claims</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-brand-light mb-2">
                Claiming Process
              </h4>
              <ul className="space-y-1">
                <li>• Connect your Web3 wallet</li>
                <li>• Select desired grief tier</li>
                <li>• Confirm blockchain transaction</li>
                <li>• Receive GTT tokens instantly</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
