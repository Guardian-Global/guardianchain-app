import { useReadContract } from 'wagmi';
import { Vault, TrendingUp, Users, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getContractAddress, CONTRACT_ABIS } from '@/lib/contracts';
import { formatGTTAmount } from '@/lib/feeConfig';
import { formatEther } from 'viem';

interface TreasuryDisplayProps {
  chainId?: number;
  className?: string;
}

export default function TreasuryDisplay({ chainId, className = "" }: TreasuryDisplayProps) {
  const feeManagerAddress = chainId ? getContractAddress(chainId, 'feeManager') : undefined;
  const gttAddress = chainId ? getContractAddress(chainId, 'gtt') : undefined;
  const treasuryAddress = chainId ? getContractAddress(chainId, 'treasury') : undefined;

  // Get treasury GTT balance
  const { data: treasuryBalance } = useReadContract({
    address: gttAddress as `0x${string}`,
    abi: CONTRACT_ABIS.GTTToken,
    functionName: 'balanceOf',
    args: [treasuryAddress],
    enabled: !!gttAddress && !!treasuryAddress,
  });

  // Get total fees collected for each action
  const { data: mintFeesTotal } = useReadContract({
    address: feeManagerAddress as `0x${string}`,
    abi: CONTRACT_ABIS.FeeManager,
    functionName: 'getTotalFeesCollected',
    args: ['mint'],
    enabled: !!feeManagerAddress,
  });

  const { data: sealFeesTotal } = useReadContract({
    address: feeManagerAddress as `0x${string}`,
    abi: CONTRACT_ABIS.FeeManager,
    functionName: 'getTotalFeesCollected',
    args: ['seal'],
    enabled: !!feeManagerAddress,
  });

  const { data: proposalFeesTotal } = useReadContract({
    address: feeManagerAddress as `0x${string}`,
    abi: CONTRACT_ABIS.FeeManager,
    functionName: 'getTotalFeesCollected',
    args: ['proposal'],
    enabled: !!feeManagerAddress,
  });

  const { data: verificationFeesTotal } = useReadContract({
    address: feeManagerAddress as `0x${string}`,
    abi: CONTRACT_ABIS.FeeManager,
    functionName: 'getTotalFeesCollected',
    args: ['verification'],
    enabled: !!feeManagerAddress,
  });

  // Calculate total fees collected
  const totalFeesCollected = 
    BigInt(mintFeesTotal || 0) + 
    BigInt(sealFeesTotal || 0) + 
    BigInt(proposalFeesTotal || 0) + 
    BigInt(verificationFeesTotal || 0);

  return (
    <Card className={`bg-slate-800/50 border-slate-700 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Vault className="h-5 w-5 text-green-400" />
          <span className="text-white">Protocol Treasury</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Treasury Balance */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-slate-700/50 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <span className="text-sm text-slate-400">Current Balance</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {treasuryBalance ? formatEther(treasuryBalance) : '0'} GTT
            </div>
          </div>
          
          <div className="text-center p-4 bg-slate-700/50 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-slate-400">Total Collected</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {formatEther(totalFeesCollected)} GTT
            </div>
          </div>
        </div>

        {/* Fee Breakdown */}
        <div className="space-y-3">
          <h4 className="font-semibold text-white">Fee Collection Breakdown</h4>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                <span className="text-sm text-slate-400">NFT Minting</span>
              </div>
              <Badge variant="outline" className="text-white">
                {mintFeesTotal ? formatEther(mintFeesTotal) : '0'} GTT
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                <span className="text-sm text-slate-400">Capsule Sealing</span>
              </div>
              <Badge variant="outline" className="text-white">
                {sealFeesTotal ? formatEther(sealFeesTotal) : '0'} GTT
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full" />
                <span className="text-sm text-slate-400">DAO Proposals</span>
              </div>
              <Badge variant="outline" className="text-white">
                {proposalFeesTotal ? formatEther(proposalFeesTotal) : '0'} GTT
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-sm text-slate-400">Verification</span>
              </div>
              <Badge variant="outline" className="text-white">
                {verificationFeesTotal ? formatEther(verificationFeesTotal) : '0'} GTT
              </Badge>
            </div>
          </div>
        </div>

        {/* Treasury Usage */}
        <div className="border-t border-slate-600 pt-4">
          <h4 className="font-semibold text-white mb-2">Treasury Usage</h4>
          <ul className="text-sm text-slate-300 space-y-1">
            <li className="flex items-center gap-2">
              <Users className="h-3 w-3 text-green-400" />
              Community rewards and incentives
            </li>
            <li className="flex items-center gap-2">
              <Activity className="h-3 w-3 text-blue-400" />
              Platform development and maintenance
            </li>
            <li className="flex items-center gap-2">
              <TrendingUp className="h-3 w-3 text-purple-400" />
              Infrastructure and scaling costs
            </li>
          </ul>
        </div>

        {/* Treasury Address */}
        <div className="text-xs text-slate-500 text-center">
          Treasury: {treasuryAddress ? `${treasuryAddress.slice(0, 6)}...${treasuryAddress.slice(-4)}` : 'Not configured'}
        </div>
      </CardContent>
    </Card>
  );
}