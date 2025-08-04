import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnhancedCapsuleCard } from "./EnhancedCapsuleCard";
import { CapsuleFilterSidebar } from "./CapsuleFilterSidebar";
import { useLocation } from "wouter";
import { 
  Grid3X3, List, Calendar, Map, BarChart3, SlidersHorizontal,
  Filter, TrendingUp, Clock, Star, Zap, Users, Eye
} from "lucide-react";

interface EnhancedCapsuleGalleryProps {
  title?: string;
  subtitle?: string;
  showFilters?: boolean;
  showViewModes?: boolean;
  limit?: number;
  category?: string;
  className?: string;
}

export function EnhancedCapsuleGallery({
  title = "Truth Capsule Gallery",
  subtitle = "Discover verified truth capsules from the Guardian community",
  showFilters = true,
  showViewModes = true,
  limit,
  category,
  className = ""
}: EnhancedCapsuleGalleryProps) {
  const [location, setLocation] = useLocation();
  const [viewMode, setViewMode] = useState<"card" | "list" | "grid" | "timeline">("card");
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [filters, setFilters] = useState({
    privacy: [] as string[],
    contentType: [] as string[],
    truthScoreRange: [0, 100] as [number, number],
    verificationLevel: [] as string[],
    dateRange: "all",
    tags: [] as string[]
  });

  // Enhanced mock data with more variety
  const mockCapsules = [
    {
      id: "cap_001",
      title: "Corporate Whistleblower Evidence Package",
      description: "Comprehensive documentation of illegal data collection practices by TechCorp Inc., including internal emails, database schemas, and employee testimonies.",
      content: "Full investigation...",
      type: "mixed" as const,
      privacy: "dao-sealed" as const,
      truthScore: 96,
      verificationLevel: "DAO Verified",
      emotionalResonance: 94,
      griefScore: 78,
      createdAt: "2025-08-03T15:30:00Z",
      unlockDate: "2025-12-01T00:00:00Z",
      author: {
        name: "DataGuardian_2024",
        tier: "Sovereign",
        verified: true
      },
      metrics: {
        views: 15429,
        likes: 2847,
        comments: 456,
        shares: 892,
        truthVotes: 1234
      },
      tags: ["whistleblower", "corporate-crime", "data-privacy", "evidence"],
      lineage: {
        childCapsules: 23,
        influenceScore: 456
      },
      nft: {
        minted: true,
        tokenId: "5678",
        blockchain: "Polygon",
        price: 1.2
      }
    },
    {
      id: "cap_002",
      title: "Environmental Cover-up Investigation",
      description: "Photographic evidence and witness testimonies of illegal toxic waste dumping in protected watersheds.",
      content: "Investigation details...",
      type: "image" as const,
      privacy: "public" as const,
      truthScore: 91,
      verificationLevel: "Community Verified",
      emotionalResonance: 87,
      griefScore: 56,
      createdAt: "2025-08-02T10:15:00Z",
      author: {
        name: "EcoGuardian_2024",
        tier: "Guardian",
        verified: true
      },
      metrics: {
        views: 8934,
        likes: 1567,
        comments: 234,
        shares: 445,
        truthVotes: 789
      },
      tags: ["environment", "investigation", "evidence", "pollution"],
      lineage: {
        childCapsules: 12,
        influenceScore: 234
      }
    },
    {
      id: "cap_003",
      title: "Voice Testimony: Healthcare Worker",
      description: "Anonymous testimony from frontline healthcare worker revealing systematic issues in patient care protocols.",
      content: "Audio testimony...",
      type: "voice" as const,
      privacy: "time-locked" as const,
      truthScore: 88,
      verificationLevel: "Expert Verified",
      emotionalResonance: 92,
      griefScore: 67,
      createdAt: "2025-08-01T14:20:00Z",
      unlockDate: "2025-10-01T00:00:00Z",
      author: {
        name: "HealthcareTruth_2024",
        tier: "Seeker",
        verified: false
      },
      metrics: {
        views: 5623,
        likes: 892,
        comments: 156,
        shares: 234,
        truthVotes: 567
      },
      tags: ["healthcare", "testimony", "anonymous", "systemic-issues"],
      lineage: {
        childCapsules: 8,
        influenceScore: 156
      }
    },
    {
      id: "cap_004",
      title: "Financial Fraud Documentation",
      description: "Detailed analysis of accounting irregularities and suspicious transactions in major financial institution.",
      content: "Financial analysis...",
      type: "document" as const,
      privacy: "private" as const,
      truthScore: 94,
      verificationLevel: "Guardian Verified",
      emotionalResonance: 76,
      griefScore: 45,
      createdAt: "2025-07-31T09:45:00Z",
      author: {
        name: "FinanceWatchdog",
        tier: "Guardian",
        verified: true
      },
      metrics: {
        views: 12456,
        likes: 1890,
        comments: 345,
        shares: 567,
        truthVotes: 923
      },
      tags: ["finance", "fraud", "investigation", "documentation"],
      lineage: {
        childCapsules: 15,
        influenceScore: 345
      },
      nft: {
        minted: true,
        tokenId: "9012",
        blockchain: "Ethereum",
        price: 2.5
      }
    },
    {
      id: "cap_005",
      title: "Government Transparency Report",
      description: "Analysis of classified documents revealing discrepancies in public policy statements versus internal communications.",
      content: "Government analysis...",
      type: "text" as const,
      privacy: "public" as const,
      truthScore: 89,
      verificationLevel: "Community Verified",
      emotionalResonance: 83,
      griefScore: 34,
      createdAt: "2025-07-30T16:30:00Z",
      author: {
        name: "TransparencyAdvocate",
        tier: "Seeker",
        verified: true
      },
      metrics: {
        views: 7890,
        likes: 1234,
        comments: 189,
        shares: 345,
        truthVotes: 678
      },
      tags: ["government", "transparency", "policy", "analysis"],
      lineage: {
        childCapsules: 6,
        influenceScore: 189
      }
    }
  ];

  const filteredCapsules = limit ? mockCapsules.slice(0, limit) : mockCapsules;

  const getViewModeIcon = (mode: string) => {
    switch (mode) {
      case "grid": return <Grid3X3 className="w-4 h-4" />;
      case "list": return <List className="w-4 h-4" />;
      case "timeline": return <Calendar className="w-4 h-4" />;
      default: return <Grid3X3 className="w-4 h-4" />;
    }
  };

  return (
    <div className={`bg-[#0d1117] text-[#f0f6fc] ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gradient-neural mb-3">
            {title}
          </h2>
          <p className="text-lg text-[#8b949e] max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card className="bg-[#161b22] border-[#30363d] text-center">
            <CardContent className="p-4">
              <div className="text-xl font-bold text-[#00ffe1]">{filteredCapsules.length}</div>
              <div className="text-sm text-[#8b949e]">Capsules</div>
            </CardContent>
          </Card>
          <Card className="bg-[#161b22] border-[#30363d] text-center">
            <CardContent className="p-4">
              <div className="text-xl font-bold text-[#ff00d4]">
                {Math.round(filteredCapsules.reduce((acc, cap) => acc + cap.truthScore, 0) / filteredCapsules.length)}
              </div>
              <div className="text-sm text-[#8b949e]">Avg Truth Score</div>
            </CardContent>
          </Card>
          <Card className="bg-[#161b22] border-[#30363d] text-center">
            <CardContent className="p-4">
              <div className="text-xl font-bold text-[#7c3aed]">
                {filteredCapsules.filter(cap => cap.nft?.minted).length}
              </div>
              <div className="text-sm text-[#8b949e]">NFTs Minted</div>
            </CardContent>
          </Card>
          <Card className="bg-[#161b22] border-[#30363d] text-center">
            <CardContent className="p-4">
              <div className="text-xl font-bold text-[#10b981]">
                {filteredCapsules.reduce((acc, cap) => acc + cap.metrics.views, 0).toLocaleString()}
              </div>
              <div className="text-sm text-[#8b949e]">Total Views</div>
            </CardContent>
          </Card>
          <Card className="bg-[#161b22] border-[#30363d] text-center">
            <CardContent className="p-4">
              <div className="text-xl font-bold text-[#f79009]">
                {filteredCapsules.filter(cap => cap.author.verified).length}
              </div>
              <div className="text-sm text-[#8b949e]">Verified Authors</div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        {(showFilters || showViewModes) && (
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="flex items-center gap-4">
              {showFilters && (
                <Button 
                  variant="outline" 
                  onClick={() => setShowFilterSidebar(!showFilterSidebar)}
                  className="border-[#30363d] text-[#8b949e] hover:border-[#00ffe1] hover:text-[#00ffe1]"
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              )}
              <Button 
                variant="outline" 
                onClick={() => setLocation('/explorer')}
                className="border-[#30363d] text-[#8b949e] hover:border-[#ff00d4] hover:text-[#ff00d4]"
              >
                <Eye className="w-4 h-4 mr-2" />
                Explore All
              </Button>
            </div>

            {showViewModes && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#8b949e] mr-2">View:</span>
                <div className="flex gap-1 bg-[#161b22] rounded-lg p-1 border border-[#30363d]">
                  {["card", "list", "grid", "timeline"].map((mode) => (
                    <Button
                      key={mode}
                      size="sm"
                      variant={viewMode === mode ? "default" : "ghost"}
                      onClick={() => setViewMode(mode as any)}
                      className={`${viewMode === mode ? 'bg-[#00ffe1] text-[#0d1117]' : 'text-[#8b949e]'}`}
                    >
                      {getViewModeIcon(mode)}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-8">
        {/* Filter Sidebar */}
        {showFilters && showFilterSidebar && (
          <div className="w-80 flex-shrink-0">
            <CapsuleFilterSidebar
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1">
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="bg-[#161b22] border-[#30363d] p-1">
              <TabsTrigger value="all" className="data-[state=active]:bg-[#00ffe1] data-[state=active]:text-[#0d1117]">
                All Capsules
              </TabsTrigger>
              <TabsTrigger value="trending" className="data-[state=active]:bg-[#ff00d4] data-[state=active]:text-[#0d1117]">
                Trending
              </TabsTrigger>
              <TabsTrigger value="recent" className="data-[state=active]:bg-[#7c3aed] data-[state=active]:text-[#0d1117]">
                Recent
              </TabsTrigger>
              <TabsTrigger value="verified" className="data-[state=active]:bg-[#10b981] data-[state=active]:text-[#0d1117]">
                Verified
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
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
            </TabsContent>

            <TabsContent value="trending" className="space-y-6">
              <div className={`grid gap-6 ${
                viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" :
                viewMode === "list" ? "grid-cols-1" :
                "grid-cols-1 md:grid-cols-2"
              }`}>
                {filteredCapsules
                  .sort((a, b) => b.metrics.views - a.metrics.views)
                  .slice(0, 3)
                  .map((capsule) => (
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
            </TabsContent>

            <TabsContent value="recent" className="space-y-6">
              <div className={`grid gap-6 ${
                viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" :
                viewMode === "list" ? "grid-cols-1" :
                "grid-cols-1 md:grid-cols-2"
              }`}>
                {filteredCapsules
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .slice(0, 3)
                  .map((capsule) => (
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
            </TabsContent>

            <TabsContent value="verified" className="space-y-6">
              <div className={`grid gap-6 ${
                viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" :
                viewMode === "list" ? "grid-cols-1" :
                "grid-cols-1 md:grid-cols-2"
              }`}>
                {filteredCapsules
                  .filter(capsule => capsule.author.verified)
                  .map((capsule) => (
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
            </TabsContent>
          </Tabs>

          {!limit && (
            <div className="text-center mt-12">
              <Button 
                size="lg"
                onClick={() => setLocation('/explorer')}
                className="bg-[#00ffe1] text-[#0d1117] hover:bg-[#00e5cb]"
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                Explore All Capsules
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}