import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Zap, 
  Users, 
  TrendingUp, 
  Share2,
  Crown,
  Timer,
  Gift,
  Target,
  Rocket,
  DollarSign
} from "lucide-react";

interface ViralPost {
  platform: string;
  content: string;
  hashtags: string[];
  expectedViews: number;
  expectedClicks: number;
  gttReward: number;
}

export default function InstantViralTrigger() {
  const [userHandle, setUserHandle] = useState("");
  const [contentIdea, setContentIdea] = useState("");
  const [viralPosts, setViralPosts] = useState<ViralPost[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateViralContent = async () => {
    if (!userHandle || !contentIdea) return;
    
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const posts: ViralPost[] = [
        {
          platform: "Twitter/X",
          content: `🚨 BREAKING: @guardianchain just launched GTT token with 8% transaction fees!\n\nFirst ${userHandle} to try truth verification gets 10x GTT bonus!\n\nThis could be the next 100x...\n\n#GTT #TruthToken #DeFi #Crypto`,
          hashtags: ["#GTT", "#TruthToken", "#DeFi", "#Crypto", "#100x"],
          expectedViews: 25000,
          expectedClicks: 750,
          gttReward: 50
        },
        {
          platform: "TikTok",
          content: `POV: You discover a token that pays 8% fees to holders 💰\n\n${contentIdea}\n\nLink in bio to join the revolution! 🚀`,
          hashtags: ["#crypto", "#defi", "#passiveincome", "#investing", "#gtt"],
          expectedViews: 100000,
          expectedClicks: 2000,
          gttReward: 100
        },
        {
          platform: "Instagram",
          content: `The truth about ${contentIdea}...\n\nJust uploaded it to @guardianchain and already earned 25 GTT tokens! 💎\n\nFirst 100 people to verify get MASSIVE bonuses!\n\nStory highlight for details ↗️`,
          hashtags: ["#truthseeker", "#crypto", "#blockchain", "#gtt", "#viral"],
          expectedViews: 15000,
          expectedClicks: 450,
          gttReward: 35
        },
        {
          platform: "YouTube Short",
          content: `"I made $500 in 24 hours posting truth on blockchain"\n\n${contentIdea}\n\nComment "GTT" for the link! 👇`,
          hashtags: ["#blockchain", "#crypto", "#makemoney", "#gtt", "#shorts"],
          expectedViews: 50000,
          expectedClicks: 1200,
          gttReward: 75
        }
      ];
      
      setViralPosts(posts);
      setIsGenerating(false);
    }, 2000);
  };

  const totalExpectedViews = viralPosts.reduce((sum, post) => sum + post.expectedViews, 0);
  const totalExpectedClicks = viralPosts.reduce((sum, post) => sum + post.expectedClicks, 0);
  const totalGttReward = viralPosts.reduce((sum, post) => sum + post.gttReward, 0);

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Rocket className="w-12 h-12 text-purple-400 mr-3" />
          <h2 className="text-4xl font-bold text-white">
            Instant Viral Trigger
          </h2>
        </div>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          Generate platform-specific viral content that drives massive GTT trading volume
        </p>
      </div>

      {/* Input Form */}
      <Card className="bg-slate-800/50 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Target className="w-6 h-6 mr-2 text-purple-400" />
            Content Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-white font-semibold mb-2 block">
              Your Social Media Handle
            </label>
            <Input
              placeholder="@yourhandle"
              value={userHandle}
              onChange={(e) => setUserHandle(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
          
          <div>
            <label className="text-white font-semibold mb-2 block">
              Content/Truth Idea
            </label>
            <Textarea
              placeholder="Describe your content idea or truth claim..."
              value={contentIdea}
              onChange={(e) => setContentIdea(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white h-24"
            />
          </div>
          
          <Button 
            onClick={generateViralContent}
            disabled={!userHandle || !contentIdea || isGenerating}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {isGenerating ? (
              <>
                <Timer className="w-5 h-5 mr-2 animate-spin" />
                Generating Viral Content...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 mr-2" />
                Generate Viral Posts
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {viralPosts.length > 0 && (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-500/30">
              <CardContent className="pt-6 text-center">
                <Users className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {totalExpectedViews.toLocaleString()}
                </div>
                <div className="text-slate-400">Expected Views</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-green-500/30">
              <CardContent className="pt-6 text-center">
                <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {totalExpectedClicks.toLocaleString()}
                </div>
                <div className="text-slate-400">Expected Clicks</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border-yellow-500/30">
              <CardContent className="pt-6 text-center">
                <Gift className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {totalGttReward}
                </div>
                <div className="text-slate-400">GTT Rewards</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-red-600/20 to-pink-600/20 border-red-500/30">
              <CardContent className="pt-6 text-center">
                <DollarSign className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  ${(totalExpectedClicks * 0.05).toFixed(0)}
                </div>
                <div className="text-slate-400">Est. Revenue</div>
              </CardContent>
            </Card>
          </div>

          {/* Generated Posts */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white text-center">
              Your Viral Content Strategy
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {viralPosts.map((post, index) => (
                <Card key={index} className="bg-slate-800/50 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <span>{post.platform}</span>
                      <Badge className="bg-purple-600">
                        {post.gttReward} GTT
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-slate-700/50 p-4 rounded-lg">
                      <p className="text-white whitespace-pre-line">
                        {post.content}
                      </p>
                    </div>
                    
                    <div>
                      <div className="text-slate-400 text-sm mb-2">Hashtags:</div>
                      <div className="flex flex-wrap gap-2">
                        {post.hashtags.map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-blue-400 border-blue-400">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-slate-400">Expected Views</div>
                        <div className="text-white font-semibold">
                          {post.expectedViews.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-400">Expected Clicks</div>
                        <div className="text-white font-semibold">
                          {post.expectedClicks.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      onClick={() => navigator.clipboard.writeText(post.content)}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Copy & Post Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <Card className="bg-gradient-to-r from-red-600/10 to-orange-600/10 border-red-500/30">
            <CardContent className="pt-6 text-center">
              <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">
                ⚠️ Post These Within 2 Hours for Maximum Impact
              </h3>
              <p className="text-slate-300 mb-6">
                Viral content has a short window. Post all 4 platforms within 2 hours to maximize 
                cross-platform momentum and GTT trading volume surge.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  onClick={() => window.location.href = '/create-capsule'}
                >
                  Create Truth Capsule First
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-green-500 text-green-400 hover:bg-green-500/10"
                  onClick={() => window.location.href = '/launch-bonuses'}
                >
                  Check Launch Bonuses
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

    </div>
  );
}