import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ChainFilterControls from "./ChainFilterControls";
import { 
  Play,
  Star,
  Eye,
  Clock,
  Zap,
  DollarSign,
  ExternalLink,
  Network,
  Layers
} from "lucide-react";

interface Capsule {
  id: string;
  title: string;
  description: string;
  truthScore: number;
  chainId: number;
  contractAddress?: string;
  tokenId?: string;
  isMinted: boolean;
  createdAt: string;
  author: {
    name: string;
    avatar?: string;
  };
  mediaType: string;
  mediaUrl?: string;
  views: number;
  likes: number;
  gasUsed?: string;
  transactionHash?: string;
}

const CHAIN_INFO = {
  137: { name: "Polygon", color: "bg-purple-500", icon: "🔷", explorer: "https://polygonscan.com" },
  8453: { name: "Base", color: "bg-blue-500", icon: "🔵", explorer: "https://basescan.org" },
  1: { name: "Ethereum", color: "bg-gray-600", icon: "⚡", explorer: "https://etherscan.io" }
};

interface MultiChainCapsuleGridProps {
  category?: string;
  userId?: string;
  limit?: number;
}

export default function MultiChainCapsuleGrid({ 
  category = "all", 
  userId,
  limit = 20 
}: MultiChainCapsuleGridProps) {
  const [selectedChains, setSelectedChains] = useState<number[]>([137, 8453]); // Polygon + Base by default
  const [sortBy, setSortBy] = useState("recent");

  // Fetch capsules from all chains
  const { data: capsules, isLoading } = useQuery({
    queryKey: ["/api/capsules/multi-chain", category, userId, selectedChains],
    enabled: selectedChains.length > 0,
  });

  // Filter and sort capsules
  const filteredCapsules = useMemo(() => {
    if (!capsules) return [];

    let filtered = capsules.filter((capsule: Capsule) => 
      selectedChains.includes(capsule.chainId)
    );

    // Apply sorting
    switch (sortBy) {
      case "truthScore":
        filtered.sort((a: Capsule, b: Capsule) => b.truthScore - a.truthScore);
        break;
      case "gasEfficiency":
        filtered.sort((a: Capsule, b: Capsule) => {
          // Prioritize chains with lower gas costs (Base > Polygon > Ethereum)
          const chainPriority = { 8453: 3, 137: 2, 1: 1 };
          return (chainPriority[b.chainId as keyof typeof chainPriority] || 0) - 
                 (chainPriority[a.chainId as keyof typeof chainPriority] || 0);
        });
        break;
      case "mostValued":
        filtered.sort((a: Capsule, b: Capsule) => (b.likes + b.views) - (a.likes + a.views));
        break;
      default: // recent
        filtered.sort((a: Capsule, b: Capsule) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    return filtered.slice(0, limit);
  }, [capsules, selectedChains, sortBy, limit]);

  const renderCapsuleCard = (capsule: Capsule) => {
    const chainInfo = CHAIN_INFO[capsule.chainId as keyof typeof CHAIN_INFO];
    
    return (
      <Card key={capsule.id} className="group hover:shadow-lg transition-all duration-300 border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {capsule.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                {capsule.description}
              </p>
            </div>
            
            {/* Chain Badge */}
            <div className="flex items-center gap-2 ml-3">
              <Badge variant="secondary" className={`${chainInfo?.color} text-white text-xs`}>
                <span className="mr-1">{chainInfo?.icon}</span>
                {chainInfo?.name}
              </Badge>
              {capsule.isMinted && (
                <Badge variant="outline" className="text-xs">
                  <Zap className="w-3 h-3 mr-1" />
                  NFT
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Media Preview */}
          {capsule.mediaUrl && (
            <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
              {capsule.mediaType === "video" ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <Button size="sm" variant="ghost" className="bg-black/60 text-white hover:bg-black/80">
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <img 
                  src={capsule.mediaUrl} 
                  alt={capsule.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="font-medium">{capsule.truthScore}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4 text-blue-500" />
                <span>{capsule.views.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-gray-500" />
                <span>{new Date(capsule.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            
            {/* Gas efficiency indicator */}
            <div className="flex items-center gap-1">
              {capsule.chainId === 8453 && (
                <Badge variant="outline" className="text-green-600 border-green-200">
                  <Zap className="w-3 h-3 mr-1" />
                  Ultra-low gas
                </Badge>
              )}
              {capsule.chainId === 137 && (
                <Badge variant="outline" className="text-blue-600 border-blue-200">
                  <DollarSign className="w-3 h-3 mr-1" />
                  Low gas
                </Badge>
              )}
            </div>
          </div>

          {/* Author */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-xs font-bold">
                {capsule.author.name.charAt(0)}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {capsule.author.name}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">
                <Play className="w-4 h-4 mr-1" />
                View
              </Button>
              {capsule.transactionHash && (
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => window.open(`${chainInfo?.explorer}/tx/${capsule.transactionHash}`, "_blank")}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Blockchain Details */}
          {capsule.isMinted && (
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
              <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                {capsule.contractAddress && (
                  <div>Contract: {capsule.contractAddress.slice(0, 8)}...{capsule.contractAddress.slice(-6)}</div>
                )}
                {capsule.tokenId && (
                  <div>Token ID: #{capsule.tokenId}</div>
                )}
                {capsule.gasUsed && (
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Gas: {capsule.gasUsed}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Multi-Chain Filter Controls */}
      <ChainFilterControls
        selectedChains={selectedChains}
        onChainsChange={setSelectedChains}
        sortBy={sortBy}
        onSortChange={setSortBy}
        showAdvanced={true}
      />

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-semibold">
            Multi-Chain Capsules
          </h2>
          {!isLoading && (
            <Badge variant="secondary">
              {filteredCapsules.length} found
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Network className="w-4 h-4" />
          <span>
            {selectedChains.length} network{selectedChains.length !== 1 ? 's' : ''} active
          </span>
        </div>
      </div>

      {/* Capsules Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="aspect-video w-full mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredCapsules.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCapsules.map(renderCapsuleCard)}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <div className="space-y-3">
            <Layers className="w-12 h-12 text-gray-400 mx-auto" />
            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400">
              No capsules found
            </h3>
            <p className="text-sm text-gray-500">
              Try adjusting your chain selection or create your first capsule
            </p>
            <Button variant="outline" onClick={() => setSelectedChains([137, 8453, 1])}>
              <Network className="w-4 h-4 mr-2" />
              Show All Chains
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}