import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Image,
  Video,
  FileText,
  Music,
  Download,
  Eye,
  Star,
  Search,
  Filter,
  Grid,
  List,
  Zap,
  Copy,
  ExternalLink,
} from "lucide-react";
import { useSupabaseAssets } from "@/hooks/useSupabaseAssets";
import { useToast } from "@/hooks/use-toast";

export function SupabaseAssetManager() {
  const {
    assets,
    recommendations,
    totalAssets,
    buckets,
    isLoading,
    error,
    getAssetsByCategory,
    getAssetsByType,
    getHighestValueAssets,
    getOptimizedUrl,
  } = useSupabaseAssets();

  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter assets based on search and category
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || asset.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "image":
        return Image;
      case "video":
        return Video;
      case "document":
        return FileText;
      case "audio":
        return Music;
      default:
        return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "image":
        return "text-blue-400";
      case "video":
        return "text-purple-400";
      case "document":
        return "text-green-400";
      case "audio":
        return "text-yellow-400";
      default:
        return "text-slate-400";
    }
  };

  const copyAssetUrl = async (asset: any) => {
    try {
      await navigator.clipboard.writeText(asset.url);
      toast({
        title: "URL Copied",
        description: `Asset URL copied to clipboard: ${asset.name}`,
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy URL to clipboard",
        variant: "destructive",
      });
    }
  };

  const openAsset = (asset: any) => {
    window.open(asset.url, "_blank");
  };

  const implementAsset = async (asset: any, location: string) => {
    toast({
      title: "Implementation Suggested",
      description: `Asset ${asset.name} recommended for ${location}. Copy URL and update your components.`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-400 border-t-transparent mx-auto"></div>
          <p className="text-white">Discovering your Supabase assets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-900/20 border-red-500">
        <CardContent className="p-6 text-center">
          <h3 className="text-red-400 font-semibold mb-2">
            Asset Discovery Failed
          </h3>
          <p className="text-red-300 mb-4">
            Unable to connect to Supabase storage. Please check your
            configuration.
          </p>
          <p className="text-slate-400 text-sm">Error: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">
              {totalAssets}
            </div>
            <div className="text-sm text-slate-400">Total Assets</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{buckets}</div>
            <div className="text-sm text-slate-400">Storage Buckets</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">
              {getAssetsByType("image").length}
            </div>
            <div className="text-sm text-slate-400">Images</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {getAssetsByType("video").length}
            </div>
            <div className="text-sm text-slate-400">Videos</div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations Section */}
      {recommendations && recommendations.immediate.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Zap className="h-5 w-5 mr-2 text-yellow-400" />
              Immediate Implementation Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendations.immediate.map((rec, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-slate-700/50 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white">{rec.location}</h3>
                    <Badge
                      variant={
                        rec.priority === "high" ? "default" : "secondary"
                      }
                    >
                      {rec.priority}
                    </Badge>
                  </div>
                  {rec.asset && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Image className="h-4 w-4 text-blue-400" />
                        <span className="text-sm text-slate-300">
                          {rec.asset.name}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => copyAssetUrl(rec.asset)}
                          className="flex-1"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy URL
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            implementAsset(rec.asset, rec.location)
                          }
                        >
                          <Zap className="h-3 w-3 mr-1" />
                          Implement
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Asset Browser */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Asset Browser</CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
            >
              <option value="all">All Categories</option>
              <option value="branding">Branding</option>
              <option value="hero">Hero</option>
              <option value="background">Background</option>
              <option value="icons">Icons</option>
              <option value="showcase">Showcase</option>
              <option value="product">Product</option>
              <option value="team">Team</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5 bg-slate-700">
              <TabsTrigger value="all" className="text-white">
                All Assets
              </TabsTrigger>
              <TabsTrigger value="images" className="text-white">
                Images
              </TabsTrigger>
              <TabsTrigger value="videos" className="text-white">
                Videos
              </TabsTrigger>
              <TabsTrigger value="documents" className="text-white">
                Documents
              </TabsTrigger>
              <TabsTrigger value="high-value" className="text-white">
                High Value
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <AssetGrid
                assets={filteredAssets}
                viewMode={viewMode}
                onCopyUrl={copyAssetUrl}
                onOpenAsset={openAsset}
                getTypeIcon={getTypeIcon}
                getTypeColor={getTypeColor}
              />
            </TabsContent>

            <TabsContent value="images">
              <AssetGrid
                assets={getAssetsByType("image")}
                viewMode={viewMode}
                onCopyUrl={copyAssetUrl}
                onOpenAsset={openAsset}
                getTypeIcon={getTypeIcon}
                getTypeColor={getTypeColor}
              />
            </TabsContent>

            <TabsContent value="videos">
              <AssetGrid
                assets={getAssetsByType("video")}
                viewMode={viewMode}
                onCopyUrl={copyAssetUrl}
                onOpenAsset={openAsset}
                getTypeIcon={getTypeIcon}
                getTypeColor={getTypeColor}
              />
            </TabsContent>

            <TabsContent value="documents">
              <AssetGrid
                assets={getAssetsByType("document")}
                viewMode={viewMode}
                onCopyUrl={copyAssetUrl}
                onOpenAsset={openAsset}
                getTypeIcon={getTypeIcon}
                getTypeColor={getTypeColor}
              />
            </TabsContent>

            <TabsContent value="high-value">
              <AssetGrid
                assets={getHighestValueAssets(20)}
                viewMode={viewMode}
                onCopyUrl={copyAssetUrl}
                onOpenAsset={openAsset}
                getTypeIcon={getTypeIcon}
                getTypeColor={getTypeColor}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

// Asset Grid Component
function AssetGrid({
  assets,
  viewMode,
  onCopyUrl,
  onOpenAsset,
  getTypeIcon,
  getTypeColor,
}: any) {
  if (assets.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-slate-400">
          No assets found matching your criteria
        </div>
      </div>
    );
  }

  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {assets.map((asset: any) => {
          const TypeIcon = getTypeIcon(asset.type);
          return (
            <Card
              key={asset.id}
              className="bg-slate-700/50 border-slate-600 hover:bg-slate-700/70 transition-colors"
            >
              <CardContent className="p-4 space-y-3">
                <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden">
                  {asset.type === "image" ? (
                    <img
                      src={asset.url}
                      alt={asset.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <TypeIcon
                      className={`h-8 w-8 ${getTypeColor(asset.type)}`}
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-white truncate">
                      {asset.name}
                    </h3>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-400" />
                      <span className="text-xs text-yellow-400">
                        {asset.value}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {asset.category}
                    </Badge>
                    <span className="text-xs text-slate-400">
                      {(asset.size / 1024).toFixed(1)}KB
                    </span>
                  </div>

                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      onClick={() => onCopyUrl(asset)}
                      className="flex-1"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onOpenAsset(asset)}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-2">
      {assets.map((asset: any) => {
        const TypeIcon = getTypeIcon(asset.type);
        return (
          <div
            key={asset.id}
            className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700/70 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <TypeIcon className={`h-5 w-5 ${getTypeColor(asset.type)}`} />
              <div>
                <div className="text-white font-medium">{asset.name}</div>
                <div className="text-sm text-slate-400">
                  {asset.category} • {(asset.size / 1024).toFixed(1)}KB
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-yellow-400">{asset.value}</span>
              </div>
              <Button size="sm" onClick={() => onCopyUrl(asset)}>
                <Copy className="h-3 w-3 mr-1" />
                Copy URL
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onOpenAsset(asset)}
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default SupabaseAssetManager;
