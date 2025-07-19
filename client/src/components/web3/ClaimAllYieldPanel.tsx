import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { getYieldVaultContract, getUserYieldInfo, claimYield, type YieldInfo } from '@/lib/yieldVault';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins, TrendingUp, Clock, Wallet } from "lucide-react";
import { BRAND_COLORS, BRAND_NAME } from "@/lib/constants";
import { useEthersSigner } from '@/lib/ethers';

interface ClaimAllYieldPanelProps {
  vaultAddress: string;
}

export function ClaimAllYieldPanel({ vaultAddress }: ClaimAllYieldPanelProps) {
  const { address, isConnected } = useAccount();
  const signer = useEthersSigner();
  const [yieldInfo, setYieldInfo] = useState<YieldInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [status, setStatus] = useState<string>('');

  const fetchYieldInfo = async () => {
    if (!address || !vaultAddress || !signer) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const contract = getYieldVaultContract(signer, vaultAddress);
      const info = await getUserYieldInfo(contract, address);
      setYieldInfo(info);
    } catch (error) {
      console.error('Error fetching yield info:', error);
      setStatus('Failed to load yield information');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchYieldInfo();
  }, [address, vaultAddress, signer]);

  const handleClaim = async () => {
    if (!signer || !vaultAddress || !yieldInfo || parseFloat(yieldInfo.claimable) <= 0) {
      return;
    }

    setClaiming(true);
    setStatus('Processing claim transaction...');

    try {
      const contract = getYieldVaultContract(signer, vaultAddress);
      const tx = await claimYield(contract);
      
      setStatus('Transaction submitted. Waiting for confirmation...');
      await tx.wait();
      
      setStatus('Yield claimed successfully!');
      await fetchYieldInfo(); // Refresh the yield info
      
      // Clear status after 3 seconds
      setTimeout(() => setStatus(''), 3000);
    } catch (error: any) {
      console.error('Claim failed:', error);
      setStatus(`Claim failed: ${error.message || 'Transaction rejected'}`);
    } finally {
      setClaiming(false);
    }
  };

  if (!isConnected) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6 text-center">
          <Wallet className="w-12 h-12 mx-auto mb-4 text-slate-400" />
          <p className="text-slate-300">Connect your wallet to view yield information</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-slate-300">Loading yield information...</p>
        </CardContent>
      </Card>
    );
  }

  const claimableAmount = yieldInfo ? parseFloat(yieldInfo.claimable) : 0;
  const hasClaimableYield = claimableAmount > 0;

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Coins className="w-5 h-5 mr-2" style={{ color: BRAND_COLORS.SUCCESS }} />
          GTT Yield Vault
        </CardTitle>
      </CardHeader>
      <CardContent>
        {yieldInfo ? (
          <div className="space-y-6">
            {/* Yield Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-400" />
                <p className="text-sm text-slate-400">Total Earned</p>
                <p className="text-xl font-bold text-white">
                  {parseFloat(yieldInfo.totalEarned).toFixed(4)} GTT
                </p>
              </div>
              
              <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                <Coins className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                <p className="text-sm text-slate-400">Total Withdrawn</p>
                <p className="text-xl font-bold text-white">
                  {parseFloat(yieldInfo.totalWithdrawn).toFixed(4)} GTT
                </p>
              </div>
              
              <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                <Clock className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                <p className="text-sm text-slate-400">Last Distribution</p>
                <p className="text-sm text-white">
                  {yieldInfo.lastDistributionTime === '0' 
                    ? 'Never' 
                    : new Date(parseInt(yieldInfo.lastDistributionTime) * 1000).toLocaleDateString()
                  }
                </p>
              </div>
            </div>

            {/* Claimable Amount */}
            <div className="text-center p-6 bg-gradient-to-br from-green-900/30 to-slate-800/30 rounded-lg border border-green-700/50">
              <h3 className="text-lg font-semibold text-white mb-2">Available to Claim</h3>
              <p className="text-3xl font-bold text-green-400 mb-4">
                {claimableAmount.toFixed(4)} GTT
              </p>
              
              {hasClaimableYield ? (
                <Badge className="bg-green-600 text-white mb-4">
                  Ready to Claim
                </Badge>
              ) : (
                <Badge className="bg-slate-600 text-white mb-4">
                  No Yield Available
                </Badge>
              )}
              
              <Button
                onClick={handleClaim}
                disabled={!hasClaimableYield || claiming}
                className="w-full mt-4"
                style={{ backgroundColor: hasClaimableYield ? BRAND_COLORS.SUCCESS : '#64748b' }}
              >
                {claiming ? (
                  <>
                    <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                    Claiming...
                  </>
                ) : (
                  <>
                    <Coins className="w-4 h-4 mr-2" />
                    Claim All Yield
                  </>
                )}
              </Button>
            </div>

            {/* Status */}
            {status && (
              <div className={`p-4 rounded-lg text-center ${
                status.includes('successfully') || status.includes('Success') 
                  ? 'bg-green-900/30 border border-green-700/50 text-green-300'
                  : status.includes('failed') || status.includes('Failed')
                  ? 'bg-red-900/30 border border-red-700/50 text-red-300'
                  : 'bg-blue-900/30 border border-blue-700/50 text-blue-300'
              }`}>
                {status}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-6">
            <p className="text-slate-400">Failed to load yield information</p>
            <Button 
              onClick={fetchYieldInfo}
              variant="outline" 
              className="mt-4 border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Retry
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}