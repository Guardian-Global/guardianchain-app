import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MicroInteractionWalletConnection from '@/components/replit/MicroInteractionWalletConnection';
import PlayfulBlockchainLearning from '@/components/replit/PlayfulBlockchainLearning';
import OneClickAIDeployment from '@/components/replit/OneClickAIDeployment';
import DynamicNetworkStatusGlobe from '@/components/replit/DynamicNetworkStatusGlobe';
import GamifiedPlatformAchievements from '@/components/replit/GamifiedPlatformAchievements';

export default function AdvancedFeaturesPage() {
  return (
    <div className="min-h-screen bg-slate-900 pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="wallet" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50">
            <TabsTrigger value="wallet">🔗 Wallet Connection</TabsTrigger>
            <TabsTrigger value="learning">📚 Blockchain Learning</TabsTrigger>
            <TabsTrigger value="deployment">🚀 AI Deployment</TabsTrigger>
            <TabsTrigger value="network">🌐 Network Globe</TabsTrigger>
            <TabsTrigger value="achievements">🏆 Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="wallet">
            <MicroInteractionWalletConnection />
          </TabsContent>

          <TabsContent value="learning">
            <PlayfulBlockchainLearning />
          </TabsContent>

          <TabsContent value="deployment">
            <OneClickAIDeployment />
          </TabsContent>

          <TabsContent value="network">
            <DynamicNetworkStatusGlobe />
          </TabsContent>

          <TabsContent value="achievements">
            <GamifiedPlatformAchievements />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}