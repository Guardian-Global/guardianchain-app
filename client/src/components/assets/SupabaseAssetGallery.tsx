import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Download,
  Eye,
  Grid,
  List,
  Filter,
  Star,
  Zap,
  Shield,
  Play,
  Image as ImageIcon,
} from "lucide-react";

interface SupabaseAsset {
  name: string;
  url: string;
  type: "image" | "video" | "icon" | "nft" | "logo";
  category: string;
  size?: string;
  featured?: boolean;
}

// Your 40+ Supabase assets based on the screenshots
const SUPABASE_ASSETS: SupabaseAsset[] = [
  // Core Logos
  {
    name: "GUARDIANCHAIN_LOGO",
    url: "",
    type: "logo",
    category: "branding",
    featured: true,
  },
  {
    name: "GTT_LOGO_PRIMARY",
    url: "",
    type: "logo",
    category: "branding",
    featured: true,
  },
  {
    name: "GTT_LOGO_VIDEO",
    url: "",
    type: "video",
    category: "branding",
    featured: true,
  },

  // Blockchain Assets
  {
    name: "BLOCKCHAIN_ASSEMBLY",
    url: "",
    type: "image",
    category: "blockchain",
  },
  {
    name: "BLOCKCHAIN_BACKGROUND",
    url: "",
    type: "image",
    category: "blockchain",
  },
  {
    name: "BLOCKCHAIN_SEALCHAIN",
    url: "",
    type: "image",
    category: "blockchain",
  },
  {
    name: "blockchain-video-bg",
    url: "",
    type: "video",
    category: "blockchain",
  },
  {
    name: "blockchain-image-bg",
    url: "",
    type: "image",
    category: "blockchain",
  },

  // NFT Capsule Collection
  {
    name: "capsule-block-bg",
    url: "",
    type: "image",
    category: "nft",
    featured: true,
  },
  { name: "capsule-blockchain-image", url: "", type: "image", category: "nft" },
  { name: "capsule-blockchain-video", url: "", type: "video", category: "nft" },
  { name: "capsule-preview-memory", url: "", type: "image", category: "nft" },
  { name: "GUARDIANCHAIN_CAPS", url: "", type: "nft", category: "nft" },
  { name: "GUARDIANCHAIN_DASH", url: "", type: "nft", category: "nft" },

  // Icon Collection
  { name: "BLOCK_ICON", url: "", type: "icon", category: "icons" },
  { name: "hand-holding-tech-bg", url: "", type: "icon", category: "icons" },
  { name: "hero-flow-bg", url: "", type: "icon", category: "icons" },
  { name: "global-communication-bg", url: "", type: "icon", category: "icons" },

  // NFT Time Capsules
  {
    name: "_Icon NFT time capsule (1)",
    url: "",
    type: "nft",
    category: "time-capsules",
  },
  {
    name: "_Icon NFT time capsule_37",
    url: "",
    type: "nft",
    category: "time-capsules",
  },
  {
    name: "_Icon NFT time capsule (2)",
    url: "",
    type: "nft",
    category: "time-capsules",
  },
  {
    name: "_Icon NFT Truth Time cap",
    url: "",
    type: "nft",
    category: "time-capsules",
  },
  {
    name: "_Icon NFT Truth Time cap_",
    url: "",
    type: "nft",
    category: "time-capsules",
  },

  // Truth Verification Assets
  {
    name: "FIRST_TIME_UNLOCK_TR",
    url: "",
    type: "image",
    category: "verification",
  },
  {
    name: "_NFT Truth Time capsule (",
    url: "",
    type: "nft",
    category: "verification",
  },
  {
    name: "_NFT Truth Time capsule_",
    url: "",
    type: "nft",
    category: "verification",
  },
  {
    name: "NFT Capsule Icon_373t5h",
    url: "",
    type: "nft",
    category: "verification",
  },

  // Protocol Assets
  {
    name: "GTT_Badge_Certificate",
    url: "",
    type: "image",
    category: "protocol",
  },
  { name: "GUARDIANCHAIN_PROT", url: "", type: "image", category: "protocol" },
];

interface SupabaseAssetGalleryProps {
  onAssetSelect?: (asset: SupabaseAsset) => void;
  category?: string;
  featured?: boolean;
}

export default function SupabaseAssetGallery({
  onAssetSelect,
  category,
  featured = false,
}: SupabaseAssetGalleryProps) {
  const [assets, setAssets] = useState<SupabaseAsset[]>(SUPABASE_ASSETS);
  const [filteredAssets, setFilteredAssets] =
    useState<SupabaseAsset[]>(SUPABASE_ASSETS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(category || "all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(false);

  const categories = [
    "all",
    "branding",
    "blockchain",
    "nft",
    "icons",
    "time-capsules",
    "verification",
    "protocol",
  ];

  useEffect(() => {
    let filtered = assets;

    if (featured) {
      filtered = filtered.filter((asset) => asset.featured);
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (asset) => asset.category === selectedCategory,
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (asset) =>
          asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset.category.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredAssets(filtered);
  }, [assets, searchTerm, selectedCategory, featured]);

  const getAssetIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Play className="h-4 w-4" />;
      case "logo":
        return <Star className="h-4 w-4" />;
      case "nft":
        return <Zap className="h-4 w-4" />;
      case "icon":
        return <Shield className="h-4 w-4" />;
      default:
        return <ImageIcon className="h-4 w-4" />;
    }
  };

  const getAssetBadgeColor = (category: string) => {
    const colors = {
      branding: "bg-purple-600",
      blockchain: "bg-blue-600",
      nft: "bg-green-600",
      icons: "bg-orange-600",
      "time-capsules": "bg-pink-600",
      verification: "bg-red-600",
      protocol: "bg-indigo-600",
    };
    return colors[category as keyof typeof colors] || "bg-gray-600";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Supabase Asset Gallery
          </h2>
          <p className="text-slate-300">
            40+ Professional assets for GUARDIANCHAIN deployment
          </p>
        </div>
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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700 text-white"
            />
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className="capitalize"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Asset Grid/List */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
        }
      >
        {filteredAssets.map((asset, index) => (
          <Card
            key={index}
            className={`bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-colors cursor-pointer ${
              viewMode === "list" ? "flex-row" : ""
            }`}
            onClick={() => onAssetSelect?.(asset)}
          >
            <CardContent
              className={
                viewMode === "list" ? "flex items-center space-x-4 p-4" : "p-4"
              }
            >
              {/* Asset Preview */}
              <div
                className={`${viewMode === "list" ? "w-16 h-16" : "w-full h-32"} bg-slate-700/50 rounded-lg flex items-center justify-center mb-3 ${viewMode === "list" ? "mb-0" : ""}`}
              >
                {getAssetIcon(asset.type)}
                {asset.featured && (
                  <Star className="absolute top-2 right-2 h-4 w-4 text-yellow-400 fill-current" />
                )}
              </div>

              {/* Asset Info */}
              <div className={viewMode === "list" ? "flex-1" : ""}>
                <div className="flex items-center justify-between mb-2">
                  <h3
                    className={`font-semibold text-white ${viewMode === "list" ? "text-sm" : "text-xs"} truncate`}
                  >
                    {asset.name}
                  </h3>
                  {viewMode === "grid" && asset.featured && (
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <Badge
                    className={`${getAssetBadgeColor(asset.category)} text-white text-xs`}
                  >
                    {asset.category}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    {getAssetIcon(asset.type)}
                    <span className="text-xs text-slate-400 capitalize">
                      {asset.type}
                    </span>
                  </div>
                </div>

                {viewMode === "list" && (
                  <div className="flex items-center space-x-2 mt-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      Preview
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-3 w-3 mr-1" />
                      Use
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats */}
      <div className="text-center py-6 border-t border-slate-700">
        <p className="text-slate-400">
          Showing {filteredAssets.length} of {assets.length} assets
        </p>
        <div className="flex items-center justify-center space-x-6 mt-2 text-sm">
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3 text-yellow-400" />
            {assets.filter((a) => a.featured).length} Featured
          </span>
          <span className="flex items-center gap-1">
            <Play className="h-3 w-3 text-blue-400" />
            {assets.filter((a) => a.type === "video").length} Videos
          </span>
          <span className="flex items-center gap-1">
            <Zap className="h-3 w-3 text-green-400" />
            {assets.filter((a) => a.type === "nft").length} NFTs
          </span>
        </div>
      </div>
    </div>
  );
}
