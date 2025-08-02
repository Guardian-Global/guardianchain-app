import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Database,
  Search,
  Upload,
  FileText,
  Image,
  Video,
  Music,
  File,
  CheckCircle,
  AlertCircle,
  Loader2,
  Filter,
  Grid,
  List,
  RefreshCw,
} from "lucide-react";
import {
  getAllAssets,
  getAssetsByType,
  searchAssets,
  createCapsuleFromAsset,
  getAllTables,
  getTableData,
} from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface Asset {
  id: string;
  name: string;
  bucket: string;
  size: number;
  type: string;
  url: string;
  lastModified: string;
  metadata?: any;
}

const AssetIntegrationHub: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());
  const [tables, setTables] = useState<string[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    loadAssets();
    loadTables();
  }, []);

  useEffect(() => {
    filterAssets();
  }, [assets, searchQuery, selectedType]);

  const loadAssets = async () => {
    setLoading(true);
    try {
      const allAssets = await getAllAssets();
      setAssets(allAssets);
      toast({
        title: "Assets Loaded",
        description: `Found ${allAssets.length} assets in your Supabase storage`,
      });
    } catch (error) {
      toast({
        title: "Error Loading Assets",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadTables = async () => {
    try {
      const tableNames = await getAllTables();
      setTables(tableNames);
    } catch (error) {
      console.warn("Could not load tables:", error);
    }
  };

  const loadTableData = async (tableName: string) => {
    if (!tableName) return;

    try {
      const data = await getTableData(tableName);
      setTableData(data || []);
    } catch (error) {
      toast({
        title: "Error Loading Table",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const filterAssets = () => {
    let filtered = assets;

    if (searchQuery) {
      filtered = filtered.filter(
        (asset) =>
          asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          asset.bucket.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (selectedType !== "all") {
      filtered = filtered.filter((asset) => asset.type === selectedType);
    }

    setFilteredAssets(filtered);
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Image className="w-5 h-5" />;
      case "video":
        return <Video className="w-5 h-5" />;
      case "audio":
        return <Music className="w-5 h-5" />;
      case "document":
        return <FileText className="w-5 h-5" />;
      default:
        return <File className="w-5 h-5" />;
    }
  };

  const getAssetTypeColor = (type: string) => {
    switch (type) {
      case "image":
        return "bg-blue-500";
      case "video":
        return "bg-red-500";
      case "audio":
        return "bg-green-500";
      case "document":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const toggleAssetSelection = (assetId: string) => {
    const newSelection = new Set(selectedAssets);
    if (newSelection.has(assetId)) {
      newSelection.delete(assetId);
    } else {
      newSelection.add(assetId);
    }
    setSelectedAssets(newSelection);
  };

  const createCapsulesFromSelected = async () => {
    if (selectedAssets.size === 0) {
      toast({
        title: "No Assets Selected",
        description: "Please select at least one asset to create capsules",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    let successCount = 0;
    let errorCount = 0;

    for (const assetId of selectedAssets) {
      const asset = assets.find((a) => a.id === assetId);
      if (!asset) continue;

      try {
        await createCapsuleFromAsset(asset, {
          title: `${
            asset.type.charAt(0).toUpperCase() + asset.type.slice(1)
          }: ${asset.name}`,
          content: `Automatically imported ${
            asset.type
          } asset from Supabase storage.\n\nBucket: ${
            asset.bucket
          }\nSize: ${formatFileSize(asset.size)}\nLast Modified: ${new Date(
            asset.lastModified,
          ).toLocaleDateString()}`,
          metadata: {
            auto_imported: true,
            import_date: new Date().toISOString(),
          },
        });
        successCount++;
      } catch (error) {
        console.error(`Failed to create capsule for ${asset.name}:`, error);
        errorCount++;
      }
    }

    setLoading(false);
    setSelectedAssets(new Set());

    toast({
      title: "Capsule Creation Complete",
      description: `${successCount} capsules created successfully${
        errorCount > 0 ? `, ${errorCount} failed` : ""
      }`,
      variant: errorCount > 0 ? "destructive" : "default",
    });
  };

  const assetTypes = [...new Set(assets.map((a) => a.type))];

  return (
    <div className="w-full space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center">
              <Database className="w-6 h-6 mr-2 text-blue-400" />
              Asset Integration Hub
            </div>
            <Button
              onClick={loadAssets}
              disabled={loading}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-1" />
              )}
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="assets" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="assets">
                Storage Assets ({assets.length})
              </TabsTrigger>
              <TabsTrigger value="database">
                Database Tables ({tables.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="assets" className="space-y-4">
              {/* Search and Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search assets by name or bucket..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-48 bg-slate-700 border-slate-600">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {assetTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Selection Actions */}
              {selectedAssets.size > 0 && (
                <div className="flex items-center justify-between bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                  <span className="text-blue-300">
                    {selectedAssets.size} asset
                    {selectedAssets.size !== 1 ? "s" : ""} selected
                  </span>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => setSelectedAssets(new Set())}
                      variant="outline"
                      size="sm"
                    >
                      Clear Selection
                    </Button>
                    <Button
                      onClick={createCapsulesFromSelected}
                      disabled={loading}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4 mr-1" />
                      )}
                      Create Capsules
                    </Button>
                  </div>
                </div>
              )}

              {/* Assets Display */}
              {loading && assets.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-400" />
                    <p className="text-slate-400">
                      Loading your Supabase assets...
                    </p>
                  </div>
                </div>
              ) : filteredAssets.length === 0 ? (
                <div className="text-center py-12">
                  <Database className="w-12 h-12 mx-auto mb-4 text-slate-500" />
                  <p className="text-slate-400">
                    {assets.length === 0
                      ? "No assets found in your Supabase storage"
                      : "No assets match your search criteria"}
                  </p>
                </div>
              ) : (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                      : "space-y-2"
                  }
                >
                  {filteredAssets.map((asset) => (
                    <Card
                      key={asset.id}
                      className={`${
                        selectedAssets.has(asset.id)
                          ? "bg-blue-900/20 border-blue-600"
                          : "bg-slate-700/50 border-slate-600"
                      } cursor-pointer transition-all hover:border-slate-500`}
                      onClick={() => toggleAssetSelection(asset.id)}
                    >
                      <CardContent
                        className={viewMode === "grid" ? "p-4" : "p-3"}
                      >
                        <div
                          className={
                            viewMode === "grid"
                              ? "space-y-3"
                              : "flex items-center space-x-4"
                          }
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div
                                className={`p-2 rounded ${getAssetTypeColor(
                                  asset.type,
                                )}`}
                              >
                                {getAssetIcon(asset.type)}
                              </div>
                              {viewMode === "list" && (
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-white font-medium truncate">
                                    {asset.name}
                                  </h3>
                                  <p className="text-slate-400 text-sm">
                                    {asset.bucket}
                                  </p>
                                </div>
                              )}
                            </div>
                            {selectedAssets.has(asset.id) && (
                              <CheckCircle className="w-5 h-5 text-blue-400" />
                            )}
                          </div>

                          {viewMode === "grid" && (
                            <>
                              <div>
                                <h3 className="text-white font-medium truncate">
                                  {asset.name}
                                </h3>
                                <p className="text-slate-400 text-sm">
                                  {asset.bucket}
                                </p>
                              </div>

                              <div className="flex justify-between items-center">
                                <Badge
                                  className={getAssetTypeColor(asset.type)}
                                >
                                  {asset.type}
                                </Badge>
                                <span className="text-slate-400 text-xs">
                                  {formatFileSize(asset.size)}
                                </span>
                              </div>
                            </>
                          )}

                          {viewMode === "list" && (
                            <div className="flex items-center space-x-4 ml-auto">
                              <Badge className={getAssetTypeColor(asset.type)}>
                                {asset.type}
                              </Badge>
                              <span className="text-slate-400 text-sm">
                                {formatFileSize(asset.size)}
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="database" className="space-y-4">
              <div className="flex items-center space-x-4">
                <Select
                  value={selectedTable}
                  onValueChange={(value) => {
                    setSelectedTable(value);
                    loadTableData(value);
                  }}
                >
                  <SelectTrigger className="w-64 bg-slate-700 border-slate-600">
                    <SelectValue placeholder="Select table to review" />
                  </SelectTrigger>
                  <SelectContent>
                    {tables.map((table) => (
                      <SelectItem key={table} value={table}>
                        {table}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => selectedTable && loadTableData(selectedTable)}
                  disabled={!selectedTable}
                  size="sm"
                >
                  Load Data
                </Button>
              </div>

              {tableData.length > 0 && (
                <Card className="bg-slate-700/50 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-white text-sm">
                      {selectedTable} ({tableData.length} records)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <div className="max-h-96 overflow-y-auto">
                        <pre className="text-xs text-slate-300 whitespace-pre-wrap">
                          {JSON.stringify(tableData.slice(0, 10), null, 2)}
                        </pre>
                      </div>
                      {tableData.length > 10 && (
                        <p className="text-slate-400 text-sm mt-2">
                          Showing first 10 of {tableData.length} records
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssetIntegrationHub;
