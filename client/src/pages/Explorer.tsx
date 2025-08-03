import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Globe, 
  Search, 
  Filter, 
  MapPin, 
  Eye, 
  Shield, 
  Clock, 
  Users, 
  TrendingUp,
  Download,
  FileText,
  Verified,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PublicTruthNode {
  id: string;
  capsuleId: string;
  title: string;
  category: string;
  emotion: string;
  truthScore: number;
  location: {
    country: string;
    region: string;
  };
  timestamp: string;
  author: string;
  verified: boolean;
  notarized: boolean;
  certificateId?: string;
  ipfsHash: string;
  contentHash: string;
}

interface ExplorerStats {
  totalNodes: number;
  verifiedNodes: number;
  notarizedNodes: number;
  certificatesIssued: number;
  avgTruthScore: number;
  activeRegions: number;
}

export default function Explorer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid");

  // Fetch public truth network data
  const { data: explorerData, isLoading } = useQuery({
    queryKey: ["/api/truth-net", "public", selectedFilter, selectedRegion],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch explorer statistics
  const { data: statsData } = useQuery({
    queryKey: ["/api/explorer/stats"],
    refetchInterval: 60000, // Refresh every minute
  });

  const nodes: PublicTruthNode[] = explorerData?.nodes || [];
  const stats: ExplorerStats = statsData?.stats || {
    totalNodes: 0,
    verifiedNodes: 0,
    notarizedNodes: 0,
    certificatesIssued: 0,
    avgTruthScore: 0,
    activeRegions: 0
  };

  // Filter nodes based on search and filters
  const filteredNodes = nodes.filter((node: PublicTruthNode) => {
    const matchesSearch = searchQuery === "" || 
      node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === "all" || 
      (selectedFilter === "verified" && node.verified) ||
      (selectedFilter === "notarized" && node.notarized) ||
      (selectedFilter === "high-score" && node.truthScore >= 90);
    
    const matchesRegion = selectedRegion === "all" || 
      node.location.region.toLowerCase() === selectedRegion.toLowerCase();
    
    return matchesSearch && matchesFilter && matchesRegion;
  });

  const handleDownloadCertificate = async (certificateId: string) => {
    try {
      const response = await fetch(`/api/certificates/${certificateId}/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `truth-certificate-${certificateId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Certificate download failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Globe className="w-12 h-12 animate-pulse text-purple-400 mx-auto mb-4" />
              <p className="text-gray-300">Loading Truth Network Explorer...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Truth Network Explorer
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Explore the global network of verified truth capsules, notarized records, and authenticated content.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardContent className="p-4 text-center">
              <Globe className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats.totalNodes.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Total Nodes</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-green-500/20">
            <CardContent className="p-4 text-center">
              <Verified className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats.verifiedNodes.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Verified</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-blue-500/20">
            <CardContent className="p-4 text-center">
              <Shield className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats.notarizedNodes.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Notarized</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-yellow-500/20">
            <CardContent className="p-4 text-center">
              <FileText className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats.certificatesIssued.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Certificates</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats.avgTruthScore}%</div>
              <div className="text-sm text-gray-400">Avg Score</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-pink-500/20">
            <CardContent className="p-4 text-center">
              <MapPin className="w-6 h-6 text-pink-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats.activeRegions}</div>
              <div className="text-sm text-gray-400">Regions</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="bg-slate-800/50 backdrop-blur-md border border-purple-500/20 rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search truth capsules, authors, or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-700/50 border-purple-500/30"
              />
            </div>

            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-2 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white"
            >
              <option value="all">All Content</option>
              <option value="verified">Verified Only</option>
              <option value="notarized">Notarized Only</option>
              <option value="high-score">High Truth Score (90+)</option>
            </select>

            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-4 py-2 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white"
            >
              <option value="all">All Regions</option>
              <option value="US">United States</option>
              <option value="EU">European Union</option>
              <option value="UK">United Kingdom</option>
              <option value="CA">Canada</option>
              <option value="AU">Australia</option>
            </select>

            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                List
              </Button>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-300">
            Showing {filteredNodes.length} of {nodes.length} truth capsules
          </p>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Live updates every 30s</span>
          </div>
        </div>

        {/* Content Grid/List */}
        <div className={viewMode === "grid" ? 
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : 
          "space-y-4"
        }>
          {filteredNodes.map((node) => (
            <Card key={node.id} className="bg-slate-800/50 border-purple-500/20 hover:border-purple-400/40 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-white truncate">
                    {node.title}
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    {node.verified && (
                      <Verified className="w-4 h-4 text-green-400" />
                    )}
                    {node.notarized && (
                      <Shield className="w-4 h-4 text-blue-400" />
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {node.category}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      node.truthScore >= 90 ? 'border-green-400 text-green-400' :
                      node.truthScore >= 70 ? 'border-yellow-400 text-yellow-400' :
                      'border-red-400 text-red-400'
                    }`}
                  >
                    {node.truthScore}% Truth Score
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>{node.author}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{node.location.country}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(node.timestamp).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Eye className="w-4 h-4" />
                    <span className="font-mono text-xs truncate">
                      {node.contentHash.substring(0, 16)}...
                    </span>
                  </div>

                  {node.certificateId && (
                    <div className="pt-2 border-t border-purple-500/20">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => handleDownloadCertificate(node.certificateId!)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Certificate
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredNodes.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Results Found</h3>
            <p className="text-gray-400">
              Try adjusting your search terms or filters to find more content.
            </p>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-12 text-center text-sm text-gray-400">
          <p>
            Truth Network Explorer provides real-time access to verified and notarized content.
            All data is cryptographically secured and blockchain-anchored.
          </p>
        </div>
      </div>
    </div>
  );
}