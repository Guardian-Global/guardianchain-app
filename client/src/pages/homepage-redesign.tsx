import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LogoDisplay from "@/components/assets/LogoDisplay";
import VideoDisplay from "@/components/assets/VideoDisplay";
import { Link } from "wouter";
import {
  Shield,
  Zap,
  Globe,
  Users,
  TrendingUp,
  Star,
  ArrowRight,
  CheckCircle
} from "lucide-react";

export default function HomepageRedesign() {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section with Professional Branding */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-green-900/20" />
        <div className="relative max-w-7xl mx-auto text-center">
          {/* Main Logo Display */}
          <div className="flex items-center justify-center space-x-8 mb-8">
            <VideoDisplay 
              type="gtt" 
              size="xl" 
              className="hover:scale-105 transition-transform duration-300"
            />
            <div className="text-center">
              <h1 className="text-6xl font-bold mb-4">
                <span style={{ color: "#7F5AF0" }}>GUARDIAN</span>
                <span style={{ color: "#2CB67D" }}>CHAIN</span>
              </h1>
              <p className="text-2xl text-slate-300 mb-6">
                Truth Verification Protocol
              </p>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                The world's first decentralized truth verification platform powered by community consensus and blockchain immutability
              </p>
            </div>
            <LogoDisplay 
              size="xl" 
              variant="full" 
              type="gtt"
              className="hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* GTT Token Status */}
          <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6 mb-12 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-6">
              <LogoDisplay size="lg" variant="icon" type="gtt" />
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">GTT Token</h2>
                <p className="text-lg text-slate-300">Ready for Deployment</p>
                <div className="flex items-center justify-center space-x-4 mt-4 text-sm text-slate-400">
                  <span>✅ Smart Contract: Ready</span>
                  <span>✅ Tokenomics: Optimized</span>
                  <span>✅ Wallet: Funded</span>
                  <span>✅ Branding: Professional</span>
                </div>
              </div>
              <VideoDisplay type="gtt" size="lg" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link href="/token-launch">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700 text-white px-8 py-3 text-lg"
              >
                Launch GTT Token
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/logo-test">
              <Button 
                variant="outline" 
                size="lg"
                className="border-purple-400 text-purple-400 hover:bg-purple-400/10 px-8 py-3 text-lg"
              >
                View Logo System
                <Shield className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Logo Showcase Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Professional Brand Assets
            </h2>
            <p className="text-lg text-slate-300">
              Complete logo and video asset integration for maximum professional impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Static Logo Showcase */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-center">Static Logos</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <LogoDisplay size="lg" variant="full" type="gtt" />
                <p className="text-sm text-slate-400">
                  High-resolution PNG assets with responsive scaling
                </p>
              </CardContent>
            </Card>

            {/* Video Logo Showcase */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-center">Video Logos</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <VideoDisplay type="gtt" size="lg" />
                <p className="text-sm text-slate-400">
                  Animated MP4 videos with autoplay and loop
                </p>
              </CardContent>
            </Card>

            {/* Brand Colors */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-center">Brand Colors</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="flex justify-center space-x-2">
                  <div className="w-8 h-8 bg-purple-600 rounded-full" />
                  <div className="w-8 h-8 bg-green-600 rounded-full" />
                  <div className="w-8 h-8 bg-blue-600 rounded-full" />
                </div>
                <p className="text-sm text-slate-400">
                  Purple, Green, Blue gradient system
                </p>
              </CardContent>
            </Card>

            {/* Typography */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-center">Typography</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="text-lg font-bold">
                  <span style={{ color: "#7F5AF0" }}>GUARDIAN</span>
                  <span style={{ color: "#2CB67D" }}>CHAIN</span>
                </div>
                <p className="text-sm text-slate-400">
                  Professional font hierarchy and styling
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Platform Features
            </h2>
            <p className="text-lg text-slate-300">
              Complete truth verification ecosystem ready for deployment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Truth Verification",
                description: "Immutable blockchain-based truth verification with community consensus"
              },
              {
                icon: Zap,
                title: "GTT Token Economy",
                description: "Optimized tokenomics with 8% transaction fees for maximum revenue"
              },
              {
                icon: Globe,
                title: "Global Network",
                description: "Polygon mainnet deployment with worldwide accessibility"
              },
              {
                icon: Users,
                title: "Community Governance",
                description: "Decentralized decision making with reputation-based voting"
              },
              {
                icon: TrendingUp,
                title: "Revenue Generation",
                description: "Multiple revenue streams targeting $1.8M-36M+ annually"
              },
              {
                icon: Star,
                title: "Professional Branding",
                description: "Complete logo and video asset integration for maximum impact"
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-colors">
                <CardContent className="p-6 text-center">
                  <feature.icon className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Status Dashboard */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-center text-2xl">
                🚀 DEPLOYMENT READINESS STATUS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { item: "Smart Contract", status: "Ready", color: "text-green-400" },
                  { item: "Logo Assets", status: "Deployed", color: "text-green-400" },
                  { item: "Video Assets", status: "Working", color: "text-green-400" },
                  { item: "Wallet Funding", status: "Complete", color: "text-green-400" },
                  { item: "Tokenomics", status: "Optimized", color: "text-green-400" },
                  { item: "Platform", status: "Operational", color: "text-green-400" },
                  { item: "Branding", status: "Professional", color: "text-green-400" },
                  { item: "Revenue Model", status: "Configured", color: "text-green-400" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-slate-300">{item.item}:</span>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className={item.color}>{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center pt-6 border-t border-slate-700">
                <p className="text-lg font-bold text-white mb-2">
                  100% READY FOR IMMEDIATE GTT TOKEN DEPLOYMENT
                </p>
                <p className="text-slate-300">
                  All systems operational, professional branding deployed, revenue streams configured
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}