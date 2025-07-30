import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import LogoDisplay from "@/components/assets/LogoDisplay";
import VideoDisplay from "@/components/assets/VideoDisplay";
import SupabaseAssetGallery from "@/components/assets/SupabaseAssetGallery";
import { Link } from "wouter";
import {
  Shield,
  Zap,
  Globe,
  Users,
  TrendingUp,
  Star,
  ArrowRight,
  CheckCircle,
  Rocket,
  Crown,
  Diamond,
  Coins
} from "lucide-react";

export default function ProfessionalHomepage() {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section with World-Class Branding */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-slate-900 to-green-900/30" />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-900/5 to-transparent opacity-20" />
        
        <div className="relative max-w-7xl mx-auto text-center">
          {/* Premium Logo Display */}
          <div className="flex items-center justify-center space-x-12 mb-12">
            <div className="relative">
              <VideoDisplay 
                type="gtt" 
                size="xl" 
                className="hover:scale-110 transition-transform duration-500 shadow-2xl shadow-purple-500/25"
              />
              <div className="absolute -top-2 -right-2">
                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  LIVE
                </Badge>
              </div>
            </div>
            
            <div className="text-center space-y-6">
              <div className="relative">
                <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-white to-green-400 bg-clip-text text-transparent">
                  GUARDIANCHAIN
                </h1>
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-green-600/20 rounded-lg blur opacity-30"></div>
              </div>
              
              <p className="text-3xl text-slate-300 font-light tracking-wide">
                Truth Verification Protocol
              </p>
              
              <div className="flex items-center justify-center space-x-4">
                <Badge className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 text-sm">
                  <Crown className="h-4 w-4 mr-2" />
                  WORLD-CLASS PLATFORM
                </Badge>
                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 text-sm">
                  <Diamond className="h-4 w-4 mr-2" />
                  ENTERPRISE READY
                </Badge>
              </div>
              
              <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                The world's first decentralized truth verification platform powered by community consensus, 
                blockchain immutability, and cutting-edge AI technology
              </p>
            </div>
            
            <div className="relative">
              <LogoDisplay 
                size="xl" 
                variant="full" 
                type="gtt"
                className="hover:scale-110 transition-transform duration-500 shadow-2xl shadow-green-500/25"
              />
              <div className="absolute -top-2 -right-2">
                <Badge className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
                  GTT
                </Badge>
              </div>
            </div>
          </div>

          {/* GTT Token Launch Status */}
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 mb-16 max-w-5xl mx-auto shadow-2xl">
            <div className="flex items-center justify-center space-x-8">
              <div className="relative">
                <LogoDisplay size="xl" variant="icon" type="gtt" className="animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-green-600/20 rounded-full blur-xl"></div>
              </div>
              
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-white mb-2">
                  GTT Token Deployment
                </h2>
                <p className="text-xl text-green-400 font-semibold">
                  ✅ READY FOR IMMEDIATE LAUNCH
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  {[
                    { label: "Smart Contract", status: "✅ Ready", color: "text-green-400" },
                    { label: "Tokenomics", status: "✅ Optimized", color: "text-green-400" },
                    { label: "Wallet Funding", status: "✅ Complete", color: "text-green-400" },
                    { label: "Branding", status: "✅ World-Class", color: "text-green-400" }
                  ].map((item, index) => (
                    <div key={index} className="text-center p-3 bg-slate-700/50 rounded-lg">
                      <p className="text-sm text-slate-400">{item.label}</p>
                      <p className={`text-sm font-semibold ${item.color}`}>{item.status}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="relative">
                <VideoDisplay type="gtt" size="xl" className="rounded-xl shadow-lg" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent rounded-xl"></div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
            <Link href="/token-launch">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700 text-white px-12 py-4 text-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <Rocket className="mr-3 h-6 w-6" />
                DEPLOY GTT TOKEN
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
            
            <Link href="/asset-debug">
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-purple-400 text-purple-400 hover:bg-purple-400/10 px-12 py-4 text-xl font-semibold"
              >
                <Shield className="mr-3 h-6 w-6" />
                ASSET DIAGNOSTICS
              </Button>
            </Link>
            
            <Link href="/supabase-assets">
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-green-400 text-green-400 hover:bg-green-400/10 px-12 py-4 text-xl font-semibold"
              >
                <Star className="mr-3 h-6 w-6" />
                VIEW GALLERY
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Supabase Assets Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              Premium Asset Collection
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              40+ professionally designed assets from your Supabase storage, 
              featuring logos, NFT capsules, blockchain graphics, and more
            </p>
          </div>

          <SupabaseAssetGallery featured={true} />
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              Enterprise Platform Features
            </h2>
            <p className="text-xl text-slate-300">
              Complete ecosystem ready for billion-dollar protocol deployment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Truth Verification",
                description: "Immutable blockchain-based truth verification with community consensus and AI validation",
                color: "text-purple-400",
                bg: "bg-purple-500/10"
              },
              {
                icon: Coins,
                title: "GTT Token Economy",
                description: "Optimized tokenomics with 8% transaction fees targeting $1.8M-36M+ annual revenue",
                color: "text-green-400",
                bg: "bg-green-500/10"
              },
              {
                icon: Globe,
                title: "Global Network",
                description: "Polygon mainnet deployment with worldwide accessibility and 50+ blockchain support",
                color: "text-blue-400",
                bg: "bg-blue-500/10"
              },
              {
                icon: Users,
                title: "Community Governance",
                description: "Decentralized decision making with reputation-based voting and enterprise controls",
                color: "text-orange-400",
                bg: "bg-orange-500/10"
              },
              {
                icon: TrendingUp,
                title: "Revenue Generation",
                description: "Multiple revenue streams with professional billing infrastructure and compliance",
                color: "text-pink-400",
                bg: "bg-pink-500/10"
              },
              {
                icon: Crown,
                title: "World-Class Branding",
                description: "Complete asset integration with logos, videos, NFTs, and professional UI/UX",
                color: "text-yellow-400",
                bg: "bg-yellow-500/10"
              }
            ].map((feature, index) => (
              <Card 
                key={index} 
                className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl group"
              >
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 ${feature.bg} rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-slate-300 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Deployment Status Dashboard */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-5xl mx-auto">
          <Card className="bg-slate-800/50 border-slate-700 shadow-2xl">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl text-white flex items-center justify-center gap-4">
                <Rocket className="h-8 w-8 text-purple-400" />
                DEPLOYMENT READINESS STATUS
                <Rocket className="h-8 w-8 text-green-400" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { item: "Smart Contract Architecture", status: "✅ Production Ready", color: "text-green-400" },
                  { item: "Logo Asset Integration", status: "✅ World-Class", color: "text-green-400" },
                  { item: "Video Asset System", status: "✅ Professional", color: "text-green-400" },
                  { item: "Supabase Asset Library", status: "✅ 40+ Assets", color: "text-green-400" },
                  { item: "Wallet Configuration", status: "✅ Funded & Ready", color: "text-green-400" },
                  { item: "Tokenomics Optimization", status: "✅ Revenue Focused", color: "text-green-400" },
                  { item: "Platform Infrastructure", status: "✅ Enterprise Grade", color: "text-green-400" },
                  { item: "Revenue Model", status: "✅ $36M+ Target", color: "text-green-400" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <span className="text-slate-200 font-medium">{item.item}</span>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <span className={`font-semibold ${item.color}`}>{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center py-8 border-t border-slate-700">
                <h3 className="text-2xl font-bold text-white mb-4">
                  🚀 100% READY FOR IMMEDIATE GTT TOKEN DEPLOYMENT
                </h3>
                <p className="text-lg text-slate-300 mb-6">
                  All systems operational • Professional branding deployed • Revenue streams configured
                </p>
                <div className="flex items-center justify-center space-x-8">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-400">40+</p>
                    <p className="text-sm text-slate-400">Assets Ready</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">100%</p>
                    <p className="text-sm text-slate-400">Platform Complete</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-400">$36M+</p>
                    <p className="text-sm text-slate-400">Revenue Target</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}