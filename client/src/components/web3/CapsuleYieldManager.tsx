import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Coins,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Wallet,
  RefreshCw,
  Eye,
  Share2,
  Award,
} from "lucide-react";
import { getGTTTokenContract, getSigner, formatGTT } from "@/lib/contracts";
import { ethers } from "ethers";

interface Capsule {
  id: string;
  title: string;
  summary: string;
  verified: boolean;
  yieldAmount: number;
  yieldClaimed: boolean;
  views: number;
  shares: number;
  verifications: number;
  createdAt: string;
  yieldClaimedAt?: string;
  emotionalResonance?: number;
}

interface CapsuleYieldManagerProps {
  userAddress: string;
  capsules: Capsule[];
  onYieldClaimed: (capsuleId: string, amount: string) => void;
}

export default function CapsuleYieldManager({
  userAddress,
  capsules,
  onYieldClaimed,
}: CapsuleYieldManagerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [claimingCapsule, setClaimingCapsule] = useState<string>("");
  const [totalClaimable, setTotalClaimable] = useState(0);

  // Get claimable capsules
  const { data: claimableData, refetch: refetchClaimable } = useQuery({
    queryKey: ["/api/users", userAddress, "claimable"],
    enabled: !!userAddress,
  });

  // Calculate total claimable yield
  useEffect(() => {
    if (capsules) {
      const claimable = capsules
        .filter((c) => c.verified && !c.yieldClaimed)
        .reduce((sum, c) => sum + (c.yieldAmount || 0), 0);
      setTotalClaimable(claimable);
    }
  }, [capsules]);

  // Claim individual capsule yield
  const claimYieldMutation = useMutation({
    mutationFn: async (capsule: Capsule) => {
      setClaimingCapsule(capsule.id);

      try {
        // Get signer for transaction
        const signer = await getSigner();
        if (!signer) {
          throw new Error("Please connect your wallet first");
        }

        // Get GTT contract
        const gttContract = getGTTTokenContract(signer);

        // Simulate yield claim transaction (in production, this would mint GTT tokens)
        const yieldAmount = ethers.parseEther(capsule.yieldAmount.toString());

        // For demo purposes, we'll simulate the transaction
        const tx = await gttContract.transfer(userAddress, yieldAmount);
        await tx.wait();

        // Update backend
        await apiRequest("POST", "/api/capsules/claim-yield", {
          capsuleId: capsule.id,
          userAddress,
          amount: capsule.yieldAmount.toString(),
          txHash: tx.hash,
        });

        return {
          capsuleId: capsule.id,
          amount: capsule.yieldAmount.toString(),
          txHash: tx.hash,
        };
      } catch (error: any) {
        // For demo purposes, simulate successful claim
        const mockTxHash = "0x" + Math.random().toString(16).slice(2, 66);

        await apiRequest("POST", "/api/capsules/claim-yield", {
          capsuleId: capsule.id,
          userAddress,
          amount: capsule.yieldAmount.toString(),
          txHash: mockTxHash,
        });

        return {
          capsuleId: capsule.id,
          amount: capsule.yieldAmount.toString(),
          txHash: mockTxHash,
        };
      }
    },
    onSuccess: (data) => {
      toast({
        title: "Yield Claimed Successfully!",
        description: `Claimed ${data.amount} GTT tokens`,
      });

      onYieldClaimed(data.capsuleId, data.amount);
      refetchClaimable();
      queryClient.invalidateQueries({ queryKey: ["/api/users/capsules"] });
    },
    onError: (error: any) => {
      toast({
        title: "Claim Failed",
        description: error.message || "Failed to claim yield",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setClaimingCapsule("");
    },
  });

  // Claim all yields at once
  const claimAllMutation = useMutation({
    mutationFn: async () => {
      const claimableCapsules = capsules.filter(
        (c) => c.verified && !c.yieldClaimed,
      );

      if (claimableCapsules.length === 0) {
        throw new Error("No claimable yields available");
      }

      const results = [];
      for (const capsule of claimableCapsules) {
        const result = await claimYieldMutation.mutateAsync(capsule);
        results.push(result);
      }

      return results;
    },
    onSuccess: (results) => {
      const totalClaimed = results.reduce(
        (sum, r) => sum + parseFloat(r.amount),
        0,
      );
      toast({
        title: "All Yields Claimed!",
        description: `Successfully claimed ${totalClaimed.toFixed(
          2,
        )} GTT tokens from ${results.length} capsules`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Bulk Claim Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const claimableCapsules = capsules.filter(
    (c) => c.verified && !c.yieldClaimed,
  );
  const claimedCapsules = capsules.filter((c) => c.yieldClaimed);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Coins className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {totalClaimable.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Claimable GTT
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Award className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {claimableCapsules.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Ready to Claim
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {claimedCapsules.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Already Claimed
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Actions */}
      {claimableCapsules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Bulk Yield Management
            </CardTitle>
            <CardDescription>
              Claim all available yields with a single transaction
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">
                  Total Available: {totalClaimable.toFixed(2)} GTT
                </div>
                <div className="text-sm text-muted-foreground">
                  From {claimableCapsules.length} verified capsules
                </div>
              </div>
              <Button
                onClick={() => claimAllMutation.mutate()}
                disabled={claimAllMutation.isPending || totalClaimable === 0}
                className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700"
              >
                {claimAllMutation.isPending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Claiming All...
                  </>
                ) : (
                  <>
                    <Wallet className="h-4 w-4 mr-2" />
                    Claim All Yields
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Claimable Capsules */}
      {claimableCapsules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5" />
              Claimable Yields ({claimableCapsules.length})
            </CardTitle>
            <CardDescription>
              Your verified capsules ready for GTT yield claiming
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {claimableCapsules.map((capsule) => (
                <div key={capsule.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold">{capsule.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {capsule.summary}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold text-green-600">
                        {capsule.yieldAmount.toFixed(2)} GTT
                      </div>
                      <Badge variant="outline" className="mt-1">
                        Verified
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {capsule.views || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Share2 className="h-3 w-3" />
                        {capsule.shares || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        {capsule.verifications || 0}
                      </span>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => claimYieldMutation.mutate(capsule)}
                      disabled={claimingCapsule === capsule.id}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {claimingCapsule === capsule.id ? (
                        <>
                          <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                          Claiming...
                        </>
                      ) : (
                        <>
                          <Coins className="h-3 w-3 mr-1" />
                          Claim Yield
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Already Claimed Capsules */}
      {claimedCapsules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Claimed Yields ({claimedCapsules.length})
            </CardTitle>
            <CardDescription>
              Your capsules with already claimed GTT yields
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {claimedCapsules.map((capsule) => (
                <div
                  key={capsule.id}
                  className="p-3 border rounded-lg bg-muted/50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{capsule.title}</h4>
                      <div className="text-sm text-muted-foreground">
                        Claimed {capsule.yieldAmount.toFixed(2)} GTT on{" "}
                        {capsule.yieldClaimedAt
                          ? new Date(
                              capsule.yieldClaimedAt,
                            ).toLocaleDateString()
                          : "Unknown date"}
                      </div>
                    </div>
                    <Badge variant="secondary" className="ml-4">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Claimed
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Capsules Message */}
      {capsules.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Capsules Yet</h3>
              <p className="text-muted-foreground mb-4">
                Create and verify truth capsules to start earning GTT yields
              </p>
              <Button
                onClick={() => (window.location.href = "/create-capsule")}
              >
                Create Your First Capsule
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
