import { useState } from 'react';
import { useAccount, useReadContract, useWriteContract, useChainId, useConnect, useDisconnect } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  TRUTH_VAULT_ABI, 
  GTT_TOKEN_ABI, 
  getContractAddress,
  getNetworkName,
  getExplorerUrl
} from '@/lib/contracts';
import {
  Wallet,
  Coins,
  Shield,
  CheckCircle,
  Upload,
  Zap,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { injected } from 'wagmi/connectors';

export default function Web3Demo() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { toast } = useToast();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  
  const [testCapsuleId, setTestCapsuleId] = useState('1');
  const [yieldAmount, setYieldAmount] = useState('10');
  const [ipfsHash, setIpfsHash] = useState('QmTestHash123456789');

  // Get contract addresses
  let vaultAddress, tokenAddress;
  let contractsDeployed = true;
  try {
    vaultAddress = getContractAddress(chainId, 'TRUTH_VAULT');
    tokenAddress = getContractAddress(chainId, 'GTT_TOKEN');
  } catch (error) {
    contractsDeployed = false;
  }

  // Read user's GTT balance
  const { data: gttBalance, refetch: refetchBalance } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: GTT_TOKEN_ABI,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    query: {
      enabled: !!tokenAddress && !!address && isConnected && contractsDeployed
    }
  });

  // Read GTT token info
  const { data: tokenName } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: GTT_TOKEN_ABI,
    functionName: 'name',
    query: {
      enabled: !!tokenAddress && contractsDeployed
    }
  });

  const { data: tokenSymbol } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: GTT_TOKEN_ABI,
    functionName: 'symbol',
    query: {
      enabled: !!tokenAddress && contractsDeployed
    }
  });

  const { data: totalSupply } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: GTT_TOKEN_ABI,
    functionName: 'totalSupply',
    query: {
      enabled: !!tokenAddress && contractsDeployed
    }
  });

  // Read test capsule info
  const { data: capsuleInfo, refetch: refetchCapsule } = useReadContract({
    address: vaultAddress as `0x${string}`,
    abi: TRUTH_VAULT_ABI,
    functionName: 'capsules',
    args: [BigInt(testCapsuleId)],
    query: {
      enabled: !!vaultAddress && contractsDeployed
    }
  });

  // Write contract hooks
  const { writeContract, isPending } = useWriteContract();

  const handleConnectWallet = async () => {
    try {
      connect({ connector: injected() });
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  const handleRegisterCapsule = async () => {
    if (!vaultAddress || !address) return;

    try {
      writeContract({
        address: vaultAddress as `0x${string}`,
        abi: TRUTH_VAULT_ABI,
        functionName: 'registerCapsule',
        args: [BigInt(testCapsuleId), address, ipfsHash],
      });

      toast({
        title: "Capsule Registration",
        description: "Transaction submitted to register capsule",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to register capsule",
        variant: "destructive",
      });
    }
  };

  const handleUpdateYield = async () => {
    if (!vaultAddress) return;

    try {
      const yieldInWei = parseEther(yieldAmount);
      writeContract({
        address: vaultAddress as `0x${string}`,
        abi: TRUTH_VAULT_ABI,
        functionName: 'updateTruthYield',
        args: [BigInt(testCapsuleId), yieldInWei],
      });

      toast({
        title: "Yield Update",
        description: "Transaction submitted to update yield",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update yield",
        variant: "destructive",
      });
    }
  };

  const handleClaimYield = async () => {
    if (!vaultAddress) return;

    try {
      const yieldInWei = parseEther(yieldAmount);
      writeContract({
        address: vaultAddress as `0x${string}`,
        abi: TRUTH_VAULT_ABI,
        functionName: 'claimYield',
        args: [BigInt(testCapsuleId), yieldInWei],
      });

      toast({
        title: "Yield Claim",
        description: "Transaction submitted to claim yield",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to claim yield",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = () => {
    refetchBalance();
    refetchCapsule();
  };

  if (!contractsDeployed) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-950 border border-yellow-800 rounded-lg p-6 text-center">
            <Shield className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Contracts Not Deployed</h2>
            <p className="text-yellow-200 mb-4">
              Smart contracts are not deployed on this network (Chain ID: {chainId || 'Unknown'}).
            </p>
            <p className="text-sm text-yellow-300">
              Connect to Hardhat local network (Chain ID: 31337) to test the smart contracts.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-2">
            Web3 Integration Demo
          </h1>
          <p className="text-slate-400 text-lg">
            Test GTT token and TruthVault smart contract functionality
          </p>
        </div>

        {/* Wallet Connection */}
        {!isConnected ? (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6 text-center">
              <Wallet className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
              <p className="text-slate-400 mb-4">
                Connect your MetaMask wallet to interact with the smart contracts
              </p>
              <Button onClick={handleConnectWallet} size="lg" className="bg-blue-600 hover:bg-blue-700">
                Connect Wallet
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-green-600 p-2 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">Wallet Connected</div>
                    <div className="text-sm text-slate-400">{address}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button onClick={handleRefresh} variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => disconnect()} variant="outline" size="sm">
                    Disconnect
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contract Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-yellow-400" />
                GTT Token Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Name</span>
                <span>{tokenName || 'Loading...'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Symbol</span>
                <span>{tokenSymbol || 'Loading...'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Supply</span>
                <span>{totalSupply ? formatEther(totalSupply) : '0'} GTT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Your Balance</span>
                <span className="font-semibold text-yellow-400">
                  {gttBalance ? formatEther(gttBalance) : '0'} GTT
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Contract</span>
                <span className="font-mono text-xs">{tokenAddress}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-400" />
                TruthVault Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Network</span>
                <span>Hardhat Local ({chainId})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status</span>
                <Badge variant="outline" className="border-green-500 text-green-400">
                  Active
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Contract</span>
                <span className="font-mono text-xs">{vaultAddress}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Test Capsule */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-green-400" />
              Test Capsule Operations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="capsuleId">Capsule ID</Label>
                <Input
                  id="capsuleId"
                  type="number"
                  value={testCapsuleId}
                  onChange={(e) => setTestCapsuleId(e.target.value)}
                  className="bg-slate-700 border-slate-600"
                />
              </div>
              <div>
                <Label htmlFor="yieldAmount">Yield Amount (ETH)</Label>
                <Input
                  id="yieldAmount"
                  type="number"
                  step="0.01"
                  value={yieldAmount}
                  onChange={(e) => setYieldAmount(e.target.value)}
                  className="bg-slate-700 border-slate-600"
                />
              </div>
              <div>
                <Label htmlFor="ipfsHash">IPFS Hash</Label>
                <Input
                  id="ipfsHash"
                  value={ipfsHash}
                  onChange={(e) => setIpfsHash(e.target.value)}
                  className="bg-slate-700 border-slate-600"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <Button
                onClick={handleRegisterCapsule}
                disabled={isPending || !isConnected}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isPending ? "Processing..." : "Register Capsule"}
              </Button>
              <Button
                onClick={handleUpdateYield}
                disabled={isPending || !isConnected}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isPending ? "Processing..." : "Update Yield"}
              </Button>
              <Button
                onClick={handleClaimYield}
                disabled={isPending || !isConnected}
                className="bg-green-600 hover:bg-green-700"
              >
                {isPending ? "Processing..." : "Claim Yield"}
              </Button>
            </div>

            {/* Capsule Info */}
            {capsuleInfo && (
              <Card className="bg-slate-700 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-sm">Capsule #{testCapsuleId} Info</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Creator</span>
                    <span className="font-mono text-xs">{capsuleInfo[0]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Verified</span>
                    <Badge variant={capsuleInfo[1] ? "default" : "outline"}>
                      {capsuleInfo[1] ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Sealed</span>
                    <Badge variant={capsuleInfo[2] ? "default" : "outline"}>
                      {capsuleInfo[2] ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Truth Yield</span>
                    <span>{formatEther(capsuleInfo[3] || 0n)} ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Claimed</span>
                    <span>{formatEther(capsuleInfo[4] || 0n)} GTT</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-400" />
              Getting Started
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Setup Instructions:</h4>
                <ol className="list-decimal list-inside space-y-1 text-slate-400">
                  <li>Make sure you're connected to Hardhat local network (Chain ID: 31337)</li>
                  <li>Connect your MetaMask wallet using the button above</li>
                  <li>Use the test functions to interact with smart contracts</li>
                  <li>Register a capsule first, then update its yield</li>
                  <li>Try claiming yield after setting a yield amount</li>
                </ol>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Contract Features:</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  <li>GTT token with controlled minting by TruthVault</li>
                  <li>Capsule registration and verification</li>
                  <li>Truth yield tracking and claiming</li>
                  <li>Role-based access control</li>
                  <li>Event emission for tracking activities</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}