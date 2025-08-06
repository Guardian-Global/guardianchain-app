import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import MasterCapsule from "@/components/MasterCapsule";
import { 
  Search, Filter, Grid3X3, List, Calendar, TrendingUp,
  Clock, Star, Globe, Lock, Shield, Users, Eye, Heart,
  ChevronDown, SlidersHorizontal, Map, BarChart3, Zap
} from "lucide-react";

export default function CapsuleExplorer() {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"card" | "list" | "grid" | "timeline">("card");
  const [sortBy, setSortBy] = useState("recent");
  const [filterBy, setFilterBy] = useState("all");
  const [privacyFilter, setPrivacyFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const { data: capsules, isLoading } = useQuery({
    queryKey: ["/api/capsules/explore", { searchQuery, sortBy, filterBy, privacyFilter, typeFilter }],
    staleTime: 30000,
  });

  const { data: explorerStats } = useQuery({
    queryKey: ["/api/capsules/stats"],
    staleTime: 60000,
  });

  // Mock data for development
  const mockCapsules = [
    {
      id: "cap_001",
      title: "The Truth About Digital Privacy in 2025",
      description: "A comprehensive analysis of how personal data is being harvested and monetized by tech giants, with actionable steps for protecting your digital footprint.",
      content: "Full investigation...",
      type: "document" as const,
      privacy: "public" as const,
      truthScore: 94,
      verificationLevel: "Guardian Verified",
      emotionalResonance: 87,
      griefScore: 23,
      createdAt: "2025-08-04T00:00:00Z",
      author: {
        name: "CyberGuardian2025",
        tier: "Guardian",
        verified: true
      },
      metrics: {
        views: 12547,
        likes: 892,
        comments: 156,
        shares: 234,
        truthVotes: 445
      },
      tags: ["privacy", "security", "tech", "investigation"],
      lineage: {
        childCapsules: 7,
        influenceScore: 156
      },
      nft: {
        minted: true,
        tokenId: "1234",
        blockchain: "Polygon",
        price: 0.5
      }
    },
    {
      id: "cap_002", 
      title: "Voice Testimony: Corporate Whistleblower",
      description: "Anonymous testimony from a tech industry insider revealing unethical practices in AI development and data collection.",
      content: "Audio content...",
      type: "voice" as const,
      privacy: "dao-sealed" as const,
      truthScore: 96,
      verificationLevel: "DAO Verified",
      emotionalResonance: 94,
      griefScore: 78,
      createdAt: "2025-08-03T15:30:00Z",
      unlockDate: "2025-12-01T00:00:00Z",
      author: {
        name: "TruthSeeker_Anonymous",
        tier: "Sovereign",
        verified: true
      },
      metrics: {
        views: 8934,
        likes: 1247,
        comments: 289,
        shares: 445,
        truthVotes: 623
      },
      tags: ["whistleblower", "ai", "ethics", "corporate"],
      lineage: {
        childCapsules: 12,
        influenceScore: 289
      }
    },
    {
      id: "cap_003",
      title: "Evidence Collection: Environmental Cover-up",
      description: "Photographic and documentary evidence of illegal dumping by a major corporation, including GPS coordinates and witness statements.",
      content: "Image gallery and documents...",
      type: "mixed" as const,
      privacy: "time-locked" as const,
      truthScore: 91,
      verificationLevel: "Community Verified",
      emotionalResonance: 82,
      griefScore: 45,
      createdAt: "2025-08-02T10:15:00Z",
      unlockDate: "2025-09-15T00:00:00Z",
      author: {
        name: "EcoWarrior23",
        tier: "Seeker",
        verified: false
      },
      metrics: {
        views: 5623,
        likes: 567,
        comments: 89,
        shares: 123,
        truthVotes: 334
      },
      tags: ["environment", "evidence", "corporate-crime", "investigation"]
    }
  ];

  const mockStats = {
    totalCapsules: 45632,
    publicCapsules: 23456,
    timeLocked: 12345,
    daoSealed: 6789,
    averageTruthScore: 84.7,
    totalViews: 2.4e6,
    activeVerifiers: 1247
  };

  const filteredCapsules = useMemo(() => {
    let filtered = mockCapsules;

    if (searchQuery) {
      filtered = filtered.filter(capsule => 
        capsule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        capsule.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        capsule.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (privacyFilter !== "all") {
      filtered = filtered.filter(capsule => capsule.privacy === privacyFilter);
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(capsule => capsule.type === typeFilter);
    }

    // Sort
    switch (sortBy) {
      case "truth-score":
        filtered.sort((a, b) => b.truthScore - a.truthScore);
        break;
      case "popular":
        filtered.sort((a, b) => b.metrics.views - a.metrics.views);
        break;
      case "recent":
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return filtered;
  }, [mockCapsules, searchQuery, sortBy, privacyFilter, typeFilter]);

  const getViewModeIcon = (mode: string) => {
    switch (mode) {
      case "grid": return <Grid3X3 className="w-4 h-4" />;
      case "list": return <List className="w-4 h-4" />;
      case "timeline": return <Calendar className="w-4 h-4" />;
      default: return <Grid3X3 className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#f0f6fc] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gradient-neural mb-4">
            Capsule Explorer
          </h1>
          <p className="text-xl text-[#8b949e] max-w-3xl mx-auto">
            Discover, verify, and explore truth capsules from the Guardian community. Search through verified testimonies, evidence, and insights.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <Card className="bg-[#161b22] border-[#30363d] col-span-2 md:col-span-2">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-[#00ffe1] mb-1">
                {mockStats.totalCapsules.toLocaleString()}
              </div>
              <div className="text-sm text-[#8b949e]">Total Capsules</div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#161b22] border-[#30363d]">
            <CardContent className="p-4 text-center">
              <Globe className="w-6 h-6 text-[#10b981] mx-auto mb-2" />
              <div className="text-lg font-bold text-[#f0f6fc]">{mockStats.publicCapsules.toLocaleString()}</div>
              <div className="text-xs text-[#8b949e]">Public</div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#161b22] border-[#30363d]">
            <CardContent className="p-4 text-center">
              <Clock className="w-6 h-6 text-[#7c3aed] mx-auto mb-2" />
              <div className="text-lg font-bold text-[#f0f6fc]">{mockStats.timeLocked.toLocaleString()}</div>
              <div className="text-xs text-[#8b949e]">Time-Locked</div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#161b22] border-[#30363d]">
            <CardContent className="p-4 text-center">
              <Shield className="w-6 h-6 text-[#00ffe1] mx-auto mb-2" />
              <div className="text-lg font-bold text-[#f0f6fc]">{mockStats.daoSealed.toLocaleString()}</div>
              <div className="text-xs text-[#8b949e]">DAO Sealed</div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#161b22] border-[#30363d]">
            <CardContent className="p-4 text-center">
              <Star className="w-6 h-6 text-[#f79009] mx-auto mb-2" />
              <div className="text-lg font-bold text-[#f0f6fc]">{mockStats.averageTruthScore}</div>
              <div className="text-xs text-[#8b949e]">Avg Truth Score</div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#161b22] border-[#30363d]">
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 text-[#ff00d4] mx-auto mb-2" />
              <div className="text-lg font-bold text-[#f0f6fc]">{mockStats.activeVerifiers.toLocaleString()}</div>
              <div className="text-xs text-[#8b949e]">Verifiers</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="bg-[#161b22] border-[#30363d] mb-8">
          <CardContent className="p-6">
            {/* Search Bar */}
            <div className="flex gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#8b949e]" />
                <Input
                  placeholder="Search capsules by title, description, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[#0d1117] border-[#30363d] text-[#f0f6fc] h-12"
                />
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className="border-[#30363d] text-[#8b949e] hover:border-[#00ffe1] hover:text-[#00ffe1]"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-[#30363d]">
                <div>
                  <label className="text-sm text-[#8b949e] mb-2 block">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="bg-[#0d1117] border-[#30363d] text-[#f0f6fc]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#161b22] border-[#30363d]">
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="truth-score">Highest Truth Score</SelectItem>
                      <SelectItem value="verified">Most Verified</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-[#8b949e] mb-2 block">Privacy</label>
                  <Select value={privacyFilter} onValueChange={setPrivacyFilter}>
                    <SelectTrigger className="bg-[#0d1117] border-[#30363d] text-[#f0f6fc]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#161b22] border-[#30363d]">
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="time-locked">Time-Locked</SelectItem>
                      <SelectItem value="dao-sealed">DAO Sealed</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-[#8b949e] mb-2 block">Content Type</label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="bg-[#0d1117] border-[#30363d] text-[#f0f6fc]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#161b22] border-[#30363d]">
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="voice">Voice</SelectItem>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="document">Document</SelectItem>
                      <SelectItem value="mixed">Mixed Media</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-[#8b949e] mb-2 block">View Mode</label>
                  <div className="flex gap-1 bg-[#0d1117] rounded-lg p-1 border border-[#30363d]">
                    {["card", "list", "grid", "timeline"].map((mode) => (
                      <Button
                        key={mode}
                        size="sm"
                        variant={viewMode === mode ? "default" : "ghost"}
                        onClick={() => setViewMode(mode as any)}
                        className={`flex-1 ${viewMode === mode ? 'bg-[#00ffe1] text-[#0d1117]' : 'text-[#8b949e]'}`}
                      >
                        {getViewModeIcon(mode)}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-[#8b949e]">
            Showing {filteredCapsules.length} of {mockCapsules.length} capsules
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-[#30363d] text-[#8b949e]">
              <Map className="w-4 h-4 mr-2" />
              Map View
            </Button>
            <Button variant="outline" size="sm" className="border-[#30363d] text-[#8b949e]">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
          </div>
        </div>

        {/* Capsules Grid/List */}
        <div className={`grid gap-6 ${
          viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" :
          viewMode === "list" ? "grid-cols-1" :
          "grid-cols-1 md:grid-cols-2"
        }`}>
          {filteredCapsules.map((capsule) => (
            <EnhancedCapsuleCard
              key={capsule.id}
              capsule={capsule}
              viewMode={viewMode}
              onView={(id) => setLocation(`/capsule/${id}`)}
              onLike={(id) => console.log("Like capsule:", id)}
              onShare={(id) => console.log("Share capsule:", id)}
              onVerify={(id) => console.log("Verify capsule:", id)}
            />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button 
            size="lg"
            variant="outline" 
            className="border-[#30363d] text-[#8b949e] hover:border-[#00ffe1] hover:text-[#00ffe1]"
          >
            Load More Capsules
          </Button>
        </div>
      </div>
    </div>
  );
}