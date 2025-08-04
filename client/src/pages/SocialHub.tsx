import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Users, Heart, MessageCircle, Share2, Trophy, Star, TrendingUp,
  Search, Filter, Globe, Clock, Zap, Eye, ChevronRight,
  ThumbsUp, Bookmark, MoreHorizontal, Award, Shield
} from "lucide-react";

export default function SocialHub() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: socialFeed } = useQuery({
    queryKey: ["/api/social/feed"],
    staleTime: 30000,
  });

  const { data: trendingTopics } = useQuery({
    queryKey: ["/api/social/trending"],
    staleTime: 60000,
  });

  const { data: topCreators } = useQuery({
    queryKey: ["/api/social/creators"],
    staleTime: 60000,
  });

  const mockSocialFeed = [
    {
      id: "1",
      user: { name: "TruthSeeker87", avatar: "", verified: true, tier: "Guardian" },
      content: "Just discovered an incredible truth capsule about ancient blockchain artifacts. The verification process is mind-blowing! 🔍",
      timestamp: "2 hours ago",
      likes: 234,
      comments: 45,
      shares: 23,
      truthScore: 95,
      type: "discovery"
    },
    {
      id: "2", 
      user: { name: "CyberVault", avatar: "", verified: true, tier: "Sovereign" },
      content: "Our latest DAO proposal for expanding the validator network just passed! Excited for the future of decentralized truth verification.",
      timestamp: "4 hours ago",
      likes: 567,
      comments: 89,
      shares: 156,
      truthScore: 98,
      type: "announcement"
    },
    {
      id: "3",
      user: { name: "QuantumGuardian", avatar: "", verified: false, tier: "Seeker" },
      content: "Finally minted my first NFT capsule! The grief scoring algorithm is fascinating. Here's my analysis thread 🧵",
      timestamp: "6 hours ago",
      likes: 123,
      comments: 34,
      shares: 12,
      truthScore: 87,
      type: "achievement"
    }
  ];

  const mockTrending = [
    { tag: "#TruthVerification", posts: 1247, growth: "+23%" },
    { tag: "#DAOGovernance", posts: 856, growth: "+45%" },
    { tag: "#CapsuleNFT", posts: 634, growth: "+67%" },
    { tag: "#GriefScore", posts: 423, growth: "+12%" },
    { tag: "#ValidatorRewards", posts: 312, growth: "+89%" }
  ];

  const mockCreators = [
    { name: "BlockchainSage", followers: 12547, truthScore: 98, capsules: 234, badge: "Legendary" },
    { name: "CryptoOracle", followers: 8934, truthScore: 96, capsules: 187, badge: "Master" },
    { name: "DigitalGuardian", followers: 6723, truthScore: 94, capsules: 156, badge: "Guardian" },
    { name: "TruthVault", followers: 4562, truthScore: 92, capsules: 123, badge: "Verified" }
  ];

  const getPostIcon = (type: string) => {
    switch (type) {
      case "discovery": return <Search className="w-5 h-5 text-[#00ffe1]" />;
      case "announcement": return <Globe className="w-5 h-5 text-[#ff00d4]" />;
      case "achievement": return <Trophy className="w-5 h-5 text-[#f79009]" />;
      default: return <MessageCircle className="w-5 h-5 text-[#8b949e]" />;
    }
  };

  const getTierBadge = (tier: string) => {
    const colors: Record<string, string> = {
      "Sovereign": "border-[#ff00d4] text-[#ff00d4]",
      "Guardian": "border-[#00ffe1] text-[#00ffe1]", 
      "Seeker": "border-[#7c3aed] text-[#7c3aed]",
      "Explorer": "border-[#10b981] text-[#10b981]"
    };
    return colors[tier] || "border-[#8b949e] text-[#8b949e]";
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#f0f6fc] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gradient-neural mb-4">
            Social Hub
          </h1>
          <p className="text-xl text-[#8b949e] max-w-3xl mx-auto">
            Connect with the Guardian community. Share discoveries, celebrate achievements, and build the future of truth together.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#8b949e]" />
            <Input
              placeholder="Search posts, users, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#161b22] border-[#30363d] text-[#f0f6fc] h-12"
            />
            <Button size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#00ffe1] text-[#0d1117] hover:bg-[#00e5cb]">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="feed" className="space-y-6">
              <TabsList className="bg-[#161b22] border-[#30363d] p-1 grid grid-cols-4">
                <TabsTrigger value="feed" className="data-[state=active]:bg-[#00ffe1] data-[state=active]:text-[#0d1117]">
                  Feed
                </TabsTrigger>
                <TabsTrigger value="trending" className="data-[state=active]:bg-[#ff00d4] data-[state=active]:text-[#0d1117]">
                  Trending
                </TabsTrigger>
                <TabsTrigger value="following" className="data-[state=active]:bg-[#7c3aed] data-[state=active]:text-[#0d1117]">
                  Following
                </TabsTrigger>
                <TabsTrigger value="live" className="data-[state=active]:bg-[#10b981] data-[state=active]:text-[#0d1117]">
                  Live
                </TabsTrigger>
              </TabsList>

              <TabsContent value="feed" className="space-y-6">
                {mockSocialFeed.map((post) => (
                  <Card key={post.id} className="bg-[#161b22] border-[#30363d] hover:border-[#00ffe1]/30 transition-all">
                    <CardContent className="p-6">
                      {/* Post Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00ffe1] to-[#ff00d4] p-0.5">
                          <div className="w-full h-full rounded-full bg-[#161b22] flex items-center justify-center">
                            <Users className="w-6 h-6 text-[#8b949e]" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[#f0f6fc]">{post.user.name}</span>
                            {post.user.verified && <Shield className="w-4 h-4 text-[#00ffe1]" />}
                            <Badge variant="outline" className={getTierBadge(post.user.tier)}>
                              {post.user.tier}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-[#8b949e]">
                            <Clock className="w-3 h-3" />
                            <span>{post.timestamp}</span>
                            <span>•</span>
                            <span>Truth Score: {post.truthScore}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getPostIcon(post.type)}
                          <Button size="sm" variant="ghost" className="text-[#8b949e] hover:text-[#f0f6fc]">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Post Content */}
                      <p className="text-[#f0f6fc] mb-4 leading-relaxed">{post.content}</p>

                      {/* Post Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-[#30363d]">
                        <div className="flex items-center gap-6">
                          <Button variant="ghost" size="sm" className="text-[#8b949e] hover:text-[#ff69b4] hover:bg-[#ff69b4]/10">
                            <Heart className="w-4 h-4 mr-1" />
                            {post.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-[#8b949e] hover:text-[#00ffe1] hover:bg-[#00ffe1]/10">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            {post.comments}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-[#8b949e] hover:text-[#7c3aed] hover:bg-[#7c3aed]/10">
                            <Share2 className="w-4 h-4 mr-1" />
                            {post.shares}
                          </Button>
                        </div>
                        <Button variant="ghost" size="sm" className="text-[#8b949e] hover:text-[#f79009] hover:bg-[#f79009]/10">
                          <Bookmark className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="trending" className="space-y-6">
                <Card className="bg-[#161b22] border-[#30363d]">
                  <CardHeader>
                    <CardTitle className="text-[#f0f6fc] flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-[#ff00d4]" />
                      Trending Topics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mockTrending.map((topic, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-[#21262d] rounded-lg hover:bg-[#30363d] transition-all cursor-pointer">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-semibold text-[#8b949e]">#{index + 1}</span>
                          <div>
                            <div className="font-semibold text-[#00ffe1]">{topic.tag}</div>
                            <div className="text-sm text-[#8b949e]">{topic.posts} posts</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[#10b981] font-semibold">{topic.growth}</span>
                          <ChevronRight className="w-4 h-4 text-[#8b949e]" />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Creators */}
            <Card className="bg-[#161b22] border-[#30363d]">
              <CardHeader>
                <CardTitle className="text-[#f0f6fc] flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#f79009]" />
                  Top Creators
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockCreators.map((creator, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-[#21262d] rounded-lg hover:bg-[#30363d] transition-all cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00ffe1] to-[#ff00d4] p-0.5">
                      <div className="w-full h-full rounded-full bg-[#161b22] flex items-center justify-center">
                        <Users className="w-5 h-5 text-[#8b949e]" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#f0f6fc] text-sm">{creator.name}</span>
                        <Badge variant="outline" className="border-[#f79009] text-[#f79009] text-xs">
                          {creator.badge}
                        </Badge>
                      </div>
                      <div className="text-xs text-[#8b949e]">
                        {creator.followers.toLocaleString()} followers • Score: {creator.truthScore}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-[#161b22] border-[#30363d]">
              <CardHeader>
                <CardTitle className="text-[#f0f6fc] flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#00ffe1]" />
                  Community Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-[#8b949e]">Active Users</span>
                  <span className="text-[#00ffe1] font-semibold">23,456</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8b949e]">Posts Today</span>
                  <span className="text-[#ff00d4] font-semibold">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8b949e]">Truth Score Avg</span>
                  <span className="text-[#7c3aed] font-semibold">87.3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8b949e]">Capsules Created</span>
                  <span className="text-[#10b981] font-semibold">456</span>
                </div>
              </CardContent>
            </Card>

            {/* Suggested Topics */}
            <Card className="bg-[#161b22] border-[#30363d]">
              <CardHeader>
                <CardTitle className="text-[#f0f6fc] flex items-center gap-2">
                  <Eye className="w-5 h-5 text-[#7c3aed]" />
                  Suggested Topics
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {["#Blockchain", "#NFTs", "#DeFi", "#Truth", "#Governance", "#Community"].map((tag) => (
                  <Badge key={tag} variant="outline" className="border-[#30363d] text-[#8b949e] hover:border-[#00ffe1] hover:text-[#00ffe1] cursor-pointer transition-all">
                    {tag}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}