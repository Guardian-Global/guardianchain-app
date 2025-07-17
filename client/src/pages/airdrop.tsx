import { useState } from 'react';
import { Gift, Check, Clock, Users, Star, Zap, Shield, Coins } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { BRAND_NAME, BRAND_COLORS, EARLY_ADOPTER_REWARDS } from '@/lib/constants';

export default function AirdropPage() {
  const [userStatus, setUserStatus] = useState({
    isEligible: true,
    walletVerified: false,
    claimed: false,
    amount: EARLY_ADOPTER_REWARDS.FIRST_500_USERS,
    position: 247
  });
  const { toast } = useToast();

  const handleVerifyWallet = () => {
    setUserStatus(prev => ({ ...prev, walletVerified: true }));
    toast({
      title: "Wallet Verified",
      description: "Your wallet has been successfully verified for the airdrop",
    });
  };

  const handleClaimAirdrop = () => {
    setUserStatus(prev => ({ ...prev, claimed: true }));
    toast({
      title: "Airdrop Claimed!",
      description: `${userStatus.amount} GTT tokens have been transferred to your wallet`,
    });
  };

  const eligibilityRequirements = [
    { label: 'Wallet Connection', completed: true, icon: Shield },
    { label: 'Discord Verification', completed: true, icon: Users },
    { label: 'Twitter Follow', completed: false, icon: Star },
    { label: 'Profile Completion', completed: true, icon: Check }
  ];

  const airdropTiers = [
    {
      tier: 'Early Pioneer',
      positions: '1-100',
      amount: 1000,
      color: 'from-yellow-600 to-orange-600',
      requirements: 'First 100 verified users'
    },
    {
      tier: 'Truth Seeker',
      positions: '101-500',
      amount: 500,
      color: 'from-purple-600 to-blue-600',
      requirements: 'First 500 verified users'
    },
    {
      tier: 'Community Builder',
      positions: '501-1000',
      amount: 250,
      color: 'from-green-600 to-blue-600',
      requirements: 'Active community members'
    }
  ];

  const getUserTier = () => {
    if (userStatus.position <= 100) return airdropTiers[0];
    if (userStatus.position <= 500) return airdropTiers[1];
    return airdropTiers[2];
  };

  const currentTier = getUserTier();

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <Card className="mb-8 bg-gradient-to-r from-purple-900/50 to-green-900/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Gift className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <span className="text-white text-xl font-bold">
                  <span style={{ color: BRAND_COLORS.GUARDIAN }}>GUARDIAN</span>
                  <span style={{ color: BRAND_COLORS.CHAIN }}>CHAIN</span>
                  {' '}Airdrop
                </span>
                <p className="text-slate-400 text-sm font-normal">
                  Claim your free GTT tokens for early participation
                </p>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Claim Interface */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  <span className="text-white">Claim Your Airdrop</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* User Status */}
                <div className={`p-4 rounded-lg bg-gradient-to-r ${currentTier.color}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-bold text-lg">{currentTier.tier}</h3>
                      <p className="text-white/80 text-sm">Position #{userStatus.position}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold text-2xl">{currentTier.amount} GTT</div>
                      <div className="text-white/80 text-sm">Eligible Amount</div>
                    </div>
                  </div>
                </div>

                {/* Eligibility Check */}
                <div className="space-y-4">
                  <h4 className="text-white font-semibold">Eligibility Requirements</h4>
                  <div className="space-y-2">
                    {eligibilityRequirements.map((req, index) => {
                      const IconComponent = req.icon;
                      return (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            <IconComponent className="w-5 h-5 text-blue-400" />
                            <span className="text-white">{req.label}</span>
                          </div>
                          {req.completed ? (
                            <Check className="w-5 h-5 text-green-400" />
                          ) : (
                            <Clock className="w-5 h-5 text-yellow-400" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Claim Actions */}
                <div className="space-y-4">
                  {!userStatus.walletVerified ? (
                    <Button
                      onClick={handleVerifyWallet}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Verify Wallet
                    </Button>
                  ) : !userStatus.claimed ? (
                    <Button
                      onClick={handleClaimAirdrop}
                      className="w-full bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700 text-white font-semibold"
                    >
                      <Gift className="w-4 h-4 mr-2" />
                      Claim {currentTier.amount} GTT
                    </Button>
                  ) : (
                    <div className="w-full bg-green-600 text-white p-3 rounded-lg text-center">
                      <Check className="w-5 h-5 mx-auto mb-2" />
                      <span className="font-semibold">Airdrop Claimed Successfully!</span>
                    </div>
                  )}
                </div>

                {/* Important Notes */}
                <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
                  <h4 className="text-yellow-400 font-semibold mb-2">Important Notes</h4>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• Airdrop tokens are available for the first 1,000 verified users</li>
                    <li>• You must complete all eligibility requirements before claiming</li>
                    <li>• Tokens will be distributed immediately after claiming</li>
                    <li>• Each wallet can only claim once</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Airdrop Tiers & Stats */}
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-purple-400" />
                  <span className="text-white">Airdrop Tiers</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {airdropTiers.map((tier, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      tier === currentTier
                        ? 'border-purple-500/50 bg-purple-900/20'
                        : 'border-slate-600 bg-slate-700/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-semibold">{tier.tier}</h4>
                      <span className="text-yellow-400 font-bold">{tier.amount} GTT</span>
                    </div>
                    <p className="text-slate-400 text-sm mb-2">{tier.requirements}</p>
                    <Badge variant="outline" className="border-slate-600 text-slate-300">
                      Positions {tier.positions}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-400" />
                  <span className="text-white">Airdrop Statistics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Total Allocated</span>
                  <span className="text-white font-semibold">500K GTT</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Claimed</span>
                  <span className="text-white font-semibold">127K GTT</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Eligible Users</span>
                  <span className="text-white font-semibold">1,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Claims Made</span>
                  <span className="text-green-400 font-semibold">423</span>
                </div>
                
                <div className="w-full bg-slate-600 rounded-full h-2 mt-4">
                  <div
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                    style={{ width: '42.3%' }}
                  />
                </div>
                <div className="text-xs text-slate-400 text-center">
                  42.3% of airdrop claimed
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-yellow-400" />
                  <span className="text-white">Next Steps</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span className="text-slate-300 text-sm">Stake your GTT for rewards</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <span className="text-slate-300 text-sm">Participate in governance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full" />
                    <span className="text-slate-300 text-sm">Create truth capsules</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                    <span className="text-slate-300 text-sm">Refer friends for bonuses</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}