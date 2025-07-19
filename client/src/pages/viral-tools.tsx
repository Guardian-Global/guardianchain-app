import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PreSocialVerification from '@/components/viral/PreSocialVerification';
import IdeaValueCalculator from '@/components/viral/IdeaValueCalculator';
import ViralPotentialAnalyzer from '@/components/viral/ViralPotentialAnalyzer';
import SocialValueMining from '@/components/viral/SocialValueMining';
import DataEducationHub from '@/components/viral/DataEducationHub';
import { 
  Shield, 
  Calculator, 
  TrendingUp, 
  Pickaxe, 
  Brain, 
  DollarSign,
  Zap,
  Crown
} from "lucide-react";

const ViralTools: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Brain className="w-16 h-16 text-purple-400 mr-4" />
            <div>
              <h1 className="text-5xl font-bold text-white mb-2">
                <span className="text-purple-400">VIRAL</span>
                <span className="text-green-400"> TOOLS</span>
              </h1>
              <div className="text-xl text-purple-400">AI-Powered Content Value Discovery</div>
            </div>
          </div>
          
          <p className="text-xl text-slate-300 max-w-4xl mx-auto mb-8">
            Understand the true value of your ideas and content before sharing them publicly. 
            Protect your intellectual property and maximize viral potential with AI-powered analysis.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <Shield className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-sm font-semibold text-white">Pre-Social Protection</div>
              <div className="text-xs text-slate-400">Immutable proof before sharing</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <Calculator className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-sm font-semibold text-white">Value Calculation</div>
              <div className="text-xs text-slate-400">Discover content worth</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <TrendingUp className="w-8 h-8 text-pink-400 mx-auto mb-2" />
              <div className="text-sm font-semibold text-white">Viral Analysis</div>
              <div className="text-xs text-slate-400">Predict viral potential</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <Pickaxe className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <div className="text-sm font-semibold text-white">Social Mining</div>
              <div className="text-xs text-slate-400">Extract hidden value</div>
            </div>
          </div>
        </div>

        {/* Main Tools */}
        <Tabs defaultValue="verification" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 mb-8">
            <TabsTrigger value="verification" className="flex items-center text-center">
              <Shield className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Pre-Social</span>
            </TabsTrigger>
            <TabsTrigger value="calculator" className="flex items-center text-center">
              <Calculator className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Calculator</span>
            </TabsTrigger>
            <TabsTrigger value="viral" className="flex items-center text-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Viral AI</span>
            </TabsTrigger>
            <TabsTrigger value="mining" className="flex items-center text-center">
              <Pickaxe className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Mining</span>
            </TabsTrigger>
            <TabsTrigger value="education" className="flex items-center text-center">
              <Brain className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Learn</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="verification">
            <PreSocialVerification />
          </TabsContent>

          <TabsContent value="calculator">
            <IdeaValueCalculator />
          </TabsContent>

          <TabsContent value="viral">
            <ViralPotentialAnalyzer />
          </TabsContent>

          <TabsContent value="mining">
            <SocialValueMining />
          </TabsContent>

          <TabsContent value="education">
            <DataEducationHub />
          </TabsContent>
        </Tabs>

        {/* Bottom CTA */}
        <Card className="mt-16 bg-gradient-to-r from-purple-900/20 to-green-900/20 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white text-center">
              <div className="text-3xl font-bold mb-2">Ready to Maximize Your Content Value?</div>
              <div className="text-lg text-purple-400">Join the GUARDIANCHAIN Protocol</div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-purple-900/30 rounded-lg p-6 mb-4">
                  <Crown className="w-12 h-12 text-purple-400 mx-auto mb-2" />
                  <div className="text-xl font-bold text-white">Own Your Ideas</div>
                </div>
                <p className="text-slate-300 text-sm">
                  Establish immutable proof of creation and ownership before sharing on social media platforms
                </p>
              </div>

              <div className="text-center">
                <div className="bg-green-900/30 rounded-lg p-6 mb-4">
                  <DollarSign className="w-12 h-12 text-green-400 mx-auto mb-2" />
                  <div className="text-xl font-bold text-white">Monetize Smart</div>
                </div>
                <p className="text-slate-300 text-sm">
                  Discover the true value of your content and ideas before giving them away for free
                </p>
              </div>

              <div className="text-center">
                <div className="bg-blue-900/30 rounded-lg p-6 mb-4">
                  <Zap className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                  <div className="text-xl font-bold text-white">Go Viral</div>
                </div>
                <p className="text-slate-300 text-sm">
                  Use AI-powered insights to optimize content for maximum engagement and viral potential
                </p>
              </div>
            </div>

            <div className="text-center mt-8">
              <div className="bg-gradient-to-r from-purple-600 to-green-600 rounded-lg p-6">
                <div className="text-2xl font-bold text-white mb-2">
                  Stop Giving Away Your Ideas for Free
                </div>
                <div className="text-lg text-white/80 mb-4">
                  Protect, Value, and Optimize Every Piece of Content You Create
                </div>
                <div className="text-sm text-white/60">
                  Join thousands of creators who are maximizing their content value with GUARDIANCHAIN
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ViralTools;