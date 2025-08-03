import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Radio, 
  Filter, 
  Clock, 
  TrendingUp, 
  Users, 
  RefreshCw,
  Zap,
  Heart,
  Eye
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";

interface StreamCapsule {
  id: string;
  title: string;
  description: string;
  cluster: number;
  clusterTheme: string;
  created_at: string;
  truthScore: number;
  emotionalResonance: number;
}

interface StreamData {
  success: boolean;
  capsules: StreamCapsule[];
  total: number;
  cluster: number | null;
  timestamp: string;
}

export default function Stream() {
  const [selectedCluster, setSelectedCluster] = useState<string>("all");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [viewMode, setViewMode] = useState<"card" | "compact">("card");

  const { data: streamData, refetch, isLoading } = useQuery<StreamData>({
    queryKey: ["/api/cluster/public-stream", selectedCluster === "all" ? undefined : selectedCluster],
    refetchInterval: autoRefresh ? 15000 : false, // Refresh every 15 seconds
  });

  const handleRefresh = () => {
    refetch();
  };

  const getEmotionalColor = (resonance: number) => {
    if (resonance >= 0.8) return "text-red-400 bg-red-400/20 border-red-400/30";
    if (resonance >= 0.6) return "text-orange-400 bg-orange-400/20 border-orange-400/30";
    return "text-blue-400 bg-blue-400/20 border-blue-400/30";
  };

  const getTruthScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400 bg-green-400/20";
    if (score >= 80) return "text-yellow-400 bg-yellow-400/20";
    return "text-orange-400 bg-orange-400/20";
  };

  const clusterOptions = [
    { value: "all", label: "All Clusters", count: streamData?.total || 0 },
    { value: "0", label: "Grief & Loss", count: streamData?.capsules.filter(c => c.cluster === 0).length || 0 },
    { value: "1", label: "Family Memories", count: streamData?.capsules.filter(c => c.cluster === 1).length || 0 },
    { value: "2", label: "Personal Growth", count: streamData?.capsules.filter(c => c.cluster === 2).length || 0 },
  ];

  const stats = streamData ? {
    total: streamData.total,
    highScore: streamData.capsules.filter(c => c.truthScore >= 90).length,
    highResonance: streamData.capsules.filter(c => c.emotionalResonance >= 0.8).length,
    recent: streamData.capsules.filter(c => 
      Date.now() - new Date(c.created_at).getTime() < 24 * 60 * 60 * 1000
    ).length
  } : null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-yellow-400 mb-4">🌍 Live Truth Stream</h1>
        <p className="text-purple-300 text-lg">
          Real-time discovery of truth capsules across emotional clusters
        </p>
      </div>

      {/* Controls */}
      <Card className="bg-white/5 border-white/10 mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-yellow-400 flex items-center gap-2">
              <Radio className="w-5 h-5" />
              Stream Controls
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === "card" ? "compact" : "card")}
                className="border-slate-600 text-slate-300"
              >
                <Eye className="w-4 h-4" />
                {viewMode === "card" ? "Compact" : "Cards"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
                className="border-slate-600 text-slate-300"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`border-slate-600 ${autoRefresh ? 'text-green-400' : 'text-slate-400'}`}
              >
                <Zap className="w-4 h-4" />
                {autoRefresh ? 'Live' : 'Manual'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <Select value={selectedCluster} onValueChange={setSelectedCluster}>
                <SelectTrigger className="w-64 bg-slate-800 border-slate-600">
                  <SelectValue placeholder="Select cluster..." />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {clusterOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center justify-between w-full">
                        <span>{option.label}</span>
                        <Badge className="ml-2 bg-blue-400/20 text-blue-400">
                          {option.count}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-blue-400/10 border-blue-400/30">
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-400">{stats.total}</div>
              <div className="text-sm text-slate-300">Total Capsules</div>
            </CardContent>
          </Card>
          <Card className="bg-green-400/10 border-green-400/30">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-400">{stats.highScore}</div>
              <div className="text-sm text-slate-300">High Truth Score</div>
            </CardContent>
          </Card>
          <Card className="bg-red-400/10 border-red-400/30">
            <CardContent className="p-4 text-center">
              <Heart className="w-6 h-6 text-red-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-400">{stats.highResonance}</div>
              <div className="text-sm text-slate-300">High Resonance</div>
            </CardContent>
          </Card>
          <Card className="bg-purple-400/10 border-purple-400/30">
            <CardContent className="p-4 text-center">
              <Clock className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-400">{stats.recent}</div>
              <div className="text-sm text-slate-300">Recent (24h)</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Stream Content */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-purple-300">
              Live Truth Capsules
              {selectedCluster !== "all" && (
                <Badge className="ml-2 bg-purple-400/20 text-purple-400">
                  {clusterOptions.find(opt => opt.value === selectedCluster)?.label}
                </Badge>
              )}
            </CardTitle>
            {streamData && (
              <div className="text-sm text-slate-400">
                Last updated: {new Date(streamData.timestamp).toLocaleTimeString()}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-slate-800 rounded-lg p-4 animate-pulse">
                  <div className="h-5 bg-slate-700 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-slate-700 rounded w-full mb-3"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-slate-700 rounded w-20"></div>
                    <div className="h-6 bg-slate-700 rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : streamData?.capsules.length ? (
            <div className={viewMode === "card" ? "space-y-4" : "space-y-2"}>
              {streamData.capsules.map((capsule) => (
                <div
                  key={capsule.id}
                  className={`
                    bg-slate-800 rounded-lg hover:bg-slate-700 transition-all duration-200
                    ${viewMode === "card" ? "p-6" : "p-3"}
                  `}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className={`text-white font-semibold ${viewMode === "card" ? "text-lg mb-2" : "text-base mb-1"}`}>
                        {capsule.title}
                      </h3>
                      {viewMode === "card" && (
                        <p className="text-slate-400 mb-3 leading-relaxed">
                          {capsule.description}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2 ml-4">
                      <Badge className={getTruthScoreColor(capsule.truthScore)}>
                        {capsule.truthScore}% Truth
                      </Badge>
                      <Badge className={getEmotionalColor(capsule.emotionalResonance)}>
                        {(capsule.emotionalResonance * 100).toFixed(0)}% Resonance
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-purple-400/20 text-purple-400 border-purple-400/30">
                        {capsule.clusterTheme}
                      </Badge>
                      <span className="text-slate-500 text-sm">
                        {formatDistanceToNow(new Date(capsule.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <div className="text-slate-500 text-sm">
                      ID: {capsule.id.split('_').pop()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <Radio className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No capsules in stream</h3>
              <p className="text-sm">Try selecting a different cluster or check back later</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}