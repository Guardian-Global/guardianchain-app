import { useQuery } from "@tanstack/react-query";
import { Shield, FileText, Users, TrendingUp, ArrowRight, Star, Lock, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Vault() {
  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  const { data: recentCapsules } = useQuery({
    queryKey: ["/api/capsules/public"],
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Truth Verification
            </span>
            <br />
            <span className="text-white">That Pays You</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Create truth capsules, verify claims, earn GTT tokens. Join the blockchain revolution for authentic information.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4"
              onClick={() => window.location.href = '/api/login'}
            >
              Start Earning GTT
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-4"
              onClick={() => window.location.href = '/pricing'}
            >
              View Pricing Plans
            </Button>
          </div>

          {/* Live Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">
                {stats?.totalCapsules?.toLocaleString() || "2,847"}
              </div>
              <div className="text-slate-400">Truth Capsules</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">
                {stats?.verifiedTruths?.toLocaleString() || "1,923"}
              </div>
              <div className="text-slate-400">Verified</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">
                ${stats?.totalRewards?.toLocaleString() || "45,672"}
              </div>
              <div className="text-slate-400">Rewards Paid</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">
                {stats?.activeUsers?.toLocaleString() || "12,439"}
              </div>
              <div className="text-slate-400">Active Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* Revenue Opportunities */}
      <section className="py-16 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Multiple Ways to Earn
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-slate-800 border-slate-700 hover:border-blue-500 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-400" />
                  Create Truth Capsules
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 mb-4">
                  Submit verified claims and earn ongoing GTT rewards through TruthYield when your capsules get validated.
                </p>
                <div className="text-2xl font-bold text-green-400 mb-2">
                  Up to 50 GTT
                </div>
                <p className="text-sm text-slate-400">Per verified capsule</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700 hover:border-purple-500 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-400" />
                  Verify Others
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 mb-4">
                  Review and verify truth capsules from the community. Build reputation and earn verification rewards.
                </p>
                <div className="text-2xl font-bold text-green-400 mb-2">
                  5-25 GTT
                </div>
                <p className="text-sm text-slate-400">Per verification task</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700 hover:border-yellow-500 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-yellow-400" />
                  Stake & Govern
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 mb-4">
                  Stake GTT tokens to participate in governance decisions and earn staking rewards.
                </p>
                <div className="text-2xl font-bold text-green-400 mb-2">
                  12% APY
                </div>
                <p className="text-sm text-slate-400">Annual staking rewards</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Subscription Tiers */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Choose Your Access Level
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Tier */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Users className="h-5 w-5 text-gray-400" />
                  Explorer
                </CardTitle>
                <div className="text-3xl font-bold text-white">Free</div>
                <p className="text-slate-400">Get started with basic access</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-slate-300">View public truth capsules</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-slate-300">Basic verification participation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-slate-300">Earn up to 10 GTT/month</span>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-6 border-slate-600"
                  onClick={() => window.location.href = '/api/login'}
                >
                  Start Free
                </Button>
              </CardContent>
            </Card>

            {/* Pro Tier */}
            <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  Most Popular
                </Badge>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Star className="h-5 w-5 text-blue-400" />
                  Pro
                </CardTitle>
                <div className="text-3xl font-bold text-white">$29/mo</div>
                <p className="text-slate-400">Unlock advanced features</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-slate-300">Unlimited truth capsule creation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-slate-300">Access to Veritas tools suite</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-slate-300">Advanced analytics dashboard</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-slate-300">Earn up to 500 GTT/month</span>
                </div>
                <Button 
                  className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => window.location.href = '/api/login'}
                >
                  Upgrade to Pro
                </Button>
              </CardContent>
            </Card>

            {/* Admin Tier */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-400" />
                  Enterprise
                </CardTitle>
                <div className="text-3xl font-bold text-white">Custom</div>
                <p className="text-slate-400">For organizations & institutions</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-slate-300">White-label solution</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-slate-300">API access & integrations</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-slate-300">Dedicated support</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-slate-300">Unlimited GTT earning potential</span>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-6 border-yellow-500 text-yellow-400 hover:bg-yellow-500/10"
                  onClick={() => window.location.href = '/contact'}
                >
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="py-16 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Live Truth Verification Activity
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentCapsules?.slice(0, 6).map((capsule, index) => (
              <Card key={capsule.id || index} className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant={capsule.status === 'verified' ? 'default' : 'secondary'}>
                      {capsule.status}
                    </Badge>
                    <span className="text-sm text-slate-400">{capsule.timeAgo || '2h ago'}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold text-white mb-2 line-clamp-2">
                    {capsule.title || "Recent Truth Capsule Submission"}
                  </h3>
                  <p className="text-slate-400 text-sm mb-3 line-clamp-3">
                    {capsule.content || "Community members are actively verifying this truth capsule submission..."}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-green-400 font-medium">
                      +{capsule.reward || Math.floor(Math.random() * 45) + 5} GTT
                    </span>
                    <Button size="sm" variant="outline" className="border-slate-600">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )) || Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="default">Verified</Badge>
                    <span className="text-sm text-slate-400">{Math.floor(Math.random() * 12) + 1}h ago</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold text-white mb-2">
                    Truth Capsule #{2847 - i}
                  </h3>
                  <p className="text-slate-400 text-sm mb-3">
                    Community verification completed with 95% consensus score.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-green-400 font-medium">
                      +{Math.floor(Math.random() * 45) + 5} GTT
                    </span>
                    <Button size="sm" variant="outline" className="border-slate-600">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">
            Ready to Start Earning?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of users already earning GTT tokens through truth verification.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4"
              onClick={() => window.location.href = '/api/login'}
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-4"
              onClick={() => window.location.href = '/about'}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}