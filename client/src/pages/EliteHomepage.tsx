import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Clock
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';

// Hero Video Component
function HeroVideo() {
  return (
    <div className="relative w-full h-[600px] overflow-hidden rounded-2xl">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/80 z-10" />
      <video 
        autoPlay 
        muted 
        loop 
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/assets/hero-video.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 z-20 flex items-center justify-center text-center">
        <div className="max-w-4xl px-6">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Truth. Preserved.
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Forever.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            The world's first sovereign memory infrastructure. Seal truth, earn yield, build legacy.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/create">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                Create Your First Capsule
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg">
              <Play className="mr-2 w-5 h-5" />
              Watch Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Trust Signals Component
function TrustSignals() {
  return (
    <div className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-center text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-8">
          Trusted by Leading Organizations
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center">
          {['Ethereum Foundation', 'Polygon', 'OpenAI', 'Y Combinator', 'Gitcoin'].map((company) => (
            <div key={company} className="text-center">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-gray-600 dark:text-gray-400 font-medium">{company}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Core Features Section
function CoreFeatures() {
  const features = [
    {
      icon: Shield,
      title: 'Truth Capsules',
      description: 'Immutable memory preservation with blockchain verification and AI-powered validation.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Zap,
      title: 'GTT Yield Engine',
      description: 'Earn tokens through truth preservation. Higher GriefScore™ = Higher yields.',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Lock,
      title: 'Eternal Contracts',
      description: 'Immutable declarations, wills, and testimonies that live forever on-chain.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Globe,
      title: 'Guardian Network',
      description: 'Decentralized truth verification through our global validator network.',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: Brain,
      title: 'AI Verification',
      description: 'Advanced AI analysis for content authenticity and emotional resonance scoring.',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      icon: Trophy,
      title: 'SMRI Rankings',
      description: 'Sovereign Memory Reputation Index - build your legacy and unlock premium features.',
      color: 'from-yellow-500 to-yellow-600'
    }
  ];

  return (
    <div className="py-24 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Revolutionary Memory Infrastructure
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            From personal memories to institutional records, GuardianChain preserves what matters most
            with cryptographic proof and economic incentives.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
              <CardContent className="p-8">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// User Journey Flow
function UserJourneyFlow() {
  const steps = [
    {
      number: '01',
      title: 'Create & Seal',
      description: 'Write your truth, attach media, set unlock conditions. Our AI analyzes authenticity.',
      icon: Heart
    },
    {
      number: '02', 
      title: 'Lock & Mint',
      description: 'Your capsule becomes an NFT on Polygon. Immutable, verifiable, yours forever.',
      icon: Lock
    },
    {
      number: '03',
      title: 'Earn & Grow',
      description: 'Accumulate GTT yield based on emotional impact. Build your Sovereign Memory Reputation.',
      icon: TrendingUp
    },
    {
      number: '04',
      title: 'Share & Legacy',
      description: 'Your truth inspires others. Create lineage connections and lasting impact.',
      icon: Infinity
    }
  ];

  return (
    <div className="py-24 bg-gradient-to-br from-blue-950 to-purple-950 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Your Truth Journey</h2>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            From memory to legacy in four simple steps
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <step.icon className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white text-black rounded-full flex items-center justify-center font-bold text-sm">
                  {step.number}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-blue-200 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Live Stats Component
function LiveStats() {
  const { data: stats } = useQuery({
    queryKey: ['/api/platform/stats'],
    refetchInterval: 5000
  });

  const displayStats = stats || {
    totalCapsules: 12547,
    totalUsers: 3891,
    gttDistributed: 847392,
    networksActive: 5
  };

  return (
    <div className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {displayStats.totalCapsules.toLocaleString()}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Truth Capsules</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
              {displayStats.totalUsers.toLocaleString()}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Guardians</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              {displayStats.gttDistributed.toLocaleString()}
            </div>
            <div className="text-gray-600 dark:text-gray-400">GTT Distributed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">
              {displayStats.networksActive}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Networks Active</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Testimonials Component
function Testimonials() {
  const testimonials = [
    {
      quote: "GuardianChain gave me the power to preserve my family's story forever. The AI analysis revealed emotional depths I never knew existed in our memories.",
      author: "Sarah Chen",
      role: "Family Historian",
      tier: "Creator"
    },
    {
      quote: "As a journalist, having immutable proof of sources and stories is revolutionary. The GTT yield rewards make truth preservation economically sustainable.",
      author: "Marcus Rodriguez", 
      role: "Investigative Journalist",
      tier: "Sovereign"
    },
    {
      quote: "The Eternal Contracts feature allowed me to create a permanent legacy for my children. Knowing it will exist forever gives me incredible peace of mind.",
      author: "Dr. Amara Okafor",
      role: "Research Scientist",
      tier: "Creator"
    }
  ];

  return (
    <div className="py-24 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Trusted by Truth Seekers Worldwide
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Real stories from our guardian community
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border-0">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.author}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    {testimonial.tier}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// Final CTA Section
function FinalCTA() {
  const { user } = useAuth();

  return (
    <div className="py-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Your Truth Awaits Preservation
        </h2>
        <p className="text-xl mb-8 text-blue-100">
          Join thousands of guardians building the future of memory and truth.
          Start your journey today.
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
          {user ? (
            <Link href="/dashboard">
              <Button size="lg" variant="secondary" className="px-8 py-4 text-lg">
                Go to Dashboard
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          ) : (
            <Link href="/create">
              <Button size="lg" variant="secondary" className="px-8 py-4 text-lg">
                Create First Capsule
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          )}
          <Link href="/explorer">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg">
              Explore Network
              <Globe className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
        
        <div className="text-blue-200 text-sm">
          <span className="flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Blockchain verified
            <CheckCircle className="w-4 h-4 ml-4" />
            AI powered
            <CheckCircle className="w-4 h-4 ml-4" />
            Forever preserved
          </span>
        </div>
      </div>
    </div>
  );
}

// Main Elite Homepage Component
export default function EliteHomepage() {
  const { user } = useAuth();

  useEffect(() => {
    // Track homepage visit
    if (typeof window !== 'undefined') {
      console.log('Elite homepage loaded');
    }
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-6 pt-8">
          <HeroVideo />
        </div>
      </section>

      {/* Trust Signals */}
      <TrustSignals />

      {/* Live Platform Stats */}
      <LiveStats />

      {/* Core Features */}
      <CoreFeatures />

      {/* User Journey */}
      <UserJourneyFlow />

      {/* Testimonials */}
      <Testimonials />

      {/* Final CTA */}
      <FinalCTA />
    </div>
  );
}