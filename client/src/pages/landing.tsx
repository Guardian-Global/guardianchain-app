import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Zap, 
  Globe, 
  Lock, 
  TrendingUp, 
  Users, 
  Coins, 
  Vote,
  ChevronRight,
  Play,
  Star,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [gttPrice, setGttPrice] = useState(0.045);

  useEffect(() => {
    const interval = setInterval(() => {
      setGttPrice(prev => prev + (Math.random() - 0.5) * 0.002);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Shield,
      title: "Truth Verification",
      description: "AI-powered content verification with immutable blockchain sealing",
      highlight: "99.7% accuracy"
    },
    {
      icon: Lock,
      title: "Time-Locked Proof",
      description: "Sovereign memory infrastructure with cryptographic time-release",
      highlight: "Forever sealed"
    },
    {
      icon: Vote,
      title: "DAO Governance",
      description: "Community-driven decision making with GTT token weighted voting",
      highlight: "Decentralized"
    },
    {
      icon: Coins,
      title: "Yield Generation",
      description: "Earn GTT rewards through engagement and content verification",
      highlight: "12.8% APY"
    }
  ];

  const stats = [
    { label: "Capsules Created", value: "45,628", growth: "+34%" },
    { label: "GTT Staked", value: "2.8M", growth: "+67%" },
    { label: "Active Guardians", value: "12,847", growth: "+45%" },
    { label: "Platform TVL", value: "$8.4M", growth: "+89%" }
  ];

  const useCases = [
    {
      title: "Personal Legacy",
      description: "Preserve family memories and important moments forever",
      icon: "👨‍👩‍👧‍👦"
    },
    {
      title: "Legal Evidence",
      description: "Immutable documentation for legal proceedings",
      icon: "⚖️"
    },
    {
      title: "Research Data",
      description: "Academic verification and peer review systems",
      icon: "🔬"
    },
    {
      title: "Corporate Compliance",
      description: "Enterprise-grade audit trails and compliance",
      icon: "🏢"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-hsl(218,54%,9%) via-hsl(220,39%,11%) to-hsl(222,47%,11%) text-hsl(180,100%,90%)">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00ffe1]/10 via-transparent to-[#ff00d4]/10" />
        
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="bg-gradient-to-r from-[#00ffe1] to-[#ff00d4] text-black font-semibold mb-4">
                Phase 3 Launch Ready • Production Deployed
              </Badge>
              
              <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-[#00ffe1] via-[#ff00d4] to-[#7c3aed] bg-clip-text text-transparent leading-tight">
                GuardianChain
              </h1>
              
              <p className="text-2xl md:text-3xl text-hsl(180,100%,70%) max-w-4xl mx-auto leading-relaxed">
                The First <span className="text-[#00ffe1] font-semibold">Sovereign Memory Network</span> for 
                Truth Verification and Decentralized Governance
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button 
                size="lg"
                className="bg-gradient-to-r from-[#00ffe1] to-[#ff00d4] hover:opacity-90 text-black font-semibold px-8 py-4 text-lg"
                onClick={() => window.open('/profile', '_blank')}
              >
                <Play className="w-5 h-5 mr-2" />
                Mint Your First Capsule
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                className="border-[#ff00d4] text-[#ff00d4] hover:bg-[#ff00d4]/10 px-8 py-4 text-lg"
                onClick={() => window.open('/demo', '_blank')}
              >
                <Globe className="w-5 h-5 mr-2" />
                View Live Demo
              </Button>
            </motion.div>

            {/* Live Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-16"
            >
              {stats.map((stat, index) => (
                <Card key={index} className="bg-hsl(217,33%,17%)/30 border-hsl(217,33%,24%) backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-[#00ffe1]">{stat.value}</div>
                    <div className="text-sm text-hsl(180,100%,70%)">{stat.label}</div>
                    <div className="text-xs text-green-400 flex items-center justify-center mt-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {stat.growth}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-hsl(220,39%,11%)/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#00ffe1] mb-4">
              Revolutionary Features
            </h2>
            <p className="text-xl text-hsl(180,100%,70%) max-w-3xl mx-auto">
              Advanced technology stack powering the future of digital memory and truth verification
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <Card className="bg-hsl(217,33%,17%)/50 border-hsl(217,33%,24%) hover:border-[#00ffe1]/50 transition-all duration-300 h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <feature.icon className="w-8 h-8 text-[#ff00d4] group-hover:text-[#00ffe1] transition-colors" />
                      <Badge variant="secondary" className="bg-[#7c3aed]/20 text-[#7c3aed]">
                        {feature.highlight}
                      </Badge>
                    </div>
                    <CardTitle className="text-[#00ffe1] group-hover:text-[#ff00d4] transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-hsl(180,100%,70%)">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#ff00d4] mb-4">
              Real-World Applications
            </h2>
            <p className="text-xl text-hsl(180,100%,70%) max-w-3xl mx-auto">
              From personal memories to enterprise compliance, GuardianChain serves every truth preservation need
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-gradient-to-br from-hsl(217,33%,17%)/50 to-hsl(220,39%,11%)/50 border-hsl(217,33%,24%) hover:border-[#ff00d4]/50 transition-all duration-300 h-full text-center">
                  <CardHeader>
                    <div className="text-4xl mb-4">{useCase.icon}</div>
                    <CardTitle className="text-[#ff00d4]">{useCase.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-hsl(180,100%,70%)">{useCase.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GTT Token Section */}
      <section className="py-20 bg-hsl(220,39%,11%)/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-[#7c3aed] mb-8">
              GTT Token Economics
            </h2>
            
            <div className="bg-gradient-to-r from-hsl(217,33%,17%)/50 to-hsl(220,39%,11%)/50 border border-hsl(217,33%,24%) rounded-2xl p-8 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#00ffe1] mb-2">
                    ${gttPrice.toFixed(3)}
                  </div>
                  <div className="text-hsl(180,100%,70%)">Current GTT Price</div>
                  <div className="text-green-400 text-sm mt-1 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +34.2% this month
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#ff00d4] mb-2">12.8%</div>
                  <div className="text-hsl(180,100%,70%)">Staking APY</div>
                  <div className="text-[#7c3aed] text-sm mt-1">Dynamic yield</div>
                </div>
                
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#7c3aed] mb-2">2.8M</div>
                  <div className="text-hsl(180,100%,70%)">GTT Staked</div>
                  <div className="text-green-400 text-sm mt-1">67% of supply</div>
                </div>
              </div>
              
              <div className="mt-8">
                <Button 
                  className="bg-gradient-to-r from-[#7c3aed] to-[#ff00d4] hover:opacity-90 text-white font-semibold px-8 py-3"
                  onClick={() => window.open('/vault/stake', '_blank')}
                >
                  <Coins className="w-5 h-5 mr-2" />
                  Start Staking GTT
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#00ffe1] to-[#ff00d4] bg-clip-text text-transparent mb-8">
            Join the Memory Revolution
          </h2>
          <p className="text-xl text-hsl(180,100%,70%) mb-12 max-w-2xl mx-auto">
            Be part of the first sovereign network for truth preservation. Create your legacy today.
          </p>
          
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-[#00ffe1] to-[#ff00d4] hover:opacity-90 text-black font-semibold px-8 py-4 text-lg"
                onClick={() => window.open('/', '_blank')}
              >
                <Users className="w-5 h-5 mr-2" />
                Start Creating Capsules
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                className="border-[#7c3aed] text-[#7c3aed] hover:bg-[#7c3aed]/10 px-8 py-4 text-lg"
                onClick={() => window.open('/whitepaper', '_blank')}
              >
                <Star className="w-5 h-5 mr-2" />
                Read Whitepaper
              </Button>
            </div>
            
            <div className="text-sm text-hsl(180,100%,70%) space-x-4">
              <a href="/demo" className="hover:text-[#00ffe1] transition-colors">Live Demo</a>
              <span>•</span>
              <a href="/docs" className="hover:text-[#00ffe1] transition-colors">Documentation</a>
              <span>•</span>
              <a href="/valuation" className="hover:text-[#00ffe1] transition-colors">Platform Metrics</a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-hsl(217,33%,17%) bg-hsl(220,39%,11%)/30">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-[#00ffe1] font-bold text-xl mb-4">GuardianChain</div>
          <p className="text-hsl(180,100%,70%) mb-4">
            Sovereign Memory Infrastructure • Truth Verification • Decentralized Governance
          </p>
          <div className="text-sm text-hsl(180,100%,60%)">
            © 2025 GuardianChain. All rights reserved. • Built on Base Network
          </div>
        </div>
      </footer>
    </div>
  );
}