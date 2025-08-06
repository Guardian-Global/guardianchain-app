import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Pin,
  Star,
  Eye,
  Heart,
  Share2,
  Gem,
  Shield,
  Clock,
  Search,
  Plus,
  X,
  Move,
} from "lucide-react";

interface FeaturedCapsule {
  id: string;
  title: string;
  description?: string;
  mediaUrl?: string;
  mediaType?: string;
  truthScore: number;
  views: number;
  likes: number;
  isSealed: boolean;
  isMinted: boolean;
  nftTokenId?: string;
  createdAt: string;
  featuredAt: string;
  position: number;
}

interface CapsuleSearchResult {
  id: string;
  title: string;
  description?: string;
  mediaUrl?: string;
  truthScore: number;
  isSealed: boolean;
  isMinted: boolean;
  createdAt: string;
}

export default function FeaturedCapsulesManager() {
  const [featuredCapsules, setFeaturedCapsules] = useState<FeaturedCapsule[]>(
    [],
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<CapsuleSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  // Fetch featured capsules
  const { data: featured, isLoading: featuredLoading } = useQuery({
    queryKey: ["/api/profile/featured-capsules"],
    enabled: true,
  });

  // Search user's capsules
  const searchCapsules = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await apiRequest(
        `/api/capsules/search?q=${encodeURIComponent(query)}`,
      );
      setSearchResults(response.capsules || []);
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "Could not search capsules.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Add capsule to featured
  const addToFeatured = useMutation({
    mutationFn: async (capsuleId: string) => {
      return apiRequest("/api/profile/featured-capsules", {
        method: "POST",
        body: JSON.stringify({ capsuleId }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/profile/featured-capsules"],
      });
      toast({
        title: "Capsule Featured",
        description: "Capsule added to featured collection.",
      });
    },
    onError: () => {
      toast({
        title: "Feature Failed",
        description: "Could not feature this capsule.",
        variant: "destructive",
      });
    },
  });

  // Remove from featured
  const removeFromFeatured = useMutation({
    mutationFn: async (capsuleId: string) => {
      return apiRequest(`/api/profile/featured-capsules/${capsuleId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/profile/featured-capsules"],
      });
      toast({
        title: "Capsule Unfeatured",
        description: "Capsule removed from featured collection.",
      });
    },
  });

  // Reorder featured capsules
  const reorderFeatured = useMutation({
    mutationFn: async (reorderedIds: string[]) => {
      return apiRequest("/api/profile/featured-capsules/reorder", {
        method: "PUT",
        body: JSON.stringify({ orderedIds: reorderedIds }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/profile/featured-capsules"],
      });
      toast({
        title: "Order Updated",
        description: "Featured capsules reordered successfully.",
      });
    },
  });

  useEffect(() => {
    if (featured?.featuredCapsules) {
      setFeaturedCapsules(featured.featuredCapsules);
    }
  }, [featured]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchCapsules(searchTerm);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const renderCapsuleCard = (
    capsule: CapsuleSearchResult | FeaturedCapsule,
    isFeatured = false,
  ) => (
    <Card key={capsule.id} className="relative group">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Media Preview */}
          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
            {capsule.mediaUrl ? (
              <img
                src={capsule.mediaUrl}
                alt={capsule.title}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Gem className="w-6 h-6 text-gray-400" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate">
                  {capsule.title}
                </h3>
                {capsule.description && (
                  <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                    {capsule.description}
                  </p>
                )}
              </div>

              {/* Action Button */}
              <div className="flex-shrink-0 ml-2">
                {isFeatured ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeFromFeatured.mutate(capsule.id)}
                    disabled={removeFromFeatured.isPending}
                    className="h-8 px-2"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => addToFeatured.mutate(capsule.id)}
                    disabled={addToFeatured.isPending}
                    className="h-8 px-2"
                  >
                    <Pin className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3" />
                {capsule.truthScore}
              </span>
              {"views" in capsule && (
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {capsule.views}
                </span>
              )}
              {"likes" in capsule && (
                <span className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  {capsule.likes}
                </span>
              )}
            </div>

            {/* Badges */}
            <div className="flex gap-1 mt-2">
              {capsule.isSealed && (
                <Badge variant="secondary" className="text-xs">
                  <Shield className="w-2 h-2 mr-1" />
                  Sealed
                </Badge>
              )}
              {capsule.isMinted && (
                <Badge variant="secondary" className="text-xs">
                  <Gem className="w-2 h-2 mr-1" />
                  NFT
                </Badge>
              )}
              {isFeatured && (
                <Badge variant="default" className="text-xs">
                  <Pin className="w-2 h-2 mr-1" />
                  Featured
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Featured Capsules Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pin className="w-5 h-5" />
            Featured Capsules ({featuredCapsules.length}/6)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {featuredCapsules.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Pin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No featured capsules yet.</p>
              <p className="text-sm">
                Search and pin your best capsules below.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {featuredCapsules.map((capsule) =>
                renderCapsuleCard(capsule, true),
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search and Add */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Add to Featured
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search Input */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search your capsules to feature..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Search Results */}
          {searchTerm.length >= 2 && (
            <div className="space-y-2">
              {isSearching ? (
                <div className="text-center py-4 text-gray-500">
                  <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2" />
                  Searching...
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No capsules found matching "{searchTerm}"
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                  {searchResults
                    .filter(
                      (capsule) =>
                        !featuredCapsules.find((f) => f.id === capsule.id),
                    )
                    .map((capsule) => renderCapsuleCard(capsule, false))}
                </div>
              )}
            </div>
          )}

          {/* Quick Actions */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 mb-2">
              <Star className="w-4 h-4 inline mr-1" />
              Pro Tips for Featured Capsules:
            </p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Choose capsules with high truth scores for credibility</li>
              <li>• Mix different media types (images, videos, documents)</li>
              <li>• Feature recent achievements and sealed verifications</li>
              <li>• Limit to 6 capsules for optimal presentation</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
