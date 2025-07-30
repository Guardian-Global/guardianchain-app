import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReplitToolsIntegration from '@/components/replit/ReplitToolsIntegration';
import ReplitEnhancementDashboard from '@/components/replit/ReplitEnhancementDashboard';
import MaximumEnhancementSystem from '@/components/replit/MaximumEnhancementSystem';

export default function ReplitToolsPage() {
  return (
    <div className="min-h-screen bg-slate-900 pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="maximum" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
            <TabsTrigger value="maximum">🚀 MAXIMUM ENHANCEMENT</TabsTrigger>
            <TabsTrigger value="overview">Enhancement Dashboard</TabsTrigger>
            <TabsTrigger value="tools">All Tools & Integrations</TabsTrigger>
          </TabsList>

          <TabsContent value="maximum">
            <MaximumEnhancementSystem />
          </TabsContent>

          <TabsContent value="overview">
            <ReplitEnhancementDashboard />
          </TabsContent>

          <TabsContent value="tools">
            <ReplitToolsIntegration />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}