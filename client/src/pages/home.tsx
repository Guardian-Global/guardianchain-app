import { useQuery } from "@tanstack/react-query";
import {
  Shield,
  Plus,
  Play,
  Star,
  User,
  Coins,
  Check,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CapsuleCard from "@/components/capsule/capsule-card";
import ExplainerVideo from "@/components/ExplainerVideo";
import { Link } from "wouter";

export default function Home() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  const { data: featuredCapsules, isLoading: capsulesLoading } = useQuery({
    queryKey: ["/api/capsules/featured"],
  });

  const { data: topUsers, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/leaderboard", "3"],
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl animate-pulse-slow"></div>
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full filter blur-3xl animate-pulse-slow"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span style={{ color: "#7F5AF0" }}>GUARDIAN</span>
              <span style={{ color: "#2CB67D" }}>CHAIN</span>
              <br />
              <span className="gradient-text">Truth, Verified Forever.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Create immutable truth capsules, earn rewards for accuracy, and
              build reputation in the world's first Web3 truth verification
              ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link href="/create">
                <Button
                  size="lg"
                  className="gradient-primary hover:from-primary/90 hover:to-secondary/90 px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Create Capsule
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="border-slate-600 hover:border-slate-400 px-8 py-4 text-lg font-semibold hover:bg-slate-800 transition-all duration-200"
                onClick={() =>
                  document
                    .getElementById("explainer-video")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 animate-slide-up">
            <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary">
                  {statsLoading
                    ? "..."
                    : stats?.totalCapsules?.toLocaleString() || "0"}
                </div>
                <div className="text-slate-400 mt-1">Truth Capsules</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-emerald-400">
                  {statsLoading
                    ? "..."
                    : stats?.verifiedTruths?.toLocaleString() || "0"}
                </div>
                <div className="text-slate-400 mt-1">Verified</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-amber-400">
                  {statsLoading ? "..." : `$${stats?.totalRewards || "0"}`}
                </div>
                <div className="text-slate-400 mt-1">Rewards Paid</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-secondary">
                  {statsLoading
                    ? "..."
                    : stats?.activeUsers?.toLocaleString() || "0"}
                </div>
                <div className="text-slate-400 mt-1">Active Users</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Explainer Video Section */}
      <section id="explainer-video" className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
              See GuardianChain in Action
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Watch how truth capsules are created, verified, and sealed into
              immutable digital proof using blockchain technology.
            </p>
          </div>
          <ExplainerVideo />
        </div>
      </section>

      {/* Featured Capsules */}
      <section className="py-20 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Featured Capsules
              </h2>
              <p className="text-slate-400 text-lg">
                Trending truth capsules with high verification scores
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="default" size="sm">
                Trending
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-slate-600 hover:border-slate-400"
              >
                Recent
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-slate-600 hover:border-slate-400"
              >
                Verified
              </Button>
            </div>
          </div>

          {capsulesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="h-48 bg-slate-700 rounded-lg mb-4"></div>
                      <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCapsules?.length ? (
                featuredCapsules.map((capsule) => (
                  <CapsuleCard key={capsule.id} capsule={capsule} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-slate-400 text-lg">
                    No featured capsules available yet.
                  </div>
                  <Link href="/create">
                    <Button className="mt-4 gradient-primary">
                      <Plus className="mr-2 h-4 w-4" />
                      Create the First Capsule
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How Veritas Works
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              A decentralized ecosystem where truth is rewarded and
              misinformation is penalized through blockchain verification
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Plus className="text-white h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Create Capsule</h3>
              <p className="text-slate-400 leading-relaxed">
                Submit claims, predictions, or statements with supporting
                evidence. Include multimedia, documents, and references to
                strengthen your capsule.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="text-white h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Community Verification
              </h3>
              <p className="text-slate-400 leading-relaxed">
                The community reviews and verifies your capsule using our
                Grief-Score algorithm. DocuSign integration provides additional
                verification seals.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Coins className="text-white h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Earn Rewards</h3>
              <p className="text-slate-400 leading-relaxed">
                Verified capsules earn GTT tokens through TruthYield. Build
                reputation and climb the leaderboard while contributing to
                global truth verification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Token Economics */}
      <section className="py-20 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              GTT Token Economics
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Governance Truth Token (GTT) powers the ecosystem with sustainable
              tokenomics and real utility
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-gradient-to-br from-amber-900/20 to-amber-800/20 border-amber-700/50">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-amber-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Coins className="text-white h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-amber-400">
                  TruthYield
                </h3>
                <p className="text-slate-300 text-sm">
                  Earn ongoing rewards from verified capsules through our
                  replay-based yield system
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-900/20 to-emerald-800/20 border-emerald-700/50">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="text-white h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-emerald-400">
                  Governance
                </h3>
                <p className="text-slate-300 text-sm">
                  Vote on protocol upgrades, dispute resolutions, and ecosystem
                  improvements
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/20 to-primary/10 border-primary/50">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Star className="text-white h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-primary">
                  Staking
                </h3>
                <p className="text-slate-300 text-sm">
                  Stake GTT to increase your verification power and earn
                  additional rewards
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border-purple-700/50">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Plus className="text-white h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-purple-400">
                  Premium
                </h3>
                <p className="text-slate-300 text-sm">
                  Access premium features, advanced analytics, and exclusive
                  verification tools
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
