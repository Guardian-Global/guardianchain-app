import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, Users, TrendingUp, Zap, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function MobileHome() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
              GUARDIANCHAIN
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              The world's first decentralized truth verification platform.
              Protect your digital sovereignty and earn rewards for verifying
              truth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700 w-full sm:w-auto"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/explore">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10 w-full sm:w-auto"
                >
                  Explore Platform
                </Button>
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <Shield className="h-8 w-8 text-purple-400 mb-2" />
                <CardTitle className="text-lg">Truth Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Immutable truth capsules with community verification and
                  blockchain proof
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <TrendingUp className="h-8 w-8 text-green-400 mb-2" />
                <CardTitle className="text-lg">GTT Rewards</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Earn GTT tokens for creating verified content and
                  participating in governance
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <Users className="h-8 w-8 text-blue-400 mb-2" />
                <CardTitle className="text-lg">Community</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Join thousands of truth guardians protecting digital integrity
                  worldwide
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <Zap className="h-8 w-8 text-yellow-400 mb-2" />
                <CardTitle className="text-lg">Enterprise</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Professional tools for organizations requiring verified
                  information workflows
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Stats Section */}
          <div className="bg-slate-800/30 rounded-xl p-6 sm:p-8 mb-12">
            <h2 className="text-2xl font-bold text-center mb-8 text-white">
              Platform Statistics
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-purple-400">
                  50K+
                </div>
                <div className="text-sm text-slate-400">Truth Capsules</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-green-400">
                  25K+
                </div>
                <div className="text-sm text-slate-400">Verified Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-400">
                  1M+
                </div>
                <div className="text-sm text-slate-400">GTT Distributed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-yellow-400">
                  99.9%
                </div>
                <div className="text-sm text-slate-400">Accuracy Rate</div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white">
              Ready to Start Verifying Truth?
            </h2>
            <p className="text-slate-300 mb-6 max-w-xl mx-auto">
              Join the revolution in digital truth verification. Create your
              account and start earning GTT tokens today.
            </p>
            <Link href="/login">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700"
              >
                Create Free Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated user home
  return (
    <div className="min-h-screen bg-slate-900 pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-white">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-slate-400">Your GUARDIANCHAIN dashboard</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Link href="/create">
            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-purple-400" />
                  Create Capsule
                </CardTitle>
                <CardDescription>
                  Create a new truth capsule and earn GTT rewards
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/explore">
            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
                  Explore
                </CardTitle>
                <CardDescription>
                  Discover and verify truth capsules from the community
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/profile">
            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-400" />
                  Profile
                </CardTitle>
                <CardDescription>
                  View your stats, achievements, and GTT balance
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* User Stats */}
        <Card className="bg-slate-800/30 border-slate-700">
          <CardHeader>
            <CardTitle>Your GUARDIANCHAIN Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-purple-400">
                  {user?.gttBalance || "0"}
                </div>
                <div className="text-sm text-slate-400">GTT Balance</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-400">
                  {user?.totalCapsules || 0}
                </div>
                <div className="text-sm text-slate-400">Capsules Created</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-blue-400">
                  {user?.reputation || 0}
                </div>
                <div className="text-sm text-slate-400">Reputation</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-yellow-400">
                  {user?.userTier || "Explorer"}
                </div>
                <div className="text-sm text-slate-400">Current Tier</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
