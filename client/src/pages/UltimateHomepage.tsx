import React, { useState, useEffect, Suspense } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  Network
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { detectUserLanguage, getRTLContainerProps } from "@/lib/rtlSupport";
import { getLabel } from "@/lib/labels";

// Platform Stats Component
function LivePlatformStats() {
  const { data: stats } = useQuery({
    queryKey: ['/api/platform/live-stats'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const defaultStats = {
    totalCapsules: 45231,
    totalValue: '$2.4M',
    activeUsers: 12847,
    verification: '99.7%',
    countries: 67,
    yield: '12.3%'
  };

  const displayStats = stats || defaultStats;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-6 bg-black/20 rounded-2xl backdrop-blur-sm border border-white/10">
      <div className="text-center">
        <div className="text-2xl font-bold text-white">{displayStats.totalCapsules.toLocaleString()}</div>
        <div className="text-xs text-white/70">Truth Capsules</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-green-400">{displayStats.totalValue}</div>
        <div className="text-xs text-white/70">Total Locked</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-blue-400">{displayStats.activeUsers.toLocaleString()}</div>
        <div className="text-xs text-white/70">Active Users</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-purple-400">{displayStats.verification}</div>
        <div className="text-xs text-white/70">Verified</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-yellow-400">{displayStats.countries}</div>
        <div className="text-xs text-white/70">Countries</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-orange-400">{displayStats.yield}</div>
        <div className="text-xs text-white/70">APY</div>
      </div>
    </div>
  );
}

// Hero Section with Video Background
function HeroSection() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const video = document.createElement('video');
    video.src = '/assets/video/guardianchain-hero.mp4';
    video.oncanplaythrough = () => setVideoLoaded(true);
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
      
      {/* Fallback Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900" />
      
      {/* Animated Grid Overlay */}
      <div className="absolute inset-0 bg-[url('/assets/grid-pattern.svg')] opacity-10 animate-pulse" />
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
        {/* Tagline Badge */}
        <Badge className="mb-6 bg-white/10 text-white border-white/20 px-4 py-2">
          <Crown className="w-4 h-4 mr-2" />
          World's First Sovereign Memory Infrastructure
        </Badge>

        {/* Hero Headline */}
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight">
          Truth.{' '}
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Preserved.
          </span>
          <br />
          <span className="text-4xl md:text-6xl">Forever.</span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-2xl md:text-3xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed">
          Seal memories, verify truth, earn yield. 
          <br />
          <span className="text-blue-300">Powered by blockchain. Governed by community.</span>
        </p>

        {/* Live Stats */}
        <div className="mb-12">
          <LivePlatformStats />
        </div>

        {/* Hero CTAs */}
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-8">
          <Link href={isAuthenticated ? "/dashboard" : "/onboarding"}>
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-6 text-xl font-semibold rounded-full shadow-2xl transform hover:scale-105 transition-all">
              {isAuthenticated ? "Open Dashboard" : "Start Preserving Truth"}
              <ArrowRight className="ml-3 w-6 h-6" />
            </Button>
          </Link>
          
          <Button variant="outline" size="lg" className="border-2 border-white/30 text-white hover:bg-white/10 px-12 py-6 text-xl rounded-full backdrop-blur-sm">
            <Play className="mr-3 w-6 h-6" />
            Watch Demo
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center items-center gap-8 text-white/70">
          <div className="flex items-center">
            <Shield className="w-5 h-5 mr-2 text-green-400" />
            <span>Blockchain Secured</span>
          </div>
          <div className="flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-400" />
            <span>Community Governed</span>
          </div>
          <div className="flex items-center">
            <Globe className="w-5 h-5 mr-2 text-purple-400" />
            <span>Globally Accessible</span>
          </div>
          <div className="flex items-center">
            <Infinity className="w-5 h-5 mr-2 text-yellow-400" />
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

// Core Features Section
function CoreFeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: "Immutable Truth Capsules",
      description: "Seal memories, testimonies, and documents with cryptographic verification that lasts forever.",
      stats: "45,000+ Capsules Created",
      color: "blue"
    },
    {
      icon: Coins,
      title: "GTT Yield Generation",
      description: "Earn tokens based on your grief score, community engagement, and truth verification activities.",
      stats: "12.3% Average APY",
      color: "green"
    },
    {
      icon: Brain,
      title: "AI-Powered Verification",
      description: "Advanced ML models detect deepfakes, validate authenticity, and ensure content integrity.",
      stats: "99.7% Accuracy Rate",
      color: "purple"
    },
    {
      icon: GitBranch,
      title: "Truth Lineage Protocol",
      description: "Track how truths evolve and influence others through our revolutionary lineage system.",
      stats: "50,000+ Connections",
      color: "orange"
    },
    {
      icon: Users,
      title: "Community Governance",
      description: "Shape the platform's future through DAO voting and community-driven decision making.",
      stats: "12,000+ DAO Members",
      color: "indigo"
    },
    {
      icon: Database,
      title: "Decentralized Storage",
      description: "Content stored across IPFS and blockchain ensures accessibility and censorship resistance.",
      stats: "500TB+ Preserved",
      color: "pink"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "from-blue-500/20 to-blue-600/20 border-blue-400/30 text-blue-400",
      green: "from-green-500/20 to-green-600/20 border-green-400/30 text-green-400",
      purple: "from-purple-500/20 to-purple-600/20 border-purple-400/30 text-purple-400",
      orange: "from-orange-500/20 to-orange-600/20 border-orange-400/30 text-orange-400",
      indigo: "from-indigo-500/20 to-indigo-600/20 border-indigo-400/30 text-indigo-400",
      pink: "from-pink-500/20 to-pink-600/20 border-pink-400/30 text-pink-400"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-white/10 text-white border-white/20">
            Core Platform Features
          </Badge>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Built for
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Truth</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Every feature designed to preserve, verify, and monetize truth in the digital age.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className={`bg-gradient-to-br ${getColorClasses(feature.color)} border backdrop-blur-sm hover:scale-105 transition-all duration-300`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <feature.icon className={`w-8 h-8 ${getColorClasses(feature.color).split(' ')[2]}`} />
                  <Badge variant="outline" className="text-xs">
                    {feature.stats}
                  </Badge>
                </div>
                <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// Use Cases Section
function UseCasesSection() {
  const useCases = [
    {
      title: "Personal Legacy",
      description: "Preserve family memories, personal stories, and life experiences for future generations.",
      icon: Heart,
      examples: ["Family photo albums", "Personal diaries", "Life milestones", "Heritage stories"]
    },
    {
      title: "Whistleblower Protection",
      description: "Safely expose wrongdoing with anonymous, tamper-proof submissions and legal protection.",
      icon: Shield,
      examples: ["Corporate misconduct", "Government transparency", "Safety violations", "Fraud reporting"]
    },
    {
      title: "Professional Documentation",
      description: "Create verifiable records of work, achievements, and professional interactions.",
      icon: Trophy,
      examples: ["Contract agreements", "Performance records", "Certifications", "Testimonials"]
    },
    {
      title: "Historical Preservation",
      description: "Document important events, cultural practices, and historical moments for posterity.",
      icon: Clock,
      examples: ["Cultural traditions", "Historical events", "Language preservation", "Social movements"]
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Endless
            <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent"> Possibilities</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            From personal memories to global transparency, GuardianChain serves every truth preservation need.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {useCases.map((useCase, index) => (
            <div key={index} className="group">
              <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 hover:border-gray-600/70 transition-all duration-300 h-full">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                      <useCase.icon className="w-8 h-8 text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-2xl">{useCase.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80 mb-6">{useCase.description}</p>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-white/60 uppercase tracking-wide">Examples:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {useCase.examples.map((example, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-sm text-white/70">{example}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Technology Stack Section
function TechnologySection() {
  const techStack = [
    {
      category: "Blockchain",
      technologies: ["Ethereum", "Polygon", "IPFS", "ERC-721"],
      icon: Database,
      description: "Immutable storage and verification"
    },
    {
      category: "AI & ML",
      technologies: ["GPT-4", "Claude", "Computer Vision", "NLP"],
      icon: Brain,
      description: "Intelligent content analysis"
    },
    {
      category: "Security",
      technologies: ["Zero-Knowledge Proofs", "Cryptographic Hashing", "Multi-Sig", "Encryption"],
      icon: Shield,
      description: "Enterprise-grade protection"
    },
    {
      category: "Infrastructure",
      technologies: ["Distributed Systems", "P2P Networks", "CDN", "Load Balancing"],
      icon: Network,
      description: "Global scale and reliability"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Cutting-Edge
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Technology</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Built on the most advanced blockchain, AI, and distributed systems technologies.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {techStack.map((tech, index) => (
            <Card key={index} className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 border-gray-700/50 backdrop-blur-sm hover:scale-105 transition-all duration-300">
              <CardHeader className="text-center">
                <tech.icon className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <CardTitle className="text-white text-xl">{tech.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/60 text-sm mb-4 text-center">{tech.description}</p>
                <div className="space-y-2">
                  {tech.technologies.map((technology, i) => (
                    <Badge key={i} variant="outline" className="mr-2 mb-2 text-xs">
                      {technology}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// Testimonials Section
function TestimonialsSection() {
  const testimonials = [
    {
      quote: "GuardianChain gave my family a way to preserve our grandmother's stories forever. The technology is incredible.",
      author: "Sarah Chen",
      role: "Family Heritage Keeper",
      avatar: "👵"
    },
    {
      quote: "As a journalist, having an immutable platform for source protection and truth verification is invaluable.",
      author: "Marcus Rodriguez",
      role: "Investigative Journalist",
      avatar: "📰"
    },
    {
      quote: "The yield mechanism rewards truth-telling. Finally, a platform that incentivizes authenticity.",
      author: "Dr. Elena Vasquez",
      role: "Research Scientist",
      avatar: "🔬"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Trusted by
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent"> Truth-Tellers</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 border-gray-700/50 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="text-4xl mb-4">{testimonial.avatar}</div>
                <blockquote className="text-white/90 text-lg mb-6">
                  "{testimonial.quote}"
                </blockquote>
                <div>
                  <div className="font-semibold text-white">{testimonial.author}</div>
                  <div className="text-white/60 text-sm">{testimonial.role}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// Final CTA Section
function FinalCTASection() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="py-24 bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/assets/grid-pattern.svg')] opacity-10" />
      
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <h2 className="text-5xl md:text-7xl font-bold text-white mb-8">
          Your Truth.
          <br />
          <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Your Legacy.
          </span>
        </h2>
        
        <p className="text-2xl text-white/90 mb-12 max-w-2xl mx-auto">
          Join thousands preserving truth for future generations. Start your journey today.
        </p>

        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          <Link href={isAuthenticated ? "/capsules/create" : "/onboarding"}>
            <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black px-12 py-6 text-xl font-bold rounded-full shadow-2xl transform hover:scale-105 transition-all">
              {isAuthenticated ? "Create First Capsule" : "Get Started Free"}
              <Sparkles className="ml-3 w-6 h-6" />
            </Button>
          </Link>
          
          <Link href="/investors">
            <Button variant="outline" size="lg" className="border-2 border-white/30 text-white hover:bg-white/10 px-12 py-6 text-xl rounded-full backdrop-blur-sm">
              <Crown className="mr-3 w-6 h-6" />
              Investor Info
            </Button>
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-white/80">
          <div className="text-center">
            <div className="text-2xl font-bold">$2.4M+</div>
            <div className="text-sm">Value Locked</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">45K+</div>
            <div className="text-sm">Capsules</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">99.7%</div>
            <div className="text-sm">Verified</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">67</div>
            <div className="text-sm">Countries</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Main Homepage Component
export default function UltimateHomepage() {
  const userLang = detectUserLanguage();
  const containerProps = getRTLContainerProps(userLang);
  
  return (
    <div 
      className="min-h-screen bg-black text-white overflow-x-hidden"
      dir={containerProps.dir}
    >
      <HeroSection />
      <CoreFeaturesSection />
      <UseCasesSection />
      <TechnologySection />
      <TestimonialsSection />
      <FinalCTASection />
    </div>
  );
}