import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Shield, 
  Rocket,
  TrendingUp,
  Users,
  Globe,
  CheckCircle
} from "lucide-react";

export default function SimpleHome() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            GUARDIANCHAIN
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            The world's first blockchain-powered truth verification platform. 
            Secure your content, verify information, and earn GTT tokens.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-green-600 hover:opacity-90">
              <Rocket className="h-5 w-5 mr-2" />
              Get Started
            </Button>
            <Button variant="outline" size="lg" className="border-purple-500 text-purple-400 hover:bg-purple-500/10">
              View Token Launch
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-green-400">
                <TrendingUp className="h-5 w-5" />
                GTT Price
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">$0.0075</div>
              <div className="text-sm text-green-400">+19.05% (24h)</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <Users className="h-5 w-5" />
                Active Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">15,847</div>
              <div className="text-sm text-blue-400">Growing daily</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <Globe className="h-5 w-5" />
                Market Cap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">$18.75M</div>
              <div className="text-sm text-purple-400">Target: $75M</div>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-white">Truth Verification</CardTitle>
              <CardDescription className="text-slate-300">
                Blockchain-powered content verification with community consensus
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-green-600 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-white">GTT Rewards</CardTitle>
              <CardDescription className="text-slate-300">
                Earn tokens for creating verified content and accurate verification
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-yellow-600 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-white">Enterprise Ready</CardTitle>
              <CardDescription className="text-slate-300">
                Professional-grade platform with 99.9% uptime and enterprise features
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Status Badge */}
        <div className="text-center mt-12">
          <Badge className="bg-green-600 text-white px-6 py-2 text-lg">
            ✅ Platform 100% Operational
          </Badge>
          <p className="text-slate-400 mt-2">
            All systems running smoothly. Ready for mainnet launch.
          </p>
        </div>
      </div>
    </div>
  );
}