import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitBranch, Network, TrendingUp, Clock } from "lucide-react";
import LineageVisualizer from "@/components/lineage/LineageVisualizer";
import { useQuery } from "@tanstack/react-query";

interface LineageStats {
  totalNodes: number;
  totalConnections: number;
  maxDepth: number;
  activeLineages: number;
}

export default function Lineage() {
  // Get lineage data for stats
  const { data: lineageData } = useQuery({
    queryKey: ["/api/lineage/graph"],
  });

  const stats: LineageStats = lineageData?.graph ? {
    totalNodes: lineageData.graph.nodes?.length || 0,
    totalConnections: lineageData.graph.edges?.length || 0,
    maxDepth: Math.max(...(lineageData.graph.nodes?.map((n: any) => n.depth || 0) || [0])),
    activeLineages: new Set(lineageData.graph.nodes?.map((n: any) => n.lineageId)).size || 0
  } : {
    totalNodes: 0,
    totalConnections: 0,
    maxDepth: 0,
    activeLineages: 0
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-yellow-400 mb-4">🧬 Truth Lineage Explorer</h1>
        <p className="text-purple-300 text-lg max-w-3xl mx-auto">
          Explore the ancestry and inheritance patterns of truth capsules. Discover how memories connect through time, context, and emotional resonance.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-blue-400/10 border-blue-400/30">
          <CardContent className="p-4 text-center">
            <Network className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-400">{stats.totalNodes}</div>
            <div className="text-sm text-slate-300">Truth Nodes</div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-400/10 border-green-400/30">
          <CardContent className="p-4 text-center">
            <GitBranch className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-400">{stats.totalConnections}</div>
            <div className="text-sm text-slate-300">Connections</div>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-400/10 border-purple-400/30">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-400">{stats.maxDepth}</div>
            <div className="text-sm text-slate-300">Max Depth</div>
          </CardContent>
        </Card>
        
        <Card className="bg-orange-400/10 border-orange-400/30">
          <CardContent className="p-4 text-center">
            <Clock className="w-6 h-6 text-orange-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-400">{stats.activeLineages}</div>
            <div className="text-sm text-slate-300">Active Lineages</div>
          </CardContent>
        </Card>
      </div>

      {/* Lineage Types Legend */}
      <Card className="bg-white/5 border-white/10 mb-8">
        <CardHeader>
          <CardTitle className="text-yellow-400">Lineage Connection Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-1 bg-blue-400 rounded"></div>
              <div>
                <div className="text-white font-medium">Temporal</div>
                <div className="text-slate-400 text-sm">Sequential memory links</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-1 bg-green-400 rounded"></div>
              <div>
                <div className="text-white font-medium">Emotional</div>
                <div className="text-slate-400 text-sm">Shared emotional themes</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-1 bg-purple-400 rounded"></div>
              <div>
                <div className="text-white font-medium">Contextual</div>
                <div className="text-slate-400 text-sm">Related life events</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Lineage Graph */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-purple-300 flex items-center gap-2">
              <Network className="w-5 h-5" />
              Interactive Truth Lineage Graph
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-400/20 text-blue-400">Live Data</Badge>
              <Badge className="bg-green-400/20 text-green-400">Interactive</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-900 rounded-lg p-6 min-h-[600px]">
            <LineageVisualizer />
          </div>
        </CardContent>
      </Card>

      {/* Usage Instructions */}
      <Card className="bg-white/5 border-white/10 mt-6">
        <CardHeader>
          <CardTitle className="text-yellow-400">How to Navigate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-medium mb-2">Graph Controls</h4>
              <ul className="text-slate-400 space-y-1 text-sm">
                <li>• Click and drag nodes to reposition</li>
                <li>• Hover over nodes for detailed information</li>
                <li>• Zoom with mouse wheel or touch gestures</li>
                <li>• Pan by dragging empty space</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-2">Node Information</h4>
              <ul className="text-slate-400 space-y-1 text-sm">
                <li>• Node size indicates influence strength</li>
                <li>• Color represents emotional cluster</li>
                <li>• Connection thickness shows relationship strength</li>
                <li>• Dotted lines indicate weak connections</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}