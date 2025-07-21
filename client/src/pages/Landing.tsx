import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, Zap, Globe } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center">
              <Shield className="text-white h-10 w-10" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-green-400 bg-clip-text text-transparent">
            GUARDIAN<span className="text-green-400">CHAIN</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed">
            The world's first enterprise-grade blockchain protocol for truth verification and data sovereignty. 
            Secure your ideas before sharing them with the world.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg" asChild>
              <a href="/api/login">
                <Users className="mr-2 h-5 w-5" />
                Sign In with Replit
              </a>
            </Button>
            
            <Button variant="outline" size="lg" className="border-green-500 text-green-400 hover:bg-green-500/10 px-8 py-6 text-lg">
              Watch Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-4">
                <Shield className="text-white h-6 w-6" />
              </div>
              <CardTitle className="text-white">Truth Verification</CardTitle>
              <CardDescription className="text-slate-400">
                Immutable proof of your ideas and content before social media sharing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-slate-300 space-y-2">
                <li>• Blockchain-verified timestamps</li>
                <li>• Immutable content hashing</li>
                <li>• Legal admissibility</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-4">
                <Zap className="text-white h-6 w-6" />
              </div>
              <CardTitle className="text-white">GTT Token Economy</CardTitle>
              <CardDescription className="text-slate-400">
                Earn rewards for verified truth contributions and community participation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-slate-300 space-y-2">
                <li>• Truth yield rewards</li>
                <li>• Staking opportunities</li>
                <li>• Governance voting</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-4">
                <Globe className="text-white h-6 w-6" />
              </div>
              <CardTitle className="text-white">Enterprise Ready</CardTitle>
              <CardDescription className="text-slate-400">
                World-class infrastructure trusted by Fortune 500 companies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-slate-300 space-y-2">
                <li>• 99.9% uptime SLA</li>
                <li>• SOC2 compliant</li>
                <li>• Multi-chain support</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">Trusted by Global Leaders</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl font-bold text-purple-400 mb-2">$247.5K</div>
              <div className="text-slate-400">Treasury Balance</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400 mb-2">1.25M</div>
              <div className="text-slate-400">GTT Circulation</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">99.9%</div>
              <div className="text-slate-400">Uptime</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">77/100</div>
              <div className="text-slate-400">Compliance Score</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}