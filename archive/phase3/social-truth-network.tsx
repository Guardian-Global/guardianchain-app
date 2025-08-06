import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Users,
  MessageCircle,
  Heart,
  Share,
  Eye,
  Verified,
  Crown,
  Shield,
  Star,
  Flame,
  TrendingUp,
  Globe,
  Lock,
  Unlock,
  Search,
  Filter,
  Plus,
  Zap,
  Diamond,
  Sparkles
} from "lucide-react";

interface SocialPost {
  id: string;
  user: {
    id: string;
    username: string;
    avatar: string;
    tier: string;
    verified: boolean;
    truth_score: number;
  };
  content: string;
  media_urls: string[];
  truth_verification: boolean;
  emotion_score: number;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  tags: string[];
  created_at: string;
  is_premium: boolean;
  capsule_id?: string;
}

interface TruthCommunity {
  id: string;
  name: string;
  description: string;
  member_count: number;
  post_count: number;
  category: string;
  is_verified: boolean;
  privacy: 'public' | 'private' | 'invite_only';
  created_at: string;
  banner_image: string;
  moderators: string[];
}

const communityCategories = [
  { id: 'whistleblowing', name: 'Whistleblowing', icon: Shield, color: 'red' },
  { id: 'journalism', name: 'Journalism', icon: Globe, color: 'blue' },
  { id: 'activism', name: 'Activism', icon: Flame, color: 'orange' },
  { id: 'research', name: 'Research', icon: Star, color: 'purple' },
  { id: 'investigation', name: 'Investigation', icon: Eye, color: 'green' },
  { id: 'transparency', name: 'Transparency', icon: Unlock, color: 'cyan' }
];

export default function SocialTruthNetwork() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newPostContent, setNewPostContent] = useState('');
  const [showCreateCommunity, setShowCreateCommunity] = useState(false);

  // Fetch social feed
  const { data: socialFeed, isLoading: feedLoading } = useQuery({
    queryKey: ["/api/social/feed", selectedCategory],
    refetchInterval: 10000
  });

  // Fetch communities
  const { data: communities, isLoading: communitiesLoading } = useQuery({
    queryKey: ["/api/social/communities"],
    refetchInterval: 30000
  });

  // Fetch trending topics
  const { data: trendingTopics } = useQuery({
    queryKey: ["/api/social/trending"],
    refetchInterval: 60000
  });

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: async (postData: any) => {
      return apiRequest("/api/social/posts", {
        method: "POST",
        body: postData
      });
    },
    onSuccess: () => {
      toast({
        title: "Post Created",
        description: "Your truth post has been shared with the network.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/social/feed"] });
      setNewPostContent('');
    },
    onError: (error) => {
      toast({
        title: "Post Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Like post mutation
  const likePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      return apiRequest(`/api/social/posts/${postId}/like`, {
        method: "POST"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/social/feed"] });
    }
  });

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const getTierBadge = (tier: string) => {
    const tierConfig = {
      'EXPLORER': { color: 'gray', icon: Users },
      'SEEKER': { color: 'blue', icon: Eye },
      'CREATOR': { color: 'purple', icon: Star },
      'SOVEREIGN': { color: 'yellow', icon: Crown }
    };
    
    const config = tierConfig[tier as keyof typeof tierConfig] || tierConfig.EXPLORER;
    const IconComponent = config.icon;
    
    return (
      <Badge className={`bg-${config.color}-500/20 text-${config.color}-400 border-${config.color}-500/30`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {tier}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-display font-black text-gradient-quantum mb-4 animate-prismatic-shift">
            Social Truth Network
          </h1>
          <p className="text-xl text-cyan-300 font-web3 max-w-3xl mx-auto">
            Connect with truth seekers, whistleblowers, and investigators in a 
            decentralized social network built for transparency and authenticity.
          </p>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800/50 border border-gray-700">
            <TabsTrigger value="feed" className="text-white data-[state=active]:bg-cyan-600">
              Feed
            </TabsTrigger>
            <TabsTrigger value="communities" className="text-white data-[state=active]:bg-purple-600">
              Communities
            </TabsTrigger>
            <TabsTrigger value="trending" className="text-white data-[state=active]:bg-yellow-600">
              Trending
            </TabsTrigger>
            <TabsTrigger value="discover" className="text-white data-[state=active]:bg-green-600">
              Discover
            </TabsTrigger>
          </TabsList>

          {/* Feed Tab */}
          <TabsContent value="feed" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Sidebar - Create Post */}
              <div className="lg:col-span-1 space-y-4">
                {isAuthenticated && (
                  <Card className="holographic-glass border-cyan-500/30">
                    <CardHeader>
                      <CardTitle className="text-lg font-bold text-white flex items-center">
                        <Plus className="w-5 h-5 mr-2 text-cyan-400" />
                        Share Truth
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3 mb-4">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={user?.profileImageUrl} />
                          <AvatarFallback className="bg-cyan-600 text-white">
                            {user?.firstName?.[0] || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-white">{user?.firstName} {user?.lastName}</div>
                          {getTierBadge(user?.tier || 'EXPLORER')}
                        </div>
                      </div>
                      
                      <textarea
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        placeholder="What truth do you want to share?"
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none min-h-[100px]"
                      />
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={() => createPostMutation.mutate({ content: newPostContent })}
                          disabled={!newPostContent.trim() || createPostMutation.isPending}
                          className="flex-1 quantum-field text-black font-bold"
                        >
                          {createPostMutation.isPending ? (
                            <>
                              <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                              Posting...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 mr-2" />
                              Post
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Category Filter */}
                <Card className="holographic-glass border-white/20">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-white flex items-center">
                      <Filter className="w-5 h-5 mr-2 text-purple-400" />
                      Categories
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      variant={selectedCategory === 'all' ? 'default' : 'ghost'}
                      className="w-full justify-start text-white"
                      onClick={() => setSelectedCategory('all')}
                    >
                      All Posts
                    </Button>
                    {communityCategories.map((category) => {
                      const IconComponent = category.icon;
                      return (
                        <Button
                          key={category.id}
                          variant={selectedCategory === category.id ? 'default' : 'ghost'}
                          className="w-full justify-start text-white"
                          onClick={() => setSelectedCategory(category.id)}
                        >
                          <IconComponent className={`w-4 h-4 mr-2 text-${category.color}-400`} />
                          {category.name}
                        </Button>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>

              {/* Main Feed */}
              <div className="lg:col-span-2 space-y-4">
                {feedLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin quantum-field w-12 h-12 rounded-full mb-4 mx-auto"></div>
                    <p className="text-cyan-300">Loading truth feed...</p>
                  </div>
                ) : (
                  socialFeed?.map((post: SocialPost) => (
                    <Card key={post.id} className="holographic-glass border-white/20 animate-float">
                      <CardContent className="p-6">
                        {/* Post Header */}
                        <div className="flex items-center gap-3 mb-4">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={post.user.avatar} />
                            <AvatarFallback className="bg-cyan-600 text-white">
                              {post.user.username[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-white">@{post.user.username}</span>
                              {post.user.verified && (
                                <Verified className="w-4 h-4 text-blue-400" />
                              )}
                              {post.truth_verification && (
                                <Shield className="w-4 h-4 text-green-400" />
                              )}
                              {post.is_premium && (
                                <Crown className="w-4 h-4 text-yellow-400" />
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              {getTierBadge(post.user.tier)}
                              <span>•</span>
                              <span>{formatTimeAgo(post.created_at)}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Star className="w-3 h-3" />
                                {post.user.truth_score}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Post Content */}
                        <div className="mb-4">
                          <p className="text-gray-200 leading-relaxed">{post.content}</p>
                          
                          {/* Media */}
                          {post.media_urls && post.media_urls.length > 0 && (
                            <div className="mt-4 grid grid-cols-2 gap-2">
                              {post.media_urls.slice(0, 4).map((url, index) => (
                                <img
                                  key={index}
                                  src={url}
                                  alt="Post media"
                                  className="rounded-lg object-cover w-full h-48"
                                />
                              ))}
                            </div>
                          )}
                          
                          {/* Tags */}
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {post.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-cyan-400 border-cyan-500/30">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Engagement Stats */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                          <div className="flex items-center gap-6">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => likePostMutation.mutate(post.id)}
                              className="text-gray-400 hover:text-red-400"
                            >
                              <Heart className="w-4 h-4 mr-1" />
                              {post.engagement.likes}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-400">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              {post.engagement.comments}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-green-400">
                              <Share className="w-4 h-4 mr-1" />
                              {post.engagement.shares}
                            </Button>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Eye className="w-4 h-4" />
                            {post.engagement.views.toLocaleString()}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              {/* Right Sidebar - Stats & Trending */}
              <div className="lg:col-span-1 space-y-4">
                {/* Network Stats */}
                <Card className="holographic-glass border-white/20">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-white flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                      Network Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">Active Users:</span>
                      <span className="text-cyan-400 font-bold">12,543</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">Truth Posts:</span>
                      <span className="text-purple-400 font-bold">45,672</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">Verifications:</span>
                      <span className="text-green-400 font-bold">8,934</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">Communities:</span>
                      <span className="text-yellow-400 font-bold">234</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Trending Topics */}
                <Card className="holographic-glass border-white/20">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-white flex items-center">
                      <Flame className="w-5 h-5 mr-2 text-orange-400" />
                      Trending Now
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {trendingTopics?.slice(0, 5).map((topic: any, index: number) => (
                      <div key={index} className="p-2 rounded hover:bg-gray-800/50 cursor-pointer">
                        <div className="font-medium text-white">#{topic.tag}</div>
                        <div className="text-sm text-gray-400">{topic.post_count} posts</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Suggested Users */}
                <Card className="holographic-glass border-white/20">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-white flex items-center">
                      <Users className="w-5 h-5 mr-2 text-blue-400" />
                      Truth Seekers
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[1, 2, 3].map((_, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-purple-600 text-white">
                            U{index + 1}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-medium text-white text-sm">@truthseeker{index + 1}</div>
                          <div className="text-xs text-gray-400">Truth Score: {85 + index * 5}</div>
                        </div>
                        <Button size="sm" variant="outline" className="text-cyan-400 border-cyan-500/30">
                          Follow
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Communities Tab */}
          <TabsContent value="communities" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {communitiesLoading ? (
                <div className="col-span-full text-center py-8">
                  <div className="animate-spin quantum-field w-12 h-12 rounded-full mb-4 mx-auto"></div>
                  <p className="text-cyan-300">Loading communities...</p>
                </div>
              ) : (
                communities?.map((community: TruthCommunity) => (
                  <Card key={community.id} className="holographic-glass border-white/20 animate-float">
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-white">{community.name}</h3>
                          {community.is_verified && (
                            <Verified className="w-4 h-4 text-blue-400" />
                          )}
                        </div>
                        <p className="text-gray-300 text-sm line-clamp-2">{community.description}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div className="text-center">
                          <div className="text-cyan-400 font-bold">{community.member_count.toLocaleString()}</div>
                          <div className="text-gray-400">Members</div>
                        </div>
                        <div className="text-center">
                          <div className="text-purple-400 font-bold">{community.post_count.toLocaleString()}</div>
                          <div className="text-gray-400">Posts</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge className="bg-gray-700 text-gray-300">
                          {community.category}
                        </Badge>
                        <Button size="sm" className="quantum-field text-black font-bold">
                          Join
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}