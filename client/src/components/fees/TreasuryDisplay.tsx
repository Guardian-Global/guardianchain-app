import { useReadContract } from "wagmi";
import { Vault, TrendingUp, Users, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getContractAddress, CONTRACT_ABIS } from "@/lib/contracts";
import { formatGTTAmount } from "@/lib/feeConfig";
import { formatEther } from "viem";

interface TreasuryDisplayProps {
  chainId?: number;
  className?: string;
}

export default function TreasuryDisplay({
  chainId,
  className = "",
}: TreasuryDisplayProps) {
  const feeManagerAddress = chainId
    ? getContractAddress(chainId, "feeManager")
    : undefined;
  const gttAddress = chainId ? getContractAddress(chainId, "gtt") : undefined;
  const treasuryAddress = chainId
    ? getContractAddress(chainId, "treasury")
    : undefined;

  // Get treasury GTT balance
  const { data: treasuryBalance } = useReadContract({
    address: gttAddress as `0x${string}`,
    abi: CONTRACT_ABIS.GTTToken,
    functionName: "balanceOf",
    args: [treasuryAddress],
    enabled: !!gttAddress && !!treasuryAddress,
  });

  // Get total fees collected for each action
  const { data: mintFeesTotal } = useReadContract({
    address: feeManagerAddress as `0x${string}`,
    abi: CONTRACT_ABIS.FeeManager,
    functionName: "getTotalFeesCollected",
    args: ["mint"],
    enabled: !!feeManagerAddress,
  });

  const { data: sealFeesTotal } = useReadContract({
    address: feeManagerAddress as `0x${string}`,
    abi: CONTRACT_ABIS.FeeManager,
    functionName: "getTotalFeesCollected",
    args: ["seal"],
    enabled: !!feeManagerAddress,
  });

  const { data: proposalFeesTotal } = useReadContract({
    address: feeManagerAddress as `0x${string}`,
    abi: CONTRACT_ABIS.FeeManager,
    functionName: "getTotalFeesCollected",
    args: ["proposal"],
    enabled: !!feeManagerAddress,
  });

  const { data: verificationFeesTotal } = useReadContract({
    address: feeManagerAddress as `0x${string}`,
    abi: CONTRACT_ABIS.FeeManager,
    functionName: "getTotalFeesCollected",
    args: ["verification"],
    enabled: !!feeManagerAddress,
  });

  // Calculate total fees collected
  const totalFeesCollected =
    BigInt(mintFeesTotal || 0) +
    BigInt(sealFeesTotal || 0) +
    BigInt(proposalFeesTotal || 0) +
    BigInt(verificationFeesTotal || 0);

  return (
    <Card
      className={`bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-green-500/30 shadow-lg shadow-green-500/10 ${className}`}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-green-500/20 rounded-lg">
            <Vault className="h-6 w-6 text-green-400" />
          </div>
          <div>
            <span className="text-white text-lg font-bold">
              GuardianChain Treasury
            </span>
            <p className="text-slate-400 text-sm font-normal">
              Community-governed protocol funds
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Treasury Balance - Enhanced */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center p-6 bg-gradient-to-br from-green-900/30 to-green-800/20 rounded-xl border border-green-500/20">
            <div className="flex items-center justify-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-green-400" />
              <span className="text-sm text-slate-300 font-medium">
                Current Balance
              </span>
            </div>
            <div className="text-3xl font-bold text-green-400 mb-2">
              {treasuryBalance ? formatEther(treasuryBalance) : "0"}
            </div>
            <div className="text-sm text-slate-400">GTT Tokens</div>
          </div>

          <div className="text-center p-6 bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-xl border border-blue-500/20">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Activity className="h-5 w-5 text-blue-400" />
              <span className="text-sm text-slate-300 font-medium">
                Total Collected
              </span>
            </div>
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {formatEther(totalFeesCollected)}
            </div>
            <div className="text-sm text-slate-400">GTT Tokens</div>
          </div>
        </div>

        {/* Fee Breakdown - Enhanced */}
        <div className="space-y-4">
          <h4 className="font-semibold text-white text-lg flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-400" />
            Fee Collection Analytics
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-4 bg-slate-700/40 rounded-lg border border-yellow-500/20">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                <span className="text-slate-300 font-medium">NFT Minting</span>
              </div>
              <div className="text-right">
                <div className="text-white font-bold">
                  {mintFeesTotal ? formatEther(mintFeesTotal) : "0"} GTT
                </div>
                <div className="text-xs text-slate-400">50 GTT per mint</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-700/40 rounded-lg border border-blue-500/20">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-400 rounded-full" />
                <span className="text-slate-300 font-medium">
                  Capsule Sealing
                </span>
              </div>
              <div className="text-right">
                <div className="text-white font-bold">
                  {sealFeesTotal ? formatEther(sealFeesTotal) : "0"} GTT
                </div>
                <div className="text-xs text-slate-400">100 GTT per seal</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-700/40 rounded-lg border border-purple-500/20">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-purple-400 rounded-full" />
                <span className="text-slate-300 font-medium">
                  DAO Proposals
                </span>
              </div>
              <div className="text-right">
                <div className="text-white font-bold">
                  {proposalFeesTotal ? formatEther(proposalFeesTotal) : "0"} GTT
                </div>
                <div className="text-xs text-slate-400">
                  500 GTT per proposal
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-700/40 rounded-lg border border-green-500/20">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full" />
                <span className="text-slate-300 font-medium">Verification</span>
              </div>
              <div className="text-right">
                <div className="text-white font-bold">
                  {verificationFeesTotal
                    ? formatEther(verificationFeesTotal)
                    : "0"}{" "}
                  GTT
                </div>
                <div className="text-xs text-slate-400">
                  25 GTT per verification
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Treasury Usage - Enhanced */}
        <div className="border-t border-slate-600 pt-6">
          <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-green-400" />
            Treasury Fund Allocation
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-slate-700/20 rounded-lg">
              <Users className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="text-sm text-slate-300 font-medium">
                Community Rewards
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Verification incentives
              </div>
            </div>
            <div className="text-center p-4 bg-slate-700/20 rounded-lg">
              <Activity className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="text-sm text-slate-300 font-medium">
                Development
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Platform improvements
              </div>
            </div>
            <div className="text-center p-4 bg-slate-700/20 rounded-lg">
              <TrendingUp className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="text-sm text-slate-300 font-medium">
                Infrastructure
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Scaling & operations
              </div>
            </div>
          </div>
        </div>

        {/* Treasury Address & Status */}
        <div className="bg-slate-700/20 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-slate-400 text-sm">Treasury Contract:</span>
              <div className="font-mono text-xs text-white mt-1">
                {treasuryAddress
                  ? `${treasuryAddress.slice(0, 10)}...${treasuryAddress.slice(
                      -8
                    )}`
                  : "Not configured"}
              </div>
            </div>
            <div className="text-right">
              <span className="text-slate-400 text-sm">DAO Governed:</span>
              <div className="text-green-400 text-sm font-medium mt-1">
                ✓ Active
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
