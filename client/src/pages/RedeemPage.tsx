import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { 
  Gift, 
  Wallet, 
  Shield, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Coins,
  Trophy,
  Lock,
  Unlock
} from "lucide-react";

interface RedeemableCapusle {
  id: string;
  title: string;
  griefScore: number;
  unlockTimestamp: number;
  redeemed: boolean;
  value: number;
  type: string;
  claimant?: string;
  requirements?: {
    minGriefScore: number;
    timelock: boolean;
    verified: boolean;
  };
}

interface RedemptionResult {
  success: boolean;
  capsuleId?: string;
  redeemedAt?: string;
  gttReward?: number;
  reason?: string;
  txHash?: string;
}

export default function RedeemPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [capsuleId, setCapsuleId] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [redeemableCapusles, setRedeemableCapusles] = useState<RedeemableCapusle[]>([]);
  const [redemptionResult, setRedemptionResult] = useState<RedemptionResult | null>(null);
  const [selectedCapsule, setSelectedCapsule] = useState<RedeemableCapusle | null>(null);

  // Load user's redeemable capsules on mount
  useEffect(() => {
    if (user) {
      loadRedeemableCapusles();
      setWalletAddress(user.walletAddress || "");
    }
  }, [user]);

  const loadRedeemableCapusles = async () => {
    try {
      const response = await apiRequest("GET", "/api/redeem/available");
      setRedeemableCapusles(response.capsules || []);
    } catch (error) {
      console.error("Failed to load redeemable capsules:", error);
    }
  };

  const handleRedeemCapsule = async () => {
    if (!capsuleId.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a capsule ID",
        variant: "destructive"
      });
      return;
    }

    if (!walletAddress.trim()) {
      toast({
        title: "Missing Information", 
        description: "Please enter your wallet address",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest("POST", "/api/redeem", {
        capsuleId: capsuleId.trim(),
        wallet: walletAddress.trim()
      });

      setRedemptionResult(response);
      
      if (response.success) {
        toast({
          title: "Redemption Successful",
          description: `Capsule redeemed! You earned ${response.gttReward || 0} GTT tokens.`
        });
        // Refresh the available capsules
        await loadRedeemableCapusles();
      } else {
        toast({
          title: "Redemption Failed",
          description: response.reason || "Unknown error occurred",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to redeem capsule",
        variant: "destructive"
      });
      setRedemptionResult({
        success: false,
        reason: "Network error occurred"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickRedeem = async (capsule: RedeemableCapusle) => {
    if (!walletAddress.trim()) {
      toast({
        title: "Missing Wallet",
        description: "Please enter your wallet address first",
        variant: "destructive"
      });
      return;
    }

    setSelectedCapsule(capsule);
    setCapsuleId(capsule.id);
    
    setLoading(true);
    try {
      const response = await apiRequest("POST", "/api/redeem", {
        capsuleId: capsule.id,
        wallet: walletAddress.trim()
      });

      setRedemptionResult(response);
      
      if (response.success) {
        toast({
          title: "Quick Redemption Successful",
          description: `"${capsule.title}" redeemed for ${response.gttReward || 0} GTT!`
        });
        await loadRedeemableCapusles();
      } else {
        toast({
          title: "Redemption Failed",
          description: response.reason || "Unknown error occurred",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to redeem capsule",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setSelectedCapsule(null);
    }
  };

  const isUnlockable = (capsule: RedeemableCapusle) => {
    const now = Date.now();
    return !capsule.redeemed && 
           now >= capsule.unlockTimestamp && 
           (!capsule.requirements || 
            (capsule.griefScore >= (capsule.requirements.minGriefScore || 0)));
  };

  const getTimeUntilUnlock = (timestamp: number) => {
    const now = Date.now();
    const diff = timestamp - now;
    if (diff <= 0) return "Available now";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} days remaining`;
    if (hours > 0) return `${hours} hours remaining`;
    return "Soon";
  };

  const getCapsuleTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "truth": return "bg-blue-500";
      case "legacy": return "bg-purple-500";
      case "testimony": return "bg-green-500";
      case "whistle": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Gift className="h-8 w-8 text-green-400" />
          <h1 className="text-3xl font-bold text-white">Capsule Redemption Portal</h1>
        </div>
        <p className="text-gray-300 text-lg">
          Redeem your unlocked truth capsules for GTT rewards and exclusive benefits
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Manual Redemption */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Unlock className="h-5 w-5" />
              Manual Redemption
            </CardTitle>
            <CardDescription>
              Enter capsule details to redeem manually
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="capsule-id">Capsule ID</Label>
              <Input
                id="capsule-id"
                value={capsuleId}
                onChange={(e) => setCapsuleId(e.target.value)}
                placeholder="cap_1234567890_abc123"
                className="bg-gray-700 border-gray-600"
              />
            </div>

            <div>
              <Label htmlFor="wallet-address">Wallet Address</Label>
              <div className="flex gap-2">
                <Input
                  id="wallet-address"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="0x742d35Cc6635Ca0532aB6d15e12c1F8D1a4eF0b7"
                  className="bg-gray-700 border-gray-600"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    if (user?.walletAddress) {
                      setWalletAddress(user.walletAddress);
                    }
                  }}
                  className="flex items-center gap-1"
                >
                  <Wallet className="h-4 w-4" />
                  Auto
                </Button>
              </div>
            </div>

            <Button 
              onClick={handleRedeemCapsule} 
              disabled={loading}
              className="w-full"
            >
              {loading ? "Redeeming..." : "Redeem Capsule"}
            </Button>

            {redemptionResult && (
              <Alert className={redemptionResult.success ? "border-green-600 bg-green-950" : "border-red-600 bg-red-950"}>
                {redemptionResult.success ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
                <AlertTitle>
                  {redemptionResult.success ? "Redemption Successful" : "Redemption Failed"}
                </AlertTitle>
                <AlertDescription>
                  {redemptionResult.success ? (
                    <div className="space-y-2">
                      <div>Capsule ID: {redemptionResult.capsuleId}</div>
                      <div>Redeemed: {new Date(redemptionResult.redeemedAt!).toLocaleString()}</div>
                      {redemptionResult.gttReward && (
                        <div className="flex items-center gap-1">
                          <Coins className="h-4 w-4 text-yellow-400" />
                          <span>GTT Reward: {redemptionResult.gttReward}</span>
                        </div>
                      )}
                      {redemptionResult.txHash && (
                        <div className="text-xs">
                          TX: {redemptionResult.txHash.slice(0, 16)}...
                        </div>
                      )}
                    </div>
                  ) : (
                    redemptionResult.reason
                  )}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* DAO Vault Status */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Shield className="h-5 w-5" />
              DAO Vault Status
            </CardTitle>
            <CardDescription>
              Community treasury and reward distribution
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-cyan-400">47,231</div>
                <div className="text-sm text-gray-300">Total GTT Pool</div>
              </div>
              <div className="text-center p-3 bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-purple-400">1,847</div>
                <div className="text-sm text-gray-300">Capsules Redeemed</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Weekly Distribution</span>
                <span className="text-green-400">2,500 GTT</span>
              </div>
              <Progress value={68} className="h-2" />
              <div className="text-xs text-gray-400">Next distribution in 3 days</div>
            </div>

            <div className="p-3 bg-blue-950 border border-blue-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-4 w-4 text-yellow-400" />
                <span className="font-semibold text-white">Validator Rewards</span>
              </div>
              <div className="text-sm text-blue-200">
                Active validators earn 2.5 GTT per verified capsule plus bonus incentives
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Redemptions */}
      {redeemableCapusles.length > 0 && (
        <Card className="bg-gray-800 border-gray-700 mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Gift className="h-5 w-5" />
              Available Redemptions
            </CardTitle>
            <CardDescription>
              Your unlocked capsules ready for redemption
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {redeemableCapusles.map((capsule) => (
                <Card key={capsule.id} className="bg-gray-700 border-gray-600">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-white truncate">{capsule.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getCapsuleTypeColor(capsule.type)} variant="secondary">
                            {capsule.type}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {capsule.griefScore}/10
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-green-400">
                          {capsule.value} GTT
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-gray-300">
                      <div className="flex items-center justify-between">
                        <span>Status:</span>
                        <div className="flex items-center gap-1">
                          {isUnlockable(capsule) ? (
                            <>
                              <CheckCircle className="h-3 w-3 text-green-400" />
                              <span className="text-green-400">Ready</span>
                            </>
                          ) : capsule.redeemed ? (
                            <>
                              <Lock className="h-3 w-3 text-gray-400" />
                              <span className="text-gray-400">Redeemed</span>
                            </>
                          ) : (
                            <>
                              <Clock className="h-3 w-3 text-yellow-400" />
                              <span className="text-yellow-400">{getTimeUntilUnlock(capsule.unlockTimestamp)}</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {capsule.requirements && (
                        <div className="text-xs text-gray-400">
                          Min Grief: {capsule.requirements.minGriefScore}/10
                          {capsule.requirements.verified && " • Verified Required"}
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={() => handleQuickRedeem(capsule)}
                      disabled={loading || !isUnlockable(capsule) || selectedCapsule?.id === capsule.id}
                      size="sm"
                      className="w-full mt-3"
                      variant={isUnlockable(capsule) ? "default" : "secondary"}
                    >
                      {selectedCapsule?.id === capsule.id ? "Redeeming..." : 
                       isUnlockable(capsule) ? "Quick Redeem" : 
                       capsule.redeemed ? "Already Redeemed" : "Locked"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}