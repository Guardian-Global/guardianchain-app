import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Shield, 
  ArrowRight,
  Target,
  CheckCircle,
  AlertTriangle,
  FileText,
  Mail
} from "lucide-react";

export default function EnhancedRevenueExplainer() {
  const [activeScenario, setActiveScenario] = useState("creator");

  const revenueBreakdown = {
    capsuleMinting: {
      creator: 70,
      dao: 20,
      platform: 10,
      example: "Mint a $10 capsule → Creator gets $7, DAO gets $2, Platform gets $1"
    },
    capsuleUnlock: {
      creator: 50,
      referrer: 25,
      dao: 25,
      example: "$5 unlock fee → Creator gets $2.50, Referrer gets $1.25, DAO gets $1.25"
    },
    gttYieldRewards: {
      creator: 90,
      dao: 10,
      example: "$100 yield pool → Stakers get $90, DAO reserve gets $10"
    },
    gatedContent: {
      creator: 60,
      platform: 30,
      dao: 10,
      example: "$15 subscription → Creator gets $9, Platform gets $4.50, DAO gets $1.50"
    },
    vaultHosting: {
      platform: 100,
      example: "$20 storage fee → Platform gets $20 (cost recovery + 25% markup)"
    }
  };

  const scenarioExamples = {
    creator: {
      title: "Independent Creator",
      monthlyEarnings: "$250-750",
      breakdown: [
        { source: "Capsule Mints", amount: "$175", percentage: "70% of $250" },
        { source: "Content Unlocks", amount: "$125", percentage: "50% of $250" },
        { source: "GTT Yield Staking", amount: "$225", percentage: "90% of $250" },
        { source: "Referral Bonuses", amount: "$125", percentage: "25% of referrals" }
      ],
      total: "$650",
      advantages: [
        "Higher revenue share than YouTube (15-40% more)",
        "Permanent content ownership via NFTs",
        "Multiple income streams from single content",
        "DAO governance participation rewards"
      ]
    },
    influencer: {
      title: "Social Media Influencer",
      monthlyEarnings: "$1,500-5,000",
      breakdown: [
        { source: "Premium Capsules", amount: "$1,750", percentage: "70% creator share" },
        { source: "Subscription Content", amount: "$1,800", percentage: "60% creator share" },
        { source: "Yield Staking Pool", amount: "$900", percentage: "90% yield share" },
        { source: "Community Referrals", amount: "$550", percentage: "25% referral bonus" }
      ],
      total: "$5,000",
      advantages: [
        "40% higher earnings than Patreon",
        "Uncensorable content distribution",
        "Global reach without platform restrictions",
        "Direct fan monetization with GTT tokens"
      ]
    },
    enterprise: {
      title: "Enterprise Content Team",
      monthlyEarnings: "$10,000-25,000",
      breakdown: [
        { source: "Corporate Capsules", amount: "$7,000", percentage: "70% revenue share" },
        { source: "Training Content", amount: "$6,000", percentage: "60% gated content" },
        { source: "Validator Rewards", amount: "$4,500", percentage: "Truth validation" },
        { source: "DAO Treasury Grants", amount: "$7,500", percentage: "Governance participation" }
      ],
      total: "$25,000",
      advantages: [
        "Enterprise-grade compliance framework",
        "Transparent revenue tracking and reporting",
        "Legal separation between platform and DAO",
        "Institutional-grade audit and security measures"
      ]
    }
  };

  const complianceFeatures = [
    {
      title: "Non-Passive Security Status",
      description: "GTT rewards require active capsule creation, staking, or sharing - ensuring regulatory compliance",
      icon: <Shield className="h-5 w-5 text-green-400" />
    },
    {
      title: "Full Revenue Transparency",
      description: "Complete revenue disclosures published at guardianchain.app/revenue-sharing-policy",
      icon: <FileText className="h-5 w-5 text-blue-400" />
    },
    {
      title: "KYC/AML Compliance",
      description: "Tiered verification system for fiat off-ramp compliance with regulatory requirements",
      icon: <CheckCircle className="h-5 w-5 text-purple-400" />
    },
    {
      title: "Legal Separation",
      description: "Platform operations legally separated from DAO governance decisions",
      icon: <Users className="h-5 w-5 text-yellow-400" />
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
          Revenue Model & Compliance Deck
        </h1>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Comprehensive overview of GuardianChain's revenue-sharing system, GTT token utility, DAO structure, 
          and partner-facing compliance features designed for grant bodies, investors, and institutional collaborators.
        </p>
      </div>

      {/* Revenue Distribution Overview */}
      <Card className="bg-gradient-to-br from-green-900/20 to-blue-900/20 border-green-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-green-400" />
            Revenue Distribution Model
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(revenueBreakdown).map(([key, value]) => (
              <div key={key} className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg">
                <h3 className="font-medium text-sm mb-3 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <div className="space-y-2 mb-3">
                  {Object.entries(value).filter(([k]) => k !== 'example').map(([role, percentage]) => (
                    <div key={role} className="flex justify-between items-center">
                      <span className="text-xs capitalize">{role}:</span>
                      <Badge variant="secondary" className="text-xs">{percentage}%</Badge>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground italic">{value.example}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scenario-Based Earnings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-6 w-6 text-purple-400" />
            Earnings Scenarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeScenario} onValueChange={setActiveScenario}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="creator">Independent Creator</TabsTrigger>
              <TabsTrigger value="influencer">Social Influencer</TabsTrigger>
              <TabsTrigger value="enterprise">Enterprise Team</TabsTrigger>
            </TabsList>

            {Object.entries(scenarioExamples).map(([key, scenario]) => (
              <TabsContent key={key} value={key} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Earnings Breakdown */}
                  <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20">
                    <CardHeader>
                      <CardTitle className="text-lg">{scenario.title}</CardTitle>
                      <div className="text-2xl font-bold text-green-400">{scenario.monthlyEarnings}</div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {scenario.breakdown.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div>
                            <div className="font-medium text-sm">{item.source}</div>
                            <div className="text-xs text-muted-foreground">{item.percentage}</div>
                          </div>
                          <Badge variant="outline" className="text-green-400 border-green-400/30">
                            {item.amount}
                          </Badge>
                        </div>
                      ))}
                      <div className="border-t border-slate-700 pt-3 flex justify-between items-center">
                        <span className="font-bold">Total Monthly:</span>
                        <Badge className="bg-green-600 text-white text-lg px-3 py-1">
                          {scenario.total}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Advantages */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Key Advantages</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {scenario.advantages.map((advantage, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{advantage}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* DAO Treasury Flow */}
      <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6 text-purple-400" />
            DAO Treasury Flow Diagram
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Flow Diagram */}
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
                Grant Programs (30%)
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg px-4 py-2">
                Validator Incentives (25%)
              </div>
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg px-4 py-2">
                Compliance/Audit Fund (20%)
              </div>
              <div className="bg-indigo-500/20 border border-indigo-500/30 rounded-lg px-4 py-2">
                Emergency Legal Reserve (15%)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Framework */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-yellow-400" />
            Compliance & Legal Disclaimers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {complianceFeatures.map((feature, index) => (
              <div key={index} className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg">
                <div className="flex items-start gap-3">
                  {feature.icon}
                  <div>
                    <h3 className="font-medium text-sm mb-2">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact & Support */}
      <Card className="bg-gradient-to-br from-cyan-900/20 to-teal-900/20 border-cyan-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-6 w-6 text-cyan-400" />
            Contact + Grant Support
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              For partnership, audit, or grant requests:
            </p>
            
            <div className="space-y-2">
              <Badge variant="outline" className="text-cyan-400 border-cyan-400/30 px-4 py-2">
                compliance@guardianchain.app
              </Badge>
              <div className="text-sm text-muted-foreground">
                www.guardianchain.app
              </div>
            </div>
            
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
              <p className="text-xs text-cyan-200">
                Live treasury stats, DAO governance, and capsule scoring dashboards are available upon request.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Ready to Join the Revenue Revolution?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Experience superior revenue sharing, true content ownership, and transparent DAO governance
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button size="lg" className="bg-green-600 hover:bg-green-700">
            <TrendingUp className="h-4 w-4 mr-2" />
            Start Earning Today
          </Button>
          <Button size="lg" variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Download Full Deck
          </Button>
        </div>
      </div>
    </div>
  );
}