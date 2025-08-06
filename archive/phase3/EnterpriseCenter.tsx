import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Shield, 
  TrendingUp, 
  Zap, 
  Crown, 
  Users, 
  DollarSign,
  Rocket,
  CheckCircle,
  Star
} from "lucide-react";
import EnterpriseFeatures from "@/components/EnterpriseFeatures";
import CompetitiveAnalysis from "@/components/CompetitiveAnalysis";
import EnhancedSubscriptionPlans from "@/components/EnhancedSubscriptionPlans";

export default function EnterpriseCenter() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <>
      <Helmet>
        <title>Enterprise Center | GuardianChain - Sovereign Creator Platform</title>
        <meta 
          name="description" 
          content="Advanced enterprise features, competitive revenue sharing, and sovereignty infrastructure for creators and developers on GuardianChain" 
        />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Building2 className="h-12 w-12 text-purple-400" />
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Enterprise Center
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
              Revolutionary sovereign creator platform with enterprise-grade infrastructure, 
              competitive revenue sharing, and blockchain-backed content ownership
            </p>
            
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
              <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/30 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-400">70%</div>
                <div className="text-sm text-muted-foreground">Creator Revenue Share</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-400">15-40%</div>
                <div className="text-sm text-muted-foreground">Higher Than Legacy</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-400">100%</div>
                <div className="text-sm text-muted-foreground">Content Ownership</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-400">$5</div>
                <div className="text-sm text-muted-foreground">Starting Creator+</div>
              </div>
            </div>

            {/* Value Proposition */}
            <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-xl p-6 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-3 text-purple-300">
                The World's First Sovereign Creator Economy
              </h2>
              <p className="text-muted-foreground mb-4">
                Unlike legacy platforms that control your content, GuardianChain provides true digital sovereignty 
                with blockchain-backed ownership, AI-powered verification, and revolutionary revenue sharing that puts creators first.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                  Higher Revenue Share
                </Badge>
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                  True Ownership
                </Badge>
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                  AI Verification
                </Badge>
                <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300">
                  DAO Governance
                </Badge>
              </div>
            </div>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="competitive" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Competitive
              </TabsTrigger>
              <TabsTrigger value="pricing" className="flex items-center gap-2">
                <Crown className="h-4 w-4" />
                Pricing
              </TabsTrigger>
              <TabsTrigger value="enterprise" className="flex items-center gap-2">
                <Rocket className="h-4 w-4" />
                Enterprise
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sovereignty Features */}
                <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-6 w-6 text-purple-400" />
                      Digital Sovereignty
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Blockchain Ownership</h4>
                          <p className="text-sm text-muted-foreground">
                            Your content is permanently stored on blockchain with immutable proof of ownership
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Uncensorable Storage</h4>
                          <p className="text-sm text-muted-foreground">
                            IPFS-based decentralized storage ensures your content can never be removed
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium">AI Truth Verification</h4>
                          <p className="text-sm text-muted-foreground">
                            Advanced AI analyzes content authenticity and emotional resonance
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Revenue Model */}
                <Card className="bg-gradient-to-br from-green-900/20 to-yellow-900/20 border-green-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-6 w-6 text-green-400" />
                      Superior Revenue Model
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Content Minting</span>
                        <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                          70% Creator Share
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Content Unlocks</span>
                        <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                          50% + Referrals
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">GTT Yield Staking</span>
                        <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                          90% Creator Share
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">DAO Governance</span>
                        <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300">
                          Token Rewards
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <p className="text-green-200 text-xs">
                        💰 Average creators earn $25-75/month just from platform yield, 
                        plus unlimited revenue from content unlocks and referrals
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Start CTA */}
              <div className="text-center bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-xl p-8">
                <h3 className="text-2xl font-bold mb-4">Ready to Join the Sovereign Creator Revolution?</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Start with our free Seeker plan and experience true content ownership with competitive revenue sharing
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                    <Star className="h-4 w-4 mr-2" />
                    Start Creating for Free
                  </Button>
                  <Button size="lg" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Schedule Demo
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="competitive">
              <CompetitiveAnalysis />
            </TabsContent>

            <TabsContent value="pricing">
              <EnhancedSubscriptionPlans />
            </TabsContent>

            <TabsContent value="enterprise">
              <EnterpriseFeatures />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}