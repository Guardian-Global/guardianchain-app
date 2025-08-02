import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Coins, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Zap,
  Gift,
  Shield,
  ArrowRight,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface ClaimableReward {
  id: string;
  type: 'staking' | 'grief_yield' | 'validation' | 'referral' | 'bonus';
  amount: number;
  source: string;
  earnedAt: string;
  claimableAt: string;
  expiresAt?: string;
  status: 'pending' | 'claimable' | 'claimed' | 'expired';
  metadata: {
    griefScore?: number;
    stakingPeriod?: number;
    validationCount?: number;
    referralCount?: number;
  };
}

interface YieldSummary {
  totalClaimable: number;
  totalPending: number;
  totalClaimed: number;
  nextYieldDate: string;
  currentAPY: number;
  griefMultiplier: number;
  stakingBonus: number;
}

export default function GTTClaimPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedRewards, setSelectedRewards] = useState<string[]>([]);

  const { data: yieldSummary, isLoading: summaryLoading } = useQuery<YieldSummary>({
    queryKey: ['/api/gtt/yield-summary', user?.id],
    enabled: !!user?.id,
  });

  const { data: claimableRewards, isLoading: rewardsLoading, refetch } = useQuery<ClaimableReward[]>({
    queryKey: ['/api/gtt/claimable-rewards', user?.id],
    enabled: !!user?.id,
  });

  const claimMutation = useMutation({
    mutationFn: async (rewardIds: string[]) => {
      return apiRequest('POST', '/api/gtt/claim-rewards', { rewardIds });
    },
    onSuccess: (data: any) => {
      toast({
        title: 'Rewards Claimed',
        description: `Successfully claimed ${data.totalAmount || selectedAmount} GTT tokens.`,
      });
      setSelectedRewards([]);
      refetch();
    },
    onError: (error) => {
      toast({
        title: 'Claim Failed',
        description: 'There was an error claiming your rewards. Please try again.',
        variant: 'destructive',
      });
    }
  });

  const handleSelectReward = (rewardId: string) => {
    setSelectedRewards(prev => 
      prev.includes(rewardId) 
        ? prev.filter(id => id !== rewardId)
        : [...prev, rewardId]
    );
  };

  const handleSelectAll = () => {
    const claimable = claimableRewards?.filter(r => r.status === 'claimable') || [];
    setSelectedRewards(
      selectedRewards.length === claimable.length 
        ? [] 
        : claimable.map(r => r.id)
    );
  };

  const handleClaimSelected = () => {
    if (selectedRewards.length === 0) return;
    claimMutation.mutate(selectedRewards);
  };

  const getRewardTypeIcon = (type: string) => {
    switch (type) {
      case 'staking': return Shield;
      case 'grief_yield': return TrendingUp;
      case 'validation': return CheckCircle;
      case 'referral': return Gift;
      case 'bonus': return Zap;
      default: return Coins;
    }
  };

  const getRewardTypeLabel = (type: string) => {
    switch (type) {
      case 'staking': return 'Staking Rewards';
      case 'grief_yield': return 'Grief Score Yield';
      case 'validation': return 'Validation Rewards';
      case 'referral': return 'Referral Bonus';
      case 'bonus': return 'Platform Bonus';
      default: return 'GTT Rewards';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'claimable': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'claimed': return 'bg-gray-500';
      case 'expired': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const selectedAmount = selectedRewards.reduce((sum, rewardId) => {
    const reward = claimableRewards?.find(r => r.id === rewardId);
    return sum + (reward?.amount || 0);
  }, 0);

  if (summaryLoading || rewardsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Coins className="w-12 h-12 text-yellow-500 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              GTT Yield Claims
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Claim your earned GTT tokens from staking, grief score yield, and platform activities.
          </p>
        </div>

        {/* Yield Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Claimable Now</p>
                  <p className="text-3xl font-bold text-green-600">{yieldSummary?.totalClaimable.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">GTT Tokens</p>
                </div>
                <TrendingUp className="w-10 h-10 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pending Yield</p>
                  <p className="text-3xl font-bold text-yellow-600">{yieldSummary?.totalPending.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">GTT Tokens</p>
                </div>
                <Clock className="w-10 h-10 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Claimed</p>
                  <p className="text-3xl font-bold text-blue-600">{yieldSummary?.totalClaimed.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">GTT Tokens</p>
                </div>
                <CheckCircle className="w-10 h-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Yield Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Yield Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Current APY</span>
                  <span className="font-semibold">{yieldSummary?.currentAPY.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Grief Score Multiplier</span>
                  <span className="font-semibold">{yieldSummary?.griefMultiplier.toFixed(2)}x</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Staking Bonus</span>
                  <span className="font-semibold">+{yieldSummary?.stakingBonus.toFixed(1)}%</span>
                </div>
              </div>
              <div>
                <div className="mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Next Yield Distribution</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="font-semibold">
                    {yieldSummary?.nextYieldDate ? formatDate(yieldSummary.nextYieldDate) : 'TBD'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Claimable Rewards */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Gift className="w-5 h-5 mr-2" />
                Available Rewards ({claimableRewards?.filter(r => r.status === 'claimable').length || 0})
              </CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={handleSelectAll}
                  disabled={!claimableRewards?.some(r => r.status === 'claimable')}
                >
                  {selectedRewards.length === claimableRewards?.filter(r => r.status === 'claimable').length 
                    ? 'Deselect All' 
                    : 'Select All'}
                </Button>
                <Button
                  onClick={handleClaimSelected}
                  disabled={selectedRewards.length === 0 || claimMutation.isPending}
                  className="min-w-32"
                >
                  {claimMutation.isPending ? (
                    <>
                      <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                      Claiming...
                    </>
                  ) : (
                    <>
                      Claim {selectedAmount.toFixed(2)} GTT
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {claimableRewards && claimableRewards.length > 0 ? (
              <div className="space-y-4">
                {claimableRewards.map((reward) => {
                  const RewardIcon = getRewardTypeIcon(reward.type);
                  const isSelected = selectedRewards.includes(reward.id);
                  const isClaimable = reward.status === 'claimable';
                  
                  return (
                    <div
                      key={reward.id}
                      className={`p-4 border-2 rounded-lg transition-all cursor-pointer ${
                        isSelected && isClaimable
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      } ${!isClaimable ? 'opacity-60' : ''}`}
                      onClick={() => isClaimable && handleSelectReward(reward.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <RewardIcon className="w-5 h-5 text-blue-500" />
                            <div>
                              <h3 className="font-semibold">{getRewardTypeLabel(reward.type)}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{reward.source}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-lg font-bold">{reward.amount.toFixed(2)} GTT</p>
                            <div className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full ${getStatusColor(reward.status)}`} />
                              <span className="text-xs capitalize">{reward.status}</span>
                            </div>
                          </div>
                          
                          {isClaimable && (
                            <div className={`w-5 h-5 border-2 rounded ${
                              isSelected 
                                ? 'bg-blue-500 border-blue-500' 
                                : 'border-gray-300 dark:border-gray-600'
                            }`}>
                              {isSelected && (
                                <CheckCircle className="w-5 h-5 text-white" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-3 text-xs text-gray-500 space-y-1">
                        <div className="flex justify-between">
                          <span>Earned: {formatDate(reward.earnedAt)}</span>
                          <span>Claimable: {formatDate(reward.claimableAt)}</span>
                        </div>
                        {reward.expiresAt && (
                          <div className="flex items-center text-red-500">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            <span>Expires: {formatDate(reward.expiresAt)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Coins className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">No Rewards Available</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Keep participating in the platform to earn GTT rewards.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}