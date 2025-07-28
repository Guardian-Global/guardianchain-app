import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Zap,
  Globe,
  TrendingUp,
  Coins,
  Users,
  Target,
  ArrowRight,
  CheckCircle,
  Star,
  Sparkles,
  Crown,
} from "lucide-react";
import { Link } from "wouter";
import { useGTTLiveData } from "@/lib/gttLiveData";

export default function GTTLaunch() {
  const { data: gttData, isLoading } = useGTTLiveData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section with Video Background */}
      <div className="relative overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-20"
          >
            <source src="/assets/logo-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-purple-900/80 to-slate-900/80" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 pt-20 pb-32">
          <div className="text-center max-w-6xl mx-auto">
            {/* GTT Logo */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <img
                  src="/assets/logo.png"
                  alt="GTT Token"
                  className="w-32 h-32 rounded-2xl shadow-2xl border-4 border-purple-500/30"
                />
                <div className="absolute -top-2 -right-2">
                  <Badge className="bg-green-500 text-white animate-pulse">
                    LIVE
                  </Badge>
                </div>
              </div>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-green-400 bg-clip-text text-transparent">
              GTT TOKEN
            </h1>

            <p className="text-2xl md:text-3xl font-semibold mb-4 bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
              GUARDIAN<span className="text-green-400">CHAIN</span> Truth Token
            </p>

            <p className="text-xl md:text-2xl text-slate-300 mb-12 leading-relaxed max-w-4xl mx-auto">
              The world's first enterprise-grade truth verification token.
              Secure your ideas, verify authenticity, and earn rewards on
              Polygon mainnet.
            </p>

            {/* Live Token Data */}
            {!isLoading && gttData && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
                <Card className="bg-slate-800/50 border-purple-500/30">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-400">
                      ${gttData.price || "TBD"}
                    </div>
                    <div className="text-sm text-slate-400">Price</div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-purple-500/30">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-400">
                      {gttData.change24h || "+0"}%
                    </div>
                    <div className="text-sm text-slate-400">24h Change</div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-purple-500/30">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      ${(gttData.marketCap || 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-slate-400">Market Cap</div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-purple-500/30">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-400">
                      137
                    </div>
                    <div className="text-sm text-slate-400">Polygon</div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-6 text-xl shadow-2xl"
                asChild
              >
                <Link href="/token-launch">
                  <Sparkles className="mr-3 h-6 w-6" />
                  Launch Platform
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-2 border-purple-500 text-purple-300 hover:bg-purple-500/20 px-12 py-6 text-xl"
                asChild
              >
                <Link href="/token-listings">
                  <Coins className="mr-3 h-6 w-6" />
                  View Token Data
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
            Revolutionary Truth Verification
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-gradient-to-br from-purple-900/50 to-slate-900/50 border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
              <CardHeader>
                <Shield className="h-12 w-12 text-purple-400 mb-4" />
                <CardTitle className="text-2xl text-white">
                  Immutable Truth
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Blockchain-secured verification ensuring your content remains
                  authentic and tamper-proof forever.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-to-br from-green-900/50 to-slate-900/50 border-green-500/30 hover:border-green-400/50 transition-all duration-300">
              <CardHeader>
                <Zap className="h-12 w-12 text-green-400 mb-4" />
                <CardTitle className="text-2xl text-white">
                  Instant Rewards
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Earn GTT tokens for creating verified content and
                  participating in truth consensus mechanisms.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-to-br from-blue-900/50 to-slate-900/50 border-blue-500/30 hover:border-blue-400/50 transition-all duration-300">
              <CardHeader>
                <Globe className="h-12 w-12 text-blue-400 mb-4" />
                <CardTitle className="text-2xl text-white">
                  Global Network
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Connect with truth-seekers worldwide on the most advanced
                  decentralized verification platform.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>

      {/* Token Economics */}
      <div className="py-20 bg-gradient-to-br from-slate-900 to-purple-900/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
              GTT Token Economics
            </h2>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-xl text-purple-400 flex items-center">
                    <Target className="mr-2 h-5 w-5" />
                    Total Supply
                  </CardTitle>
                  <CardDescription className="text-3xl font-bold text-white">
                    2.5 Billion GTT
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-slate-800/50 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-xl text-green-400 flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Utility Focus
                  </CardTitle>
                  <CardDescription className="text-3xl font-bold text-white">
                    100% Utility-Driven
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div className="text-left space-y-4 max-w-2xl mx-auto">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-slate-300">
                  Truth Capsule Creation & Verification
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-slate-300">
                  Staking Rewards up to 25% APY
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-slate-300">Governance Voting Rights</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-slate-300">Premium Platform Access</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="py-20 bg-slate-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">
            Ready to Join the Truth Revolution?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Be part of the first enterprise-grade blockchain protocol securing
            truth and authenticity worldwide.
          </p>

          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700 text-white px-12 py-6 text-xl shadow-2xl"
            asChild
          >
            <Link href="/create">
              <Crown className="mr-3 h-6 w-6" />
              Start Creating Truth Capsules
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
