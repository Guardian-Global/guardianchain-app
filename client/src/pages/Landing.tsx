import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, Coins, Award } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Landing() {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    window.location.href = '/dashboard';
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center space-y-8">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Veritas
          </h1>
          <p className="text-2xl text-gray-300 max-w-3xl mx-auto">
            Veritas Sealed. Truth Tokenized.
          </p>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Web3 truth verification platform for creating immutable truth capsules, 
            earning GTT rewards, and building a decentralized ecosystem of verified information.
          </p>
          
          {/* Login Button */}
          <div className="pt-8 space-y-4">
            <Button 
              size="lg"
              onClick={() => window.location.href = '/dashboard'}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
            >
              Enter Veritas Platform
            </Button>
            <div className="flex gap-2 justify-center">
              <Button 
                size="sm"
                onClick={() => window.location.href = '/dashboard'}
                className="bg-green-700 hover:bg-green-600 text-white px-4 py-2"
              >
                Simple Login Test
              </Button>
              <Button 
                size="sm"
                onClick={() => window.location.href = '/test-auth'}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2"
              >
                Advanced Test
              </Button>
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