import React from 'react';
import { ExternalLink, Download, TrendingUp, Users, Shield, Zap } from 'lucide-react';
import CardGlass from '@/components/ui/CardGlass';
import GlowButton from '@/components/ui/GlowButton';
import { Badge } from '@/components/ui/badge';

const metrics = [
  { label: 'Total Capsules', value: '2,847', icon: Zap },
  { label: 'Active Users', value: '18.5K', icon: Users },
  { label: 'GTT Distributed', value: '156.2K', icon: TrendingUp },
  { label: 'Truth Verifications', value: '9,132', icon: Shield },
];

const features = [
  {
    title: 'AI-Powered Truth Verification',
    description: 'GPT-4o engine for content analysis and verification',
    status: 'Live'
  },
  {
    title: 'Blockchain NFT Minting',
    description: 'Real Polygon integration with authentic transactions',
    status: 'Live'
  },
  {
    title: 'Time-Locked Capsules',
    description: 'Lit Protocol encryption for secure time-based reveals',
    status: 'Live'
  },
  {
    title: 'Truth Auction System',
    description: 'Crowdfunded disclosure mechanisms with GTT rewards',
    status: 'Live'
  },
  {
    title: 'Grief Score Yield',
    description: 'Novel tokenomics based on emotional resonance',
    status: 'Beta'
  },
  {
    title: 'Global Network',
    description: 'Multi-language support with 29 RTL languages',
    status: 'Live'
  }
];

const useCases = [
  {
    title: 'Whistleblower Protection',
    description: 'Secure, time-locked evidence submission with legal protection',
    impact: 'High'
  },
  {
    title: 'Eternal Declarations',
    description: 'Immutable personal and institutional legacy preservation',
    impact: 'Medium'
  },
  {
    title: 'Sovereign Social Profiles',
    description: 'Blockchain-verified identity and truth sharing',
    impact: 'High'
  },
  {
    title: 'Corporate Transparency',
    description: 'Internal disclosure and compliance documentation',
    impact: 'High'
  }
];

export default function DemoKit() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
          <TrendingUp className="w-4 h-4 mr-1" />
          Live Production Platform
        </Badge>
        
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
          GuardianChain Investor Demo Kit
        </h1>
        
        <p className="text-xl text-slate-300 max-w-3xl mx-auto">
          Complete truth preservation infrastructure with real blockchain integration, 
          AI verification, and sovereign data ownership
        </p>
      </div>

      {/* Live Metrics */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">Live Platform Metrics</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <CardGlass key={metric.label} className="text-center">
                <Icon className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                <div className="text-2xl font-bold text-white">{metric.value}</div>
                <div className="text-sm text-slate-400">{metric.label}</div>
              </CardGlass>
            );
          })}
        </div>
      </section>

      {/* Core Features */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">Core Technology Stack</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <CardGlass key={feature.title} hover>
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-white">{feature.title}</h3>
                <Badge variant={feature.status === 'Live' ? 'default' : 'secondary'}>
                  {feature.status}
                </Badge>
              </div>
              <p className="text-slate-300 text-sm">{feature.description}</p>
            </CardGlass>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">Market Applications</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {useCases.map((useCase) => (
            <CardGlass key={useCase.title} gradient>
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-white">{useCase.title}</h3>
                <Badge variant={useCase.impact === 'High' ? 'default' : 'secondary'}>
                  {useCase.impact} Impact
                </Badge>
              </div>
              <p className="text-slate-300 text-sm">{useCase.description}</p>
            </CardGlass>
          ))}
        </div>
      </section>

      {/* Investment Highlights */}
      <CardGlass gradient className="text-center">
        <h3 className="text-xl font-semibold text-white mb-4">Investment Highlights</h3>
        
        <div className="grid md:grid-cols-3 gap-6 text-left">
          <div>
            <h4 className="font-semibold text-blue-400 mb-2">Novel Tokenomics</h4>
            <p className="text-sm text-slate-300">
              Grief Score Yield creates sustainable value through emotional truth resonance
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-green-400 mb-2">Real Utility</h4>
            <p className="text-sm text-slate-300">
              Live platform with authentic blockchain transactions and user adoption
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-purple-400 mb-2">Market Timing</h4>
            <p className="text-sm text-slate-300">
              Perfect intersection of AI verification, Web3 sovereignty, and truth preservation
            </p>
          </div>
        </div>
      </CardGlass>

      {/* Download Section */}
      <CardGlass className="text-center">
        <h3 className="text-xl font-semibold text-white mb-4">Complete Documentation</h3>
        
        <div className="space-y-4">
          <p className="text-slate-300">
            Access comprehensive technical documentation, tokenomics analysis, 
            and market research in our investor package.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/assets/pdf/GuardianChain_GrantKit.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GlowButton variant="primary">
                <Download className="w-4 h-4 mr-2" />
                Download Full Kit
              </GlowButton>
            </a>
            
            <GlowButton variant="secondary">
              <ExternalLink className="w-4 h-4 mr-2" />
              Schedule Demo Call
            </GlowButton>
          </div>
        </div>
      </CardGlass>
    </div>
  );
}