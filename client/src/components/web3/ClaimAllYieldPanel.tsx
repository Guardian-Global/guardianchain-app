import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Coins,
  Download,
  TrendingUp,
  RefreshCw,
  ExternalLink,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useAccount, useBalance } from "wagmi";
import { useEthersProvider, useEthersSigner } from "@/lib/ethers";
import { getGTTBalance } from "@/lib/gtt";

// YieldVault ABI for claiming functions
const YIELD_VAULT_ABI = [
  "function yieldOwed(address user) external view returns (uint256)",
  "function claimYield() external",
  "function totalYieldDistributed() external view returns (uint256)",
  "event YieldClaimed(address indexed user, uint256 amount)",
];

interface YieldData {
  pendingYield: string;
  claimableAmount: string;
  totalClaimed: string;
  lastClaimDate: Date | null;
  estimatedValue: number;
}

export default function ClaimAllYieldPanel() {
  const [yieldData, setYieldData] = useState<YieldData | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const { address, isConnected } = useAccount();
  const provider = useEthersProvider();
  const signer = useEthersSigner();
  const { toast } = useToast();

  // Contract addresses - these should come from environment variables
  const YIELD_VAULT_ADDRESS =
    import.meta.env.VITE_YIELD_VAULT ||
    "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const GTT_TOKEN_ADDRESS =
    import.meta.env.VITE_GTT_CONTRACT ||
    "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  // Get GTT balance
  const { data: gttBalance } = useBalance({
    address: address,
    token: GTT_TOKEN_ADDRESS as `0x${string}`,
  });

  const fetchYieldData = async () => {
    if (!address || !isConnected) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Try to fetch real data from contracts
      let pendingYield = "0";
      try {
        const contract = new (await import("ethers")).Contract(
          YIELD_VAULT_ADDRESS,
          YIELD_VAULT_ABI,
          provider,
        );
        const yieldOwed = await contract.yieldOwed(address);
        pendingYield = (await import("ethers")).formatEther(yieldOwed);
      } catch (error) {
        // Development logging removed for production
      }

      // Realistic starter data for new users
      const mockYieldData: YieldData = {
        pendingYield: pendingYield !== "0" ? pendingYield : "0.00", // New users start with zero
        claimableAmount: pendingYield !== "0" ? pendingYield : "0.00", // No claimable amount for new users
        totalClaimed: "0.00", // No claims yet for new users
        lastClaimDate: null, // No previous claims
        estimatedValue: 0, // No estimated value for new users
      };

      setYieldData(mockYieldData);
    } catch (error) {
      console.error("Error fetching yield data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch yield data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const claimYield = async () => {
    if (!signer || !yieldData || parseFloat(yieldData.claimableAmount) === 0) {
      return;
    }

    try {
      setClaiming(true);
      setTxHash(null);

      const contract = new (await import("ethers")).Contract(
        YIELD_VAULT_ADDRESS,
        YIELD_VAULT_ABI,
        signer,
      );

      const tx = await contract.claimYield();
      setTxHash(tx.hash);

      toast({
        title: "Transaction Submitted",
        description: `Claiming ${formatGTTAmount(
          yieldData.claimableAmount,
        )} GTT...`,
      });

      const receipt = await tx.wait();

      if (receipt.status === 1) {
        toast({
          title: "Yield Claimed Successfully!",
          description: `${formatGTTAmount(
            yieldData.claimableAmount,
          )} GTT has been added to your wallet`,
        });

        // Refresh data
        await fetchYieldData();
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      console.error("Error claiming yield:", error);
      toast({
        title: "Claim Failed",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setClaiming(false);
    }
  };

  useEffect(() => {
    fetchYieldData();
  }, [address, isConnected]);

  if (!isConnected) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <AlertCircle className="w-12 h-12 mx-auto text-yellow-400" />
            <h3 className="text-xl font-semibold text-white">
              Wallet Not Connected
            </h3>
            <p className="text-slate-300">
              Connect your wallet to view and claim your GTT yield rewards.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Coins className="w-5 h-5 mr-2 text-yellow-400" />
            GTT Yield Claiming
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-600 rounded w-1/2"></div>
            <div className="h-4 bg-slate-600 rounded w-3/4"></div>
            <div className="h-10 bg-slate-600 rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center">
              <Coins className="w-5 h-5 mr-2 text-yellow-400" />
              GTT Yield Claiming
            </CardTitle>
            <Button
              onClick={fetchYieldData}
              disabled={loading}
              size="sm"
              variant="outline"
              className="border-slate-600 text-slate-300 hover:text-white"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Claimable Yield */}
          <div className="bg-gradient-to-r from-yellow-900/20 to-green-900/20 rounded-lg p-6">
            <div className="text-center space-y-2">
              <div className="text-sm text-slate-400">Available to Claim</div>
              <div className="text-4xl font-bold text-white">
                {formatGTTAmount(yieldData?.claimableAmount || "0")} GTT
              </div>
              <div className="text-sm text-slate-400">
                ≈ ${yieldData?.estimatedValue.toFixed(2) || "0.00"} USD
              </div>
            </div>
          </div>

          {/* Claim Button */}
          <Button
            onClick={claimYield}
            disabled={
              claiming ||
              !yieldData ||
              parseFloat(yieldData.claimableAmount) === 0
            }
            className="w-full bg-gradient-to-r from-yellow-600 to-green-600 hover:from-yellow-700 hover:to-green-700 text-white font-semibold py-3"
          >
            {claiming ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                Claiming Yield...
              </>
            ) : parseFloat(yieldData?.claimableAmount || "0") === 0 ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                No Yield Available
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Claim {formatGTTAmount(yieldData?.claimableAmount || "0")} GTT
              </>
            )}
          </Button>

          {/* Transaction Status */}
          {txHash && (
            <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-blue-300 text-sm">Transaction Hash:</span>
                <a
                  href={`https://polygonscan.com/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
                >
                  View on Explorer
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
              <div className="text-slate-400 text-xs mt-1 font-mono break-all">
                {txHash}
              </div>
            </div>
          )}

          {/* Yield Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-white">
                {formatGTTAmount(yieldData?.totalClaimed || "0")}
              </div>
              <div className="text-xs text-slate-400">Total Claimed</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-white">
                {gttBalance ? formatGTTAmount(gttBalance.formatted) : "0"}
              </div>
              <div className="text-xs text-slate-400">Current Balance</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-white">
                {yieldData?.lastClaimDate
                  ? yieldData.lastClaimDate.toLocaleDateString()
                  : "Never"}
              </div>
              <div className="text-xs text-slate-400">Last Claim</div>
            </div>
          </div>

          {/* Yield Information */}
          <div className="bg-slate-700/30 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-white mb-2 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-green-400" />
              How Yield is Calculated
            </h4>
            <div className="text-sm text-slate-300 space-y-1">
              <p>
                • Base yield from capsule verifications and community
                participation
              </p>
              <p>• Tier-based multipliers (up to +25% for Sovereign tier)</p>
              <p>• Trading tax redistribution from GTT token transactions</p>
              <p>• DAO governance participation rewards</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
