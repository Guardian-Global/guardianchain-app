import React, { useState, useEffect, Suspense } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  Zap,
  Globe,
  TrendingUp,
  Users,
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  Trophy,
  Lock,
  Infinity,
  Brain,
  Heart,
  Clock,
  Coins,
  Crown,
  Sparkles,
  Target,
  Award,
  ExternalLink,
  GitBranch,
  Database,
  Cpu,
  Network,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import GlowButton from '@/components/ui/GlowButton';
import CardGlass from '@/components/ui/CardGlass';

// Platform Stats Component with Live Data
function LivePlatformStats() {
  const { data: stats } = useQuery({
    queryKey: ["/api/platform/live-stats"],
    refetchInterval: 30000, // Refresh every 30 seconds
    queryFn: async () => {
      try {
        const response = await fetch("/api/platform/live-stats");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.warn("Platform stats fetch failed:", error);
        return null;
      }
    },
    retry: false
  });

  const defaultStats = {
    totalCapsules: 45231,
    totalValue: "$2.4M",
    activeUsers: 12847,
    verification: "99.7%",
    countries: 67,
    yield: "12.3%",
  };

  const displayStats = stats || defaultStats;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-6 bg-black/20 rounded-2xl backdrop-blur-sm border border-white/10">
      <div className="text-center">
        <div className="text-2xl font-bold text-white">
          {displayStats.totalCapsules.toLocaleString()}
        </div>
        <div className="text-xs text-white/70">Truth Capsules</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-green-400">
          {displayStats.totalValue}
        </div>
        <div className="text-xs text-white/70">Total Locked</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-blue-400">
          {displayStats.activeUsers.toLocaleString()}
        </div>
        <div className="text-xs text-white/70">Active Users</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-purple-400">
          {displayStats.verification}
        </div>
        <div className="text-xs text-white/70">Verified</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-yellow-400">
          {displayStats.countries}
        </div>
        <div className="text-xs text-white/70">Countries</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-orange-400">
          {displayStats.yield}
        </div>
        <div className="text-xs text-white/70">APY</div>
      </div>
    </div>
  );
}

// Hero Section with Video Background and Rich Graphics
function HeroSection() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const video = document.createElement("video");
    video.src = "/assets/video/guardianchain-hero.mp4";
    video.oncanplaythrough = () => setVideoLoaded(true);
    video.load();
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      {videoLoaded && (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          src="/assets/video/guardianchain-hero.mp4"
        />
      )}

      {/* Fallback Background with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900" />
      
      {/* Animated Grid Overlay */}
      <div className="absolute inset-0 bg-[url('/assets/grid-pattern.svg')] opacity-10 animate-pulse" />
      
      {/* Enhanced Particle Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating orbs with epic glow */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-400 rounded-full animate-particle-float opacity-80 animate-epic-glow" />
        <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-purple-400 rounded-full animate-particle-float opacity-60 animate-rainbow-glow animation-delay-500" />
        <div className="absolute top-1/2 left-1/3 w-3 h-3 bg-cyan-400 rounded-full animate-particle-float opacity-70 animate-epic-glow animation-delay-1000" />
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-green-400 rounded-full animate-particle-float opacity-50 animate-rainbow-glow animation-delay-1500" />
        <div className="absolute bottom-1/4 left-1/2 w-4 h-4 bg-pink-400 rounded-full animate-particle-float opacity-60 animate-epic-glow animation-delay-2000" />
        
        {/* Digital rain */}
        <div className="absolute top-0 left-16 w-px h-32 bg-gradient-to-b from-transparent via-cyan-400/40 to-transparent animate-digital-rain animation-delay-300" />
        <div className="absolute top-0 left-48 w-px h-24 bg-gradient-to-b from-transparent via-blue-400/40 to-transparent animate-digital-rain animation-delay-800" />
        <div className="absolute top-0 right-32 w-px h-28 bg-gradient-to-b from-transparent via-purple-400/40 to-transparent animate-digital-rain animation-delay-1200" />
        
        {/* Animated grid lines */}
        <div className="absolute inset-0 opacity-5 animate-cyber-grid"
             style={{
               backgroundImage: `
                 linear-gradient(rgba(59, 130, 246, 0.2) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(59, 130, 246, 0.2) 1px, transparent 1px)
               `,
               backgroundSize: '60px 60px'
             }}>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        {/* Logo with Enhanced Styling */}
        <div className="mb-8">
          <img 
            src="/assets/GUARDIANCHAIN_logo.png" 
            alt="GuardianChain" 
            className="h-16 md:h-20 mx-auto mb-4 filter drop-shadow-2xl hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              // Fallback to text if logo fails to load
              const target = e.currentTarget;
              target.style.display = 'none';
              const textLogo = document.createElement('div');
              textLogo.innerHTML = '<span class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">GuardianChain</span>';
              textLogo.className = 'mb-4';
              target.parentNode?.insertBefore(textLogo, target);
            }}
          />
        </div>

        {/* Enhanced Badge */}
        <Badge className="mb-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border-blue-400/30 px-4 py-2 animate-pulse">
          <Sparkles className="w-4 h-4 mr-2" />
          Truth Network v2.0 • Live on Polygon
        </Badge>

        {/* Ultra-Enhanced Hero Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight transform hover:scale-105 transition-transform duration-500">
          <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent drop-shadow-2xl animate-epic-glow">
            Preserve Truth
          </span>
          <br />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl animate-rainbow-glow">
            Unlock Value
          </span>
        </h1>

        {/* Enhanced Subtitle */}
        <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-4xl mx-auto leading-relaxed">
          The sovereign Web3 infrastructure for{" "}
          <span className="text-blue-400 font-semibold bg-blue-400/10 px-2 py-1 rounded">
            time-locked proof
          </span>
          ,{" "}
          <span className="text-purple-400 font-semibold bg-purple-400/10 px-2 py-1 rounded">
            grief-score yield
          </span>
          , and{" "}
          <span className="text-cyan-400 font-semibold bg-cyan-400/10 px-2 py-1 rounded">
            capsule monetization
          </span>
          . Seal your truth, earn GTT rewards.
        </p>

        {/* Live Stats */}
        <div className="mb-8">
          <LivePlatformStats />
        </div>

        {/* Ultra-Enhanced CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
          {isAuthenticated ? (
            <>
              <Link href="/create">
                <GlowButton size="lg" className="px-10 py-5 text-xl font-bold shadow-2xl transform hover:scale-110 transition-all duration-300 animate-epic-glow relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-holographic"></div>
                  <Shield className="w-6 h-6 mr-3 relative z-10" />
                  <span className="relative z-10">Create Truth Capsule</span>
                </GlowButton>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="px-10 py-5 text-xl border-white/30 hover:border-white/60 backdrop-blur-md hover:backdrop-blur-lg transform hover:scale-105 transition-all duration-300 animate-rainbow-glow">
                  <TrendingUp className="w-6 h-6 mr-3" />
                  My Dashboard
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <GlowButton size="lg" className="px-10 py-5 text-xl font-bold shadow-2xl transform hover:scale-110 transition-all duration-300 animate-epic-glow relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 animate-holographic"></div>
                  <Zap className="w-6 h-6 mr-3 relative z-10" />
                  <span className="relative z-10">Enter GuardianChain</span>
                </GlowButton>
              </Link>
              <Link href="/explore">
                <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-white/20 hover:border-white/40 backdrop-blur-sm">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Enhanced Trust Indicators */}
        <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-slate-400">
          <div className="flex items-center gap-2 bg-green-400/10 px-3 py-2 rounded-full">
            <Shield className="w-4 h-4 text-green-400" />
            <span>Polygon Secured</span>
          </div>
          <div className="flex items-center gap-2 bg-blue-400/10 px-3 py-2 rounded-full">
            <CheckCircle className="w-4 h-4 text-blue-400" />
            <span>IPFS Verified</span>
          </div>
          <div className="flex items-center gap-2 bg-purple-400/10 px-3 py-2 rounded-full">
            <Lock className="w-4 h-4 text-purple-400" />
            <span>Lit Protocol Encrypted</span>
          </div>
          <div className="flex items-center gap-2 bg-yellow-400/10 px-3 py-2 rounded-full">
            <Infinity className="w-4 h-4 text-yellow-400" />
            <span>Permanently Preserved</span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full p-1">
          <div className="w-1 h-3 bg-white/60 rounded-full mx-auto animate-pulse" />
        </div>
      </div>
    </section>
  );
}

export default function EliteHomepage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section with Full UI/UX Graphics */}
      <HeroSection />

      {/* Feature Showcase with Rich Visual Elements */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Revolutionary Truth Infrastructure
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Built for truth professionals, whistleblowers, and legacy creators who demand sovereign control over their narratives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Truth Capsules */}
            <CardGlass className="p-8 text-center group hover:scale-105 transition-transform duration-300 relative overflow-hidden animate-epic-glow">
              {/* Floating particles inside card */}
              <div className="absolute top-4 right-4 w-1 h-1 bg-blue-400/60 rounded-full animate-particle-float animation-delay-300"></div>
              <div className="absolute bottom-6 left-6 w-2 h-2 bg-cyan-400/40 rounded-full animate-particle-float animation-delay-700"></div>
              
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-2xl animate-epic-glow relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 animate-holographic rounded-2xl"></div>
                <Shield className="w-8 h-8 text-white relative z-10" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white drop-shadow-lg">Truth Capsules</h3>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Time-locked, blockchain-verified containers for sensitive information with automated disclosure triggers.
              </p>
              <Link href="/create">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-2xl transform hover:scale-105 transition-all duration-300 animate-rainbow-glow">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Create Capsule
                </Button>
              </Link>
            </CardGlass>

            {/* Truth Auctions */}
            <CardGlass className="p-8 text-center group hover:scale-105 transition-transform duration-300 relative overflow-hidden animate-rainbow-glow">
              {/* Floating particles inside card */}
              <div className="absolute top-3 left-4 w-1.5 h-1.5 bg-orange-400/60 rounded-full animate-particle-float animation-delay-500"></div>
              <div className="absolute bottom-4 right-5 w-1 h-1 bg-yellow-400/50 rounded-full animate-particle-float animation-delay-1200"></div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-2xl animate-rainbow-glow relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 animate-holographic rounded-2xl"></div>
                <Trophy className="w-8 h-8 text-white relative z-10" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white drop-shadow-lg">Truth Auctions</h3>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Crowd-fund investigations and directly reward whistleblowers through blockchain governance.
              </p>
              <Link href="/auction-house">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-2xl transform hover:scale-105 transition-all duration-300 animate-epic-glow">
                  <Target className="w-4 h-4 mr-2" />
                  Browse Auctions
                </Button>
              </Link>
            </CardGlass>

            {/* GTT Yield */}
            <CardGlass className="p-8 text-center group hover:scale-105 transition-transform duration-300 relative overflow-hidden animate-epic-glow">
              {/* Floating particles inside card */}
              <div className="absolute top-5 right-3 w-1 h-1 bg-green-400/70 rounded-full animate-particle-float animation-delay-800"></div>
              <div className="absolute bottom-7 left-4 w-1.5 h-1.5 bg-emerald-400/50 rounded-full animate-particle-float animation-delay-1400"></div>
              
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-2xl animate-rainbow-glow relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 animate-holographic rounded-2xl"></div>
                <Coins className="w-8 h-8 text-white relative z-10" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white drop-shadow-lg">GTT Yield</h3>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Earn Guardian Truth Tokens based on your GriefScore™ and contribution to truth verification.
              </p>
              <Link href="/gtt-yield">
                <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-2xl transform hover:scale-105 transition-all duration-300 animate-epic-glow">
                  <Award className="w-4 h-4 mr-2" />
                  Earn GTT
                </Button>
              </Link>
            </CardGlass>
          </div>
        </div>
      </section>

      {/* Technology Showcase with Visual Icons */}
      <section className="py-20 px-4 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Cutting-Edge Technology Stack
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Built on battle-tested Web3 infrastructure with institutional-grade security and performance.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 rounded-2xl bg-gradient-to-b from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:scale-105 transition-transform animate-epic-glow relative overflow-hidden">
              <div className="absolute top-2 right-2 w-1 h-1 bg-purple-400/50 rounded-full animate-particle-float animation-delay-300"></div>
              <Network className="w-12 h-12 text-purple-400 mx-auto mb-4 animate-rainbow-glow" />
              <h4 className="font-semibold text-white mb-2 drop-shadow-lg">Polygon</h4>
              <p className="text-sm text-slate-400">Fast, low-cost transactions</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-b from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:scale-105 transition-transform">
              <Database className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h4 className="font-semibold text-white mb-2">IPFS</h4>
              <p className="text-sm text-slate-400">Decentralized storage</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-b from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:scale-105 transition-transform">
              <Lock className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h4 className="font-semibold text-white mb-2">Lit Protocol</h4>
              <p className="text-sm text-slate-400">Advanced encryption</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-b from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:scale-105 transition-transform">
              <Brain className="w-12 h-12 text-orange-400 mx-auto mb-4" />
              <h4 className="font-semibold text-white mb-2">GPT-4o</h4>
              <p className="text-sm text-slate-400">AI verification</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action with Enhanced Graphics */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Ready to Preserve Your Truth?
          </h2>
          <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
            Join thousands of truth professionals already using GuardianChain to protect their narratives and earn rewards.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link href="/create">
                <GlowButton size="lg" className="px-8 py-4 text-lg font-semibold shadow-2xl">
                  <Shield className="w-5 h-5 mr-2" />
                  Create Truth Capsule
                </GlowButton>
              </Link>
            ) : (
              <Link href="/auth/login">
                <GlowButton size="lg" className="px-8 py-4 text-lg font-semibold shadow-2xl">
                  <Zap className="w-5 h-5 mr-2" />
                  Start Your Truth Journey
                </GlowButton>
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}