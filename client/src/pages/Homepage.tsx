import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Coins, 
  TrendingUp, 
  Users, 
  Zap,
  Play,
  Star,
  Crown
} from "lucide-react";
import { Link } from "wouter";
import GuardianAssistant from "@/components/ai/GuardianAssistant";
import HeroSection from "@/components/homepage/HeroSection";
import LiveStats from "@/components/homepage/LiveStats";

export default function Homepage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 text-white">
      {/* Hero Section */}
      <HeroSection />

        <div className="container mx-auto px-4">
        {/* Video Preview */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="bg-slate-800/50 border-slate-700/50 overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                  <Play className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                  <p className="text-xl font-semibold mb-2">GuardianChain Platform Overview</p>
                  <p className="text-gray-400">See how truth verification works</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Features */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <Card className="bg-gradient-to-br from-slate-800/50 to-blue-900/20 border-slate-700/50 text-center">
            <CardHeader>
              <Shield className="h-8 w-8 text-blue-400 mx-auto" />
              <CardTitle className="text-lg">Truth Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">Community-driven verification with blockchain immutability</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-green-900/20 border-slate-700/50 text-center">
            <CardHeader>
              <Coins className="h-8 w-8 text-green-400 mx-auto" />
              <CardTitle className="text-lg">GTT Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">Earn tokens for verifying truth and creating quality content</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-purple-900/20 border-slate-700/50 text-center">
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-purple-400 mx-auto" />
              <CardTitle className="text-lg">Yield Staking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">Stake GTT tokens for passive income and tier progression</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-yellow-900/20 border-slate-700/50 text-center">
            <CardHeader>
              <Users className="h-8 w-8 text-yellow-400 mx-auto" />
              <CardTitle className="text-lg">Global Network</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">Join thousands of guardians preserving digital truth</p>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">25,847</div>
            <div className="text-gray-400">Truth Capsules</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">12,450</div>
            <div className="text-gray-400">Active Guardians</div>
          </div>
          <div className="text-3xl font-bold text-purple-400 mb-2">98.7%</div>
            <div className="text-gray-400">Verification Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">$2.4M</div>
            <div className="text-gray-400">GTT Distributed</div>
          </div>
        </div>

        {/* AI Assistant Preview for Authenticated Users */}
        {isAuthenticated && (
          <div className="max-w-2xl mx-auto mb-16">
            <GuardianAssistant context="dashboard" />
          </div>
        )}

        {/* Verification Levels */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Verification Levels</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-slate-800/50 border-blue-500/30">
              <CardHeader className="text-center">
                <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30 mx-auto mb-2">Standard</Badge>
                <CardTitle>Community Verified</CardTitle>
                <CardDescription>Peer-reviewed by guardian network</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Community consensus verification</li>
                  <li>• Basic truth score rating</li>
                  <li>• Public visibility</li>
                  <li>• Standard GTT rewards</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-green-500/30">
              <CardHeader className="text-center">
                <Badge className="bg-green-600/20 text-green-400 border-green-500/30 mx-auto mb-2">Verified</Badge>
                <CardTitle>Professional Grade</CardTitle>
                <CardDescription>Expert validator authentication</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Professional validator review</li>
                  <li>• Enhanced truth metrics</li>
                  <li>• Priority discovery</li>
                  <li>• 1.5x GTT rewards</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-yellow-500/30">
              <CardHeader className="text-center">
                <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-500/30 mx-auto mb-2">Veritas Sealed</Badge>
                <CardTitle>Ultimate Truth</CardTitle>
                <CardDescription>Highest level guarantee</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Multi-layer verification</li>
                  <li>• Immutable truth guarantee</li>
                  <li>• Premium positioning</li>
                  <li>• 3x GTT rewards</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Preserve Truth Forever?</h3>
              <p className="text-gray-300 mb-6">
                Join the revolutionary platform where your truth matters, your voice is heard, and your contributions are rewarded.
              </p>
              
              {isAuthenticated ? (
                <div className="flex gap-4 justify-center">
                  <Button asChild className="bg-blue-600 hover:bg-blue-700">
                    <Link href="/create-truth-capsule">Create Your First Capsule</Link>
                  </Button>
                  <Button asChild variant="outline" className="border-purple-500/30 text-purple-400 hover:bg-purple-600/20">
                    <Link href="/dashboard">Go to Dashboard</Link>
                  </Button>
                </div>
              ) : (
                <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600">
                  <Link href="/api/login">
                    <Zap className="h-5 w-5 mr-2" />
                    Start Your Journey
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
