import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, Star, Clock, Eye, Heart, MessageCircle, Share2, 
  Play, Pause, Volume2, Download, Bookmark, MoreHorizontal,
  Zap, Award, Globe, Lock, Unlock, Users, TrendingUp,
  FileText, Image, Video, Mic, Code, Link, Calendar,
  ChevronDown, ChevronUp, ExternalLink, Copy
} from "lucide-react";

interface CapsuleData {
  id: string;
  title: string;
  description: string;
  content: string;
  type: "text" | "voice" | "image" | "video" | "document" | "mixed";
  privacy: "public" | "private" | "time-locked" | "dao-sealed";
  truthScore: number;
  verificationLevel: string;
  emotionalResonance: number;
  griefScore: number;
  createdAt: string;
  unlockDate?: string;
  author: {
    name: string;
    avatar?: string;
    tier: string;
    verified: boolean;
  };
  metrics: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    truthVotes: number;
  };
  tags: string[];
  lineage?: {
    parentCapsule?: string;
    childCapsules: number;
    influenceScore: number;
  };
  nft?: {
    minted: boolean;
    tokenId?: string;
    blockchain: string;
    price?: number;
  };
}

interface EnhancedCapsuleCardProps {
  capsule: CapsuleData;
  viewMode: "card" | "list" | "grid" | "timeline";
  showActions?: boolean;
  onView?: (id: string) => void;
  onLike?: (id: string) => void;
  onShare?: (id: string) => void;
  onVerify?: (id: string) => void;
}

export function EnhancedCapsuleCard({
  capsule,
  viewMode,
  showActions = true,
  onView,
  onLike,
  onShare,
  onVerify
}: EnhancedCapsuleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "text": return <FileText className="w-4 h-4" />;
      case "voice": return <Mic className="w-4 h-4" />;
      case "image": return <Image className="w-4 h-4" />;
      case "video": return <Video className="w-4 h-4" />;
      case "document": return <FileText className="w-4 h-4" />;
      case "mixed": return <Code className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getPrivacyIcon = (privacy: string) => {
    switch (privacy) {
      case "public": return <Globe className="w-4 h-4 text-[#10b981]" />;
      case "private": return <Lock className="w-4 h-4 text-[#f79009]" />;
      case "time-locked": return <Clock className="w-4 h-4 text-[#7c3aed]" />;
      case "dao-sealed": return <Shield className="w-4 h-4 text-[#00ffe1]" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Sovereign": return "text-[#ff00d4]";
      case "Guardian": return "text-[#00ffe1]";
      case "Seeker": return "text-[#7c3aed]";
      case "Explorer": return "text-[#10b981]";
      default: return "text-[#8b949e]";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (viewMode === "list") {
    return (
      <Card className="bg-[#161b22] border-[#30363d] hover:border-[#00ffe1]/30 transition-all mb-4">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#00ffe1]/20 to-[#ff00d4]/20 flex items-center justify-center">
                {getTypeIcon(capsule.type)}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-[#f0f6fc] truncate">{capsule.title}</h3>
                {getPrivacyIcon(capsule.privacy)}
                <Badge variant="outline" className="border-[#00ffe1] text-[#00ffe1] text-xs">
                  {capsule.truthScore}
                </Badge>
              </div>
              <p className="text-sm text-[#8b949e] truncate">{capsule.description}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-[#8b949e]">
                <span>{capsule.author.name}</span>
                <span>{formatTimestamp(capsule.createdAt)}</span>
                <span>{capsule.metrics.views} views</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" onClick={() => onView?.(capsule.id)}>
                <Eye className="w-4 h-4" />
              </Button>
              {showActions && (
                <>
                  <Button size="sm" variant="ghost" onClick={() => onLike?.(capsule.id)}>
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#161b22] border-[#30363d] hover:border-[#00ffe1]/30 transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00ffe1] to-[#ff00d4] p-0.5">
              <div className="w-full h-full rounded-full bg-[#161b22] flex items-center justify-center">
                <Users className="w-5 h-5 text-[#8b949e]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`font-semibold text-sm ${getTierColor(capsule.author.tier)}`}>
                  {capsule.author.name}
                </span>
                {capsule.author.verified && <Shield className="w-3 h-3 text-[#00ffe1]" />}
                <Badge variant="outline" className="border-[#30363d] text-[#8b949e] text-xs">
                  {capsule.author.tier}
                </Badge>
              </div>
              <div className="text-xs text-[#8b949e]">{formatTimestamp(capsule.createdAt)}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {getPrivacyIcon(capsule.privacy)}
            {getTypeIcon(capsule.type)}
            <Button size="sm" variant="ghost" className="text-[#8b949e]">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Title and Description */}
        <div>
          <h3 className="text-lg font-semibold text-[#f0f6fc] mb-2">{capsule.title}</h3>
          <p className="text-[#8b949e] text-sm leading-relaxed">
            {isExpanded ? capsule.description : `${capsule.description.slice(0, 150)}...`}
          </p>
          {capsule.description.length > 150 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[#00ffe1] hover:text-[#00e5cb] p-0 h-auto mt-1"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {isExpanded ? "Show less" : "Show more"}
            </Button>
          )}
        </div>

        {/* Content Preview */}
        {capsule.type === "voice" && (
          <div className="bg-[#21262d] rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Button 
                size="sm" 
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-[#00ffe1] text-[#0d1117] hover:bg-[#00e5cb]"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <div className="flex-1">
                <Progress value={30} className="h-2 bg-[#30363d]" />
              </div>
              <span className="text-xs text-[#8b949e]">2:34</span>
              <Button size="sm" variant="ghost">
                <Volume2 className="w-4 h-4 text-[#8b949e]" />
              </Button>
            </div>
          </div>
        )}

        {/* Metrics and Scores */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-[#21262d] rounded-lg">
            <div className="text-lg font-bold text-[#00ffe1]">{capsule.truthScore}</div>
            <div className="text-xs text-[#8b949e]">Truth Score</div>
          </div>
          <div className="text-center p-3 bg-[#21262d] rounded-lg">
            <div className="text-lg font-bold text-[#ff00d4]">{capsule.emotionalResonance}%</div>
            <div className="text-xs text-[#8b949e]">Resonance</div>
          </div>
          <div className="text-center p-3 bg-[#21262d] rounded-lg">
            <div className="text-lg font-bold text-[#7c3aed]">{capsule.griefScore}</div>
            <div className="text-xs text-[#8b949e]">Grief Score</div>
          </div>
          <div className="text-center p-3 bg-[#21262d] rounded-lg">
            <div className="text-lg font-bold text-[#10b981]">{capsule.metrics.views}</div>
            <div className="text-xs text-[#8b949e]">Views</div>
          </div>
        </div>

        {/* Tags */}
        {capsule.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {capsule.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="border-[#30363d] text-[#8b949e] text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* NFT Information */}
        {capsule.nft?.minted && (
          <div className="bg-gradient-to-r from-[#7c3aed]/20 to-[#ff00d4]/20 rounded-lg p-4 border border-[#7c3aed]/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#7c3aed]" />
                <span className="font-semibold text-[#f0f6fc]">NFT Minted</span>
                <Badge variant="outline" className="border-[#7c3aed] text-[#7c3aed]">
                  #{capsule.nft.tokenId}
                </Badge>
              </div>
              {capsule.nft.price && (
                <span className="text-[#00ffe1] font-semibold">{capsule.nft.price} ETH</span>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex items-center justify-between pt-4 border-t border-[#30363d]">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onLike?.(capsule.id)}
                className="text-[#8b949e] hover:text-[#ff69b4] hover:bg-[#ff69b4]/10"
              >
                <Heart className="w-4 h-4 mr-1" />
                {capsule.metrics.likes}
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-[#8b949e] hover:text-[#00ffe1] hover:bg-[#00ffe1]/10"
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                {capsule.metrics.comments}
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onShare?.(capsule.id)}
                className="text-[#8b949e] hover:text-[#7c3aed] hover:bg-[#7c3aed]/10"
              >
                <Share2 className="w-4 h-4 mr-1" />
                {capsule.metrics.shares}
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                onClick={() => onView?.(capsule.id)}
                className="bg-[#00ffe1] text-[#0d1117] hover:bg-[#00e5cb]"
                data-testid={`button-preview-${capsule.id}`}
              >
                <Eye className="w-4 h-4 mr-1" />
                Preview
              </Button>
              <Button 
                size="sm" 
                onClick={() => onVerify?.(capsule.id)}
                variant="outline"
                className="border-[#30363d] text-[#8b949e] hover:border-[#ff00d4] hover:text-[#ff00d4]"
              >
                <Shield className="w-4 h-4 mr-1" />
                Verify
              </Button>
              <Button size="sm" variant="outline" className="border-[#30363d] text-[#8b949e]">
                <Bookmark className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}