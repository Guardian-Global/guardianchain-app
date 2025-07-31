import { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import GuardianChainVideo from "@/components/video/GuardianChainVideo";
import { 
  Shield, 
  Users, 
  TrendingUp, 
  Star, 
  ArrowRight, 
  Play,
  Eye,
  Award,
  Zap,
  Lock,
  Crown,
  Building2
} from "lucide-react";
import { FloatingParticles, BouncyIcon, RippleButton, TypingAnimation } from '@/components/interactions/MicroInteractions';
import { useUserTier } from "@/hooks/useUserTier";
import { useUnifiedAuth } from "@/hooks/useUnifiedAuth";

export default function VaultPage() {
  const { user, isAuthenticated } = useUnifiedAuth();
  const { tier, tierDisplayName, isPremium, canAccessVeritasTools, gttLimit } = useUserTier();
  
  const [liveData, setLiveData] = useState({
    totalCapsules: 12847,
    verifiedToday: 284,
    activeUsers: 5691,
    gttPrice: 0.0075,
    totalRewards: 156823
  });

  useEffect(() => {
    // Simulate live data updates
    const interval = setInterval(() => {
      setLiveData(prev => ({
        ...prev,
        verifiedToday: prev.verifiedToday + Math.floor(Math.random() * 3),
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 5) - 2,
        totalRewards: prev.totalRewards + Math.floor(Math.random() * 10)
      }));
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const subscriptionTiers = [
    {
      name: "Explorer",
      price: "Free",
      description: "Perfect for getting started",
      features: ["View public capsules", "Basic verification", "Earn up to 10 GTT/month"],
      current: tier === "explorer",
      cta: "Current Plan",
      ctaAction: () => {}
    },
    {
      name: "Pro",
      price: "$29/month", 
      description: "For active truth verifiers",
      features: ["Unlimited capsules", "Veritas tools access", "Earn up to 500 GTT/month", "Advanced analytics"],
      current: tier === "pro",
      popular: true,
      cta: tier === "pro" ? "Current Plan" : "Upgrade Now",
      ctaAction: () => window.location.href = "/upgrade"
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For organizations",
      features: ["White-label solution", "API access", "Unlimited GTT potential", "Dedicated support"],
      current: tier === "enterprise",
      cta: tier === "enterprise" ? "Current Plan" : "Contact Sales",
      ctaAction: () => window.location.href = "/contact"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
      {/* Floating Particles Background */}
      <FloatingParticles count={30} color="rgba(59, 130, 246, 0.15)" />
      {/* Hero Section */}
      <section className="pt-8 pb-16 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <motion.div 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-full px-4 py-2 mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <BouncyIcon icon={Award} className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-300">
                {liveData.verifiedToday} truth capsules verified today
              </span>
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-white">Truth Verification</span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                <TypingAnimation text="Earn GTT Rewards" speed={100} />
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Join {liveData.activeUsers.toLocaleString()}+ users earning rewards for truth verification. 
              Create capsules, verify content, and earn up to {isPremium ? "500" : "10"} GTT tokens monthly.
            </motion.p>
            
            {/* GUARDIANCHAIN Explainer Video */}
            <div className="mb-8 max-w-4xl mx-auto">
              <GuardianChainVideo 
                autoplay={false}
                showControls={true}
                className="rounded-lg overflow-hidden"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <>
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4"
                    onClick={() => window.location.href = '/create'}
                  >
                    Create Truth Capsule
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  {!isPremium && (
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-4"
                      onClick={() => window.location.href = '/upgrade'}
                    >
                      Upgrade to Earn More
                      <Crown className="ml-2 h-5 w-5" />
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4"
                    onClick={() => window.location.href = '/api/login'}
                  >
                    Start Earning Today
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-4"
                    onClick={() => window.location.href = '/explore'}
                  >
                    Explore Truth Capsules
                    <Eye className="ml-2 h-5 w-5" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* User Status Banner */}
          {isAuthenticated && (
            <Card className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-slate-600 mb-12">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="flex items-center gap-4 mb-4 md:mb-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isPremium ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-slate-700'
                    }`}>
                      {isPremium ? <Crown className="w-6 h-6 text-white" /> : <Star className="w-6 h-6 text-slate-400" />}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Welcome back, {user?.firstName || user?.email || "Truth Seeker"}!
                      </h3>
                      <p className="text-slate-400">
                        {tierDisplayName} tier • Earning limit: {gttLimit} GTT/month
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className={`${
                      isPremium 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
                        : 'bg-slate-700 text-slate-300'
                    }`}>
                      {tierDisplayName} Member
                    </Badge>
                    {!isPremium && (
                      <Button 
                        variant="outline"
                        size="sm"
                        className="border-blue-500 text-blue-400 hover:bg-blue-600 hover:text-white"
                        onClick={() => window.location.href = '/upgrade'}
                      >
                        Upgrade
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Live Stats */}
      <section className="py-16 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Live Platform Activity
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-700/50">
              <CardContent className="p-6 text-center">
                <Shield className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <div className="text-2xl font-bold text-white mb-1">
                  {liveData.totalCapsules.toLocaleString()}
                </div>
                <div className="text-blue-400 text-sm">
                  Total Truth Capsules
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-900/20 to-green-800/20 border-green-700/50">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <div className="text-2xl font-bold text-white mb-1">
                  {liveData.verifiedToday.toLocaleString()}
                </div>
                <div className="text-green-400 text-sm">
                  Verified Today
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border-purple-700/50">
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <div className="text-2xl font-bold text-white mb-1">
                  {liveData.activeUsers.toLocaleString()}
                </div>
                <div className="text-purple-400 text-sm">
                  Active Users
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-900/20 to-amber-800/20 border-amber-700/50">
              <CardContent className="p-6 text-center">
                <Star className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                <div className="text-2xl font-bold text-white mb-1">
                  ${liveData.gttPrice.toFixed(4)}
                </div>
                <div className="text-amber-400 text-sm">
                  GTT Price
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Subscription Tiers */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Choose Your Plan
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {subscriptionTiers.map((tierPlan, index) => (
              <Card 
                key={tierPlan.name}
                className={`relative ${
                  tierPlan.popular 
                    ? 'bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500 scale-105' 
                    : tierPlan.current
                    ? 'bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500'
                    : 'bg-slate-800 border-slate-700'
                } hover:shadow-xl transition-all duration-300`}
              >
                {tierPlan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                {tierPlan.current && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-green-600 text-white px-4 py-1">
                      Current Plan
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-white">
                    {tierPlan.name}
                  </CardTitle>
                  <p className="text-slate-400 text-sm">
                    {tierPlan.description}
                  </p>
                  <div className="text-3xl font-bold text-white mt-4">
                    {tierPlan.price}
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3 mb-6">
                    {tierPlan.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Shield className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-slate-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button
                    className={`w-full ${
                      tierPlan.current
                        ? 'bg-green-600 hover:bg-green-700'
                        : tierPlan.popular
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                        : 'border-slate-600 hover:bg-slate-700'
                    }`}
                    variant={tierPlan.current || tierPlan.popular ? 'default' : 'outline'}
                    onClick={tierPlan.ctaAction}
                    disabled={tierPlan.current}
                  >
                    {tierPlan.cta}
                    {!tierPlan.current && <ArrowRight className="w-4 h-4 ml-2" />}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-16 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Unlock Premium Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-8 h-8 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">Veritas Seal</h3>
                  {!canAccessVeritasTools && <Lock className="w-4 h-4 text-red-400" />}
                </div>
                <p className="text-slate-400 mb-4">
                  DocuSign-powered legal verification for legally binding truth capsules with enterprise-grade security.
                </p>
                <Badge className={canAccessVeritasTools ? "bg-green-600" : "bg-red-600"}>
                  {canAccessVeritasTools ? "Available" : "Pro Required"}
                </Badge>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-8 h-8 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">Truth Bounty</h3>
                  {!canAccessVeritasTools && <Lock className="w-4 h-4 text-red-400" />}
                </div>
                <p className="text-slate-400 mb-4">
                  Crowdsourced investigation rewards with GTT token bounties for community researchers.
                </p>
                <Badge className={canAccessVeritasTools ? "bg-green-600" : "bg-red-600"}>
                  {canAccessVeritasTools ? "Available" : "Pro Required"}
                </Badge>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-8 h-8 text-yellow-400" />
                  <h3 className="text-lg font-semibold text-white">Advanced Analytics</h3>
                  {!isPremium && <Lock className="w-4 h-4 text-red-400" />}
                </div>
                <p className="text-slate-400 mb-4">
                  Detailed performance insights, verification tracking, and earning optimization reports.
                </p>
                <Badge className={isPremium ? "bg-green-600" : "bg-red-600"}>
                  {isPremium ? "Available" : "Pro Required"}
                </Badge>
              </CardContent>
            </Card>
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
            Join the truth verification revolution. Create your first capsule and start earning GTT tokens today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4"
                  onClick={() => window.location.href = '/create'}
                >
                  Create Truth Capsule
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-4"
                  onClick={() => window.location.href = '/explore'}
                >
                  Explore Platform
                </Button>
              </>
            ) : (
              <>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4"
                  onClick={() => window.location.href = '/api/login'}
                >
                  Start Free Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-4"
                  onClick={() => window.location.href = '/pricing'}
                >
                  View Pricing
                </Button>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}