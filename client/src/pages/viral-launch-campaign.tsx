import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, 
  TrendingUp, 
  Users, 
  MessageSquare,
  Heart,
  Share2,
  Target,
  Globe,
  Award,
  Rocket,
  ExternalLink,
  Copy,
  CheckCircle
} from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function ViralLaunchCampaign() {
  const [viralScore, setViralScore] = useState(87);
  const [campaignActive, setCampaignActive] = useState(true);
  const { toast } = useToast();

  const viralMetrics = {
    totalReach: "2.3M",
    engagement: "19.2%",
    shares: "47,892",
    mentions: "156K",
    hashtagUse: "89,432",
    influencerPosts: "247",
    ugcPosts: "1,847",
    conversionRate: "3.4%"
  };

  const platforms = [
    {
      name: "Twitter/X",
      followers: "28,543",
      posts: "156",
      engagement: "12.3%",
      reach: "847K",
      hashtags: ["#GTTToken", "#TruthVerification", "#Web3Truth"],
      status: "Active",
      color: "bg-blue-600"
    },
    {
      name: "TikTok",
      followers: "67,892",
      posts: "89",
      engagement: "8.7%",
      reach: "2.1M",
      hashtags: ["#GTTChallenge", "#TruthToken", "#CryptoTruth"],
      status: "Viral",
      color: "bg-pink-600"
    },
    {
      name: "Instagram",
      followers: "34,567",
      posts: "123",
      engagement: "15.6%",
      reach: "567K",
      hashtags: ["#GuardianChain", "#DigitalTruth", "#BlockchainVerification"],
      status: "Growing",
      color: "bg-purple-600"
    },
    {
      name: "YouTube",
      followers: "12,987",
      posts: "34",
      engagement: "22.1%",
      reach: "234K",
      hashtags: ["#GTTExplained", "#TruthEconomy", "#CryptoEducation"],
      status: "Educational",
      color: "bg-red-600"
    },
    {
      name: "LinkedIn",
      followers: "8,765",
      posts: "45",
      engagement: "9.8%",
      reach: "156K",
      hashtags: ["#BlockchainInnovation", "#TruthTechnology", "#Web3Professional"],
      status: "Professional",
      color: "bg-blue-800"
    },
    {
      name: "Discord",
      members: "23,456",
      messages: "89,234",
      active: "4,567",
      events: "12",
      channels: 15,
      status: "Community Hub",
      color: "bg-indigo-600"
    }
  ];

  const viralCampaigns = [
    {
      name: "GTT Launch Challenge",
      description: "24-hour viral content creation contest",
      prize: "50,000 GTT",
      participants: "2,847",
      submissions: "1,234",
      engagement: "94.2%",
      status: "Live",
      timeLeft: "14h 23m"
    },
    {
      name: "Truth Verification Stories",
      description: "User-generated content about truth verification",
      prize: "25,000 GTT",
      participants: "1,567",
      submissions: "892",
      engagement: "87.5%",
      status: "Judging",
      timeLeft: "2d 8h"
    },
    {
      name: "Influencer Partnership Program",
      description: "Micro and macro influencer collaborations",
      prize: "100,000 GTT",
      participants: "234",
      submissions: "156",
      engagement: "156.3%",
      status: "Recruiting",
      timeLeft: "Ongoing"
    }
  ];

  const contentTemplates = [
    {
      platform: "Twitter",
      template: "🚀 BREAKING: $GTT just launched with REVOLUTIONARY truth verification! \n\n📈 Already up 847% in 24h\n🔥 8% fees = passive income for holders\n✅ Court-admissible verification system\n\n#GTTToken #TruthVerification #CryptoGems",
      engagement: "High",
      cta: "Copy Template"
    },
    {
      platform: "TikTok",
      template: "POV: You found the next 1000x crypto gem 💎\n\n$GTT = Truth verification token\n✅ Real utility\n✅ 8% holder rewards\n✅ Already mooning\n\nNot financial advice but... 👀\n\n#GTTChallenge #CryptoTruth #TruthToken",
      engagement: "Viral",
      cta: "Copy Template"
    },
    {
      platform: "Instagram",
      template: "🔍 The future of truth is here with $GTT 🔍\n\nSwipe to see why this could be the biggest crypto launch of 2025:\n\n1️⃣ Revolutionary truth verification\n2️⃣ Court-admissible evidence system\n3️⃣ 8% rewards for holders\n4️⃣ Institutional partnerships incoming\n\n#GuardianChain #DigitalTruth #CryptoInnovation",
      engagement: "Professional",
      cta: "Copy Template"
    }
  ];

  const copyToClipboard = (text: string, platform: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Template Copied!",
      description: `${platform} content template copied to clipboard`,
    });
  };

  const launchViral = () => {
    setCampaignActive(true);
    setViralScore(prev => Math.min(100, prev + 5));
    toast({
      title: "Viral Campaign Activated!",
      description: "All social media campaigns are now live",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            ⚡ VIRAL LAUNCH CAMPAIGN
          </h1>
          <p className="text-xl text-slate-300 mb-6">
            Maximum exposure strategy across all major social platforms
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Badge className="bg-green-600/20 text-green-400 text-lg px-4 py-2">
              VIRAL SCORE: {viralScore}/100
            </Badge>
            <Badge className={`text-lg px-4 py-2 ${
              campaignActive ? 'bg-red-600/20 text-red-400' : 'bg-gray-600/20 text-gray-400'
            }`}>
              {campaignActive ? 'CAMPAIGN LIVE' : 'CAMPAIGN PENDING'}
            </Badge>
          </div>
        </div>

        {/* Viral Metrics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border-blue-500/30">
            <CardContent className="p-4 text-center">
              <Globe className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-400">{viralMetrics.totalReach}</div>
              <p className="text-slate-300 text-sm">Total Reach</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/30">
            <CardContent className="p-4 text-center">
              <Heart className="h-6 w-6 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-400">{viralMetrics.engagement}</div>
              <p className="text-slate-300 text-sm">Engagement Rate</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-500/30">
            <CardContent className="p-4 text-center">
              <Share2 className="h-6 w-6 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-400">{viralMetrics.shares}</div>
              <p className="text-slate-300 text-sm">Total Shares</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-yellow-500/30">
            <CardContent className="p-4 text-center">
              <MessageSquare className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-400">{viralMetrics.mentions}</div>
              <p className="text-slate-300 text-sm">Social Mentions</p>
            </CardContent>
          </Card>
        </div>

        {/* Platform Performance */}
        <Card className="bg-slate-800/50 border-slate-700 mb-12">
          <CardHeader>
            <CardTitle className="text-white text-2xl flex items-center space-x-3">
              <TrendingUp className="h-6 w-6 text-blue-400" />
              <span>Platform Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {platforms.map((platform, index) => (
                <div key={index} className="p-4 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-bold">{platform.name}</h3>
                    <Badge className={`${platform.color}/20 text-white`}>
                      {platform.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Followers:</span>
                      <span className="text-white font-semibold">{platform.followers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Posts:</span>
                      <span className="text-blue-400 font-semibold">{platform.posts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Engagement:</span>
                      <span className="text-green-400 font-semibold">{platform.engagement}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Reach:</span>
                      <span className="text-purple-400 font-semibold">{platform.reach}</span>
                    </div>
                  </div>
                  
                  {platform.hashtags && (
                    <div className="mb-4">
                      <p className="text-slate-400 text-sm mb-2">Top Hashtags:</p>
                      <div className="flex flex-wrap gap-1">
                        {platform.hashtags.map((tag, idx) => (
                          <Badge key={idx} className="bg-slate-600/50 text-slate-300 text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Campaigns */}
        <Card className="bg-slate-800/50 border-slate-700 mb-12">
          <CardHeader>
            <CardTitle className="text-white text-2xl flex items-center space-x-3">
              <Target className="h-6 w-6 text-purple-400" />
              <span>Active Viral Campaigns</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {viralCampaigns.map((campaign, index) => (
                <div key={index} className="p-6 bg-slate-700/30 rounded-lg">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-white font-bold text-lg">{campaign.name}</h3>
                        <Badge className={`
                          ${campaign.status === 'Live' ? 'bg-red-600/20 text-red-400' : ''}
                          ${campaign.status === 'Judging' ? 'bg-yellow-600/20 text-yellow-400' : ''}
                          ${campaign.status === 'Recruiting' ? 'bg-blue-600/20 text-blue-400' : ''}
                        `}>
                          {campaign.status}
                        </Badge>
                      </div>
                      
                      <p className="text-slate-300 mb-4">{campaign.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-slate-400 text-sm">Prize Pool</p>
                          <p className="text-green-400 font-semibold">{campaign.prize}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">Participants</p>
                          <p className="text-blue-400 font-semibold">{campaign.participants}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">Submissions</p>
                          <p className="text-purple-400 font-semibold">{campaign.submissions}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">Engagement</p>
                          <p className="text-yellow-400 font-semibold">{campaign.engagement}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col justify-center">
                      <div className="text-center mb-4">
                        <p className="text-slate-400 text-sm">Time Remaining</p>
                        <p className="text-white font-bold text-xl">{campaign.timeLeft}</p>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        className="border-green-500 text-green-400 hover:bg-green-600/20"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Campaign
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content Templates */}
        <Card className="bg-slate-800/50 border-slate-700 mb-12">
          <CardHeader>
            <CardTitle className="text-white text-2xl flex items-center space-x-3">
              <Copy className="h-6 w-6 text-green-400" />
              <span>Viral Content Templates</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {contentTemplates.map((template, index) => (
                <div key={index} className="p-6 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-white font-bold">{template.platform}</h3>
                      <Badge className={`
                        ${template.engagement === 'High' ? 'bg-orange-600/20 text-orange-400' : ''}
                        ${template.engagement === 'Viral' ? 'bg-red-600/20 text-red-400' : ''}
                        ${template.engagement === 'Professional' ? 'bg-blue-600/20 text-blue-400' : ''}
                      `}>
                        {template.engagement} Engagement
                      </Badge>
                    </div>
                    
                    <Button 
                      size="sm"
                      onClick={() => copyToClipboard(template.template, template.platform)}
                      className="bg-green-600/20 text-green-400 hover:bg-green-600/40"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      {template.cta}
                    </Button>
                  </div>
                  
                  <div className="p-4 bg-slate-600/30 rounded border-l-4 border-blue-400">
                    <p className="text-slate-200 whitespace-pre-line text-sm leading-relaxed">
                      {template.template}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Launch Controls */}
        <Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-3">
              <Rocket className="h-6 w-6 text-purple-400" />
              <span>Viral Launch Controls</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="mb-6">
                <div className="text-3xl font-bold text-white mb-2">VIRAL READINESS</div>
                <Progress value={viralScore} className="h-4 mb-2" />
                <p className="text-slate-300">All platforms primed for maximum exposure</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="text-center">
                  <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <p className="text-white font-semibold">Content Ready</p>
                  <p className="text-slate-400 text-sm">All templates prepared</p>
                </div>
                
                <div className="text-center">
                  <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <p className="text-white font-semibold">Influencers Activated</p>
                  <p className="text-slate-400 text-sm">247 creators standing by</p>
                </div>
                
                <div className="text-center">
                  <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <p className="text-white font-semibold">Campaigns Live</p>
                  <p className="text-slate-400 text-sm">Multi-platform coordination</p>
                </div>
              </div>
              
              <Button 
                size="lg"
                onClick={launchViral}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg px-8 py-3"
              >
                <Zap className="h-6 w-6 mr-3" />
                ACTIVATE MAXIMUM VIRAL EXPOSURE
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}