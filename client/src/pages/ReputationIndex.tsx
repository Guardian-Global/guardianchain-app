import React from 'react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { apiRequest } from '@/lib/queryClient';
import { 
  Star, 
  TrendingUp, 
  Shield,
  Heart,
  Search,
  Award,
  Users,
  Target,
  Clock,
  Zap
} from 'lucide-react';

interface SMRIProfile {
  wallet: string;
  truth_score: number;
  grief_total: number;
  capsule_count: number;
  influence_count: number;
  cert_count: number;
  reputation_tier: 'Bronze' | 'Silver' | 'Gold' | 'Veritas';
  last_updated: string;
  trending: 'up' | 'down' | 'stable';
  rank?: number;
  avatar?: string;
  bio?: string;
  specialties?: string[];
  recent_activity?: {
    action: string;
    timestamp: string;
    points: number;
  }[];
}

export default function ReputationIndex() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('all');

  // Fetch SMRI leaderboard
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ['/api/smri/leaderboard', selectedTier],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/smri/leaderboard?tier=${selectedTier}`);
      return response.json();
    }
  });

  // Fetch user's SMRI data
  const { data: userSMRI } = useQuery({
    queryKey: ['/api/smri/debug@guardianchain.app'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/smri/debug@guardianchain.app');
      return response.json();
    }
  });

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Veritas': return 'from-yellow-400 to-yellow-600';
      case 'Gold': return 'from-yellow-500 to-orange-500';
      case 'Silver': return 'from-gray-300 to-gray-500';
      case 'Bronze': return 'from-orange-600 to-red-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'Veritas': return <Star className="w-4 h-4" />;
      case 'Gold': return <Award className="w-4 h-4" />;
      case 'Silver': return <Shield className="w-4 h-4" />;
      case 'Bronze': return <Target className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getTrendingIcon = (trending: string) => {
    switch (trending) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  const filteredLeaderboard = leaderboard?.filter((profile: SMRIProfile) =>
    profile.wallet.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Sovereign Memory Reputation Index
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Track truth-telling reputation across the GuardianChain ecosystem with SMRI scoring
          </p>
        </div>

        {/* User Profile Card */}
        {userSMRI && (
          <div className="max-w-4xl mx-auto mb-8">
            <Card className="bg-black/40 backdrop-blur-xl border-indigo-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src="/api/placeholder/64/64" />
                      <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-xl">
                        {userSMRI.wallet.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold text-white">{userSMRI.wallet}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge className={`bg-gradient-to-r ${getTierColor(userSMRI.reputation_tier)} text-white border-none`}>
                          {getTierIcon(userSMRI.reputation_tier)}
                          <span className="ml-1">{userSMRI.reputation_tier}</span>
                        </Badge>
                        {getTrendingIcon(userSMRI.trending)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-3xl font-bold text-indigo-400">{userSMRI.truth_score}</div>
                    <div className="text-sm text-gray-400">Truth Score</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">{userSMRI.grief_total}</div>
                    <div className="text-xs text-gray-400">Grief Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{userSMRI.capsule_count}</div>
                    <div className="text-xs text-gray-400">Capsules</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{userSMRI.influence_count}</div>
                    <div className="text-xs text-gray-400">Influences</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{userSMRI.cert_count}</div>
                    <div className="text-xs text-gray-400">Certificates</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">#{userSMRI.rank || 'N/A'}</div>
                    <div className="text-xs text-gray-400">Global Rank</div>
                  </div>
                </div>

                {/* Progress to next tier */}
                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Progress to next tier</span>
                    <span className="text-indigo-400">75%</span>
                  </div>
                  <Progress value={75} className="h-2 bg-slate-700" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Controls */}
        <div className="max-w-4xl mx-auto mb-6">
          <Card className="bg-black/40 backdrop-blur-xl border-indigo-500/20">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                
                {/* Search */}
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search guardians by wallet..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-slate-800/50 border-indigo-500/30 text-white placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Tier Filters */}
                <div className="flex space-x-2">
                  {['all', 'Veritas', 'Gold', 'Silver', 'Bronze'].map((tier) => (
                    <Button
                      key={tier}
                      variant={selectedTier === tier ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedTier(tier)}
                      className={selectedTier === tier ? 
                        'bg-gradient-to-r from-indigo-600 to-cyan-600' : 
                        'border-indigo-500/30 text-indigo-300'
                      }
                    >
                      {tier === 'all' ? 'All Tiers' : tier}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leaderboard */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-black/40 backdrop-blur-xl border-indigo-500/20">
            <CardHeader>
              <CardTitle className="text-indigo-300 flex items-center">
                <Award className="w-5 h-5 mr-2" />
                SMRI Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4" />
                  <p className="text-gray-400">Loading reputation data...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredLeaderboard.map((profile: SMRIProfile, index: number) => (
                    <div 
                      key={profile.wallet}
                      className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/50 hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl font-bold text-gray-400 w-8">
                          #{index + 1}
                        </div>
                        
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={profile.avatar} />
                          <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white">
                            {profile.wallet.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <div className="font-semibold text-white">{profile.wallet}</div>
                          <div className="flex items-center space-x-2">
                            <Badge className={`bg-gradient-to-r ${getTierColor(profile.reputation_tier)} text-white border-none text-xs`}>
                              {getTierIcon(profile.reputation_tier)}
                              <span className="ml-1">{profile.reputation_tier}</span>
                            </Badge>
                            {getTrendingIcon(profile.trending)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="text-xl font-bold text-indigo-400">{profile.truth_score}</div>
                          <div className="text-xs text-gray-400">Truth Score</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-lg font-semibold text-red-400">{profile.grief_total}</div>
                          <div className="text-xs text-gray-400">Grief</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-lg font-semibold text-blue-400">{profile.capsule_count}</div>
                          <div className="text-xs text-gray-400">Capsules</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-lg font-semibold text-green-400">{profile.cert_count}</div>
                          <div className="text-xs text-gray-400">Certificates</div>
                        </div>

                        <Button size="sm" variant="ghost" className="text-indigo-300 hover:text-white">
                          View Profile
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* SMRI Formula */}
        <div className="max-w-4xl mx-auto mt-8">
          <Card className="bg-black/40 backdrop-blur-xl border-indigo-500/20">
            <CardHeader>
              <CardTitle className="text-indigo-300 flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                SMRI Calculation Formula
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                <code className="text-cyan-400 text-lg">
                  Truth Score = (Grief Total + Influence × 2 + Certificates × 3) × 1.5
                </code>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <Heart className="w-6 h-6 text-red-400 mx-auto mb-2" />
                  <div className="font-semibold text-red-400">Grief Total</div>
                  <div className="text-gray-400">Emotional impact of your truth capsules</div>
                </div>
                <div className="text-center">
                  <TrendingUp className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <div className="font-semibold text-purple-400">Influence × 2</div>
                  <div className="text-gray-400">How many others you've inspired</div>
                </div>
                <div className="text-center">
                  <Award className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <div className="font-semibold text-green-400">Certificates × 3</div>
                  <div className="text-gray-400">Verified truth certifications</div>
                </div>
                <div className="text-center">
                  <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                  <div className="font-semibold text-yellow-400">× 1.5 Multiplier</div>
                  <div className="text-gray-400">Guardian ecosystem bonus</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}