import React from 'react';
import PremiumFeatures from '@/components/PremiumFeatures';
import EnhancedAuth from '@/components/EnhancedAuth';
import AdvancedAI from '@/components/AdvancedAI';
import CrossChainHub from '@/components/CrossChainHub';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crown, Shield, Zap, TrendingUp } from "lucide-react";

const PremiumFeaturesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <section className="pt-20 pb-8 bg-gradient-to-br from-yellow-900/20 to-purple-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Crown className="w-12 h-12 text-yellow-400 mr-4" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
                Premium Enterprise Features
              </h1>
            </div>
            <p className="text-xl text-slate-300 max-w-4xl mx-auto">
              Unlock billion-dollar protocol value with enterprise-grade authentication, 
              premium features, and maximum GTT token rewards.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="features" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="features" className="flex items-center">
              <Crown className="w-4 h-4 mr-2" />
              Premium Features
            </TabsTrigger>
            <TabsTrigger value="auth" className="flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Enhanced Auth
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              Advanced AI
            </TabsTrigger>
            <TabsTrigger value="crosschain" className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Cross-Chain
            </TabsTrigger>
          </TabsList>

          <TabsContent value="features">
            <PremiumFeatures />
          </TabsContent>

          <TabsContent value="auth">
            <EnhancedAuth />
          </TabsContent>

          <TabsContent value="ai">
            <AdvancedAI />
          </TabsContent>

          <TabsContent value="crosschain">
            <CrossChainHub />
          </TabsContent>
        </Tabs>

        {/* Value Proposition Summary */}
        <div className="mt-16">
          <Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white text-center">
                <div className="text-3xl font-bold mb-2">Complete Enterprise Value Package</div>
                <div className="text-lg text-purple-400">Everything needed to dominate the $231B NFT market</div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="bg-green-900/20 rounded-lg p-6 mb-4">
                    <TrendingUp className="w-12 h-12 text-green-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-400">$10M+</div>
                    <div className="text-sm text-slate-400">Annual Savings</div>
                  </div>
                  <p className="text-slate-300 text-sm">
                    Massive cost reductions through automation and AI verification
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-blue-900/20 rounded-lg p-6 mb-4">
                    <Shield className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-400">Enterprise Auth</div>
                    <div className="text-sm text-slate-400">Bank-Level Security</div>
                  </div>
                  <p className="text-slate-300 text-sm">
                    Multiple authentication methods with global compliance
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-purple-900/20 rounded-lg p-6 mb-4">
                    <Zap className="w-12 h-12 text-purple-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-400">1000x ROI</div>
                    <div className="text-sm text-slate-400">Value Multiplier</div>
                  </div>
                  <p className="text-slate-300 text-sm">
                    Unprecedented returns through efficiency and automation
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-yellow-900/20 rounded-lg p-6 mb-4">
                    <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-yellow-400">1M+ GTT</div>
                    <div className="text-sm text-slate-400">Monthly Rewards</div>
                  </div>
                  <p className="text-slate-300 text-sm">
                    Maximum token rewards for enterprise tier subscribers
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PremiumFeaturesPage;