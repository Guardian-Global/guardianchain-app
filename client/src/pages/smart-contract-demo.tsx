import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useChainId, useConnect, useDisconnect } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  Vote,
  Users,
  TrendingUp,
  ExternalLink,
  RefreshCw,
  Play,
  Settings,
  AlertTriangle
} from 'lucide-react';
import { injected } from 'wagmi/connectors';

export default function SmartContractDemo() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { toast } = useToast();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  
  // Test parameters
  const [testCapsuleId, setTestCapsuleId] = useState('1');
  const [yieldAmount, setYieldAmount] = useState('50');
  const [mintAmount, setMintAmount] = useState('100');
  const [proposalTitle, setProposalTitle] = useState('Increase Yield Multiplier');
  const [proposalDescription, setProposalDescription] = useState('Proposal to increase the premium tier yield multiplier from 1.5x to 2.0x to incentivize more high-quality content creation.');
  const [ipfsHash, setIpfsHash] = useState('QmTestHash123456789AbCdEf');

  // Get contract addresses
  let vaultAddress, tokenAddress;
  let contractsDeployed = true;
  try {
    vaultAddress = getContractAddress(chainId, 'TRUTH_VAULT');
    tokenAddress = getContractAddress(chainId, 'GTT_TOKEN');
  } catch (error) {
    contractsDeployed = false;
  }

  // Contract read hooks
  const { data: gttBalance, refetch: refetchBalance } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: GTT_TOKEN_ABI,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    query: {
      enabled: !!tokenAddress && !!address && isConnected && contractsDeployed
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

  const { data: maxSupply } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: GTT_TOKEN_ABI,
    functionName: 'MAX_SUPPLY',
    query: {
      enabled: !!tokenAddress && contractsDeployed
    }
  });

  const { data: yieldToGTTRatio } = useReadContract({
    address: vaultAddress as `0x${string}`,
    abi: TRUTH_VAULT_ABI,
    functionName: 'yieldToGTTRatio',
    query: {
      enabled: !!vaultAddress && contractsDeployed
    }
  });

  const { data: capsuleInfo, refetch: refetchCapsule } = useReadContract({
    address: vaultAddress as `0x${string}`,
    abi: TRUTH_VAULT_ABI,
    functionName: 'capsules',
    args: [BigInt(testCapsuleId)],
    query: {
      enabled: !!vaultAddress && contractsDeployed && testCapsuleId
    }
  });

  // Write contract hook
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

  const handleMintGTT = async () => {
    if (!tokenAddress || !address) return;

    try {
      const amountInWei = parseEther(mintAmount);
      
      // Note: Only vault can mint, so this would need to be called through the vault
      // For demo purposes, we'll try direct minting (will fail with proper access control)
      writeContract({
        address: tokenAddress as `0x${string}`,
        abi: GTT_TOKEN_ABI,
        functionName: 'mint',
        args: [address, amountInWei],
      });

      toast({
        title: "Mint Transaction Submitted",
        description: `Attempting to mint ${mintAmount} GTT tokens`,
      });
    } catch (error: any) {
      toast({
        title: "Mint Failed",
        description: error.message || "Failed to mint GTT tokens",
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
        title: "Capsule Registration Submitted",
        description: `Registering capsule ID ${testCapsuleId}`,
      });
    } catch (error: any) {
      toast({
        title: "Registration Failed",
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
        title: "Yield Update Submitted",
        description: `Setting yield to ${yieldAmount} for capsule ${testCapsuleId}`,
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
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
        title: "Yield Claim Submitted",
        description: `Claiming ${yieldAmount} yield for capsule ${testCapsuleId}`,
      });
    } catch (error: any) {
      toast({
        title: "Claim Failed",
        description: error.message || "Failed to claim yield",
        variant: "destructive",
      });
    }
  };

  const handleVerifyCapsule = async () => {
    if (!vaultAddress) return;

    try {
      writeContract({
        address: vaultAddress as `0x${string}`,
        abi: TRUTH_VAULT_ABI,
        functionName: 'verifyCapsule',
        args: [BigInt(testCapsuleId), true, false], // verified=true, sealed=false
      });

      toast({
        title: "Verification Submitted",
        description: `Verifying capsule ${testCapsuleId}`,
      });
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message || "Failed to verify capsule",
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
            <AlertTriangle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Smart Contracts Not Available</h2>
            <p className="text-yellow-200 mb-4">
              Smart contracts are not deployed on this network (Chain ID: {chainId || 'Unknown'}).
            </p>
            <p className="text-sm text-yellow-300">
              Connect to Hardhat local network (31337) to test smart contracts.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Smart Contract Demo
          </h1>
          <p className="text-slate-400 text-lg">
            Test all GTT token and TruthVault smart contract functions
          </p>
        </div>

        {/* Network & Wallet Status */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-lg font-semibold">
                    {getNetworkName(chainId)}
                  </div>
                  <div className="text-sm text-slate-400">Network</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-600 p-2 rounded-lg">
                  <Wallet className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-lg font-semibold">
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </div>
                  <div className="text-sm text-slate-400">Wallet Status</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-600 p-2 rounded-lg">
                  <Coins className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-lg font-semibold">
                    {gttBalance ? formatEther(gttBalance) : '0'} GTT
                  </div>
                  <div className="text-sm text-slate-400">Your Balance</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Wallet Connection */}
        {!isConnected && (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6 text-center">
              <Wallet className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
              <p className="text-slate-400 mb-4">
                Connect your MetaMask wallet to interact with smart contracts
              </p>
              <Button onClick={handleConnectWallet} size="lg" className="bg-blue-600 hover:bg-blue-700">
                Connect Wallet
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Contract Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-yellow-400" />
                GTT Token Contract
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Supply</span>
                <span>{totalSupply ? formatEther(totalSupply) : '0'} GTT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Max Supply</span>
                <span>{maxSupply ? formatEther(maxSupply) : '0'} GTT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Your Balance</span>
                <span className="font-semibold text-yellow-400">
                  {gttBalance ? formatEther(gttBalance) : '0'} GTT
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Contract</span>
                <a 
                  href={getExplorerUrl(chainId, tokenAddress || '')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-xs font-mono"
                >
                  {tokenAddress?.slice(0, 6)}...{tokenAddress?.slice(-4)}
                </a>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-400" />
                TruthVault Contract
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Yield Ratio</span>
                <span>{yieldToGTTRatio ? yieldToGTTRatio.toString() : '100'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status</span>
                <Badge variant="outline" className="border-green-500 text-green-400">
                  Active
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Network</span>
                <span>{getNetworkName(chainId)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Contract</span>
                <a 
                  href={getExplorerUrl(chainId, vaultAddress || '')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-xs font-mono"
                >
                  {vaultAddress?.slice(0, 6)}...{vaultAddress?.slice(-4)}
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Test Functions */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* GTT Token Functions */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-yellow-400" />
                GTT Token Functions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="mintAmount">Mint Amount (GTT)</Label>
                <Input
                  id="mintAmount"
                  type="number"
                  value={mintAmount}
                  onChange={(e) => setMintAmount(e.target.value)}
                  className="bg-slate-700 border-slate-600"
                />
              </div>
              <Button
                onClick={handleMintGTT}
                disabled={isPending || !isConnected}
                className="w-full bg-yellow-600 hover:bg-yellow-700"
              >
                {isPending ? "Processing..." : "Mint GTT (Admin Only)"}
              </Button>
              <div className="text-xs text-slate-400">
                Note: Only the vault contract can mint GTT tokens
              </div>
            </CardContent>
          </Card>

          {/* Capsule Functions */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-green-400" />
                Capsule Functions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                  <Label htmlFor="yieldAmount">Yield Amount</Label>
                  <Input
                    id="yieldAmount"
                    type="number"
                    value={yieldAmount}
                    onChange={(e) => setYieldAmount(e.target.value)}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
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
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={handleRegisterCapsule}
                  disabled={isPending || !isConnected}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Register
                </Button>
                <Button
                  onClick={handleVerifyCapsule}
                  disabled={isPending || !isConnected}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Verify
                </Button>
                <Button
                  onClick={handleUpdateYield}
                  disabled={isPending || !isConnected}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Update Yield
                </Button>
                <Button
                  onClick={handleClaimYield}
                  disabled={isPending || !isConnected}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Claim Yield
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Capsule Info Display */}
        {capsuleInfo && (
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                Capsule #{testCapsuleId} Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
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
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Truth Yield</span>
                  <span>{formatEther(capsuleInfo[3] || 0n)} ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Claimed</span>
                  <span>{formatEther(capsuleInfo[4] || 0n)} GTT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Last Claim</span>
                  <span>{new Date(Number(capsuleInfo[5]) * 1000).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Controls */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
            {isConnected && (
              <Button onClick={() => disconnect()} variant="outline" size="sm">
                Disconnect Wallet
              </Button>
            )}
          </div>
          <div className="text-sm text-slate-400">
            {isPending && "Transaction pending..."}
          </div>
        </div>
      </div>
    </div>
  );
}