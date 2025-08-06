import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  Clock,
  Eye,
  Heart,
  Share,
  Download,
  Lock,
  Unlock,
  TrendingUp,
  BarChart3,
  Users,
  Zap,
  Star,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Laugh,
  Angry,
  Smile,
  Frown,
  Activity,
  FileText,
  Calendar,
  Coins
} from "lucide-react";

interface CapsuleData {
  id: string;
  title: string;
  content: string;
  creator: string;
  createdAt: string;
  truthScore: number;
  isVerified: boolean;
  isTimeSealed: boolean;
  unlockDate?: string;
  viewCount: number;
  gttValue: number;
  category: string;
  tags: string[];
  mediaAttachments: string[];
}

interface CapsuleMetrics {
  totalReactions: number;
  uniqueViewers: number;
  shareCount: number;
  verificationVotes: number;
  gttEarned: number;
  influenceScore: number;
  engagementRate: number;
  trendingRank?: number;
}

interface ReactionData {
  like: number;
  dislike: number;
  love: number;
  laugh: number;
  angry: number;
  sad: number;
}

interface MasterCapsuleProps {
  capsule: CapsuleData;
  metrics: CapsuleMetrics;
  reactions: ReactionData;
  onReact: (reaction: string) => void;
  onVerify: () => void;
  onShare: () => void;
  isOwner?: boolean;
}

export default function MasterCapsule({ 
  capsule, 
  metrics, 
  reactions, 
  onReact, 
  onVerify, 
  onShare,
  isOwner = false 
}: MasterCapsuleProps) {
  const [activeTab, setActiveTab] = useState("content");
  const [userReaction, setUserReaction] = useState<string | null>(null);

  const getTruthScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400 border-green-400 bg-green-400/10";
    if (score >= 75) return "text-blue-400 border-blue-400 bg-blue-400/10";
    if (score >= 60) return "text-yellow-400 border-yellow-400 bg-yellow-400/10";
    return "text-red-400 border-red-400 bg-red-400/10";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleReaction = (reaction: string) => {
    setUserReaction(reaction === userReaction ? null : reaction);
    onReact(reaction);
  };

  const CapsuleHeader = () => (
    <Card className="bg-brand-secondary border-brand-surface">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-white">{capsule.title}</h1>
                <div className="flex items-center gap-2 text-sm text-brand-text-muted">
                  <span>by {capsule.creator}</span>
                  <span>•</span>
                  <span>{formatDate(capsule.createdAt)}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {metrics.uniqueViewers} views
                  </span>
                </div>
              </div>
              
              {capsule.isVerified && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500">
                  <Shield className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className={getTruthScoreColor(capsule.truthScore)}>
                Truth Score: {capsule.truthScore}%
              </Badge>
              
              <Badge variant="outline" className="text-brand-accent border-brand-accent">
                {capsule.category}
              </Badge>
              
              {capsule.isTimeSealed && (
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500">
                  <Clock className="w-3 h-3 mr-1" />
                  Time Sealed
                </Badge>
              )}

              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500">
                <Coins className="w-3 h-3 mr-1" />
                {capsule.gttValue} GTT
              </Badge>

              {metrics.trendingRank && (
                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Trending #{metrics.trendingRank}
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-1">
              {capsule.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-lg font-bold text-white">{metrics.totalReactions}</p>
                <p className="text-xs text-brand-text-muted">Reactions</p>
              </div>
              <div>
                <p className="text-lg font-bold text-brand-accent">{metrics.gttEarned}</p>
                <p className="text-xs text-brand-text-muted">GTT Earned</p>
              </div>
              <div>
                <p className="text-lg font-bold text-green-400">{metrics.influenceScore}</p>
                <p className="text-xs text-brand-text-muted">Influence</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const CapsuleContent = () => (
    <Card className="bg-brand-secondary border-brand-surface">
      <CardContent className="p-6">
        <div className="prose prose-invert max-w-none">
          <p className="text-brand-text-primary whitespace-pre-wrap">
            {capsule.content}
          </p>
        </div>

        {capsule.mediaAttachments.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-white mb-3">Attachments</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {capsule.mediaAttachments.map((media, index) => (
                <div key={index} className="relative aspect-square bg-brand-surface rounded-lg overflow-hidden">
                  <img
                    src={media}
                    alt={`Attachment ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {capsule.isTimeSealed && capsule.unlockDate && (
          <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500 rounded-lg">
            <div className="flex items-center gap-2 text-purple-400">
              <Lock className="w-4 h-4" />
              <span className="text-sm font-medium">
                Time Sealed until {formatDate(capsule.unlockDate)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const CapsuleReactions = () => {
    const reactionButtons = [
      { key: 'like', icon: ThumbsUp, count: reactions.like, color: 'text-blue-400' },
      { key: 'dislike', icon: ThumbsDown, count: reactions.dislike, color: 'text-red-400' },
      { key: 'love', icon: Heart, count: reactions.love, color: 'text-pink-400' },
      { key: 'laugh', icon: Laugh, count: reactions.laugh, color: 'text-yellow-400' },
      { key: 'angry', icon: Angry, count: reactions.angry, color: 'text-orange-400' },
      { key: 'sad', icon: Frown, count: reactions.sad, color: 'text-gray-400' },
    ];

    return (
      <Card className="bg-brand-secondary border-brand-surface">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Community Reactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-6">
            {reactionButtons.map((reaction) => {
              const Icon = reaction.icon;
              const isActive = userReaction === reaction.key;
              return (
                <Button
                  key={reaction.key}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleReaction(reaction.key)}
                  className={`${isActive ? 'bg-brand-primary' : ''}`}
                >
                  <Icon className={`w-4 h-4 mr-1 ${reaction.color}`} />
                  {reaction.count}
                </Button>
              );
            })}
          </div>

          <div className="flex gap-2">
            <Button onClick={onShare} variant="outline" size="sm">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
            
            {!isOwner && (
              <Button onClick={onVerify} variant="outline" size="sm">
                <Shield className="w-4 h-4 mr-2" />
                Verify
              </Button>
            )}

            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const CapsuleAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-brand-secondary border-brand-surface">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-muted">Engagement Rate</p>
                <p className="text-2xl font-bold text-green-400">{metrics.engagementRate}%</p>
              </div>
              <Activity className="w-8 h-8 text-green-400" />
            </div>
            <Progress value={metrics.engagementRate} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-brand-secondary border-brand-surface">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-muted">Unique Viewers</p>
                <p className="text-2xl font-bold text-blue-400">{metrics.uniqueViewers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-secondary border-brand-surface">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-muted">GTT Generated</p>
                <p className="text-2xl font-bold text-yellow-400">{metrics.gttEarned}</p>
              </div>
              <Zap className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-brand-secondary border-brand-surface">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Truth Score</span>
                <span>{capsule.truthScore}%</span>
              </div>
              <Progress value={capsule.truthScore} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Community Trust</span>
                <span>{metrics.verificationVotes} votes</span>
              </div>
              <Progress value={Math.min((metrics.verificationVotes / 100) * 100, 100)} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Influence Score</span>
                <span>{metrics.influenceScore}</span>
              </div>
              <Progress value={Math.min((metrics.influenceScore / 1000) * 100, 100)} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <CapsuleHeader />
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="reactions">Reactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          <CapsuleContent />
        </TabsContent>

        <TabsContent value="reactions" className="space-y-6">
          <CapsuleReactions />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <CapsuleAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}