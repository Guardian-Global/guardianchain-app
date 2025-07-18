import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { Shield, Clock, Check, ExternalLink, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getContractAddress, CONTRACT_ABIS, NETWORK_CONFIGS } from '@/lib/contracts';

interface SealInfo {
  sealedBy: string;
  timestamp: bigint;
  metadataHash: string;
}

interface SealTrackerUIProps {
  capsuleId?: string;
  onSealSuccess?: (txHash: string, capsuleId: string) => void;
}

export default function SealTrackerUI({ capsuleId: initialCapsuleId, onSealSuccess }: SealTrackerUIProps) {
  const [capsuleId, setCapsuleId] = useState(initialCapsuleId || '');
  const [metadataHash, setMetadataHash] = useState('');
  const { address, chainId } = useAccount();
  const { toast } = useToast();

  // Get contract address with error handling
  const getVaultAddress = () => {
    if (!chainId) return undefined;
    try {
      return getContractAddress(chainId, 'vault') as `0x${string}`;
    } catch (error) {
      console.warn('Failed to get vault address:', error);
      return undefined;
    }
  };

  // Read seal information
  const { 
    data: sealInfo, 
    isLoading: isLoadingSeal,
    refetch: refetchSeal 
  } = useReadContract({
    address: getVaultAddress(),
    abi: CONTRACT_ABIS.TruthVault,
    functionName: 'getSeal',
    args: capsuleId ? [BigInt(capsuleId)] : undefined,
    query: {
      enabled: !!capsuleId && !!chainId && !!getVaultAddress(),
    }
  }) as { 
    data: SealInfo | undefined, 
    isLoading: boolean,
    refetch: () => void 
  };

  // Write contract for sealing
  const { 
    writeContract, 
    data: hash, 
    isPending, 
    error 
  } = useWriteContract();

  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed 
  } = useWaitForTransactionReceipt({
    hash,
  });

  const handleSealCapsule = async () => {
    if (!capsuleId || !metadataHash) {
      toast({
        title: "Missing Information",
        description: "Please enter both capsule ID and metadata hash",
        variant: "destructive",
      });
      return;
    }

    if (!chainId) {
      toast({
        title: "No Network Connected",
        description: "Please connect your wallet and switch to a supported network",
        variant: "destructive",
      });
      return;
    }

    let vaultAddress;
    try {
      vaultAddress = getContractAddress(chainId, 'vault');
    } catch (error) {
      toast({
        title: "Unsupported Network",
        description: "Please switch to Hardhat Local (31337), Sepolia, Polygon, or Polygon Amoy",
        variant: "destructive",
      });
      return;
    }

    try {
      const vaultAddress = getContractAddress(chainId, 'vault');
      
      writeContract({
        address: vaultAddress as `0x${string}`,
        abi: CONTRACT_ABIS.TruthVault,
        functionName: 'sealCapsule',
        args: [BigInt(capsuleId), metadataHash],
      });

    } catch (error: any) {
      toast({
        title: "Seal Failed",
        description: error.message || "Failed to seal capsule",
        variant: "destructive",
      });
    }
  };

  // Handle successful sealing
  useEffect(() => {
    if (isConfirmed && hash) {
      refetchSeal();
      if (onSealSuccess) {
        onSealSuccess(hash, capsuleId);
      }
      
      toast({
        title: "Capsule Sealed!",
        description: `Capsule ${capsuleId} has been permanently sealed on-chain`,
      });
    }
  }, [isConfirmed, hash, capsuleId, onSealSuccess, refetchSeal, toast]);

  const isSealed = sealInfo && sealInfo.sealedBy !== '0x0000000000000000000000000000000000000000';
  const blockExplorer = chainId ? NETWORK_CONFIGS[chainId as keyof typeof NETWORK_CONFIGS]?.blockExplorer : null;

  return (
    <div className="space-y-6">
      {/* Seal Status Display */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-400" />
            Capsule Seal Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="checkCapsuleId" className="text-slate-300">
              Capsule ID
            </Label>
            <Input
              id="checkCapsuleId"
              type="number"
              placeholder="Enter capsule ID to check"
              value={capsuleId}
              onChange={(e) => setCapsuleId(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>

          {capsuleId && (
            <div className="space-y-3">
              {isLoadingSeal ? (
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock className="h-4 w-4 animate-spin" />
                  Loading seal status...
                </div>
              ) : isSealed ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-green-600">
                      <Shield className="h-3 w-3 mr-1" />
                      Sealed
                    </Badge>
                    <span className="text-green-400 text-sm">
                      Capsule is permanently sealed
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Sealed By:</span>
                      <p className="font-mono text-xs text-white break-all">
                        {sealInfo.sealedBy}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-400">Sealed At:</span>
                      <p className="text-white">
                        {new Date(Number(sealInfo.timestamp) * 1000).toLocaleString()}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-slate-400">Metadata Hash:</span>
                      <p className="font-mono text-xs text-white break-all">
                        {sealInfo.metadataHash}
                      </p>
                    </div>
                  </div>

                  {hash && blockExplorer && (
                    <a
                      href={`${blockExplorer}/tx/${hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View on Block Explorer
                    </a>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-yellow-500 text-yellow-400">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Unsealed
                  </Badge>
                  <span className="text-yellow-400 text-sm">
                    Capsule is not yet sealed
                  </span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Seal Creation */}
      {capsuleId && !isSealed && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-400" />
              Seal Capsule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="metadataHash" className="text-slate-300">
                Metadata Hash (IPFS or content hash)
              </Label>
              <Input
                id="metadataHash"
                placeholder="QmHash... or content identifier"
                value={metadataHash}
                onChange={(e) => setMetadataHash(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <Button
              onClick={handleSealCapsule}
              disabled={isPending || isConfirming || !address || !metadataHash}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isPending || isConfirming ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  {isPending ? 'Confirming...' : 'Sealing...'}
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Seal Capsule On-Chain
                </>
              )}
            </Button>

            {error && (
              <div className="text-red-400 text-sm">
                Error: {error.message}
              </div>
            )}

            <div className="text-xs text-slate-400">
              <p>⚠️ Sealing is permanent and cannot be undone.</p>
              <p>The metadata hash will be stored on-chain as proof of authenticity.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}