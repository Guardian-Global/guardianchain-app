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
    <div className="w-full p-4 md:p-6" style={{minHeight: '100vh'}}>
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12 p-8 rounded-3xl" style={{background: 'hsla(240, 10%, 3.9%, 0.8)', backdropFilter: 'blur(12px)', border: '1px solid hsla(0, 0%, 100%, 0.1)', boxShadow: '0 8px 32px hsla(0, 0%, 0%, 0.37), 0 0 20px hsla(180, 100%, 50%, 0.5), 0 0 40px hsla(180, 100%, 50%, 0.3)', borderColor: 'hsl(180, 100%, 50%)'}}>
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{background: 'linear-gradient(135deg, hsl(180, 100%, 50%) 0%, hsl(285, 100%, 65%) 35%, hsl(330, 100%, 50%) 70%, hsl(180, 100%, 50%) 100%)', backgroundSize: '400% 400%', animation: 'gradient-shift 8s ease infinite, neon-pulse 2s ease-in-out infinite alternate', boxShadow: '0 0 20px hsla(285, 100%, 65%, 0.5), 0 0 40px hsla(285, 100%, 65%, 0.3)', border: '1px solid hsl(285, 100%, 65%)'}}>
              <span className="text-3xl animate-pulse">⚡</span>
            </div>
            <h1 className="text-6xl font-display bg-gradient-to-r from-[#00ffe1] via-[#ff00d4] to-[#7c3aed] bg-clip-text text-transparent animate-pulse">
              Enhancement Suite
            </h1>
          </div>
          <p className="text-[#e6edf3] text-2xl max-w-3xl mx-auto leading-relaxed font-web3 mb-8">
            Revolutionary AI-powered remixing, NFT minting, and community engagement platform
          </p>
          <div className="flex justify-center gap-6 mt-8">
            <div className="px-6 py-3 rounded-full text-base text-[#00ffe1] font-quantum transition-all duration-300 hover:scale-105" style={{background: 'hsla(240, 10%, 3.9%, 0.8)', backdropFilter: 'blur(12px)', border: '1px solid hsl(180, 100%, 50%)', boxShadow: '0 0 20px hsla(180, 100%, 50%, 0.5), 0 0 40px hsla(180, 100%, 50%, 0.3)'}}>
              ✨ AI-Powered
            </div>
            <div className="px-6 py-3 rounded-full text-base text-[#ff00d4] font-quantum transition-all duration-300 hover:scale-105" style={{background: 'hsla(240, 10%, 3.9%, 0.8)', backdropFilter: 'blur(12px)', border: '1px solid hsl(330, 100%, 50%)', boxShadow: '0 0 20px hsla(330, 100%, 50%, 0.5), 0 0 40px hsla(330, 100%, 50%, 0.3)'}}>
              🔗 Blockchain Ready
            </div>
            <div className="px-6 py-3 rounded-full text-base text-[#7c3aed] font-quantum transition-all duration-300 hover:scale-105" style={{background: 'hsla(240, 10%, 3.9%, 0.8)', backdropFilter: 'blur(12px)', border: '1px solid hsl(285, 100%, 65%)', boxShadow: '0 0 20px hsla(285, 100%, 65%, 0.5), 0 0 40px hsla(285, 100%, 65%, 0.3)'}}>
              🎨 Creative Tools
            </div>
          </div>
        </header>

        <Tabs defaultValue="analytics" className="space-y-10">
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-5 lg:grid-cols-10 gap-2">
              <TabsTrigger value="analytics">
                📊 Analytics
              </TabsTrigger>
              <TabsTrigger value="reactions">
                😍 Reactions
              </TabsTrigger>
              <TabsTrigger value="leaderboard">
                🏆 Leaders
              </TabsTrigger>
              <TabsTrigger value="reputation">
                ⭐ Reputation
              </TabsTrigger>
              <TabsTrigger value="value">
                💎 Value
              </TabsTrigger>
              <TabsTrigger value="playlist">
                🎵 Playlists
              </TabsTrigger>
              <TabsTrigger value="remix">
                🎨 AI Remix
              </TabsTrigger>
              <TabsTrigger value="contest">
                🏅 Contest
              </TabsTrigger>
              <TabsTrigger value="interactions">
                📈 Activity
              </TabsTrigger>
              <TabsTrigger value="sentiment">
                🤖 AI Insights
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="analytics" className="space-y-8">
            <div className="grid gap-8 lg:grid-cols-2">
              <CapsuleStatsGraph capsuleId="demo-capsule-1" />
              <Card variant="glass";
                <CardHeader className="pb-6">
                  <CardTitle className="text-[#00ffe1] font-quantum text-2xl flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{background: 'linear-gradient(135deg, hsl(180, 100%, 50%) 0%, hsl(285, 100%, 65%) 35%, hsl(330, 100%, 50%) 70%, hsl(180, 100%, 50%) 100%)', backgroundSize: '400% 400%', animation: 'gradient-shift 8s ease infinite'}}>
                      <span className="text-lg">📊</span>
                    </div>
                    Real-time Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#e6edf3] font-web3 text-lg mb-6">
                    Interactive charts with secure increment operations, weekly trends, and comprehensive engagement metrics.
                  </p>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 rounded-xl" style={{background: 'hsla(240, 10%, 3.9%, 0.8)', backdropFilter: 'blur(12px)', border: '1px solid hsla(0, 0%, 100%, 0.1)', boxShadow: '0 8px 32px hsla(0, 0%, 0%, 0.37)'}}>
                      <span className="text-[#8b949e] font-medium">Views</span>
                      <span className="text-[#00ffe1] font-quantum text-xl">2,143</span>
                    </div>
                    <div className="flex justify-between items-center p-4 rounded-xl" style={{background: 'hsla(240, 10%, 3.9%, 0.8)', backdropFilter: 'blur(12px)', border: '1px solid hsla(0, 0%, 100%, 0.1)', boxShadow: '0 8px 32px hsla(0, 0%, 0%, 0.37)'}}>
                      <span className="text-[#8b949e] font-medium">Engagement Rate</span>
                      <span className="text-[#00ffe1] font-quantum text-xl">87.3%</span>
                    </div>
                    <div className="flex justify-between items-center p-4 rounded-xl" style={{background: 'hsla(240, 10%, 3.9%, 0.8)', backdropFilter: 'blur(12px)', border: '1px solid hsl(285, 100%, 65%)', boxShadow: '0 0 20px hsla(285, 100%, 65%, 0.5), 0 0 40px hsla(285, 100%, 65%, 0.3), 0 8px 32px hsla(0, 0%, 0%, 0.37)'}}>
                      <span className="text-[#8b949e] font-medium">Weekly Growth</span>
                      <span className="text-[#00ff88] font-quantum text-xl" style={{animation: 'neon-pulse 2s ease-in-out infinite alternate'}}>+12.5%</span>
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