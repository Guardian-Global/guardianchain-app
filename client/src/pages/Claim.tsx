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
import { useAccount, useChainId, useSwitchChain, useSignMessage } from "wagmi";
import { base } from "wagmi/chains";
import { useWallet } from "@/hooks/useWallet";
import { useWalletAuth } from "@/hooks/useWalletAuth";
import { useAuth } from "@/hooks/useAuth";
import EnhancedWalletConnect from "@/components/auth/EnhancedWalletConnect";
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
  Shield,
  Award,
  TrendingUp,
} from "lucide-react";

interface EnhancedAirdropData {
  isEligible: boolean;
  baseAmount: number;
  finalAmount: number;
  bonusMultiplier: number;
  bonuses: Array<{ type: string; multiplier: number }>;
  alreadyClaimed: boolean;
  canClaim: boolean;
  snapshotIncluded: boolean;
  requirements: {
    minTransactions: boolean;
    minGTTHolding: boolean;
    communityMember: boolean;
    earlySupporter: boolean;
  };
  network: string;
  estimatedGasFee: string;
}

export default function Claim() {
  const [customWallet, setCustomWallet] = useState("");
  const [claimProgress, setClaimProgress] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const { user } = useAuth();
  const { address, isConnected, chainId, switchToBase } = useWallet();
  const { isWalletAuthenticated, isAuthenticating, authenticateWallet } = useWalletAuth();
  const { signMessageAsync } = useSignMessage();
  const { toast } = useToast();

  const walletToCheck = customWallet || address;

  // Enhanced airdrop eligibility check with new API
  const { data: airdropData, isLoading: loadingAirdrop, refetch } = useQuery({
    queryKey: ["/api/airdrop/check", walletToCheck],
    queryFn: async () => {
      const response = await fetch(`/api/airdrop/check/${walletToCheck}?coinbaseWallet=true&network=base`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to check eligibility");
      return response.json();
    },
    enabled: !!walletToCheck,
  });

  // Enhanced claim mutation with signature verification
  const claimMutation = useMutation({
    mutationFn: async () => {
      if (!walletToCheck) throw new Error("No wallet address");
      if (!isWalletAuthenticated) throw new Error("Wallet not authenticated");
      
      // Generate claim message
      const nonce = Math.random().toString(36).substring(2, 15);
      const message = `Claim GTT Airdrop\n\nWallet: ${walletToCheck}\nNetwork: Base\nNonce: ${nonce}\nTimestamp: ${new Date().toISOString()}`;
      
      // Sign the claim message
      const signature = await signMessageAsync({ message });
      
      // Submit claim with signature
      const response = await fetch("/api/airdrop/claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          walletAddress: walletToCheck,
          signature,
          message,
          network: "base",
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Claim failed");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "GTT Claimed Successfully!",
        description: `You've claimed ${data.finalAmount} GTT tokens on Base network`,
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

  // Fetch airdrop statistics
  const { data: statsData } = useQuery({
    queryKey: ["/api/airdrop/stats"],
    queryFn: async () => {
      const response = await fetch("/api/airdrop/stats", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch stats");
      return response.json();
    },
  });

  const handleClaim = async () => {
    if (!isWalletAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please authenticate your wallet first",
        variant: "destructive",
      });
      return;
    }

    if (chainId !== base.id) {
      toast({
        title: "Wrong Network",
        description: "Please switch to Base network for optimal gas fees",
        variant: "destructive",
      });
      return;
    }

    setClaimProgress(25);
    await claimMutation.mutateAsync();
  };

  const renderEligibilityCard = () => {
    if (!airdropData) return null;

    const { 
      isEligible, 
      baseAmount, 
      finalAmount, 
      alreadyClaimed, 
      bonusMultiplier, 
      bonuses, 
      requirements 
    } = airdropData as EnhancedAirdropData;

    if (alreadyClaimed) {
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
              You've already claimed your {finalAmount} GTT airdrop on Base network.
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

    if (!isEligible) {
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
              This wallet is not eligible for the GTT airdrop.
            </p>
            <div className="space-y-2 text-sm">
              <p>Eligibility requirements:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                <li className={requirements?.minTransactions ? "text-green-600" : ""}>
                  Minimum 5 transactions on GuardianChain
                </li>
                <li className={requirements?.minGTTHolding ? "text-green-600" : ""}>
                  Minimum 100 GTT token holding
                </li>
                <li className={requirements?.communityMember ? "text-green-600" : ""}>
                  Community member before snapshot
                </li>
                <li className={requirements?.earlySupporter ? "text-green-600" : ""}>
                  Early supporter (bonus)
                </li>
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
            Eligible for {finalAmount} GTT
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{finalAmount}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Final Amount</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{bonusMultiplier}x</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Bonus Multiplier</div>
            </div>
          </div>

          {bonuses && bonuses.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Active Bonuses:</p>
              {bonuses.map((bonus, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{bonus.type}:</span>
                  <Badge variant="secondary">{bonus.multiplier}x</Badge>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Base Amount:</span>
              <span>{baseAmount} GTT</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Network:</span>
              <Badge className="bg-blue-600 text-white">Base</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span>Gas Fee:</span>
              <span className="text-green-600">{airdropData.estimatedGasFee}</span>
            </div>
          </div>

          {chainId !== base.id ? (
            <div className="space-y-3">
              <Alert>
                <Network className="w-4 h-4" />
                <AlertDescription>
                  Switch to Base network for ultra-low gas fees (~$0.01)
                </AlertDescription>
              </Alert>
              <Button onClick={switchToBase} className="w-full">
                <Network className="w-4 h-4 mr-2" />
                Switch to Base Network
              </Button>
            </div>
          ) : !isConnected ? (
            <Alert>
              <Wallet className="w-4 h-4" />
              <AlertDescription>
                Connect your wallet to claim your GTT airdrop
              </AlertDescription>
            </Alert>
          ) : !isWalletAuthenticated ? (
            <div className="space-y-3">
              <Alert>
                <Shield className="w-4 h-4" />
                <AlertDescription>
                  Authenticate your wallet to proceed with claiming
                </AlertDescription>
              </Alert>
              <Button 
                onClick={authenticateWallet} 
                disabled={isAuthenticating}
                className="w-full"
              >
                {isAuthenticating ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Authenticate Wallet
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {claimProgress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Claiming Progress</span>
                    <span>{claimProgress}%</span>
                  </div>
                  <Progress value={claimProgress} className="w-full" />
                </div>
              )}
              <Button
                onClick={handleClaim}
                disabled={claimMutation.isPending}
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
                    <Coins className="w-4 h-4 mr-2" />
                    Claim {finalAmount} GTT
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              GTT Airdrop Portal
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Claim your GuardianChain Truth Tokens on Base network
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Claim Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* Enhanced Wallet Connection */}
              <EnhancedWalletConnect 
                showBalance={true} 
                showNetworkInfo={true}
                compact={false}
              />

              {/* Wallet Input */}
              {showAdvanced && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wallet className="w-5 h-5" />
                      Check Different Address
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
                          placeholder="Enter wallet address to check eligibility"
                          className="w-full"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

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

              {/* Advanced Options Toggle */}
              <div className="text-center">
                <Button
                  variant="ghost"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  size="sm"
                >
                  {showAdvanced ? "Hide" : "Show"} Advanced Options
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Airdrop Stats */}
              {statsData && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Airdrop Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total Allocated:</span>
                        <span className="font-mono">{statsData.totalAllocated?.toLocaleString() || "250,000"} GTT</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Claimed:</span>
                        <span className="font-mono text-green-600">{statsData.totalClaimed?.toLocaleString() || "0"} GTT</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Remaining:</span>
                        <span className="font-mono text-blue-600">{statsData.totalUnclaimed?.toLocaleString() || "250,000"} GTT</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Eligible Wallets:</span>
                        <span className="font-mono">{statsData.eligibleWallets || "10"}</span>
                      </div>
                    </div>
                    <Progress value={statsData.claimPercentage || 0} className="w-full" />
                    <p className="text-xs text-gray-500">
                      {(statsData.claimPercentage || 0).toFixed(1)}% claimed
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Network Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="w-5 h-5" />
                    Base Network Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-green-500" />
                      <span>Ultra-low gas fees (~$0.01)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span>Instant transactions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-500" />
                      <span>Ethereum-grade security</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-purple-500" />
                      <span>1.5x Coinbase Wallet bonus</span>
                    </div>
                  </div>
                  <Alert>
                    <Gift className="w-4 h-4" />
                    <AlertDescription>
                      Base users enjoy the best experience with minimal fees and maximum rewards.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Claim Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle>How to Claim</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">1</span>
                    <span>Connect your wallet</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">2</span>
                    <span>Switch to Base network</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">3</span>
                    <span>Authenticate your wallet</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">4</span>
                    <span>Sign and claim your GTT</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}