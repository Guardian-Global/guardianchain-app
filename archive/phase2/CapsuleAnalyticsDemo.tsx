import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CapsuleEngagementStats from '@/components/profile/CapsuleEngagementStats';
import { Eye, Share2, Unlock, TrendingUp, BarChart3, Activity } from 'lucide-react';

export default function CapsuleAnalyticsDemo() {
  const [selectedCapsule, setSelectedCapsule] = useState('demo-capsule-1');
  
  const demoCapsules = [
    {
      id: 'demo-capsule-1',
      title: 'Climate Change Evidence Report',
      status: 'verified',
      category: 'Environmental'
    },
    {
      id: 'demo-capsule-2', 
      title: 'Corporate Whistleblower Documentation',
      status: 'sealed',
      category: 'Legal'
    },
    {
      id: 'demo-capsule-3',
      title: 'Scientific Research Findings',
      status: 'public',
      category: 'Research'
    }
  ];

  const incrementStat = async (type: 'views' | 'shares' | 'unlocks') => {
    try {
      const response = await fetch(`/api/capsule/stats/${selectedCapsule}/increment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type }),
      });
      
      if (!response.ok) {
        console.error('Failed to increment stat:', response.statusText);
      }
    } catch (error) {
      console.error('Error incrementing stat:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#f0f6fc] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-[#00ffe1] mb-4 font-[Orbitron]">
            Real-time Capsule Analytics Demo
          </h1>
          <p className="text-[#8b949e] text-lg">
            Experience live engagement tracking for GuardianChain truth capsules
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Capsule Selection */}
          <div className="lg:col-span-1">
            <Card className="bg-[#161b22] border-[#30363d]">
              <CardHeader>
                <CardTitle className="text-[#00ffe1] flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Select Capsule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {demoCapsules.map((capsule) => (
                  <div
                    key={capsule.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                      selectedCapsule === capsule.id
                        ? 'border-[#00ffe1] bg-[#00ffe1]/5'
                        : 'border-[#30363d] hover:border-[#00ffe1]/50'
                    }`}
                    onClick={() => setSelectedCapsule(capsule.id)}
                  >
                    <div className="font-semibold text-sm mb-2">{capsule.title}</div>
                    <div className="flex gap-2">
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          capsule.status === 'verified'
                            ? 'border-green-400 text-green-400'
                            : capsule.status === 'sealed'
                            ? 'border-[#ff00d4] text-[#ff00d4]'
                            : 'border-blue-400 text-blue-400'
                        }`}
                      >
                        {capsule.status}
                      </Badge>
                      <Badge variant="outline" className="text-xs border-gray-400 text-gray-400">
                        {capsule.category}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Interaction Controls */}
            <Card className="bg-[#161b22] border-[#30363d] mt-4">
              <CardHeader>
                <CardTitle className="text-[#00ffe1] flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Test Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => incrementStat('views')}
                  className="w-full bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Simulate View
                </Button>
                <Button
                  onClick={() => incrementStat('shares')}
                  className="w-full bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  Simulate Share
                </Button>
                <Button
                  onClick={() => incrementStat('unlocks')}
                  className="w-full bg-[#ff00d4] hover:bg-[#ff00d4]/80 flex items-center gap-2"
                >
                  <Unlock className="h-4 w-4" />
                  Simulate Unlock
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Real-time Analytics Display */}
          <div className="lg:col-span-2">
            <Card className="bg-[#161b22] border-[#30363d] mb-4">
              <CardHeader>
                <CardTitle className="text-[#00ffe1] flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Live Engagement Analytics
                </CardTitle>
                <p className="text-[#8b949e] text-sm mt-2">
                  Real-time data refreshes every 5 seconds • Click test buttons to see updates
                </p>
              </CardHeader>
              <CardContent>
                <CapsuleEngagementStats capsuleId={selectedCapsule} />
              </CardContent>
            </Card>

            {/* Feature Highlights */}
            <Card className="bg-[#161b22] border-[#30363d]">
              <CardHeader>
                <CardTitle className="text-[#00ffe1]">Analytics Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg bg-[#0d1117]">
                    <Eye className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                    <h3 className="font-semibold mb-1">View Tracking</h3>
                    <p className="text-xs text-[#8b949e]">
                      Monitor capsule engagement with real-time view counts
                    </p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-[#0d1117]">
                    <Share2 className="h-8 w-8 mx-auto mb-2 text-purple-400" />
                    <h3 className="font-semibold mb-1">Share Analytics</h3>
                    <p className="text-xs text-[#8b949e]">
                      Track viral spread and community distribution
                    </p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-[#0d1117]">
                    <Unlock className="h-8 w-8 mx-auto mb-2 text-[#ff00d4]" />
                    <h3 className="font-semibold mb-1">Unlock Metrics</h3>
                    <p className="text-xs text-[#8b949e]">
                      Monitor premium content access and GTT rewards
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}