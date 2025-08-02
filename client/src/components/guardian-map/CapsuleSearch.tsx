import React from "react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Search,
  Filter,
  Package,
  X,
  Clock,
  Shield,
  Target,
  TrendingUp,
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface Capsule {
  id: string;
  title: string;
  content: string;
  grief_tier: string;
  tags: string[];
  guardian_id: string;
  created_at: string;
  verification_status: "pending" | "verified" | "disputed";
  truth_score: number;
  interaction_count: number;
  region: string;
  category: string;
}

interface CapsuleFilters {
  searchQuery: string;
  griefTier: string;
  verificationStatus: string;
  region: string;
  category: string;
  truthScoreMin: number;
  dateRange: string;
  tags: string[];
}

interface CapsuleSearchProps {
  onResultsChange?: (capsules: Capsule[]) => void;
  onExport?: (capsules: Capsule[], format: string) => void;
}

export default function CapsuleSearch({
  onResultsChange,
  onExport,
}: CapsuleSearchProps) {
  const [filters, setFilters] = useState<CapsuleFilters>({
    searchQuery: "",
    griefTier: "all",
    verificationStatus: "all",
    region: "all",
    category: "all",
    truthScoreMin: 0,
    dateRange: "all",
    tags: [],
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Search capsules based on filters
  const {
    data: searchResults,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["/api/capsules/search", filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.searchQuery) params.append("query", filters.searchQuery);
      if (filters.griefTier !== "all")
        params.append("grief_tier", filters.griefTier);
      if (filters.verificationStatus !== "all")
        params.append("verification_status", filters.verificationStatus);
      if (filters.region !== "all") params.append("region", filters.region);
      if (filters.category !== "all")
        params.append("category", filters.category);
      if (filters.truthScoreMin > 0)
        params.append("truth_score_min", filters.truthScoreMin.toString());
      if (filters.dateRange !== "all")
        params.append("date_range", filters.dateRange);
      if (selectedTags.length > 0)
        params.append("tags", selectedTags.join(","));

      const response = await apiRequest(
        "GET",
        `/api/capsules/search?${params}`,
      );
      return response.json();
    },
    enabled:
      filters.searchQuery.length > 2 ||
      filters.griefTier !== "all" ||
      filters.verificationStatus !== "all",
  });

  // Get available tags
  const { data: availableTags } = useQuery({
    queryKey: ["/api/capsules/tags"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/capsules/tags");
      return response.json();
    },
  });

  const handleFilterChange = (newFilters: Partial<CapsuleFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
  };

  const clearFilters = () => {
    const defaultFilters: CapsuleFilters = {
      searchQuery: "",
      griefTier: "all",
      verificationStatus: "all",
      region: "all",
      category: "all",
      truthScoreMin: 0,
      dateRange: "all",
      tags: [],
    };
    setFilters(defaultFilters);
    setSelectedTags([]);
  };

  const toggleTag = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];

    setSelectedTags(newTags);
    handleFilterChange({ tags: newTags });
  };

  const getFilterCount = () => {
    let count = 0;
    if (filters.searchQuery) count++;
    if (filters.griefTier !== "all") count++;
    if (filters.verificationStatus !== "all") count++;
    if (filters.region !== "all") count++;
    if (filters.category !== "all") count++;
    if (filters.truthScoreMin > 0) count++;
    if (filters.dateRange !== "all") count++;
    if (selectedTags.length > 0) count++;
    return count;
  };

  const results = searchResults?.capsules || [];

  // Notify parent of results change
  React.useEffect(() => {
    if (onResultsChange) {
      onResultsChange(results);
    }
  }, [results, onResultsChange]);

  return (
    <Card className="bg-black/40 backdrop-blur-xl border-indigo-500/20">
      <CardHeader>
        <CardTitle className="text-indigo-300 flex items-center justify-between">
          <div className="flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Capsule Search
            {getFilterCount() > 0 && (
              <Badge
                variant="outline"
                className="ml-2 border-indigo-400 text-indigo-300"
              >
                {getFilterCount()} active
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="border-indigo-500/30"
            >
              <Filter className="w-4 h-4 mr-1" />
              Advanced
            </Button>
            {getFilterCount() > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="border-red-500/30 text-red-300"
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Basic Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search capsules by title, content, guardian..."
            value={filters.searchQuery}
            onChange={(e) =>
              handleFilterChange({ searchQuery: e.target.value })
            }
            className="pl-10 bg-slate-800/50 border-indigo-500/30 text-white placeholder:text-gray-400"
          />
        </div>

        {/* Quick Filters */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <Label className="text-sm text-gray-300 mb-1 block">
              Grief Tier
            </Label>
            <Select
              value={filters.griefTier}
              onValueChange={(value) =>
                handleFilterChange({ griefTier: value })
              }
            >
              <SelectTrigger className="bg-slate-800 border-indigo-500/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-indigo-500/30">
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="tier_1">Tier 1 (0-25)</SelectItem>
                <SelectItem value="tier_2">Tier 2 (26-50)</SelectItem>
                <SelectItem value="tier_3">Tier 3 (51-75)</SelectItem>
                <SelectItem value="tier_4">Tier 4 (76-100)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm text-gray-300 mb-1 block">
              Verification
            </Label>
            <Select
              value={filters.verificationStatus}
              onValueChange={(value) =>
                handleFilterChange({ verificationStatus: value })
              }
            >
              <SelectTrigger className="bg-slate-800 border-indigo-500/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-indigo-500/30">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="verified">
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-green-400" />
                    Verified
                  </div>
                </SelectItem>
                <SelectItem value="pending">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-yellow-400" />
                    Pending
                  </div>
                </SelectItem>
                <SelectItem value="disputed">
                  <div className="flex items-center">
                    <Target className="w-4 h-4 mr-2 text-red-400" />
                    Disputed
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm text-gray-300 mb-1 block">
              Time Range
            </Label>
            <Select
              value={filters.dateRange}
              onValueChange={(value) =>
                handleFilterChange({ dateRange: value })
              }
            >
              <SelectTrigger className="bg-slate-800 border-indigo-500/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-indigo-500/30">
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="space-y-4 border-t border-gray-700 pt-4">
            {/* Region and Category */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-300 mb-1 block">
                  Region
                </Label>
                <Select
                  value={filters.region}
                  onValueChange={(value) =>
                    handleFilterChange({ region: value })
                  }
                >
                  <SelectTrigger className="bg-slate-800 border-indigo-500/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-indigo-500/30">
                    <SelectItem value="all">All Regions</SelectItem>
                    <SelectItem value="north_america">North America</SelectItem>
                    <SelectItem value="europe">Europe</SelectItem>
                    <SelectItem value="asia">Asia</SelectItem>
                    <SelectItem value="africa">Africa</SelectItem>
                    <SelectItem value="south_america">South America</SelectItem>
                    <SelectItem value="oceania">Oceania</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm text-gray-300 mb-1 block">
                  Category
                </Label>
                <Select
                  value={filters.category}
                  onValueChange={(value) =>
                    handleFilterChange({ category: value })
                  }
                >
                  <SelectTrigger className="bg-slate-800 border-indigo-500/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-indigo-500/30">
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="memory">Memory</SelectItem>
                    <SelectItem value="testimony">Testimony</SelectItem>
                    <SelectItem value="legacy">Legacy</SelectItem>
                    <SelectItem value="truth">Truth</SelectItem>
                    <SelectItem value="trauma">Trauma</SelectItem>
                    <SelectItem value="wisdom">Wisdom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Truth Score Filter */}
            <div>
              <Label className="text-sm text-gray-300 mb-2 block">
                Minimum Truth Score: {filters.truthScoreMin}
              </Label>
              <input
                type="range"
                min="0"
                max="100"
                value={filters.truthScoreMin}
                onChange={(e) =>
                  handleFilterChange({ truthScoreMin: Number(e.target.value) })
                }
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Tags */}
            {availableTags?.tags && (
              <div>
                <Label className="text-sm text-gray-300 mb-2 block">Tags</Label>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-h-32 overflow-y-auto">
                  {availableTags.tags.map((tag: string) => (
                    <div key={tag} className="flex items-center space-x-2">
                      <Checkbox
                        id={tag}
                        checked={selectedTags.includes(tag)}
                        onCheckedChange={() => toggleTag(tag)}
                        className="border-indigo-500/30"
                      />
                      <Label
                        htmlFor={tag}
                        className="text-xs text-gray-300 cursor-pointer"
                      >
                        {tag}
                      </Label>
                    </div>
                  ))}
                </div>
                {selectedTags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {selectedTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="border-indigo-400 text-indigo-300 text-xs cursor-pointer"
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                        <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Search Results */}
        {isLoading && (
          <div className="text-center py-4">
            <div className="animate-spin w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-gray-400">Searching capsules...</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="border-t border-gray-700 pt-4">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-300">
                <TrendingUp className="w-4 h-4 inline mr-1" />
                Found {results.length} capsule{results.length !== 1 ? "s" : ""}
              </div>
              {onExport && (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onExport(results, "csv")}
                    className="border-indigo-500/30"
                  >
                    Export CSV
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onExport(results, "pdf")}
                    className="border-indigo-500/30"
                  >
                    Export PDF
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {results.slice(0, 10).map((capsule: Capsule) => (
                <div
                  key={capsule.id}
                  className="bg-slate-800/50 p-3 rounded border border-gray-700"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-medium text-white truncate">
                      {capsule.title}
                    </h4>
                    <div className="flex items-center space-x-2 ml-2">
                      <Badge variant="outline" className="text-xs">
                        {capsule.grief_tier}
                      </Badge>
                      {capsule.verification_status === "verified" && (
                        <Shield className="w-3 h-3 text-green-400" />
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mb-2 line-clamp-2">
                    {capsule.content.slice(0, 120)}...
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Score: {capsule.truth_score}</span>
                    <span>
                      {new Date(capsule.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {capsule.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {capsule.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {results.length > 10 && (
                <p className="text-center text-xs text-gray-400 py-2">
                  ... and {results.length - 10} more results
                </p>
              )}
            </div>
          </div>
        )}

        {filters.searchQuery.length > 2 &&
          results.length === 0 &&
          !isLoading && (
            <div className="text-center py-4 text-gray-400">
              <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No capsules found matching your criteria</p>
              <p className="text-xs">Try adjusting your search filters</p>
            </div>
          )}
      </CardContent>
    </Card>
  );
}
