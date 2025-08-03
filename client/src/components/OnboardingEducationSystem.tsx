import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Zap, 
  Shield, 
  Coins, 
  Users,
  PlayCircle,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Target,
  Trophy,
  Heart
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface OnboardingModule {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  duration: string;
  completed: boolean;
  content: {
    overview: string;
    benefits: string[];
    steps: string[];
    emotionalHook: string;
  };
}

export default function OnboardingEducationSystem() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [currentModule, setCurrentModule] = useState(0);
  const [completedModules, setCompletedModules] = useState<string[]>([]);

  const modules: OnboardingModule[] = [
    {
      id: "sovereignty",
      title: "Digital Sovereignty",
      description: "Own your content forever with blockchain technology",
      icon: <Shield className="h-6 w-6 text-purple-400" />,
      duration: "3 min",
      completed: false,
      content: {
        overview: "GuardianChain gives you true ownership of your digital content. Unlike traditional platforms that can delete or censor your work, our blockchain-based system ensures your content remains yours forever.",
        benefits: [
          "Permanent ownership via NFT minting",
          "Uncensorable storage on IPFS", 
          "No platform dependency or lock-in",
          "Legal proof of authorship and timestamp"
        ],
        steps: [
          "Create your first Truth Capsule",
          "Mint it as an NFT on blockchain",
          "Store content on decentralized IPFS",
          "Share with permanent links"
        ],
        emotionalHook: "Imagine never losing your precious memories, important documents, or creative work to platform changes or censorship. With GuardianChain, your digital legacy is truly yours."
      }
    },
    {
      id: "revenue",
      title: "Superior Revenue Sharing",
      description: "Earn 15-40% more than legacy platforms like YouTube or Patreon",
      icon: <Coins className="h-6 w-6 text-green-400" />,
      duration: "4 min",
      completed: false,
      content: {
        overview: "GuardianChain's revenue model puts creators first with transparent, competitive splits that outperform traditional platforms by 15-40%.",
        benefits: [
          "70% creator share on capsule minting",
          "90% yield rewards from GTT staking",
          "50% plus referral bonuses on unlocks",
          "Multiple income streams per content piece"
        ],
        steps: [
          "Set up your creator profile",
          "Create premium gated content",
          "Stake GTT tokens for yield rewards",
          "Build referral network for bonuses"
        ],
        emotionalHook: "Stop giving away 45-55% of your earnings to mega-corporations. Keep what you've earned and build real wealth from your creativity and expertise."
      }
    },
    {
      id: "verification",
      title: "AI-Powered Truth Verification",
      description: "Build trust with advanced AI authentication and community validation",
      icon: <Zap className="h-6 w-6 text-blue-400" />,
      duration: "3 min",
      completed: false,
      content: {
        overview: "Our Truth Genome system uses advanced AI to analyze content authenticity, emotional resonance, and community trust scores, creating a reputation system that matters.",
        benefits: [
          "AI-powered authenticity scoring",
          "Community-driven verification",
          "Truth bounties for fact-checking",
          "Reputation-based content promotion"
        ],
        steps: [
          "Submit content for AI analysis",
          "Receive Truth Genome profile", 
          "Participate in community validation",
          "Build trusted creator reputation"
        ],
        emotionalHook: "In a world full of misinformation, be the voice people can trust. Build a reputation that opens doors and creates lasting impact."
      }
    },
    {
      id: "community",
      title: "DAO Governance & Community",
      description: "Shape the platform's future and earn rewards through participation",
      icon: <Users className="h-6 w-6 text-yellow-400" />,
      duration: "2 min",
      completed: false,
      content: {
        overview: "As a GTT token holder, you have voting power in platform decisions, treasury allocation, and feature development. Your voice shapes GuardianChain's evolution.",
        benefits: [
          "Vote on platform proposals",
          "Influence treasury fund allocation",
          "Earn governance participation rewards",
          "Connect with like-minded creators"
        ],
        steps: [
          "Acquire GTT tokens through participation",
          "Join DAO governance discussions",
          "Vote on active proposals",
          "Earn rewards for engagement"
        ],
        emotionalHook: "Be part of something bigger than yourself. Help build the future of content creation where creators have real power and say."
      }
    }
  ];

  const markModuleComplete = useMutation({
    mutationFn: async (moduleId: string) => {
      return apiRequest("POST", "/api/onboarding/complete-module", { moduleId });
    },
    onSuccess: (_, moduleId) => {
      setCompletedModules(prev => [...prev, moduleId]);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    }
  });

  const currentModuleData = modules[currentModule];
  const progressPercentage = (currentModule / modules.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <BookOpen className="h-10 w-10 text-purple-400" />
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Creator Sovereignty Academy
          </h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Master the art of sovereign content creation and build lasting wealth through digital ownership
        </p>
        
        {/* Progress Indicator */}
        <div className="bg-slate-800/50 rounded-lg p-4 max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Your Progress</span>
            <span className="text-sm text-muted-foreground">
              {currentModule + 1} of {modules.length} modules
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-purple-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {currentModuleData.icon}
              <div>
                <CardTitle className="text-xl">{currentModuleData.title}</CardTitle>
                <p className="text-muted-foreground">{currentModuleData.description}</p>
              </div>
            </div>
            <Badge variant="outline" className="text-purple-400 border-purple-400/30">
              {currentModuleData.duration}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Emotional Hook */}
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Heart className="h-5 w-5 text-pink-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-pink-300 mb-2">Why This Matters</h3>
                <p className="text-sm text-muted-foreground">
                  {currentModuleData.content.emotionalHook}
                </p>
              </div>
            </div>
          </div>

          {/* Overview */}
          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-400" />
              What You'll Learn
            </h3>
            <p className="text-muted-foreground">
              {currentModuleData.content.overview}
            </p>
          </div>

          {/* Benefits */}
          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Trophy className="h-4 w-4 text-green-400" />
              Key Benefits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentModuleData.content.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Steps */}
          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-400" />
              Action Steps
            </h3>
            <div className="space-y-3">
              {currentModuleData.content.steps.map((step, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <span className="text-sm">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6 border-t border-slate-700">
            <Button 
              variant="outline" 
              onClick={() => setCurrentModule(Math.max(0, currentModule - 1))}
              disabled={currentModule === 0}
            >
              Previous Module
            </Button>

            <div className="flex gap-2">
              {modules.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentModule 
                      ? 'bg-purple-500' 
                      : index < currentModule 
                      ? 'bg-green-500' 
                      : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>

            {currentModule === modules.length - 1 ? (
              <Button 
                onClick={() => markModuleComplete.mutate(currentModuleData.id)}
                className="bg-green-600 hover:bg-green-700"
                disabled={markModuleComplete.isPending}
              >
                {markModuleComplete.isPending ? "Completing..." : "Complete Academy"}
                <Trophy className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={() => {
                  markModuleComplete.mutate(currentModuleData.id);
                  setCurrentModule(Math.min(modules.length - 1, currentModule + 1));
                }}
                className="bg-purple-600 hover:bg-purple-700"
                disabled={markModuleComplete.isPending}
              >
                {markModuleComplete.isPending ? "Saving..." : "Complete & Continue"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border-purple-500/30">
          <CardContent className="p-4 text-center">
            <Shield className="h-8 w-8 text-purple-400 mx-auto mb-2" />
            <h3 className="font-medium mb-2">Create First Capsule</h3>
            <Button size="sm" variant="outline" className="w-full">
              Get Started
            </Button>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-900/20 to-green-800/20 border-green-500/30">
          <CardContent className="p-4 text-center">
            <Coins className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <h3 className="font-medium mb-2">Setup Revenue Streams</h3>
            <Button size="sm" variant="outline" className="w-full">
              Configure
            </Button>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-500/30">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <h3 className="font-medium mb-2">Join DAO Community</h3>
            <Button size="sm" variant="outline" className="w-full">
              Participate
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}