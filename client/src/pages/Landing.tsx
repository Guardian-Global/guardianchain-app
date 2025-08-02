import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, Coins, Award, Brain, Lock, FileText, Zap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  
  if (isAuthenticated) {
    window.location.href = '/dashboard';
    return null;
  }

  useEffect(() => {
    // Preload video
    const video = document.createElement('video');
    video.src = '/assets/video/GUARDIANCHAIN_LOGO_VIDEO.mp4';
    video.onloadedmetadata = () => setIsVideoLoaded(true);
  }, []);
  
  return (
    <div className="min-h-screen relative overflow-hidden text-white">
      {/* Aurora Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-slate-900 to-indigo-900">
        <div className="absolute inset-0 bg-[url('/assets/images/global-communication-bg.jpg')] opacity-20 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
        
        {/* Animated Aurora Effect */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse delay-1000" />
        </div>
      </div>

      {/* Hero Video Background */}
      {isVideoLoaded && (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          poster="/assets/images/blockchain-image-bg.png"
        >
          <source src="/assets/video/GUARDIANCHAIN_LOGO_VIDEO.mp4" type="video/mp4" />
        </video>
      )}

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation Header */}
        <header className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="/assets/logo/GUARDIANCHAIN_logo.png" 
                alt="GuardianChain" 
                className="h-10 w-auto"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                GuardianChain
              </span>
            </div>
            <Button 
              onClick={() => window.location.href = '/dashboard'}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Launch Platform
            </Button>
          </div>
        </header>

        {/* Hero Section */}
        <div className="container mx-auto px-4 py-20">
          <div className="text-center space-y-8 max-w-5xl mx-auto">
            <div className="space-y-4">
              <h1 className="text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent">
                  Veritas Sealed.
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Truth Tokenized.
                </span>
              </h1>
              
              <p className="text-xl text-gray-200 max-w-3xl mx-auto font-medium">
                Your truth. Forever verified. GuardianChain is the AI-powered sovereign memory protocol for digital immortality.
              </p>
            </div>
            
            {/* Highlights */}
            <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Lock className="h-4 w-4 text-blue-400" />
                <span>Immutable Truth Capsules</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <FileText className="h-4 w-4 text-purple-400" />
                <span>Veritas-Proof Authorship</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Brain className="h-4 w-4 text-green-400" />
                <span>GPT-4 Assisted Creation</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Zap className="h-4 w-4 text-yellow-400" />
                <span>Validator Yield System</span>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="pt-8 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  onClick={() => window.location.href = '/create-truth-capsule'}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
                >
                  Launch Your Capsule
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => window.location.href = '/vault'}
                  className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold backdrop-blur-sm"
                >
                  Browse Truth Vault
                </Button>
              </div>
              
              {/* Quick Login for Testing */}
              <div className="flex gap-2 justify-center pt-4">
                <Button 
                  size="sm"
                  onClick={() => window.location.href = '/dashboard'}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2"
                >
                  Quick Access
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <Shield className="h-12 w-12 text-blue-400 mb-4" />
              <CardTitle className="text-white">Truth Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-400">
                Create immutable truth capsules with blockchain verification and community governance.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <Users className="h-12 w-12 text-purple-400 mb-4" />
              <CardTitle className="text-white">Community Driven</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-400">
                Join validators, jurors, and truth seekers in building a decentralized verification network.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <Coins className="h-12 w-12 text-green-400 mb-4" />
              <CardTitle className="text-white">GTT Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-400">
                Earn GTT tokens for verifying truth, staking, and contributing to the ecosystem.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <Award className="h-12 w-12 text-yellow-400 mb-4" />
              <CardTitle className="text-white">Tier System</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-400">
                Progress through Explorer, Seeker, Creator, and Sovereign tiers with enhanced privileges.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-20 space-y-4">
          <h2 className="text-3xl font-bold text-white">Ready to Join the Truth Revolution?</h2>
          <p className="text-gray-400 text-lg">
            Stop paying monthly fees for data you don't own. Get permanent IPFS + blockchain storage.
          </p>
          <Button 
            size="lg"
            onClick={() => window.location.href = '/api/login'}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4 text-lg"
          >
            Get Started Now
          </Button>
        </div>
      </div>
    </div>
  );
}