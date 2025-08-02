import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import ReplayCapsule from "@/components/ReplayCapsule";
import { ExternalLink, FileText, Calendar, User, Target, Coins, Eye } from "lucide-react";

interface CapsuleData {
  id: string;
  title: string;
  content: string;
  griefTier: number;
  category: string;
  nftTokenId?: string;
  transactionHash?: string;
  author: string;
  createdAt: string;
  status: string;
  replays?: number;
  yieldEarned?: number;
}

export default function CapsuleReplayView() {
  const params = useParams();
  const capsuleId = params.id;
  const { toast } = useToast();

  // Fetch capsule data
  const { data: capsule, isLoading, error } = useQuery({
    queryKey: ["/api/capsules", capsuleId],
    queryFn: async () => {
      if (!capsuleId) throw new Error("No capsule ID provided");
      return apiRequest("GET", `/api/capsules/${capsuleId}`);
    },
    enabled: !!capsuleId,
  });

  const getGriefTierColor = (tier: number) => {
    if (tier >= 4) return "bg-red-100 text-red-800 border-red-300";
    if (tier >= 3) return "bg-yellow-100 text-yellow-800 border-yellow-300";
    if (tier >= 2) return "bg-blue-100 text-blue-800 border-blue-300";
    return "bg-green-100 text-green-800 border-green-300";
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'memory': return '🧠';
      case 'legacy': return '👑';
      case 'testimony': return '⚖️';
      case 'historical': return '📜';
      case 'tribute': return '🌟';
      case 'wisdom': return '🦉';
      default: return '📦';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !capsule) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8">
            <FileText className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-800 mb-2">Capsule Not Found</h2>
            <p className="text-red-600 mb-4">
              The requested capsule could not be found or may have been removed.
            </p>
            <Button onClick={() => window.history.back()} variant="outline">
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getCategoryIcon(capsule.category)}</span>
              <h1 className="text-3xl font-bold tracking-tight">
                {capsule.title}
              </h1>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(capsule.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {capsule.author}
              </div>
              {capsule.replays && (
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {capsule.replays} replays
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="capitalize">
              {capsule.category}
            </Badge>
            <Badge className={getGriefTierColor(capsule.griefTier)}>
              Tier {capsule.griefTier}/5
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Capsule Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Capsule Content
                </CardTitle>
                <CardDescription>
                  Preserved memory sealed on the blockchain
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {capsule.content}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Replay Component */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Experience Capsule
                </CardTitle>
                <CardDescription>
                  Replay this capsule to earn GTT yield based on emotional resonance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ReplayCapsule capsuleId={capsule.id} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Capsule Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Capsule Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Grief Tier</span>
                    <Badge className={getGriefTierColor(capsule.griefTier)}>
                      {capsule.griefTier}/5
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Category</span>
                    <span className="text-sm font-medium capitalize">{capsule.category}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status</span>
                    <Badge variant="outline" className="capitalize">
                      {capsule.status}
                    </Badge>
                  </div>

                  {capsule.yieldEarned && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">GTT Earned</span>
                      <div className="flex items-center gap-1">
                        <Coins className="h-3 w-3 text-yellow-500" />
                        <span className="text-sm font-medium">{capsule.yieldEarned}</span>
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-xs text-gray-500">
                    Yield Potential: {capsule.griefTier * 10} GTT per replay
                  </p>
                  <p className="text-xs text-gray-500">
                    Created: {new Date(capsule.createdAt).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* NFT Links */}
            {capsule.nftTokenId && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">NFT Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      Token ID: <span className="font-mono">#{capsule.nftTokenId}</span>
                    </p>
                    {capsule.transactionHash && (
                      <p className="text-sm text-gray-600">
                        Tx Hash: 
                        <span className="font-mono text-xs block mt-1">
                          {capsule.transactionHash.slice(0, 10)}...{capsule.transactionHash.slice(-8)}
                        </span>
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => {
                        const metadataUrl = `${window.location.origin}/api/metadata/${capsule.nftTokenId}`;
                        window.open(metadataUrl, "_blank");
                      }}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      View Metadata
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => {
                        const openSeaUrl = `https://opensea.io/assets/matic/0x0000000000000000000000000000000000000000/${capsule.nftTokenId}`;
                        window.open(openSeaUrl, "_blank");
                      }}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View on OpenSea
                    </Button>

                    {capsule.transactionHash && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => {
                          const polygonScanUrl = `https://polygonscan.com/tx/${capsule.transactionHash}`;
                          window.open(polygonScanUrl, "_blank");
                        }}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Transaction
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast({
                      title: "Link Copied",
                      description: "Capsule link copied to clipboard",
                    });
                  }}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Share Capsule
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => window.history.back()}
                >
                  Go Back
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}