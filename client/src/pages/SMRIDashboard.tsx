import React from 'react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { apiRequest } from '@/lib/queryClient';
import { 
  Trophy, 
  TrendingUp, 
  Heart, 
  Shield,
  Award,
  Star,
  Crown,
  Medal,
  Zap,
  Users,
  Target,
  Clock,
  Gift
} from 'lucide-react';

interface LeaderboardEntry {
  wallet: string;
  truth_score: number;
  reputation_tier: string;
  rank: number;
}

export default function SMRIDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [timeframe, setTimeframe] = useState('all');

  // Fetch user's SMRI data
  const { data: userSMRI } = useQuery({
    queryKey: ['/api/smri', (user as any)?.email || 'debug@guardianchain.app'],
    queryFn: async () => {
      const wallet = (user as any)?.email || 'debug@guardianchain.app';
      const response = await apiRequest('GET', `/api/smri/${wallet}`);
      return response.json();
    },
    enabled: isAuthenticated,
    refetchInterval: 60000
  });

  // Fetch leaderboard data
  const { data: leaderboard } = useQuery({
    queryKey: ['/api/smri/leaderboard', timeframe],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/smri/leaderboard?timeframe=${timeframe}`);
      return response.json();
    },
    refetchInterval: 120000
  });

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
      case 'veritas': return <Crown className="w-5 h-5" />;
      case 'gold': return <Trophy className="w-5 h-5" />;
      case 'silver': return <Medal className="w-5 h-5" />;
      case 'bronze': return <Award className="w-5 h-5" />;
      default: return <Star className="w-5 h-5" />;
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Award className="w-6 h-6 text-orange-600" />;
    return <div className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center text-white text-sm font-bold">{rank}</div>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-gold-400 bg-clip-text text-transparent mb-4">
            SMRI Dashboard
          </h1>
          <p className="text-xl text-gray-300">
            Track your reputation journey and compete with fellow truth guardians
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Personal SMRI Card */}
          <div className="lg:col-span-2">
            {userSMRI ? (
              <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20 mb-6">
                <CardHeader>
                  <CardTitle className="text-2xl text-purple-300 flex items-center justify-between">
                    <div className="flex items-center">
                      {getTierIcon(userSMRI.reputation_tier)}
                      <span className="ml-2">Your Reputation</span>
                    </div>
                    <Badge className={`bg-gradient-to-r ${getTierColor(userSMRI.reputation_tier)} text-white border-none`}>
                      {userSMRI.reputation_tier}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Main Score Display */}
                  <div className="text-center">
                    <div className={`text-6xl font-bold bg-gradient-to-r ${getTierColor(userSMRI.reputation_tier)} bg-clip-text text-transparent mb-2`}>
                      {userSMRI.truth_score}
                    </div>
                    <p className="text-gray-300 text-lg">Truth Score</p>
                    {userSMRI.trending && (
                      <div className="flex items-center justify-center mt-2">
                        <TrendingUp className={`w-4 h-4 mr-1 ${userSMRI.trending === 'up' ? 'text-green-400' : 'text-gray-400'}`} />
                        <span className="text-sm text-gray-400 capitalize">{userSMRI.trending}</span>
                      </div>
                    )}
                  </div>

                  {/* Progress to Next Tier */}
                  <div>
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                      <span>Progress to Next Tier</span>
                      <span>{Math.min((userSMRI.truth_score / 200) * 100, 100).toFixed(0)}%</span>
                    </div>
                    <Progress 
                      value={Math.min((userSMRI.truth_score / 200) * 100, 100)} 
                      className="h-3"
                    />
                  </div>

                  {/* Quick Stats Grid */}
                  <div className="grid grid-cols-4 gap-3">
                    <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                      <Heart className="w-5 h-5 text-red-400 mx-auto mb-1" />
                      <p className="text-lg font-bold text-white">{userSMRI.grief_total}</p>
                      <p className="text-xs text-gray-400">Grief</p>
                    </div>
                    
                    <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                      <Shield className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                      <p className="text-lg font-bold text-white">{userSMRI.capsule_count}</p>
                      <p className="text-xs text-gray-400">Capsules</p>
                    </div>
                    
                    <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                      <Zap className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                      <p className="text-lg font-bold text-white">{userSMRI.influence_count}</p>
                      <p className="text-xs text-gray-400">Influenced</p>
                    </div>
                    
                    <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                      <Award className="w-5 h-5 text-green-400 mx-auto mb-1" />
                      <p className="text-lg font-bold text-white">{userSMRI.cert_count}</p>
                      <p className="text-xs text-gray-400">Certs</p>
                    </div>
                  </div>

                  {/* Next Milestone */}
                  <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg p-4 border border-purple-500/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-purple-300 font-medium">Next Milestone</h4>
                        <p className="text-gray-300 text-sm">
                          {userSMRI.reputation_tier === 'Bronze' ? 'Reach 50 points for Silver tier' :
                           userSMRI.reputation_tier === 'Silver' ? 'Reach 100 points for Gold tier' :
                           userSMRI.reputation_tier === 'Gold' ? 'Reach 150 points for Veritas tier' :
                           'Maximum tier achieved!'}
                        </p>
                      </div>
                      <Target className="w-8 h-8 text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-black/40 backdrop-blur-xl border-gray-500/20 mb-6">
                <CardContent className="text-center py-12">
                  <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
                  <p className="text-gray-400">Loading your reputation...</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Leaderboard */}
          <div>
            <Card className="bg-black/40 backdrop-blur-xl border-yellow-500/20">
              <CardHeader>
                <CardTitle className="text-xl text-yellow-300 flex items-center justify-between">
                  <div className="flex items-center">
                    <Trophy className="w-5 h-5 mr-2" />
                    Leaderboard
                  </div>
                  <select 
                    value={timeframe} 
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="bg-slate-800 text-white text-sm rounded px-2 py-1 border border-yellow-500/30"
                  >
                    <option value="all">All Time</option>
                    <option value="month">This Month</option>
                    <option value="week">This Week</option>
                  </select>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {leaderboard ? (
                  <div className="space-y-3">
                    {leaderboard.slice(0, 10).map((entry: LeaderboardEntry) => (
                      <div key={entry.wallet} className="flex items-center space-x-3 p-2 rounded-lg bg-slate-800/30">
                        <div className="flex-shrink-0">
                          {getRankIcon(entry.rank)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">
                            {entry.wallet.includes('@') ? entry.wallet.split('@')[0] : `${entry.wallet.slice(0, 8)}...`}
                          </p>
                          <div className="flex items-center space-x-2">
                            {getTierIcon(entry.reputation_tier)}
                            <span className="text-xs text-gray-400">{entry.reputation_tier}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold">{entry.truth_score}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-2 opacity-50" />
                    <p className="text-gray-400 text-sm">Loading leaderboard...</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Weekly Challenges */}
            <Card className="bg-black/40 backdrop-blur-xl border-green-500/20 mt-6">
              <CardHeader>
                <CardTitle className="text-xl text-green-300 flex items-center">
                  <Gift className="w-5 h-5 mr-2" />
                  Weekly Challenges
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-green-900/20 rounded-lg p-3 border border-green-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-green-300 text-sm font-medium">Create 3 Capsules</span>
                    <Badge variant="outline" className="border-green-500/30 text-green-300">+15 pts</Badge>
                  </div>
                  <Progress value={userSMRI ? (userSMRI.capsule_count / 3) * 100 : 0} className="h-2" />
                  <p className="text-xs text-gray-400 mt-1">
                    {userSMRI ? Math.min(userSMRI.capsule_count, 3) : 0}/3 completed
                  </p>
                </div>

                <div className="bg-blue-900/20 rounded-lg p-3 border border-blue-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-300 text-sm font-medium">Verify 2 Contracts</span>
                    <Badge variant="outline" className="border-blue-500/30 text-blue-300">+10 pts</Badge>
                  </div>
                  <Progress value={userSMRI ? (userSMRI.cert_count / 2) * 100 : 0} className="h-2" />
                  <p className="text-xs text-gray-400 mt-1">
                    {userSMRI ? Math.min(userSMRI.cert_count, 2) : 0}/2 completed
                  </p>
                </div>

                <div className="bg-purple-900/20 rounded-lg p-3 border border-purple-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-purple-300 text-sm font-medium">Inspire Others</span>
                    <Badge variant="outline" className="border-purple-500/30 text-purple-300">+20 pts</Badge>
                  </div>
                  <Progress value={userSMRI ? Math.min((userSMRI.influence_count / 1) * 100, 100) : 0} className="h-2" />
                  <p className="text-xs text-gray-400 mt-1">
                    Have 1 capsule inspire another
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