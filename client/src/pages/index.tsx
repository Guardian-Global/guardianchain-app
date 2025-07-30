import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import VideoDisplay from "@/components/assets/VideoDisplay";
import LogoDisplay from "@/components/assets/LogoDisplay";
import ResponsiveLogoSuite from "@/components/assets/ResponsiveLogoSuite";
import { 
  Shield, 
  Zap, 
  Users, 
  Lock, 
  Globe, 
  Building, 
  TrendingUp, 
  Award,
  CheckCircle,
  ArrowRight,
  Star,
  Target,
  Database,
  Layers,
  Monitor,
  Smartphone
} from "lucide-react";

export default function Homepage() {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section with Animated Backgrounds */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900/30 to-green-900/30">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-10 right-10 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative container mx-auto px-4 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Mission Statement */}
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-600/20 border border-purple-500/30">
                  <Shield className="h-4 w-4 text-purple-400 mr-2" />
                  <span className="text-purple-300 text-sm font-semibold">Enterprise Truth Verification Protocol</span>
                </div>
                
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  <span className="text-white">Securing</span>
                  <br />
                  <span className="bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
                    Digital Truth
                  </span>
                  <br />
                  <span className="text-white">at Scale</span>
                </h1>
                
                <p className="text-xl lg:text-2xl text-slate-300 leading-relaxed max-w-2xl">
                  GUARDIANCHAIN revolutionizes enterprise truth verification through immutable blockchain technology, 
                  AI-powered validation, and community-driven consensus. Protecting $100B+ in digital assets globally.
                </p>
              </div>
              
              {/* Enterprise Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6">
                {[
                  { label: "Enterprise Clients", value: "500+" },
                  { label: "Truth Capsules", value: "2.5M+" },
                  { label: "Verified Claims", value: "$100B+" },
                  { label: "Global Reach", value: "150+" }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl lg:text-3xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-slate-400">{stat.label}</div>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg">
                  Start Enterprise Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="border-green-500 text-green-400 hover:bg-green-500/10 px-8 py-4 text-lg">
                  View Live Demo
                </Button>
              </div>

              {/* Responsive Logo Suite */}
              <div className="pt-8">
                <ResponsiveLogoSuite 
                  showVideo={false}
                  showStatic={true}
                  logoType="guardianchain"
                  className="justify-start"
                />
              </div>
            </div>

            {/* Right Visual Showcase */}
            <div className="space-y-8">
              {/* Logo Showcase */}
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300">
                <CardContent className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* GUARDIANCHAIN Video Logo */}
                    <div className="group relative overflow-hidden rounded-lg bg-slate-900/50 p-6 hover:bg-slate-900/80 transition-all duration-300">
                      <VideoDisplay 
                        type="guardianchain" 
                        size="lg" 
                        className="mx-auto rounded-lg shadow-2xl shadow-purple-500/20 transform group-hover:scale-110 transition-transform duration-500"
                        autoPlay={true}
                        loop={true}
                        muted={true}
                      />
                      <div className="mt-4 text-center">
                        <h4 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">GUARDIANCHAIN</h4>
                        <p className="text-sm text-slate-400">Enterprise Protocol</p>
                      </div>
                      <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-500/50 rounded-lg transition-all duration-300"></div>
                    </div>

                    {/* GTT Video Logo */}
                    <div className="group relative overflow-hidden rounded-lg bg-slate-900/50 p-6 hover:bg-slate-900/80 transition-all duration-300">
                      <VideoDisplay 
                        type="gtt" 
                        size="lg" 
                        className="mx-auto rounded-lg shadow-2xl shadow-green-500/20 transform group-hover:scale-110 transition-transform duration-500"
                        autoPlay={true}
                        loop={true}
                        muted={true}
                      />
                      <div className="mt-4 text-center">
                        <h4 className="text-lg font-semibold text-white group-hover:text-green-400 transition-colors">GTT TOKEN</h4>
                        <p className="text-sm text-slate-400">Guardian Truth Token</p>
                      </div>
                      <div className="absolute inset-0 border-2 border-transparent group-hover:border-green-500/50 rounded-lg transition-all duration-300"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Capabilities Section */}
      <section className="py-24 bg-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Enterprise-Grade Truth Infrastructure
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Built for Fortune 500 companies requiring immutable proof, regulatory compliance, 
              and billion-dollar asset protection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Immutable Blockchain Proof",
                description: "Military-grade cryptographic evidence that cannot be altered, deleted, or disputed",
                features: ["SHA-256 Encryption", "Polygon Network", "99.99% Uptime"]
              },
              {
                icon: Zap,
                title: "AI-Powered Verification",
                description: "Advanced machine learning algorithms for real-time fraud detection and content analysis",
                features: ["GPT-4 Integration", "Pattern Recognition", "Instant Validation"]
              },
              {
                icon: Users,
                title: "Community Consensus",
                description: "Decentralized validation network of verified experts and industry professionals",
                features: ["Expert Network", "Reputation Scoring", "Stake-Based Voting"]
              },
              {
                icon: Building,
                title: "Enterprise Compliance",
                description: "Full regulatory compliance for GDPR, SOX, HIPAA, and international data protection laws",
                features: ["Audit Trails", "Legal Framework", "Compliance Reports"]
              },
              {
                icon: Database,
                title: "Scalable Infrastructure",
                description: "Cloud-native architecture supporting millions of transactions with sub-second response times",
                features: ["Auto-Scaling", "Global CDN", "Enterprise APIs"]
              },
              {
                icon: Globe,
                title: "Global Truth Network",
                description: "Worldwide network of truth validators operating across 150+ countries and jurisdictions",
                features: ["24/7 Operations", "Multi-Language", "Cross-Border Verification"]
              }
            ].map((capability, index) => (
              <Card key={index} className="bg-slate-800/70 border-slate-700 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  <capability.icon className="h-16 w-16 text-purple-400 mx-auto mb-6 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-semibold text-white mb-4">{capability.title}</h3>
                  <p className="text-slate-300 mb-6">{capability.description}</p>
                  <div className="space-y-2">
                    {capability.features.map((feature, featIndex) => (
                      <div key={featIndex} className="flex items-center justify-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-sm text-slate-400">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-24 bg-gradient-to-r from-purple-900/20 to-green-900/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-600/20 border border-green-500/30">
                  <Target className="h-4 w-4 text-green-400 mr-2" />
                  <span className="text-green-300 text-sm font-semibold">Our Mission</span>
                </div>
                
                <h2 className="text-4xl lg:text-5xl font-bold text-white">
                  Protecting Digital Truth in the Age of AI
                </h2>
                
                <p className="text-xl text-slate-300 leading-relaxed">
                  In an era where deepfakes, AI-generated content, and digital manipulation threaten the 
                  foundation of trust, GUARDIANCHAIN provides the infrastructure to verify, validate, 
                  and protect authentic truth at global scale.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  "Combating $78B annual losses from digital fraud",
                  "Protecting intellectual property and brand integrity", 
                  "Enabling transparent governance and accountability",
                  "Building the infrastructure for Web3 truth verification"
                ].map((point, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Star className="h-5 w-5 text-purple-400 mt-1" />
                    <span className="text-slate-300">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              {/* Performance Metrics */}
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-8 space-y-6">
                  <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-purple-900/30 to-green-900/30 p-8">
                    <div className="flex justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 flex-col sm:flex-row">
                      <VideoDisplay 
                        type="guardianchain" 
                        size="md" 
                        className="rounded-lg shadow-xl shadow-purple-500/30 transform hover:scale-105 transition-all duration-500"
                        autoPlay={true}
                        loop={true}
                        muted={true}
                      />
                      <VideoDisplay 
                        type="gtt" 
                        size="md" 
                        className="rounded-lg shadow-xl shadow-green-500/30 transform hover:scale-105 transition-all duration-500"
                        autoPlay={true}
                        loop={true}
                        muted={true}
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-green-600/10 rounded-lg"></div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-slate-900/30 rounded-lg p-4">
                      <div className="text-2xl font-bold text-purple-400">99.9%</div>
                      <div className="text-xs text-slate-400">Accuracy Rate</div>
                    </div>
                    <div className="bg-slate-900/30 rounded-lg p-4">
                      <div className="text-2xl font-bold text-green-400">24/7</div>
                      <div className="text-xs text-slate-400">Global Operations</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* ROI Calculator */}
              <Card className="bg-gradient-to-br from-green-900/20 to-blue-900/20 border-green-500/20">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                    Enterprise ROI Calculator
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-slate-400">Annual Fraud Prevention</div>
                      <div className="text-2xl font-bold text-green-400">$10M+</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Implementation Cost</div>
                      <div className="text-2xl font-bold text-white">$250K</div>
                    </div>
                    <div className="md:col-span-2 pt-4 border-t border-slate-700">
                      <div className="text-slate-400">Annual ROI</div>
                      <div className="text-3xl font-bold text-purple-400">4,000%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise CTA Section */}
      <section className="py-24 bg-slate-900">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-bold text-white">
                Ready to Secure Your Enterprise Truth?
              </h2>
              <p className="text-xl text-slate-300">
                Join Fortune 500 companies already protecting their digital assets with 
                GUARDIANCHAIN's revolutionary truth verification infrastructure.
              </p>
            </div>

            {/* Enterprise Features Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8">
              {[
                { icon: Award, label: "Enterprise SLA", desc: "99.99% Uptime" },
                { icon: Lock, label: "Military Security", desc: "Zero Breaches" },
                { icon: Users, label: "24/7 Support", desc: "Dedicated Team" },
                { icon: Globe, label: "Global Scale", desc: "150+ Countries" }
              ].map((feature, index) => (
                <div key={index} className="text-center space-y-2">
                  <feature.icon className="h-8 w-8 text-purple-400 mx-auto" />
                  <div className="text-sm font-semibold text-white">{feature.label}</div>
                  <div className="text-xs text-slate-400">{feature.desc}</div>
                </div>
              ))}
            </div>

            {/* Brand Showcase */}
            <Card className="bg-gradient-to-br from-purple-900/20 to-green-900/20 border-purple-500/20">
              <CardContent className="p-8">
                <ResponsiveLogoSuite 
                  showVideo={true}
                  showStatic={true}
                  logoType="guardianchain"
                  className="mb-8"
                />
                <ResponsiveLogoSuite 
                  showVideo={true}
                  showStatic={true}
                  logoType="gtt"
                />
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700 text-white px-12 py-4 text-lg">
                Schedule Enterprise Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="border-purple-500 text-purple-400 hover:bg-purple-500/10 px-12 py-4 text-lg">
                Download Whitepaper
              </Button>
            </div>

            <div className="text-sm text-slate-500 pt-8">
              Trusted by 500+ enterprises • $100B+ in verified assets • 150+ countries served
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}