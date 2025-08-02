import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Coins, 
  TrendingUp, 
  ArrowRight,
  Zap,
  Star,
  Clock
} from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";

interface GriefTier {
  name: string;
  multiplier: string;
  estimatedYield: string;
  color: string;
}

export default function CalloutCTA() {
  const { isAuthenticated } = useAuth();

  const griefTiers: GriefTier[] = [
    { name: "Truth Seeker", multiplier: "1x", estimatedYield: "$25-50", color: "text-blue-400" },
    { name: "Memory Guardian", multiplier: "2x", estimatedYield: "$75-125", color: "text-green-400" },
    { name: "Veritas Holder", multiplier: "3x", estimatedYield: "$150-200", color: "text-purple-400" }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-green-600/10"></div>
      <div className="absolute inset-0 bg-[url('/assets/images/global-communication-bg.jpg')] bg-cover bg-center opacity-5"></div>
      
      <div className="relative container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Main CTA Header */}
          <div className="mb-12">
            <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-500/30 mb-4">
              <Star className="h-3 w-3 mr-1" />
              Launch Special: Triple GTT Rewards
            </Badge>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              Mint Your Truth Capsule
              <br />
              <span className="text-2xl md:text-4xl text-yellow-400">→ Earn $GTT</span>
            </h2>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Transform your memories into immutable digital assets. Each verified capsule generates GTT yield based on your GriefScore tier.
            </p>
          </div>

          {/* Yield Tiers Display */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {griefTiers.map((tier, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className={`text-2xl font-bold ${tier.color} mb-2`}>
                    {tier.multiplier}
                  </div>
                  <h3 className="font-semibold text-white mb-2">{tier.name}</h3>
                  <div className="text-3xl font-bold text-green-400 mb-1">
                    {tier.estimatedYield}
                  </div>
                  <p className="text-sm text-gray-400">Estimated Monthly Yield</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            {isAuthenticated ? (
              <>
                <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4">
                  <Link href="/create-truth-capsule">
                    <Shield className="h-5 w-5 mr-2" />
                    Create Truth Capsule
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-4">
                  <Link href="/yield">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    View Yield Dashboard
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4">
                  <Link href="/api/login">
                    <Zap className="h-5 w-5 mr-2" />
                    Start Earning GTT
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-4">
                  <Link href="/live-demo">
                    <Clock className="h-5 w-5 mr-2" />
                    Watch How It Works
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Social Proof */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-400 mb-1">25,847</div>
              <div className="text-sm text-gray-400">Truth Capsules</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400 mb-1">$2.4M</div>
              <div className="text-sm text-gray-400">GTT Distributed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400 mb-1">98.7%</div>
              <div className="text-sm text-gray-400">Verification Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400 mb-1">12,450</div>
              <div className="text-sm text-gray-400">Active Guardians</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}