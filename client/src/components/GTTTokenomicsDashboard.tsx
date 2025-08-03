import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@radix-ui/react-progress";
import { 
  Coins, 
  TrendingUp, 
  Shield, 
  Users, 
  Vote,
  Zap,
  DollarSign,
  Target,
  Lock,
  Unlock,
  ArrowRight,
  Info
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function GTTTokenomicsDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch GTT token data
  const { data: tokenData } = useQuery({
    queryKey: ["/api/token/live-data"],
    refetchInterval: 30000
  });

  // Fetch revenue sharing policy
  const { data: revenuePolicy } = useQuery({
    queryKey: ["/api/revenue-sharing/policy"]
  });

  // Type-safe data access
  const price = (tokenData as any)?.price || 0.0075;
  const marketCap = (tokenData as any)?.marketCap || '2.5M';
  const policy = revenuePolicy as any;

  const gttUseCases = [
    {
      icon: <Coins className="h-5 w-5" />,
      title: "Capsule Mint Fees",
      description: "Pay GTT to mint capsules as NFTs with blockchain ownership",
      earnings: "70% creator share"
    },
    {
      icon: <Unlock className="h-5 w-5" />, 
      title: "Content Unlock Gates",
      description: "Users pay GTT to unlock premium or time-locked content",
      earnings: "50% creator + 25% referrer"
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Yield Staking",
      description: "Stake GTT tokens to earn passive yield from platform activity",
      earnings: "90% staker rewards"
    },
    {
      icon: <Vote className="h-5 w-5" />,
      title: "DAO Governance",
      description: "Vote on platform proposals and treasury allocation decisions",
      earnings: "Governance rewards"
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Truth Validation",
      description: "Earn GTT for verifying content authenticity and scoring capsules",
      earnings: "Validator incentives"
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Sovereign AI Access",
      description: "Premium AI tools for content creation, time-release, and remixing",
      earnings: "Tool usage rewards"
    }
  ];

  const treasuryFlows = [
    { name: "Grant Programs", percentage: 30, color: "bg-green-500" },
    { name: "Validator Incentives", percentage: 25, color: "bg-blue-500" },
    { name: "Compliance/Audit Fund", percentage: 20, color: "bg-purple-500" },
    { name: "Emergency Legal Reserve", percentage: 15, color: "bg-yellow-500" },
    { name: "Community Development", percentage: 10, color: "bg-pink-500" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Coins className="h-10 w-10 text-yellow-400" />
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
            GTT Tokenomics
          </h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Comprehensive overview of GTT token utility, revenue sharing, and DAO treasury management
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-900/20 to-green-800/20 border-green-500/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              ${price.toFixed(4)}
            </div>
            <div className="text-sm text-muted-foreground">GTT Price</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-500/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">70%</div>
            <div className="text-sm text-muted-foreground">Creator Share</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border-purple-500/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">
              {marketCap}
            </div>
            <div className="text-sm text-muted-foreground">Market Cap</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/20 border-yellow-500/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">90%</div>
            <div className="text-sm text-muted-foreground">Yield Share</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="utility">Utility</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Token Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Token Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Community & Creators</span>
                    <Badge variant="secondary">60%</Badge>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">DAO Treasury</span>
                    <Badge variant="secondary">25%</Badge>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Development Team</span>
                    <Badge variant="secondary">10%</Badge>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Platform Operations</span>
                    <Badge variant="secondary">5%</Badge>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '5%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Treasury Allocation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  DAO Treasury Allocation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {treasuryFlows.map((flow, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{flow.name}</span>
                      <Badge variant="secondary">{flow.percentage}%</Badge>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className={`${flow.color} h-2 rounded-full`} style={{ width: `${flow.percentage}%` }}></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Revenue Flow Diagram */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Flow Process</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg px-4 py-2">
                  Revenue Event
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg px-4 py-2">
                  DAO Treasury
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg px-4 py-2">
                  Grant Programs
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg px-4 py-2">
                  Community Benefits
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="utility" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gttUseCases.map((useCase, index) => (
              <Card key={index} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {useCase.icon}
                    {useCase.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {useCase.description}
                  </p>
                  <Badge variant="outline" className="text-green-400 border-green-400/30">
                    {useCase.earnings}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          {policy && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Splits */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Revenue Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {policy.revenueModel && Object.entries(policy.revenueModel).map(([key, value]: [string, any]) => (
                    <div key={key} className="p-3 bg-slate-800/50 rounded-lg">
                      <div className="font-medium text-sm capitalize mb-1">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <div className="text-xs text-muted-foreground">{String(value)}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* GTT Use Cases */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Token Utility
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {policy.gttUseCases?.map((useCase: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm">{useCase}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          {policy && (
            <div className="space-y-6">
              {/* Legal Disclosures */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Legal Compliance Framework
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {policy.legalDisclosures && Object.entries(policy.legalDisclosures).map(([key, value]: [string, any]) => (
                    <div key={key} className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg">
                      <div className="font-medium text-sm mb-2 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <div className="text-xs text-muted-foreground">{String(value)}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Support & Partnership
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {policy.supportContact && (
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <div className="font-medium text-sm">Compliance Contact</div>
                        <div className="text-xs text-blue-300">{policy.supportContact.compliance}</div>
                      </div>
                      <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                        <div className="font-medium text-sm">Official Website</div>
                        <div className="text-xs text-purple-300">{policy.supportContact.website}</div>
                      </div>
                      <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <div className="font-medium text-sm">Available Services</div>
                        <div className="text-xs text-green-300">{policy.supportContact.services}</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Disclaimer */}
              <Card className="border-yellow-500/30 bg-yellow-500/5">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div className="space-y-2">
                      <div className="font-medium text-yellow-300">Important Legal Notice</div>
                      <p className="text-xs text-muted-foreground">
                        GTT is not a passive security. All earnings require active participation in capsule creation, 
                        staking, content sharing, or platform governance. This platform maintains strict compliance 
                        with regulatory requirements and enforces mandatory Terms of Revenue Sharing agreements.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}