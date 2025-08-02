import { useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, 
  Coins, 
  Clock, 
  Users, 
  TrendingUp, 
  Shield, 
  Award,
  ArrowUpRight,
  Play,
  Calendar,
  Target
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function EnhancedDashboard() {
  const { user } = useAuth();
  const [selectedAvatar, setSelectedAvatar] = useState('/assets/icon/NFT Capsule Icon_1751151138.png');

  // Fetch user stats
  const { data: userStats } = useQuery({
    queryKey: ['/api/user/stats'],
    enabled: !!user
  });

  // Fetch recent capsules
  const { data: recentCapsules } = useQuery({
    queryKey: ['/api/capsules/recent'],
    enabled: !!user
  });

  // Mock data for demonstration
  const stats = {
    truthScore: 87,
    gttEarned: 12547,
    capsulesCreated: user?.usage?.capsulesCreated || 5,
    verifiedCapsules: 3,
    timeLockedValue: 45200,
    nextUnlock: '2025-12-25',
    tierProgress: 65
  };

  const quickActions = [
    {
      title: 'Mint Capsule',
      description: 'Create new truth capsule',
      href: '/create-capsule',
      icon: Sparkles,
      color: 'bg-brand-primary/20 text-brand-primary',
      highlight: true
    },
    {
      title: 'My Yield',
      description: 'Claim GTT rewards',
      href: '/gtt-yield',
      icon: Coins,
      color: 'bg-brand-accent/20 text-brand-accent'
    },
    {
      title: 'Time-Lock Panel',
      description: 'Manage locked capsules',
      href: '/vault',
      icon: Clock,
      color: 'bg-brand-green/20 text-brand-green'
    },
    {
      title: 'Invite Friends',
      description: 'Earn referral rewards',
      href: '/referral',
      icon: Users,
      color: 'bg-purple-500/20 text-purple-400'
    }
  ];

  const nftAvatarOptions = [
    '/assets/icon/NFT Capsule Icon_1751151138.png',
    '/assets/icon/NFT Truth Time capsule_1751149906.png',
    '/assets/icon/_icon NFT Truth Time capsule (2).png',
    '/assets/icon/_icon NFT time capsule (1).png'
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-secondary via-slate-900 to-brand-surface p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome back, {user.firstName}!</h1>
          <p className="text-slate-300">Your truth preservation dashboard</p>
        </div>

        {/* Enhanced User Profile Card */}
        <Card className="bg-slate-800/50 border-brand-primary/20 backdrop-blur-sm mb-8 overflow-hidden">
          <CardContent className="p-0">
            {/* Dashboard Video Banner */}
            <div className="relative h-32">
              <video
                autoPlay
                muted
                loop
                className="w-full h-full object-cover opacity-60"
                src="/assets/video/GUARDIANCHAIN_DASHBOARD_VIDEO.mp4"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
            </div>
            
            <div className="p-6 -mt-16 relative z-10">
              <div className="flex items-start gap-6">
                {/* Avatar Selection */}
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    <img 
                      src={selectedAvatar}
                      alt="Profile Avatar"
                      className="w-24 h-24 rounded-full border-4 border-brand-primary bg-slate-800 p-2"
                    />
                    <Badge className="absolute -top-2 -right-2 bg-brand-accent text-white">
                      {user.tier?.toUpperCase()}
                    </Badge>
                  </div>
                  
                  {/* Avatar Options */}
                  <div className="flex gap-2 mt-3">
                    {nftAvatarOptions.map((avatar, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedAvatar(avatar)}
                        className={`w-8 h-8 rounded-full border-2 p-1 transition-all ${
                          selectedAvatar === avatar 
                            ? 'border-brand-primary scale-110' 
                            : 'border-slate-600 hover:border-slate-400'
                        }`}
                      >
                        <img src={avatar} alt={`Avatar ${i + 1}`} className="w-full h-full object-cover rounded-full" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-white">
                      {user.firstName} {user.lastName}
                    </h2>
                    <Badge variant="outline" className="border-brand-green text-brand-green">
                      Truth Guardian
                    </Badge>
                  </div>
                  
                  <p className="text-slate-300 mb-3">{user.email}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-xl font-bold text-brand-primary">{stats.capsulesCreated}</div>
                      <div className="text-slate-400">Capsules Created</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-brand-accent">{stats.gttEarned.toLocaleString()}</div>
                      <div className="text-slate-400">GTT Earned</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-brand-green">{stats.verifiedCapsules}</div>
                      <div className="text-slate-400">Verified</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-purple-400">{stats.truthScore}</div>
                      <div className="text-slate-400">Truth Score</div>
                    </div>
                  </div>
                </div>

                {/* Tier Progress */}
                <div className="min-w-[200px]">
                  <div className="text-center mb-3">
                    <div className="text-sm text-slate-400 mb-1">Tier Progress</div>
                    <div className="text-lg font-semibold text-white">{user.tier?.toUpperCase()} → CREATOR</div>
                  </div>
                  <Progress value={stats.tierProgress} className="mb-2" />
                  <div className="text-xs text-slate-400 text-center">
                    {stats.tierProgress}% to next tier
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickActions.map((action, i) => (
            <Link key={i} href={action.href}>
              <Card className={`
                bg-slate-800/30 hover:bg-slate-700/50 transition-all duration-300 cursor-pointer group
                ${action.highlight ? 'ring-2 ring-brand-primary/50' : ''}
              `}>
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-white mb-1">{action.title}</h3>
                  <p className="text-sm text-slate-400 mb-3">{action.description}</p>
                  <div className="flex items-center text-brand-primary text-sm font-medium">
                    <span>Get started</span>
                    <ArrowUpRight className="ml-1 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Portfolio Overview */}
          <Card className="lg:col-span-2 bg-slate-800/50 border-brand-primary/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-brand-primary" />
                Portfolio Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-3xl font-bold text-brand-accent mb-1">
                    ${stats.timeLockedValue.toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-400 mb-4">Time-Locked Value</div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Active Locks</span>
                      <span className="text-white font-medium">12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Pending Yields</span>
                      <span className="text-brand-accent font-medium">2.4k GTT</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Next Unlock</span>
                      <span className="text-brand-green font-medium">{stats.nextUnlock}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="text-3xl font-bold text-brand-primary mb-1">
                    {stats.truthScore}%
                  </div>
                  <div className="text-sm text-slate-400 mb-4">Truth Score</div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">Verification Rate</span>
                      <span className="text-white">95%</span>
                    </div>
                    <Progress value={95} className="h-2" />
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">Community Trust</span>
                      <span className="text-white">87%</span>
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="bg-slate-800/50 border-brand-primary/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-brand-accent" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-brand-primary rounded-full mt-2"></div>
                  <div>
                    <div className="text-white font-medium">Capsule Unlock</div>
                    <div className="text-sm text-slate-400">Family Memory #1001</div>
                    <div className="text-xs text-brand-accent">Dec 25, 2025</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-brand-accent rounded-full mt-2"></div>
                  <div>
                    <div className="text-white font-medium">Yield Distribution</div>
                    <div className="text-sm text-slate-400">Monthly GTT rewards</div>
                    <div className="text-xs text-brand-accent">Jan 1, 2026</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-brand-green rounded-full mt-2"></div>
                  <div>
                    <div className="text-white font-medium">Tier Upgrade</div>
                    <div className="text-sm text-slate-400">Promote to Creator</div>
                    <div className="text-xs text-brand-accent">35% progress</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Capsules */}
          <Card className="bg-slate-800/50 border-brand-primary/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-brand-green" />
                  Recent Capsules
                </span>
                <Link href="/vault">
                  <Button variant="ghost" size="sm" className="text-brand-primary hover:text-brand-primary/80">
                    View All
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors">
                    <img 
                      src="/assets/icon/NFT Truth Time capsule_1751149906.png"
                      alt="Capsule"
                      className="w-10 h-10 rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="text-white font-medium">Personal Journey #{1000 + i}</div>
                      <div className="text-sm text-slate-400">Created 2 days ago</div>
                    </div>
                    <Badge className="bg-brand-green/20 text-brand-green">
                      Verified
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="bg-slate-800/50 border-brand-primary/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Award className="h-5 w-5 text-brand-accent" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-700/30">
                  <div className="w-10 h-10 bg-brand-primary/20 rounded-lg flex items-center justify-center">
                    <Target className="h-5 w-5 text-brand-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">First Capsule Created</div>
                    <div className="text-sm text-slate-400">Started your truth journey</div>
                  </div>
                  <Badge className="bg-brand-primary/20 text-brand-primary">
                    +100 GTT
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-700/30">
                  <div className="w-10 h-10 bg-brand-accent/20 rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 text-brand-accent" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">Truth Verified</div>
                    <div className="text-sm text-slate-400">Community validated your capsule</div>
                  </div>
                  <Badge className="bg-brand-accent/20 text-brand-accent">
                    +250 GTT
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-700/30">
                  <div className="w-10 h-10 bg-brand-green/20 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-brand-green" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">Explorer Tier</div>
                    <div className="text-sm text-slate-400">Reached first milestone</div>
                  </div>
                  <Badge className="bg-brand-green/20 text-brand-green">
                    Unlocked
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}