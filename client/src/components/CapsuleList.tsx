import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, Eye, Coins, ExternalLink, FileText } from "lucide-react";
import { Link } from "wouter";

interface Capsule {
  id: string;
  title: string;
  content: string;
  griefTier: number;
  category: string;
  nftTokenId?: string;
  author: string;
  createdAt: string;
  status: string;
  replays?: number;
  yieldEarned?: number;
}

export default function CapsuleList() {
  const { data: capsules, isLoading, error } = useQuery({
    queryKey: ["/api/capsules"],
    queryFn: () => fetch("/api/capsules").then(res => res.json()),
    refetchInterval: 30000, // Refresh every 30 seconds
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

  const truncateContent = (content: string, maxLength: number = 120) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + '...';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Capsules</CardTitle>
          <CardDescription>Loading your preserved memories...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !capsules) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Capsules</CardTitle>
          <CardDescription>Unable to load capsules at this time</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">
            No capsules found. Create your first truth capsule to get started!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Your Capsules
        </CardTitle>
        <CardDescription>
          Manage and view your preserved memories and truth capsules
        </CardDescription>
      </CardHeader>
      <CardContent>
        {capsules.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No capsules yet</h3>
            <p className="text-gray-500 mb-4">
              Create your first truth capsule to start preserving memories on the blockchain
            </p>
            <Button className="mx-auto">
              Create First Capsule
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {capsules.map((capsule: Capsule) => (
              <div
                key={capsule.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{getCategoryIcon(capsule.category)}</span>
                      <h4 className="font-medium text-lg text-gray-900">
                        {capsule.title}
                      </h4>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                      {truncateContent(capsule.content)}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(capsule.createdAt).toLocaleDateString()}
                      </div>
                      {capsule.replays && (
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {capsule.replays} replays
                        </div>
                      )}
                      {capsule.yieldEarned && (
                        <div className="flex items-center gap-1">
                          <Coins className="h-3 w-3 text-yellow-500" />
                          {capsule.yieldEarned} GTT
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 ml-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize text-xs">
                        {capsule.category}
                      </Badge>
                      <Badge className={`${getGriefTierColor(capsule.griefTier)} text-xs`}>
                        Tier {capsule.griefTier}
                      </Badge>
                    </div>

                    <Link href={`/capsule/${capsule.id}`}>
                      <Button size="sm" variant="outline" className="text-xs">
                        <Eye className="mr-1 h-3 w-3" />
                        View
                      </Button>
                    </Link>
                  </div>
                </div>

                {capsule.nftTokenId && (
                  <>
                    <Separator className="my-3" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>NFT Token:</span>
                        <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">
                          #{capsule.nftTokenId}
                        </code>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs h-6 px-2"
                          onClick={() => {
                            const metadataUrl = `${window.location.origin}/api/metadata/${capsule.nftTokenId}`;
                            window.open(metadataUrl, "_blank");
                          }}
                        >
                          <FileText className="mr-1 h-3 w-3" />
                          Metadata
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs h-6 px-2"
                          onClick={() => {
                            const openSeaUrl = `https://opensea.io/assets/matic/0x0000000000000000000000000000000000000000/${capsule.nftTokenId}`;
                            window.open(openSeaUrl, "_blank");
                          }}
                        >
                          <ExternalLink className="mr-1 h-3 w-3" />
                          OpenSea
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
            
            {capsules.length > 0 && (
              <div className="text-center pt-4">
                <Button variant="outline" size="sm">
                  Load More Capsules
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}