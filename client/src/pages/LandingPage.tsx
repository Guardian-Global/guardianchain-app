import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { 
  Shield, 
  Zap, 
  Crown, 
  Users, 
  ArrowRight, 
  Play, 
  Lock,
  CheckCircle,
  Sparkles,
  Globe,
  Target
} from 'lucide-react';

const tiers = [
  {
    name: 'Explorer',
    price: 'Free',
    description: 'Perfect for getting started with truth verification',
    features: [
      '5 capsules per month',
      'Basic verification tools',
      'Community access',
      'Standard support'
    ],
    color: 'from-[#00ffe1] to-[#059669]',
    icon: Shield,
    popular: false
  },
  {
    name: 'Seeker',
    price: '$19/month',
    description: 'Advanced features for serious truth seekers',
    features: [
      '50 capsules per month',
      'Advanced AI analysis',
      'Priority verification',
      'Analytics dashboard',
      'Premium support'
    ],
    color: 'from-[#ff00d4] to-[#c21cac]',
    icon: Zap,
    popular: true
  },
  {
    name: 'Creator',
    price: '$49/month', 
    description: 'Full creation suite for content creators',
    features: [
      'Unlimited capsules',
      'NFT minting capabilities',
      'Advanced customization',
      'Revenue sharing',
      'White-label options',
      'Priority support'
    ],
    color: 'from-[#7c3aed] to-[#5b21b6]',
    icon: Crown,
    popular: false
  },
  {
    name: 'Sovereign',
    price: '$99/month',
    description: 'Enterprise-grade truth infrastructure',
    features: [
      'Everything in Creator',
      'Enterprise integrations',
      'Custom blockchain deployment',
      'Dedicated support team',
      'SLA guarantees',
      'Custom features'
    ],
    color: 'from-[#f59e0b] to-[#d97706]',
    icon: Users,
    popular: false
  }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-[#f0f6fc]">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00ffe1]/10 via-transparent to-[#7c3aed]/10" />
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00ffe1]/20 to-[#7c3aed]/20 rounded-full border border-[#00ffe1]/30 mb-8">
            <Sparkles className="w-5 h-5 text-[#00ffe1]" />
            <span className="text-[#00ffe1] font-medium">Truth Verification Platform</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#00ffe1] via-[#ff00d4] to-[#7c3aed] bg-clip-text text-transparent">
            GuardianChain
          </h1>
          
          <p className="text-xl md:text-2xl text-[#8b949e] mb-8 max-w-3xl mx-auto leading-relaxed">
            Secure your truth. Preserve your legacy. Build the future of decentralized verification 
            with blockchain-powered time capsules and community-driven validation.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/onboarding">
              <Button size="lg" className="bg-[#00ffe1] text-[#0d1117] hover:bg-[#00e5cb] px-8 py-4 text-lg">
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            
            <Link href="/login">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-[#30363d] text-[#8b949e] hover:text-[#f0f6fc] hover:border-[#00ffe1] px-8 py-4 text-lg"
              >
                Existing Member Login
                <Lock className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
          
          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="bg-[#161b22] border-[#30363d] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#00ffe1]/20 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-[#00ffe1]" />
                </div>
                <h3 className="text-lg font-semibold text-[#f0f6fc]">Blockchain Verified</h3>
              </div>
              <p className="text-[#8b949e]">
                Every truth capsule is cryptographically sealed and verified on the blockchain for immutable proof.
              </p>
            </Card>
            
            <Card className="bg-[#161b22] border-[#30363d] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#ff00d4]/20 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-[#ff00d4]" />
                </div>
                <h3 className="text-lg font-semibold text-[#f0f6fc]">Global Community</h3>
              </div>
              <p className="text-[#8b949e]">
                Join thousands of truth seekers worldwide in building a more transparent future.
              </p>
            </Card>
            
            <Card className="bg-[#161b22] border-[#30363d] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#7c3aed]/20 flex items-center justify-center">
                  <Target className="w-6 h-6 text-[#7c3aed]" />
                </div>
                <h3 className="text-lg font-semibold text-[#f0f6fc]">AI-Powered Analysis</h3>
              </div>
              <p className="text-[#8b949e]">
                Advanced AI algorithms analyze and score truth content for authenticity and relevance.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Subscription Plans */}
      <section className="py-20 px-6 bg-[#161b22]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#f0f6fc] mb-4">
              Choose Your Path to Truth
            </h2>
            <p className="text-xl text-[#8b949e] max-w-2xl mx-auto">
              Select the perfect plan for your truth verification needs. 
              Upgrade or downgrade anytime with no penalties.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tier) => {
              const IconComponent = tier.icon;
              return (
                <Card 
                  key={tier.name} 
                  className={`
                    relative bg-[#161b22] border-[#30363d] overflow-hidden
                    ${tier.popular ? 'ring-2 ring-[#ff00d4] scale-105' : ''}
                  `}
                >
                  {tier.popular && (
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-[#ff00d4] to-[#c21cac] text-white text-center py-2 text-sm font-medium">
                      Most Popular
                    </div>
                  )}
                  
                  <CardHeader className={tier.popular ? 'pt-12' : 'pt-6'}>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${tier.color} flex items-center justify-center`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`border-transparent bg-gradient-to-r ${tier.color} text-white`}
                      >
                        {tier.name}
                      </Badge>
                    </div>
                    
                    <CardTitle className="text-2xl text-[#f0f6fc]">
                      {tier.price}
                    </CardTitle>
                    
                    <p className="text-[#8b949e] text-sm">
                      {tier.description}
                    </p>
                  </CardHeader>
                  
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-[#00ffe1]" />
                          <span className="text-[#8b949e] text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Link href={`/onboarding?plan=${tier.name.toLowerCase()}`}>
                      <Button 
                        className={`
                          w-full bg-gradient-to-r ${tier.color} text-white hover:opacity-90
                          ${tier.popular ? 'shadow-lg shadow-[#ff00d4]/25' : ''}
                        `}
                      >
                        Get Started
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#f0f6fc] mb-4">
              How GuardianChain Works
            </h2>
            <p className="text-xl text-[#8b949e] max-w-2xl mx-auto">
              A simple, secure process to preserve and verify truth for generations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#00ffe1] to-[#059669] rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-[#f0f6fc] mb-4">Create Truth Capsule</h3>
              <p className="text-[#8b949e]">
                Upload documents, testimonies, or evidence to create a secure, time-locked truth capsule.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#ff00d4] to-[#c21cac] rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-[#f0f6fc] mb-4">Community Verification</h3>
              <p className="text-[#8b949e]">
                Our global community of guardians reviews and verifies your truth using advanced AI tools.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#7c3aed] to-[#5b21b6] rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-[#f0f6fc] mb-4">Blockchain Sealed</h3>
              <p className="text-[#8b949e]">
                Verified truth is permanently sealed on the blockchain, creating immutable proof for the future.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-[#161b22] to-[#0d1117]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-[#f0f6fc] mb-6">
            Ready to Secure Your Truth?
          </h2>
          <p className="text-xl text-[#8b949e] mb-8">
            Join thousands of guardians building a more transparent world. 
            Your truth matters—preserve it forever.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/onboarding">
              <Button size="lg" className="bg-[#00ffe1] text-[#0d1117] hover:bg-[#00e5cb] px-8 py-4 text-lg">
                Start Free Trial
                <Play className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            
            <Link href="/demo">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-[#30363d] text-[#8b949e] hover:text-[#f0f6fc] hover:border-[#00ffe1] px-8 py-4 text-lg"
              >
                Watch Demo
                <Play className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}