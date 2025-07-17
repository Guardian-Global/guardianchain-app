import { useState } from 'react';
import { useAccount, useWriteContract, useReadContract, useChainId } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  TRUTH_VAULT_ABI, 
  GTT_TOKEN_ABI, 
  getContractAddress
} from '@/lib/constants';
import { 
  Coins, 
  Wallet, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import type { Capsule } from '@shared/schema';

interface CapsuleClaimButtonProps {
  capsule: Capsule;
  isCreator?: boolean;
  showDetails?: boolean;
}

export default function CapsuleClaimButton({ 
  capsule, 
  isCreator = false,
  showDetails = true 
}: CapsuleClaimButtonProps) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { toast } = useToast();
  const [isClaiming, setIsClaiming] = useState(false);

  // Check if connected to supported network and get contract addresses
  let vaultAddress, tokenAddress;
  try {
    vaultAddress = getContractAddress(chainId, 'TRUTH_VAULT');
    tokenAddress = getContractAddress(chainId, 'GTT_TOKEN');
  } catch (error) {
    return (
      <Card className="bg-yellow-950 border-yellow-800">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-yellow-200">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">Please switch to a supported network (Hardhat local: 31337)</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Read capsule verification info from smart contract
  const { data: capsuleInfo } = useReadContract({
    address: vaultAddress as `0x${string}`,
    abi: TRUTH_VAULT_ABI,
    functionName: 'capsules',
    args: [BigInt(capsule.id)],
    query: {
      enabled: !!vaultAddress && isConnected
    }
  });

  // Read user's GTT balance
  const { data: gttBalance } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: GTT_TOKEN_ABI,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    query: {
      enabled: !!tokenAddress && !!address && isConnected
    }
  });

  // Write contract hook for claiming yield
  const { writeContract, isPending } = useWriteContract();

  const handleClaimYield = async () => {
    if (!vaultAddress || !isConnected || !address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to claim yield",
        variant: "destructive",
      });
      return;
    }

    try {
      getContractAddress(chainId, 'TRUTH_VAULT');
    } catch (error) {
      toast({
        title: "Unsupported Network",
        description: "Please switch to a supported network",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsClaiming(true);

      // Calculate yield amount from capsule data
      const yieldAmount = parseFloat(capsule.truthYield || "0");
      const yieldInWei = parseEther(yieldAmount.toString());

      // Call smart contract claim function
      writeContract({
        address: vaultAddress as `0x${string}`,
        abi: TRUTH_VAULT_ABI,
        functionName: 'claimYield',
        args: [BigInt(capsule.id), yieldInWei],
      });

      // Note: Transaction confirmation and success handling would be done
      // by the useWriteContract hook's onSuccess callback if properly configured
      
    } catch (error: any) {
      console.error('Claim error:', error);
      toast({
        title: "Claim Failed",
        description: error.message || "Failed to claim yield",
        variant: "destructive",
      });
    } finally {
      setIsClaiming(false);
    }
  };

  // Parse claim info from contract
  const claimData = claimInfo ? {
    creator: claimInfo[0],
    totalEarned: claimInfo[1],
    totalClaimed: claimInfo[2],
    claimable: claimInfo[3],
    nextClaimTime: claimInfo[4],
  } : null;

  // Check if user can claim
  const canClaim = claimData && 
    isCreator && 
    isConnected && 
    claimData.claimable > 0n &&
    Date.now() >= Number(claimData.nextClaimTime) * 1000;

  // Format amounts for display
  const formatGTT = (amount: bigint) => {
    const formatted = formatEther(amount);
    return parseFloat(formatted).toFixed(2);
  };

  // Time until next claim
  const getTimeUntilClaim = () => {
    if (!claimData) return null;
    const nextClaimTime = Number(claimData.nextClaimTime) * 1000;
    const now = Date.now();
    if (now >= nextClaimTime) return null;
    
    const diff = nextClaimTime - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  const timeUntilClaim = getTimeUntilClaim();

  if (!showDetails && !canClaim) {
    return null;
  }

  if (!isConnected) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-4 text-center">
          <Wallet className="h-8 w-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm text-slate-400">Connect wallet to view claim status</p>
        </CardContent>
      </Card>
    );
  }

  if (!isSupportedNetwork(chainId)) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-4 text-center">
          <AlertTriangle className="h-8 w-8 text-red-400 mx-auto mb-2" />
          <p className="text-sm text-red-400">Switch to a supported network to claim yield</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoadingClaimInfo) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-4 text-center">
          <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
          <p className="text-sm text-slate-400">Loading claim data...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Coins className="h-4 w-4 text-yellow-400" />
          GTT Yield Claim
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Balance */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-400">Your GTT Balance:</span>
          <span className="font-semibold text-green-400">
            {gttBalance ? formatGTT(gttBalance) : '0.00'} GTT
          </span>
        </div>

        {/* Claim Status */}
        {claimData && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Total Earned:</span>
              <span className="text-white">{formatGTT(claimData.totalEarned)} GTT</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Already Claimed:</span>
              <span className="text-slate-300">{formatGTT(claimData.totalClaimed)} GTT</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Available to Claim:</span>
              <span className="font-semibold text-green-400">
                {formatGTT(claimData.claimable)} GTT
              </span>
            </div>
          </div>
        )}

        {/* Claim Button or Status */}
        <div className="space-y-2">
          {canClaim ? (
            <Button
              onClick={handleClaimYield}
              disabled={isClaiming || isPending}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <Coins className="h-4 w-4 mr-2" />
              {isClaiming || isPending ? "Claiming..." : `Claim ${formatGTT(claimData!.claimable)} GTT`}
            </Button>
          ) : claimData && claimData.claimable === 0n ? (
            <div className="text-center">
              <Badge className="bg-slate-600">
                <CheckCircle className="h-3 w-3 mr-1" />
                Nothing to Claim
              </Badge>
              <p className="text-xs text-slate-400 mt-1">
                Generate more yield through engagement
              </p>
            </div>
          ) : timeUntilClaim ? (
            <div className="text-center">
              <Badge className="bg-blue-600">
                <Clock className="h-3 w-3 mr-1" />
                Cooldown: {timeUntilClaim}
              </Badge>
              <p className="text-xs text-slate-400 mt-1">
                Claims available every 7 days
              </p>
            </div>
          ) : !isCreator ? (
            <div className="text-center">
              <Badge className="bg-slate-600">
                Only Creator Can Claim
              </Badge>
            </div>
          ) : (
            <div className="text-center">
              <Badge className="bg-red-600">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Not Eligible
              </Badge>
              <p className="text-xs text-slate-400 mt-1">
                Capsule must be verified or sealed
              </p>
            </div>
          )}
        </div>

        {/* Smart Contract Link */}
        {truthVaultAddress && (
          <div className="pt-2 border-t border-slate-700">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(`https://etherscan.io/address/${truthVaultAddress}`, '_blank')}
              className="w-full text-xs text-slate-400 hover:text-white"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              View TruthVault Contract
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}