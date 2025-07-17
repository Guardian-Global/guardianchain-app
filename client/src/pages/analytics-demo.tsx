import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CapsuleAnalytics from "@/components/analytics/capsule-analytics";
import { calculateTruthYield, calculateGTTReward, getYieldTier } from "@shared/utils/roi";
import { 
  TrendingUp, 
  BarChart3, 
  Coins, 
  Target,
  Zap,
  Trophy,
  Users,
  Activity
} from "lucide-react";

export default function AnalyticsDemo() {
  // Mock capsule data for analytics demonstration
  const mockCapsules = [
    {
      id: 101,
      title: "Climate Change Evidence: Arctic Ice Sheet Melting Acceleration",
      description: "Comprehensive analysis of arctic ice sheet data from 2020-2024 showing unprecedented melting rates.",
      content: "Detailed scientific analysis...",
      category: "science",
      status: "sealed",
      creatorId: 1,
      griefScore: "0.2",
      verificationCount: 15,
      replayCount: 89,
      viewCount: 342,
      shareCount: 67,
      minted: true,
      truthYield: "45.60",
      gttReward: "4.56",
      imageUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=101&backgroundColor=1e293b",
      ipfsHash: "QmX9ZV7Y8W6U5T4R3Q2P1O0N9M8L7K6J5I4H3G2F1E0D9",
      nftTokenId: "12345",
      docusignEnvelopeId: "env_climate_2024",
      veritasSealUrl: "https://demo.docusign.net/climate-seal",
      isPublic: true,
      tags: ["climate", "science", "arctic"],
      evidence: null,
      metadata: null,
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-02-20T14:45:00Z"
    },
    {
      id: 102,
      title: "Supply Chain Transparency: Fast Fashion Environmental Impact",
      description: "Investigation into hidden environmental costs of major fast fashion brands' supply chains.",
      content: "Detailed investigation...",
      category: "investigation",
      status: "verified",
      creatorId: 2,
      griefScore: "0.8",
      verificationCount: 23,
      replayCount: 156,
      viewCount: 1204,
      shareCount: 189,
      minted: false,
      truthYield: "78.30",
      gttReward: "7.83",
      imageUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=102&backgroundColor=2563eb",
      ipfsHash: null,
      nftTokenId: null,
      docusignEnvelopeId: null,
      veritasSealUrl: null,
      isPublic: true,
      tags: ["environment", "fashion", "supply-chain"],
      evidence: null,
      metadata: null,
      createdAt: "2024-02-10T09:15:00Z",
      updatedAt: "2024-02-25T16:20:00Z"
    },
    {
      id: 103,
      title: "Corporate Whistleblower: Healthcare Data Privacy Violations",
      description: "Internal documents revealing systematic patient data privacy violations at major healthcare provider.",
      content: "Whistleblower documentation...",
      category: "whistleblowing",
      status: "sealed",
      creatorId: 3,
      griefScore: "0.1",
      verificationCount: 45,
      replayCount: 267,
      viewCount: 2891,
      shareCount: 423,
      minted: true,
      truthYield: "156.75",
      gttReward: "23.51",
      imageUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=103&backgroundColor=7c3aed",
      ipfsHash: "QmP8M7L6K5J4I3H2G1F0E9D8C7B6A5Z9Y8X7W6V5U4T3",
      nftTokenId: "67890",
      docusignEnvelopeId: "env_healthcare_2024",
      veritasSealUrl: "https://demo.docusign.net/healthcare-seal",
      isPublic: true,
      tags: ["healthcare", "privacy", "whistleblowing"],
      evidence: null,
      metadata: null,
      createdAt: "2024-01-05T14:22:00Z",
      updatedAt: "2024-03-15T11:30:00Z"
    }
  ];

  // Calculate analytics for demo capsules
  const analyticsData = mockCapsules.map(capsule => {
    const truthYield = calculateTruthYield(capsule);
    const gttReward = calculateGTTReward(truthYield);
    const tier = getYieldTier(truthYield);
    
    return {
      capsule,
      truthYield,
      gttReward,
      tier,
      roi: ((capsule.viewCount * 0.5) + (capsule.shareCount * 1.5) + (capsule.verificationCount * 3.0))
    };
  });

  // Platform-wide analytics
  const totalViews = mockCapsules.reduce((sum, c) => sum + c.viewCount, 0);
  const totalShares = mockCapsules.reduce((sum, c) => sum + c.shareCount, 0);
  const totalVerifications = mockCapsules.reduce((sum, c) => sum + c.verificationCount, 0);
  const totalYield = analyticsData.reduce((sum, a) => sum + a.truthYield, 0);
  const totalGTT = analyticsData.reduce((sum, a) => sum + a.gttReward, 0);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
          TruthYield ROI Analytics
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Real-time analytics tracking for truth capsules with yield calculation, 
          GTT token rewards, and creator monetization insights.
        </p>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <Activity className="h-6 w-6 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{totalViews.toLocaleString()}</div>
            <div className="text-xs text-slate-400">Total Views</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-6 w-6 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{totalShares.toLocaleString()}</div>
            <div className="text-xs text-slate-400">Total Shares</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <Users className="h-6 w-6 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{totalVerifications}</div>
            <div className="text-xs text-slate-400">Verifications</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <Target className="h-6 w-6 text-orange-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{totalYield.toFixed(2)}</div>
            <div className="text-xs text-slate-400">Total Yield</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <Coins className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{totalGTT.toFixed(2)}</div>
            <div className="text-xs text-slate-400">GTT Rewards</div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Analytics */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Performer */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-400" />
              Top Performing Capsule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData
                .sort((a, b) => b.truthYield - a.truthYield)
                .slice(0, 1)
                .map((data) => (
                  <div key={data.capsule.id} className="space-y-3">
                    <div className="flex items-start gap-3">
                      <img 
                        src={data.capsule.imageUrl} 
                        alt="Capsule" 
                        className="w-12 h-12 rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-white text-sm line-clamp-2">
                          {data.capsule.title}
                        </h4>
                        <div className="flex gap-2 mt-1">
                          <Badge className={data.tier.color}>
                            {data.tier.tier}
                          </Badge>
                          <Badge className="bg-slate-600">
                            {data.capsule.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2 text-center text-sm">
                      <div>
                        <div className="font-bold text-blue-400">{data.capsule.viewCount}</div>
                        <div className="text-xs text-slate-400">Views</div>
                      </div>
                      <div>
                        <div className="font-bold text-green-400">{data.capsule.shareCount}</div>
                        <div className="text-xs text-slate-400">Shares</div>
                      </div>
                      <div>
                        <div className="font-bold text-purple-400">{data.truthYield.toFixed(2)}</div>
                        <div className="text-xs text-slate-400">Yield</div>
                      </div>
                      <div>
                        <div className="font-bold text-yellow-400">{data.gttReward.toFixed(2)}</div>
                        <div className="text-xs text-slate-400">GTT</div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* ROI Formula */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-400" />
              TruthYield Formula
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-slate-900 p-4 rounded-lg">
                <div className="text-sm font-mono text-slate-300">
                  <div>yield = (views × 0.5)</div>
                  <div className="ml-8">+ (shares × 1.5)</div>
                  <div className="ml-8">+ (verifications × 3.0)</div>
                  <div className="ml-8">+ (minted × 10.0)</div>
                  <div className="ml-8">+ (veritas_sealed × 5.0)</div>
                  <div className="mt-2">× grief_multiplier</div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Views (engagement)</span>
                  <span className="text-blue-400">0.5 points each</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Shares (viral growth)</span>
                  <span className="text-green-400">1.5 points each</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Verifications (trust)</span>
                  <span className="text-purple-400">3.0 points each</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">NFT Minted (permanence)</span>
                  <span className="text-orange-400">10.0 bonus</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Veritas Sealed (legal)</span>
                  <span className="text-yellow-400">5.0 bonus</span>
                </div>
              </div>

              <div className="text-xs text-slate-500">
                GTT conversion: 1 yield point = 0.1 GTT
                <br />
                Premium tiers apply multipliers for high-yield capsules
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Individual Capsule Analytics */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Individual Capsule Analytics</h2>
        
        <div className="space-y-6">
          {mockCapsules.map((capsule) => (
            <div key={capsule.id} className="grid lg:grid-cols-3 gap-6">
              {/* Capsule Info */}
              <div className="lg:col-span-1">
                <Card className="bg-slate-800 border-slate-700 h-full">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <img 
                          src={capsule.imageUrl} 
                          alt="Capsule" 
                          className="w-12 h-12 rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-white text-sm line-clamp-2">
                            {capsule.title}
                          </h4>
                          <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                            {capsule.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 flex-wrap">
                        <Badge className={
                          capsule.status === 'sealed' ? 'bg-purple-600' :
                          capsule.status === 'verified' ? 'bg-green-600' :
                          'bg-blue-600'
                        }>
                          {capsule.status === 'sealed' ? 'Veritas Sealed' : 
                           capsule.status === 'verified' ? 'Verified' : 
                           'Pending'}
                        </Badge>
                        <Badge className="bg-slate-600">
                          {capsule.category}
                        </Badge>
                        {capsule.minted && (
                          <Badge className="bg-orange-600">
                            NFT Minted
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Analytics */}
              <div className="lg:col-span-2">
                <CapsuleAnalytics 
                  capsule={capsule}
                  walletAddress="0x1234567890abcdef1234567890abcdef12345678"
                  showClaimButton={true}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Implementation Summary */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-green-400" />
            TruthYield Analytics Implementation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-white">✅ Backend Features</h4>
              <ul className="text-sm text-slate-400 space-y-1">
                <li>• Real-time view/share tracking via API endpoints</li>
                <li>• Dynamic yield calculation based on engagement</li>
                <li>• GTT token reward calculation and claiming</li>
                <li>• Analytics data persistence and growth tracking</li>
                <li>• Smart contract integration ready (mock implementation)</li>
              </ul>

              <h4 className="font-semibold text-white mt-4">✅ Frontend Components</h4>
              <ul className="text-sm text-slate-400 space-y-1">
                <li>• CapsuleAnalytics component with real-time updates</li>
                <li>• Yield tier visualization and GTT claim functionality</li>
                <li>• Share button analytics tracking integration</li>
                <li>• Comprehensive ROI breakdown and insights</li>
                <li>• Performance metrics and growth rate calculations</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-white">🚀 Ready for Production</h4>
              <ul className="text-sm text-slate-400 space-y-1">
                <li>• Automated share tracking on social platforms</li>
                <li>• Creator monetization with GTT token rewards</li>
                <li>• Viral growth incentives through yield multipliers</li>
                <li>• Truth verification impact on yield calculations</li>
                <li>• Veritas sealing bonus for legal proof documents</li>
              </ul>

              <h4 className="font-semibold text-white mt-4">🔗 Next Integration</h4>
              <ul className="text-sm text-slate-400 space-y-1">
                <li>• Deploy TruthYield smart contract to blockchain</li>
                <li>• Connect MetaMask for real GTT token claiming</li>
                <li>• DAO governance for yield formula parameters</li>
                <li>• Dispute resolution and creator protection systems</li>
                <li>• Advanced analytics dashboard with historical data</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}