import React from 'react';
import { Link } from 'wouter';
import { ArrowRight, Play, TrendingUp, Shield, Clock, Coins, Users, Zap } from 'lucide-react';
import GlowButton from '@/components/ui/GlowButton';
import CardGlass from '@/components/ui/CardGlass';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';

const stats = [
  { label: 'Active Capsules', value: '2,847', icon: Clock, change: '+12%' },
  { label: 'GTT Distributed', value: '156.2K', icon: Coins, change: '+8%' },
  { label: 'Truth Seekers', value: '18.5K', icon: Users, change: '+24%' },
  { label: 'Verifications', value: '9,132', icon: Shield, change: '+16%' },
];

const featuredCapsules = [
  {
    id: 1,
    title: 'Climate Data Leak 2024',
    author: 'Anonymous Scientist',
    unlockDate: '2024-12-31',
    gttReserve: '1,250',
    verified: true,
    category: 'Environmental'
  },
  {
    id: 2,
    title: 'Corporate Whistleblower Evidence',
    author: 'TruthSeeker_47',
    unlockDate: '2025-03-15',
    gttReserve: '3,400',
    verified: true,
    category: 'Legal'
  },
  {
    id: 3,
    title: 'Historical Family Archive',
    author: 'Legacy_Keeper',
    unlockDate: '2025-01-01',
    gttReserve: '890',
    verified: false,
    category: 'Personal'
  }
];

export default function EliteHomepage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative">
        <div className="text-center space-y-6">
          <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
            <Zap className="w-4 h-4 mr-1" />
            Truth Network v2.0 Live
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
            Preserve Truth,
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Unlock Value
            </span>
          </h1>
          
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            The sovereign Web3 infrastructure for time-locked proof, grief-score yield, 
            and capsule monetization. Seal your truth, earn GTT rewards.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            {isAuthenticated ? (
              <>
                <Link href="/create">
                  <GlowButton variant="primary" size="lg">
                    Create Capsule
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </GlowButton>
                </Link>
                <Link href="/explore">
                  <GlowButton variant="secondary" size="lg">
                    <Play className="w-5 h-5 mr-2" />
                    Explore Truth Feed
                  </GlowButton>
                </Link>
              </>
            ) : (
              <>
                <GlowButton variant="primary" size="lg">
                  Connect Wallet
                  <ArrowRight className="w-5 h-5 ml-2" />
                </GlowButton>
                <Link href="/explore">
                  <GlowButton variant="secondary" size="lg">
                    <Play className="w-5 h-5 mr-2" />
                    View Demo
                  </GlowButton>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <CardGlass key={stat.label} className="text-center">
                <Icon className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-slate-400 mb-2">{stat.label}</div>
                <Badge variant="secondary" className="text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {stat.change}
                </Badge>
              </CardGlass>
            );
          })}
        </div>
      </section>

      {/* Featured Capsules */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Featured Truth Capsules</h2>
          <Link href="/explore">
            <button className="text-blue-400 hover:text-blue-300 transition-colors">
              View All <ArrowRight className="w-4 h-4 inline ml-1" />
            </button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {featuredCapsules.map((capsule) => (
            <CardGlass key={capsule.id} gradient hover>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <Badge variant={capsule.verified ? 'default' : 'secondary'}>
                    {capsule.category}
                  </Badge>
                  {capsule.verified && (
                    <Shield className="w-4 h-4 text-green-400" />
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-white mb-2">{capsule.title}</h3>
                  <p className="text-sm text-slate-400">by {capsule.author}</p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Unlock Date:</span>
                    <span className="text-white">{capsule.unlockDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">GTT Reserve:</span>
                    <span className="text-green-400 font-semibold">{capsule.gttReserve}</span>
                  </div>
                </div>

                <Link href={`/auction/${capsule.id}`}>
                  <GlowButton variant="accent" size="sm" className="w-full">
                    Fund Auction
                  </GlowButton>
                </Link>
              </div>
            </CardGlass>
          ))}
        </div>
      </section>

      {/* Welcome Message for Authenticated Users */}
      {isAuthenticated && user && (
        <CardGlass gradient className="text-center">
          <h3 className="text-xl font-semibold text-white mb-2">
            Welcome back, {user.firstName}!
          </h3>
          <p className="text-slate-300 mb-4">
            You're currently on the <Badge variant="secondary">{user.tier || 'Explorer'}</Badge> tier.
            Ready to create your next truth capsule?
          </p>
          <Link href="/create">
            <GlowButton variant="primary">
              Start Creating
              <ArrowRight className="w-4 h-4 ml-2" />
            </GlowButton>
          </Link>
        </CardGlass>
      )}
    </div>
  );
}