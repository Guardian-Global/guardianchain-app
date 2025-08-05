import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReactEmojiBar from '../reactions/ReactEmojiBar';
import UserInteractionExplorer from '../interactions/UserInteractionExplorer';
import TopCapsulesLeaderboard from '../leaderboard/TopCapsulesLeaderboard';
import CapsuleReputationBadge from '../reputation/CapsuleReputationBadge';
import SentimentBadge from '../sentiment/SentimentBadge';
import CapsuleValueCalculator from '../value/CapsuleValueCalculator';
import PlaylistCreator from '../playlist/PlaylistCreator';
import CapsuleStatsGraph from '../analytics/CapsuleStatsGraph';

export default function EnhancementShowcase() {
  const sampleStats = {
    views: 147,
    reactions: 23,
    unlocks: 5,
    verifications: 3,
    timeLockedDays: 90,
  };

  return (
    <div className="min-h-screen bg-[#0d1117] p-6">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#00ffe1] mb-2">
            GuardianChain Enhancement Suite
          </h1>
          <p className="text-[#8b949e] text-lg">
            Advanced analytics, engagement tracking, and community features
          </p>
        </header>

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid grid-cols-4 lg:grid-cols-8 bg-[#161b22] border-[#30363d]">
            <TabsTrigger value="analytics" className="data-[state=active]:bg-[#00ffe1] data-[state=active]:text-black">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="reactions" className="data-[state=active]:bg-[#00ffe1] data-[state=active]:text-black">
              Reactions
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="data-[state=active]:bg-[#00ffe1] data-[state=active]:text-black">
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="reputation" className="data-[state=active]:bg-[#00ffe1] data-[state=active]:text-black">
              Reputation
            </TabsTrigger>
            <TabsTrigger value="value" className="data-[state=active]:bg-[#00ffe1] data-[state=active]:text-black">
              Value
            </TabsTrigger>
            <TabsTrigger value="playlist" className="data-[state=active]:bg-[#00ffe1] data-[state=active]:text-black">
              Playlists
            </TabsTrigger>
            <TabsTrigger value="interactions" className="data-[state=active]:bg-[#00ffe1] data-[state=active]:text-black">
              Activity
            </TabsTrigger>
            <TabsTrigger value="sentiment" className="data-[state=active]:bg-[#00ffe1] data-[state=active]:text-black">
              AI
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <CapsuleStatsGraph capsuleId="demo-capsule-1" />
              <Card className="bg-[#0d1117] border-[#30363d]">
                <CardHeader>
                  <CardTitle className="text-[#00ffe1]">Real-time Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#8b949e]">
                    Interactive charts with secure increment operations, weekly trends, and comprehensive engagement metrics.
                  </p>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#8b949e]">Views</span>
                      <span className="text-[#00ffe1]">2,143</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#8b949e]">Engagement Rate</span>
                      <span className="text-[#00ffe1]">87.3%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#8b949e]">Weekly Growth</span>
                      <span className="text-green-400">+12.5%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reactions" className="space-y-6">
            <div className="grid gap-6">
              <Card className="bg-[#0d1117] border-[#30363d]">
                <CardHeader>
                  <CardTitle className="text-[#00ffe1]">Interactive Emoji Reactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ReactEmojiBar capsuleId="demo-capsule-1" />
                  <p className="text-[#8b949e] mt-4 text-sm">
                    Real-time emoji reactions with database persistence and community engagement tracking.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <TopCapsulesLeaderboard />
          </TabsContent>

          <TabsContent value="reputation" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-[#0d1117] border-[#30363d]">
                <CardContent className="p-6 text-center">
                  <CapsuleReputationBadge tier="platinum" score={92} />
                  <p className="text-xs text-[#8b949e] mt-2">Platinum Tier</p>
                </CardContent>
              </Card>
              <Card className="bg-[#0d1117] border-[#30363d]">
                <CardContent className="p-6 text-center">
                  <CapsuleReputationBadge tier="gold" score={78} />
                  <p className="text-xs text-[#8b949e] mt-2">Gold Tier</p>
                </CardContent>
              </Card>
              <Card className="bg-[#0d1117] border-[#30363d]">
                <CardContent className="p-6 text-center">
                  <CapsuleReputationBadge tier="silver" score={45} />
                  <p className="text-xs text-[#8b949e] mt-2">Silver Tier</p>
                </CardContent>
              </Card>
              <Card className="bg-[#0d1117] border-[#30363d]">
                <CardContent className="p-6 text-center">
                  <CapsuleReputationBadge tier="bronze" score={23} />
                  <p className="text-xs text-[#8b949e] mt-2">Bronze Tier</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="value" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <CapsuleValueCalculator capsuleStats={sampleStats} />
              <Card className="bg-[#0d1117] border-[#30363d]">
                <CardHeader>
                  <CardTitle className="text-[#00ffe1]">Value Calculation Formula</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="text-[#8b949e]">
                      <strong className="text-[#f0f6fc]">Base Value:</strong>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-[#8b949e] ml-4">
                      <li>Views × $0.01</li>
                      <li>Reactions × $0.05</li>
                      <li>Unlocks × $0.20</li>
                      <li>Verifications × $0.25</li>
                    </ul>
                    <div className="text-[#8b949e] mt-3">
                      <strong className="text-[#f0f6fc]">Time Lock Multiplier:</strong>
                    </div>
                    <p className="text-[#8b949e] ml-4">
                      1 + (days locked / 365)
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="playlist" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <PlaylistCreator />
              <Card className="bg-[#0d1117] border-[#30363d]">
                <CardHeader>
                  <CardTitle className="text-[#00ffe1]">Playlist Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-[#8b949e]">
                    <li className="flex items-center gap-2">
                      ✅ <span>Create custom capsule collections</span>
                    </li>
                    <li className="flex items-center gap-2">
                      ✅ <span>Share playlists with community</span>
                    </li>
                    <li className="flex items-center gap-2">
                      ✅ <span>Collaborative playlist building</span>
                    </li>
                    <li className="flex items-center gap-2">
                      ✅ <span>Voice summaries and descriptions</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="interactions" className="space-y-6">
            <UserInteractionExplorer userId="dev-user-123" />
          </TabsContent>

          <TabsContent value="sentiment" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="bg-[#0d1117] border-[#30363d]">
                <CardContent className="p-6 text-center">
                  <SentimentBadge sentiment="positive" confidence={0.92} />
                  <p className="text-xs text-[#8b949e] mt-2">AI-powered sentiment analysis</p>
                </CardContent>
              </Card>
              <Card className="bg-[#0d1117] border-[#30363d]">
                <CardContent className="p-6 text-center">
                  <SentimentBadge sentiment="neutral" confidence={0.78} />
                  <p className="text-xs text-[#8b949e] mt-2">Neutral emotional tone</p>
                </CardContent>
              </Card>
              <Card className="bg-[#0d1117] border-[#30363d]">
                <CardContent className="p-6 text-center">
                  <SentimentBadge sentiment="negative" confidence={0.85} />
                  <p className="text-xs text-[#8b949e] mt-2">Emotional support needed</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}