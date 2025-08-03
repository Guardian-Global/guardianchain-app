import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Globe, 
  Search, 
  Filter, 
  Map, 
  Layers, 
  Zap,
  Shield,
  Target,
  Users,
  Calendar,
  MapPin,
  TrendingUp,
  Eye,
  Download,
  Share,
  Bookmark,
  Star,
  ChevronDown,
  RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface TruthNode {
  id: string;
  title: string;
  category: string;
  truthScore: number;
  location: {
    country: string;
    region: string;
    coordinates: [number, number];
  };
  timestamp: string;
  author: string;
  verified: boolean;
  notarized: boolean;
  connections: number;
  viewCount: number;
  impactScore: number;
  tags: string[];
  preview: string;
}

interface ExplorerFilters {
  searchQuery: string;
  category: string;
  region: string;
  timeRange: string;
  minTruthScore: number;
  verified: boolean | null;
  notarized: boolean | null;
  sortBy: string;
}

export default function EnhancedTruthExplorer() {
  const [filters, setFilters] = useState<ExplorerFilters>({
    searchQuery: "",
    category: "all",
    region: "global",
    timeRange: "all",
    minTruthScore: 0,
    verified: null,
    notarized: null,
    sortBy: "relevance"
  });
  
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid");
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch truth network data
  const { data: networkData, isLoading } = useQuery({
    queryKey: ["/api/truth-net", filters],
    refetchInterval: 30000, // Real-time updates
  });

  const categories = [
    { id: "all", name: "All Categories", count: 1247 },
    { id: "whistleblowing", name: "Whistleblowing", count: 234 },
    { id: "testimony", name: "Personal Testimony", count: 567 },
    { id: "historical", name: "Historical Record", count: 189 },
    { id: "news", name: "News Event", count: 123 },
    { id: "legal", name: "Legal Document", count: 78 },
    { id: "research", name: "Research Finding", count: 56 }
  ];

  const regions = [
    { id: "global", name: "Global", count: 1247 },
    { id: "north_america", name: "North America", count: 423 },
    { id: "europe", name: "Europe", count: 312 },
    { id: "asia_pacific", name: "Asia Pacific", count: 267 },
    { id: "south_america", name: "South America", count: 134 },
    { id: "africa", name: "Africa", count: 89 },
    { id: "middle_east", name: "Middle East", count: 22 }
  ];

  // Generate mock truth nodes
  const generateTruthNodes = (): TruthNode[] => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: `node_${i}`,
      title: [
        "Corporate Data Breach Disclosure",
        "Government Surveillance Evidence",
        "Climate Change Research Findings",
        "Medical Trial Misconduct Report",
        "Financial Fraud Documentation",
        "Workplace Safety Violations",
        "Historical Document Archive",
        "Witness Testimony Account",
        "Investigative Journalism Report",
        "Scientific Research Integrity"
      ][Math.floor(Math.random() * 10)],
      category: categories[Math.floor(Math.random() * (categories.length - 1)) + 1].id,
      truthScore: Math.floor(Math.random() * 40) + 60,
      location: {
        country: ["US", "UK", "CA", "DE", "FR", "AU", "JP"][Math.floor(Math.random() * 7)],
        region: regions[Math.floor(Math.random() * (regions.length - 1)) + 1].id,
        coordinates: [
          (Math.random() - 0.5) * 360,
          (Math.random() - 0.5) * 180
        ] as [number, number]
      },
      timestamp: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      author: `User${Math.floor(Math.random() * 1000)}`,
      verified: Math.random() > 0.3,
      notarized: Math.random() > 0.7,
      connections: Math.floor(Math.random() * 50),
      viewCount: Math.floor(Math.random() * 10000),
      impactScore: Math.floor(Math.random() * 100),
      tags: ["truth", "evidence", "verified", "important"].slice(0, Math.floor(Math.random() * 4) + 1),
      preview: "This disclosure contains critical information about events that impact public trust and safety. The evidence presented has been carefully documented and cross-verified through multiple sources."
    }));
  };

  const truthNodes = generateTruthNodes();

  // Filter nodes based on current filters
  const filteredNodes = truthNodes.filter(node => {
    if (filters.searchQuery && !node.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) && 
        !node.preview.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
      return false;
    }
    if (filters.category !== "all" && node.category !== filters.category) return false;
    if (filters.region !== "global" && node.location.region !== filters.region) return false;
    if (node.truthScore < filters.minTruthScore) return false;
    if (filters.verified !== null && node.verified !== filters.verified) return false;
    if (filters.notarized !== null && node.notarized !== filters.notarized) return false;
    return true;
  });

  const updateFilter = (key: keyof ExplorerFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const TruthNodeCard = ({ node, compact = false }: { node: TruthNode; compact?: boolean }) => (
    <Card 
      className={`bg-slate-800/50 border-purple-500/20 hover:border-purple-400/40 transition-all duration-200 cursor-pointer ${
        selectedNode === node.id ? 'ring-2 ring-purple-500' : ''
      }`}
      onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
    >
      <CardContent className={compact ? "p-4" : "p-6"}>
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className={`font-semibold text-white ${compact ? 'text-sm' : 'text-base'}`}>
                {node.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {node.category}
                </Badge>
                {node.verified && (
                  <Badge variant="default" className="text-xs bg-green-500">
                    Verified
                  </Badge>
                )}
                {node.notarized && (
                  <Badge variant="default" className="text-xs bg-purple-500">
                    Notarized
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-green-400">
                {node.truthScore}%
              </span>
            </div>
          </div>

          {/* Preview */}
          {!compact && (
            <p className="text-sm text-gray-300 line-clamp-2">
              {node.preview}
            </p>
          )}

          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {node.location.country}
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {node.connections}
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {node.viewCount.toLocaleString()}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Bookmark className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Share className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Tags */}
          {!compact && (
            <div className="flex flex-wrap gap-1">
              {node.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Expanded Details */}
          {selectedNode === node.id && (
            <div className="border-t border-gray-600 pt-3 mt-3 space-y-2">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-400">Author:</span>
                  <span className="text-white ml-2">{node.author}</span>
                </div>
                <div>
                  <span className="text-gray-400">Impact Score:</span>
                  <span className="text-white ml-2">{node.impactScore}</span>
                </div>
                <div>
                  <span className="text-gray-400">Created:</span>
                  <span className="text-white ml-2">
                    {new Date(node.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Region:</span>
                  <span className="text-white ml-2">{node.location.region}</span>
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline">
                  <Eye className="w-3 h-3 mr-1" />
                  View Full
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="w-3 h-3 mr-1" />
                  Download
                </Button>
                <Button size="sm" variant="outline">
                  <Zap className="w-3 h-3 mr-1" />
                  Analyze
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const FilterPanel = () => (
    <Card className="bg-slate-800/50 border-purple-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Filter className="w-4 h-4" />
          Advanced Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Category Filter */}
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">Category</label>
          <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{cat.name}</span>
                    <Badge variant="secondary" className="text-xs ml-2">
                      {cat.count}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Region Filter */}
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">Region</label>
          <Select value={filters.region} onValueChange={(value) => updateFilter('region', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {regions.map((region) => (
                <SelectItem key={region.id} value={region.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{region.name}</span>
                    <Badge variant="secondary" className="text-xs ml-2">
                      {region.count}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Truth Score Filter */}
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">
            Minimum Truth Score: {filters.minTruthScore}%
          </label>
          <Slider
            value={[filters.minTruthScore]}
            onValueChange={(value) => updateFilter('minTruthScore', value[0])}
            max={100}
            step={5}
            className="w-full"
          />
        </div>

        {/* Status Filters */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300">Verified Only</label>
            <Button
              variant={filters.verified === true ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter('verified', filters.verified === true ? null : true)}
            >
              {filters.verified === true ? "On" : "Off"}
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300">Notarized Only</label>
            <Button
              variant={filters.notarized === true ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter('notarized', filters.notarized === true ? null : true)}
            >
              {filters.notarized === true ? "On" : "Off"}
            </Button>
          </div>
        </div>

        {/* Sort Options */}
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">Sort By</label>
          <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="truth_score">Truth Score</SelectItem>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="impact">Impact Score</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters */}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setFilters({
            searchQuery: "",
            category: "all",
            region: "global",
            timeRange: "all",
            minTruthScore: 0,
            verified: null,
            notarized: null,
            sortBy: "relevance"
          })}
        >
          Clear All Filters
        </Button>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="bg-slate-800/50 border-purple-500/20">
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-700 rounded w-1/3"></div>
              <div className="h-4 bg-gray-700 rounded w-2/3"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-48 bg-gray-700 rounded"></div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-slate-800/50 border-purple-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-purple-400" />
                Truth Explorer
                <Badge variant="outline" className="animate-pulse">
                  Live Network
                </Badge>
              </CardTitle>
              <p className="text-sm text-gray-400 mt-1">
                Explore verified truth capsules from the global GuardianChain network
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
              
              <div className="flex items-center gap-1 bg-slate-700/50 rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Layers className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <Search className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "map" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("map")}
                >
                  <Map className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search truth capsules, topics, or keywords..."
              value={filters.searchQuery}
              onChange={(e) => updateFilter('searchQuery', e.target.value)}
              className="pl-10 bg-slate-700/50 border-purple-500/30"
            />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{filteredNodes.length}</div>
              <div className="text-xs text-gray-400">Total Results</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {filteredNodes.filter(n => n.verified).length}
              </div>
              <div className="text-xs text-gray-400">Verified</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {filteredNodes.filter(n => n.notarized).length}
              </div>
              <div className="text-xs text-gray-400">Notarized</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {Math.round(filteredNodes.reduce((sum, n) => sum + n.truthScore, 0) / filteredNodes.length) || 0}%
              </div>
              <div className="text-xs text-gray-400">Avg Truth Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-6">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="w-80">
            <FilterPanel />
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1">
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNodes.map((node) => (
                <TruthNodeCard key={node.id} node={node} />
              ))}
            </div>
          )}

          {viewMode === "list" && (
            <div className="space-y-4">
              {filteredNodes.map((node) => (
                <TruthNodeCard key={node.id} node={node} compact />
              ))}
            </div>
          )}

          {viewMode === "map" && (
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardContent className="p-6">
                <div className="h-96 bg-slate-700/50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Map className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Interactive Truth Map
                    </h3>
                    <p className="text-gray-400 mb-4">
                      Geographic visualization of truth network nodes
                    </p>
                    <div className="text-sm text-gray-500">
                      Showing {filteredNodes.length} truth capsules across {
                        new Set(filteredNodes.map(n => n.location.country)).size
                      } countries
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {filteredNodes.length === 0 && (
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardContent className="p-12 text-center">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  No Results Found
                </h3>
                <p className="text-gray-400 mb-4">
                  Try adjusting your search criteria or filters
                </p>
                <Button
                  variant="outline"
                  onClick={() => setFilters({
                    searchQuery: "",
                    category: "all",
                    region: "global",
                    timeRange: "all",
                    minTruthScore: 0,
                    verified: null,
                    notarized: null,
                    sortBy: "relevance"
                  })}
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}