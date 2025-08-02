import React from 'react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { apiRequest } from '@/lib/queryClient';
import { 
  Trophy, 
  TrendingUp, 
  Heart, 
  Shield,
  Search,
  User,
  Award,
  Star,
  Crown,
  Medal,
  Zap
} from 'lucide-react';

interface SMRIData {
  wallet: string;
  truth_score: number;
  grief_total: number;
  capsule_count: number;
  influence_count: number;
  cert_count: number;
  reputation_tier: string;
  last_updated: string;
  trending?: string;
}

export default function ReputationIndex() {
  const { user, isAuthenticated } = useAuth();
  const [searchWallet, setSearchWallet] = useState('');
  const [activeWallet, setActiveWallet] = useState('');

  // Fetch SMRI data for searched wallet
  const { data: smriData, isLoading: smriLoading } = useQuery({
    queryKey: ['/api/smri', activeWallet],
    enabled: !!activeWallet,
    refetchInterval: 60000
  });

  // Auto-load user's own SMRI if authenticated
  const { data: userSMRI } = useQuery({
    queryKey: ['/api/smri', (user as any)?.email || 'debug@guardianchain.app'],
    enabled: isAuthenticated,
    refetchInterval: 60000
  });

  const handleSearch = () => {
    if (searchWallet.trim()) {
      setActiveWallet(searchWallet.trim());
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'veritas': return 'from-purple-500 to-blue-500';
      case 'gold': return 'from-yellow-500 to-orange-500';
      case 'silver': return 'from-gray-300 to-gray-500';
      case 'bronze': return 'from-orange-600 to-red-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'veritas': return <Crown className="w-6 h-6" />;
      case 'gold': return <Trophy className="w-6 h-6" />;
      case 'silver': return <Medal className="w-6 h-6" />;
      case 'bronze': return <Award className="w-6 h-6" />;
      default: return <Star className="w-6 h-6" />;
    }
  };

  const renderSMRICard = (data: SMRIData, title: string) => (
    <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-2xl text-purple-300 flex items-center justify-between">
          <div className="flex items-center">
            {getTierIcon(data.reputation_tier)}
            <span className="ml-2">{title}</span>
          </div>
          <Badge className={`bg-gradient-to-r ${getTierColor(data.reputation_tier)} text-white border-none`}>
            {data.reputation_tier}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Truth Score */}
        <div className="text-center">
          <div className={`text-6xl font-bold bg-gradient-to-r ${getTierColor(data.reputation_tier)} bg-clip-text text-transparent mb-2`}>
            {data.truth_score}
          </div>
          <p className="text-gray-300 text-lg">Truth Score</p>
          {data.trending && (
            <div className="flex items-center justify-center mt-2">
              <TrendingUp className={`w-4 h-4 mr-1 ${data.trending === 'up' ? 'text-green-400' : 'text-gray-400'}`} />
              <span className="text-sm text-gray-400 capitalize">{data.trending}</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Progress to Next Tier</span>
            <span>{Math.min((data.truth_score / 200) * 100, 100).toFixed(0)}%</span>
          </div>
          <Progress 
            value={Math.min((data.truth_score / 200) * 100, 100)} 
            className="h-3"
          />
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-4 text-center">
            <Heart className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{data.grief_total}</p>
            <p className="text-sm text-gray-400">Total Grief</p>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg p-4 text-center">
            <Shield className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{data.capsule_count}</p>
            <p className="text-sm text-gray-400">Capsules</p>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg p-4 text-center">
            <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{data.influence_count}</p>
            <p className="text-sm text-gray-400">Influenced</p>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg p-4 text-center">
            <Award className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{data.cert_count}</p>
            <p className="text-sm text-gray-400">Certificates</p>
          </div>
        </div>

        {/* Wallet Info */}
        <div className="bg-slate-800/50 rounded-lg p-3">
          <p className="text-sm text-gray-400 mb-1">Wallet Address</p>
          <p className="text-white font-mono text-sm break-all">{data.wallet}</p>
          <p className="text-xs text-gray-500 mt-2">
            Last updated: {new Date(data.last_updated).toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-gold-400 bg-clip-text text-transparent mb-4">
            Sovereign Memory Reputation Index
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Track your truth score, grief contribution, and influence across the GuardianChain network. 
            Discover who holds the highest reputation for preserving authentic human memory.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          
          {/* Search Section */}
          <div className="space-y-6">
            <Card className="bg-black/40 backdrop-blur-xl border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-300 flex items-center">
                  <Search className="w-6 h-6 mr-2" />
                  Lookup Reputation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-3">
                  <Input
                    placeholder="Enter wallet address or ENS name..."
                    value={searchWallet}
                    onChange={(e) => setSearchWallet(e.target.value)}
                    className="bg-slate-800/50 border-blue-500/30 text-white placeholder:text-gray-400"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <Button 
                    onClick={handleSearch}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={!searchWallet.trim()}
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setSearchWallet('debug@guardianchain.app');
                      setActiveWallet('debug@guardianchain.app');
                    }}
                    className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                  >
                    Sample Guardian
                  </Button>
                  {isAuthenticated && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        const wallet = (user as any)?.email || 'debug@guardianchain.app';
                        setSearchWallet(wallet);
                        setActiveWallet(wallet);
                      }}
                      className="border-green-500/30 text-green-300 hover:bg-green-500/10"
                    >
                      <User className="w-3 h-3 mr-1" />
                      My Reputation
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Search Results */}
            {smriLoading ? (
              <Card className="bg-black/40 backdrop-blur-xl border-gray-500/20">
                <CardContent className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
                  <p className="text-gray-400">Calculating reputation...</p>
                </CardContent>
              </Card>
            ) : smriData ? (
              renderSMRICard(smriData, 'Search Results')
            ) : activeWallet ? (
              <Card className="bg-black/40 backdrop-blur-xl border-red-500/20">
                <CardContent className="text-center py-8">
                  <Search className="w-16 h-16 text-red-400 mx-auto mb-4 opacity-50" />
                  <p className="text-red-300">No reputation data found for this wallet</p>
                  <p className="text-gray-400 text-sm mt-2">Try a different wallet address</p>
                </CardContent>
              </Card>
            ) : null}
          </div>

          {/* User's Own SMRI */}
          <div className="space-y-6">
            {isAuthenticated && userSMRI ? (
              renderSMRICard(userSMRI, 'Your Reputation')
            ) : isAuthenticated ? (
              <Card className="bg-black/40 backdrop-blur-xl border-yellow-500/20">
                <CardContent className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full mx-auto mb-4" />
                  <p className="text-gray-400">Loading your reputation...</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-black/40 backdrop-blur-xl border-gray-500/20">
                <CardContent className="text-center py-8">
                  <User className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
                  <p className="text-gray-300 mb-2">Sign in to view your reputation</p>
                  <p className="text-gray-400 text-sm">Create capsules and certificates to build your Truth Score</p>
                </CardContent>
              </Card>
            )}

            {/* Reputation Tiers Explanation */}
            <Card className="bg-black/40 backdrop-blur-xl border-gray-500/20">
              <CardHeader>
                <CardTitle className="text-xl text-gray-300">Reputation Tiers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Crown className="w-5 h-5 text-purple-400" />
                    <span className="text-purple-300">Veritas</span>
                  </div>
                  <span className="text-gray-400 text-sm">150+ Score</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <span className="text-yellow-300">Gold</span>
                  </div>
                  <span className="text-gray-400 text-sm">100-149 Score</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Medal className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-300">Silver</span>
                  </div>
                  <span className="text-gray-400 text-sm">50-99 Score</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-orange-400" />
                    <span className="text-orange-300">Bronze</span>
                  </div>
                  <span className="text-gray-400 text-sm">0-49 Score</span>
                </div>
                
                <div className="mt-4 pt-3 border-t border-gray-600">
                  <p className="text-xs text-gray-400">
                    Score = (Grief Total + Influence × 2 + Certificates × 3) × 1.5
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}