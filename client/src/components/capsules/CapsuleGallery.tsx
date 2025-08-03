import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useWallet } from "@/hooks/useWallet";
import { useToast } from "@/hooks/use-toast";
import { 
  Grid3X3, 
  List, 
  Search,
  Filter,
  SortAsc,
  Eye,
  Shield,
  Lock,
  Globe,
  Play,
  Image,
  FileText,
  Coins,
  ExternalLink,
  Sparkles,
  Calendar,
  TrendingUp
} from "lucide-react";
import { calculateCapsuleYield, formatYieldAmount, getYieldTier } from "@/utils/capsuleYield";

interface Capsule {
  id: string;
  title: string;
  description: string;
  mediaUrl?: string;
  mediaType: string;
  isPrivate: boolean;
  hasVeritasSeal: boolean;
  unlockDate?: string;
  ipfsUrl?: string;
  createdAt: string;
  truthScore?: number;
  viewCount?: number;
  nftTokenId?: string;
  transactionHash?: string;
}

interface CapsuleGalleryProps {
  userId?: string;
  showFilters?: boolean;
  gridSize?: 'small' | 'medium' | 'large';
  maxItems?: number;
}

export default function CapsuleGallery({ 
  userId, 
  showFilters = true, 
  gridSize = 'medium',
  maxItems 
}: CapsuleGalleryProps) {
  const { user } = useAuth();
  const { address } = useWallet();
  const { toast } = useToast();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterType, setFilterType] = useState('all');

  // Use provided userId or fallback to current user
  const targetUserId = userId || user?.id;

  const { 
    data: capsules = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ["/api/capsules", targetUserId, sortBy, filterType],
    queryFn: async () => {
      if (!targetUserId) return [];
      
      const params = new URLSearchParams({
        userId: targetUserId,
        sort: sortBy,
        filter: filterType,
      });
      
      const response = await fetch(`/api/capsules?${params}`, {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch capsules");
      }
      
      return response.json();
    },
    enabled: !!targetUserId,
  });

  // Filter and sort capsules locally for real-time updates
  const filteredCapsules = capsules
    .filter((capsule: Capsule) => {
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          capsule.title.toLowerCase().includes(searchLower) ||
          capsule.description.toLowerCase().includes(searchLower)
        );
      }
      return true;
    })
    .slice(0, maxItems);

  const getCapsuleIcon = (mediaType: string) => {
    if (mediaType.startsWith("image/")) return <Image className="w-4 h-4" />;
    if (mediaType.startsWith("video/")) return <Play className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  const getGridClasses = () => {
    switch (gridSize) {
      case 'small':
        return 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6';
      case 'large':
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
    }
  };

  const isUnlocked = (unlockDate?: string) => {
    if (!unlockDate) return true;
    return new Date() >= new Date(unlockDate);
  };

  if (!targetUserId) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">
          Please connect your wallet to view capsules
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {showFilters && (
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="h-10 bg-gray-200 rounded animate-pulse flex-1"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse w-32"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse w-32"></div>
          </div>
        )}
        <div className={`grid ${getGridClasses()} gap-4`}>
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-video bg-gray-200 animate-pulse"></div>
              <CardContent className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center space-y-3">
          <div className="text-red-500">Failed to load capsules</div>
          <Button variant="outline" onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  if (filteredCapsules.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center space-y-3">
          <Sparkles className="w-12 h-12 text-gray-400 mx-auto" />
          <div className="text-gray-500">
            {searchTerm ? 'No capsules match your search' : 'No capsules created yet'}
          </div>
          {!searchTerm && targetUserId === user?.id && (
            <Link href="/create">
              <Button className="mt-2">
                Create Your First Capsule
              </Button>
            </Link>
          )}
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Controls */}
      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-1 gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search capsules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="verified">Veritas Sealed</SelectItem>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="locked">Time Locked</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SortAsc className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="yield">Highest Yield</SelectItem>
                <SelectItem value="views">Most Viewed</SelectItem>
                <SelectItem value="score">Truth Score</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Capsules Grid/List */}
      <div className={
        viewMode === 'grid' 
          ? `grid ${getGridClasses()} gap-4`
          : 'space-y-4'
      }>
        {filteredCapsules.map((capsule: Capsule) => {
          const yieldData = calculateCapsuleYield(
            capsule.createdAt, 
            0.12, 
            capsule.truthScore,
            capsule.hasVeritasSeal
          );
          const yieldTier = getYieldTier(yieldData.dailyRate);

          return viewMode === 'grid' ? (
            // Grid View
            <Card key={capsule.id} className="group overflow-hidden hover:shadow-lg transition-all duration-200">
              <div className="relative">
                {/* Media Preview */}
                <div className="aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
                  {capsule.mediaUrl ? (
                    capsule.mediaType.startsWith("image/") ? (
                      <img 
                        src={capsule.mediaUrl} 
                        alt={capsule.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : capsule.mediaType.startsWith("video/") ? (
                      <video 
                        src={capsule.mediaUrl}
                        className="w-full h-full object-cover"
                        muted
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {getCapsuleIcon(capsule.mediaType)}
                      </div>
                    )
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900">
                      <Sparkles className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Status Badges */}
                <div className="absolute top-2 left-2 flex gap-1">
                  {capsule.hasVeritasSeal && (
                    <Badge className="bg-blue-600 text-white text-xs">
                      <Shield className="w-3 h-3 mr-1" />
                      Sealed
                    </Badge>
                  )}
                  
                  {!isUnlocked(capsule.unlockDate) && (
                    <Badge className="bg-orange-600 text-white text-xs">
                      <Lock className="w-3 h-3 mr-1" />
                      Locked
                    </Badge>
                  )}
                </div>

                {/* Privacy Indicator */}
                <div className="absolute top-2 right-2">
                  {capsule.isPrivate ? (
                    <Lock className="w-4 h-4 text-white drop-shadow-lg" />
                  ) : (
                    <Globe className="w-4 h-4 text-white drop-shadow-lg" />
                  )}
                </div>

                {/* Yield Tier Badge */}
                <div className="absolute bottom-2 right-2">
                  <Badge variant="secondary" className={`${yieldTier.color} text-xs`}>
                    {yieldTier.tier}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold line-clamp-1 group-hover:text-purple-600 transition-colors">
                      {capsule.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {capsule.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {capsule.viewCount || 0}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(capsule.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-green-600">
                      <Coins className="w-3 h-3" />
                      {formatYieldAmount(yieldData.currentYield)}
                    </div>
                  </div>

                  <Link href={`/capsule-detail/${capsule.id}`}>
                    <Button variant="outline" size="sm" className="w-full group-hover:bg-purple-50 group-hover:border-purple-200">
                      View Details
                      <ExternalLink className="w-3 h-3 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            // List View
            <Card key={capsule.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                    {capsule.mediaUrl ? (
                      capsule.mediaType.startsWith("image/") ? (
                        <img 
                          src={capsule.mediaUrl} 
                          alt={capsule.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {getCapsuleIcon(capsule.mediaType)}
                        </div>
                      )
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">{capsule.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                          {capsule.description}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2 ml-4">
                        <div className="flex items-center gap-2">
                          {capsule.hasVeritasSeal && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                              <Shield className="w-3 h-3 mr-1" />
                              Sealed
                            </Badge>
                          )}
                          
                          <Badge variant="outline" className={yieldTier.color}>
                            {yieldTier.tier}
                          </Badge>
                        </div>

                        <Link href={`/capsule-detail/${capsule.id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {capsule.viewCount || 0} views
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(capsule.createdAt).toLocaleDateString()}
                        </div>

                        {capsule.truthScore && (
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            Score: {capsule.truthScore}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-green-600 font-medium">
                        <Coins className="w-4 h-4" />
                        {formatYieldAmount(yieldData.currentYield)} earned
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Load More / Pagination could go here */}
      {maxItems && filteredCapsules.length >= maxItems && (
        <div className="text-center">
          <Button variant="outline">
            Load More Capsules
          </Button>
        </div>
      )}
    </div>
  );
}