import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Clock,
  DollarSign,
  Users,
  Shield,
  Zap,
  Eye,
  Lock,
  Unlock,
  Download,
  Share,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Star,
  Flame,
  Crown,
  Sparkles
} from "lucide-react";

interface TruthAuction {
  id: string;
  title: string;
  description: string;
  category: string;
  reserve_amount: number;
  current_funding: number;
  contributor_count: number;
  time_remaining: number;
  status: 'active' | 'funded' | 'revealed' | 'expired';
  creator: string;
  created_at: string;
  unlock_conditions: string[];
  evidence_preview: string;
  verification_level: 'unverified' | 'community' | 'professional' | 'expert';
  risk_level: 'low' | 'medium' | 'high' | 'extreme';
  impact_score: number;
  contributors: Array<{
    wallet: string;
    amount: number;
    timestamp: string;
    anonymous: boolean;
  }>;
}

export default function AdvancedTruthAuction() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedAuction, setSelectedAuction] = useState<TruthAuction | null>(null);
  const [contributionAmount, setContributionAmount] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAuction, setNewAuction] = useState({
    title: "",
    description: "",
    category: "",
    reserve_amount: 0,
    unlock_conditions: "",
    evidence_preview: ""
  });

  // Fetch active truth auctions
  const { data: auctions, isLoading } = useQuery({
    queryKey: ["/api/truth-auctions"],
    refetchInterval: 5000
  });

  // Contribute to auction
  const contributeMutation = useMutation({
    mutationFn: async ({ auctionId, amount }: { auctionId: string; amount: number }) => {
      return apiRequest(`/api/truth-auctions/${auctionId}/contribute`, {
        method: "POST",
        body: { amount }
      });
    },
    onSuccess: () => {
      toast({
        title: "Contribution Successful",
        description: "Your GTT tokens have been contributed to the truth auction.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/truth-auctions"] });
      setContributionAmount("");
    },
    onError: (error) => {
      toast({
        title: "Contribution Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Create new auction
  const createMutation = useMutation({
    mutationFn: async (auctionData: any) => {
      return apiRequest("/api/truth-auctions", {
        method: "POST",
        body: auctionData
      });
    },
    onSuccess: () => {
      toast({
        title: "Truth Auction Created",
        description: "Your truth auction is now live and accepting contributions.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/truth-auctions"] });
      setShowCreateModal(false);
      setNewAuction({
        title: "",
        description: "",
        category: "",
        reserve_amount: 0,
        unlock_conditions: "",
        evidence_preview: ""
      });
    },
    onError: (error) => {
      toast({
        title: "Creation Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const formatTimeRemaining = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'extreme': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getVerificationIcon = (level: string) => {
    switch (level) {
      case 'expert': return <Crown className="w-4 h-4 text-purple-400" />;
      case 'professional': return <Star className="w-4 h-4 text-blue-400" />;
      case 'community': return <Users className="w-4 h-4 text-green-400" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin quantum-field w-12 h-12 rounded-full mb-4 mx-auto"></div>
          <p className="text-cyan-300 font-web3">Loading Truth Auctions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-display font-black text-gradient-quantum mb-4 animate-prismatic-shift">
            Truth Auction House
          </h1>
          <p className="text-xl text-cyan-300 font-web3 max-w-3xl mx-auto">
            Crowd-fund truth revelations with GTT tokens. Support whistleblowers, 
            investigators, and truth seekers in their mission to expose hidden realities.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="holographic-glass border-cyan-500/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-cyan-400 mb-1">
                {auctions?.filter((a: any) => a.status === 'active').length || 0}
              </div>
              <div className="text-sm text-cyan-300/70">Active Auctions</div>
            </CardContent>
          </Card>
          <Card className="holographic-glass border-purple-500/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">
                {auctions?.reduce((sum: number, a: any) => sum + a.current_funding, 0).toLocaleString() || 0}
              </div>
              <div className="text-sm text-purple-300/70">GTT Pledged</div>
            </CardContent>
          </Card>
          <Card className="holographic-glass border-yellow-500/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                {auctions?.reduce((sum: number, a: any) => sum + a.contributor_count, 0) || 0}
              </div>
              <div className="text-sm text-yellow-300/70">Contributors</div>
            </CardContent>
          </Card>
          <Card className="holographic-glass border-green-500/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {auctions?.filter((a: any) => a.status === 'revealed').length || 0}
              </div>
              <div className="text-sm text-green-300/70">Revealed</div>
            </CardContent>
          </Card>
        </div>

        {/* Create Auction Button */}
        {isAuthenticated && (
          <div className="text-center mb-8">
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="quantum-field text-black font-bold px-8 py-3 animate-morphic-pulse"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Create Truth Auction
            </Button>
          </div>
        )}
      </div>

      {/* Auction Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctions?.map((auction: TruthAuction) => (
            <Card 
              key={auction.id} 
              className="holographic-glass border-white/20 hover:border-cyan-500/50 transition-all duration-300 animate-float"
              style={{ animationDelay: `${Math.random() * 2}s` }}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-bold text-white mb-2 line-clamp-2">
                      {auction.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mb-3">
                      {getVerificationIcon(auction.verification_level)}
                      <Badge className={getRiskBadgeColor(auction.risk_level)}>
                        {auction.risk_level.toUpperCase()} RISK
                      </Badge>
                      <Badge variant="outline" className="text-cyan-400 border-cyan-500/30">
                        {auction.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-cyan-400 mb-1">Impact Score</div>
                    <div className="text-xl font-bold text-yellow-400 flex items-center">
                      <Flame className="w-4 h-4 mr-1" />
                      {auction.impact_score}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-gray-300 text-sm line-clamp-3">
                  {auction.description}
                </p>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-cyan-400">
                      {((auction.current_funding / auction.reserve_amount) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress 
                    value={(auction.current_funding / auction.reserve_amount) * 100} 
                    className="h-2 bg-gray-800"
                  />
                  <div className="flex justify-between text-sm">
                    <span className="text-green-400">
                      {auction.current_funding.toLocaleString()} GTT
                    </span>
                    <span className="text-yellow-400">
                      Goal: {auction.reserve_amount.toLocaleString()} GTT
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-300">
                      {formatTimeRemaining(auction.time_remaining)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-400" />
                    <span className="text-gray-300">
                      {auction.contributor_count} backers
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {auction.status === 'active' && (
                    <Button 
                      onClick={() => setSelectedAuction(auction)}
                      className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white"
                    >
                      <DollarSign className="w-4 h-4 mr-2" />
                      Contribute
                    </Button>
                  )}
                  {auction.status === 'funded' && (
                    <Button 
                      className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white"
                      disabled
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Unlocking...
                    </Button>
                  )}
                  {auction.status === 'revealed' && (
                    <Button 
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Unlock className="w-4 h-4 mr-2" />
                      View Truth
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-white/20 text-gray-300"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Contribution Modal */}
      {selectedAuction && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <Card className="holographic-glass max-w-md w-full border-cyan-500/30">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white">
                Contribute to Truth Auction
              </CardTitle>
              <p className="text-gray-300 text-sm">{selectedAuction.title}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Contribution Amount (GTT)
                </label>
                <Input
                  type="number"
                  value={contributionAmount}
                  onChange={(e) => setContributionAmount(e.target.value)}
                  placeholder="Enter GTT amount"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              
              <div className="text-sm text-gray-400">
                <p>• Contributions are non-refundable</p>
                <p>• Truth will be revealed when funding goal is reached</p>
                <p>• You'll receive verification credits for successful auctions</p>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => setSelectedAuction(null)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => contributeMutation.mutate({
                    auctionId: selectedAuction.id,
                    amount: Number(contributionAmount)
                  })}
                  disabled={contributeMutation.isPending || !contributionAmount}
                  className="flex-1 quantum-field text-black font-bold"
                >
                  {contributeMutation.isPending ? "Contributing..." : "Contribute"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}