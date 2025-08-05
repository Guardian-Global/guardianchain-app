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
import PlaylistNFTMinter from '../remix/PlaylistNFTMinter';
import CapsuleRemixer from '../remix/CapsuleRemixer';
import RemixLeaderboard from '../remix/RemixLeaderboard';
import RemixProfileBadges from '../profile/RemixProfileBadges';

export default function EnhancementShowcase() {
  const sampleStats = {
    views: 147,
    reactions: 23,
    unlocks: 5,
    verifications: 3,
    timeLockedDays: 90,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d1117] to-[#161b22] p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#00ffe1] to-[#ff00d4] flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-[#00ffe1] via-[#ff00d4] to-[#7c3aed] bg-clip-text text-transparent">
              Enhancement Suite
            </h1>
          </div>
          <p className="text-[#8b949e] text-xl max-w-2xl mx-auto leading-relaxed">
            Advanced analytics, AI-powered remixing, NFT minting, and community engagement features
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <div className="px-4 py-2 bg-[#161b22] border border-[#30363d] rounded-full text-sm text-[#00ffe1]">
              ✨ AI-Powered
            </div>
            <div className="px-4 py-2 bg-[#161b22] border border-[#30363d] rounded-full text-sm text-[#ff00d4]">
              🔗 Blockchain Ready
            </div>
            <div className="px-4 py-2 bg-[#161b22] border border-[#30363d] rounded-full text-sm text-[#7c3aed]">
              🎨 Creative Tools
            </div>
          </div>
        </header>

        <Tabs defaultValue="analytics" className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="inline-flex h-12 items-center justify-center rounded-xl bg-[#161b22] border border-[#30363d] p-1 shadow-lg backdrop-blur-sm">
              <div className="grid grid-cols-5 lg:grid-cols-10 gap-1">
                <TabsTrigger 
                  value="analytics" 
                  className="px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00ffe1] data-[state=active]:to-[#00d4aa] data-[state=active]:text-black data-[state=active]:shadow-lg hover:bg-[#30363d]/50"
                >
                  📊 Analytics
                </TabsTrigger>
                <TabsTrigger 
                  value="reactions" 
                  className="px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00ffe1] data-[state=active]:to-[#00d4aa] data-[state=active]:text-black data-[state=active]:shadow-lg hover:bg-[#30363d]/50"
                >
                  😍 Reactions
                </TabsTrigger>
                <TabsTrigger 
                  value="leaderboard" 
                  className="px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00ffe1] data-[state=active]:to-[#00d4aa] data-[state=active]:text-black data-[state=active]:shadow-lg hover:bg-[#30363d]/50"
                >
                  🏆 Leaders
                </TabsTrigger>
                <TabsTrigger 
                  value="reputation" 
                  className="px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00ffe1] data-[state=active]:to-[#00d4aa] data-[state=active]:text-black data-[state=active]:shadow-lg hover:bg-[#30363d]/50"
                >
                  ⭐ Reputation
                </TabsTrigger>
                <TabsTrigger 
                  value="value" 
                  className="px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00ffe1] data-[state=active]:to-[#00d4aa] data-[state=active]:text-black data-[state=active]:shadow-lg hover:bg-[#30363d]/50"
                >
                  💎 Value
                </TabsTrigger>
                <TabsTrigger 
                  value="playlist" 
                  className="px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00ffe1] data-[state=active]:to-[#00d4aa] data-[state=active]:text-black data-[state=active]:shadow-lg hover:bg-[#30363d]/50"
                >
                  🎵 Playlists
                </TabsTrigger>
                <TabsTrigger 
                  value="remix" 
                  className="px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00ffe1] data-[state=active]:to-[#00d4aa] data-[state=active]:text-black data-[state=active]:shadow-lg hover:bg-[#30363d]/50"
                >
                  🎨 AI Remix
                </TabsTrigger>
                <TabsTrigger 
                  value="contest" 
                  className="px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00ffe1] data-[state=active]:to-[#00d4aa] data-[state=active]:text-black data-[state=active]:shadow-lg hover:bg-[#30363d]/50"
                >
                  🏅 Contest
                </TabsTrigger>
                <TabsTrigger 
                  value="interactions" 
                  className="px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00ffe1] data-[state=active]:to-[#00d4aa] data-[state=active]:text-black data-[state=active]:shadow-lg hover:bg-[#30363d]/50"
                >
                  📈 Activity
                </TabsTrigger>
                <TabsTrigger 
                  value="sentiment" 
                  className="px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00ffe1] data-[state=active]:to-[#00d4aa] data-[state=active]:text-black data-[state=active]:shadow-lg hover:bg-[#30363d]/50"
                >
                  🤖 AI Insights
                </TabsTrigger>
              </div>
            </TabsList>
          </div>

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
                  <CardTitle className="text-[#00ffe1]">NFT Minting</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <PlaylistNFTMinter 
                    playlistId="demo-playlist-1"
                    playlistName="My Truth Collection"
                    capsuleCount={12}
                  />
                  <ul className="space-y-2 text-[#8b949e] text-sm">
                    <li className="flex items-center gap-2">
                      ✅ <span>Mint playlists as ERC-721 NFTs</span>
                    </li>
                    <li className="flex items-center gap-2">
                      ✅ <span>Showcase collection metadata</span>
                    </li>
                    <li className="flex items-center gap-2">
                      ✅ <span>Trade on OpenSea marketplace</span>
                    </li>
                    <li className="flex items-center gap-2">
                      ✅ <span>Earn royalties from sales</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="remix" className="space-y-6">
            <div className="grid gap-6">
              <CapsuleRemixer capsuleId="demo-capsule-1" />
              <Card className="bg-[#0d1117] border-[#30363d]">
                <CardHeader>
                  <CardTitle className="text-[#00ffe1]">Profile Remix Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <RemixProfileBadges remixCount={5} remixAwards={2} />
                  <p className="text-[#8b949e] mt-4 text-sm">
                    Track your remix journey from beginner to master. Earn badges, win contests, and claim exclusive NFT rewards for your creative contributions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="contest" className="space-y-6">
            <RemixLeaderboard />
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