import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Globe,
  ArrowRight,
  Play,
  Activity,
  TrendingUp,
  Star,
} from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";

export default function HeroSection() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <img
            src="/assets/logo/GUARDIANCHAIN_logo.png"
            alt="GuardianChain"
            className="h-20 w-auto"
          />
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
          Veritas Sealed.
          <br />
          Truth Tokenized.
        </h1>

        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
          The sovereign truth verification platform where your memories become
          immutable digital assets, verified by the community and rewarded
          through GTT tokenomics.
        </p>

        <div className="flex items-center justify-center gap-4 mb-8">
          <Badge className="bg-green-600/20 text-green-400 border-green-500/30">
            <Activity className="h-3 w-3 mr-1" />
            Live Network
          </Badge>
          <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30">
            <TrendingUp className="h-3 w-3 mr-1" />
            V1.0.0 Launch
          </Badge>
          <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/30">
            <Star className="h-3 w-3 mr-1" />
            Institutional Ready
          </Badge>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {isAuthenticated ? (
            <>
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Link href="/create-truth-capsule">
                  <Shield className="h-5 w-5 mr-2" />
                  Create Truth Capsule
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Link href="/truth-vault">
                  <Globe className="h-5 w-5 mr-2" />
                  Explore Vault
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Link href="/api/login">
                  Get Started
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Link href="/live-demo">
                  <Play className="h-5 w-5 mr-2" />
                  Watch Demo
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
