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
  Zap
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

interface PublicClusterStreamProps {
  className?: string;
}

export default function PublicClusterStream({ className }: PublicClusterStreamProps) {
  const [selectedCluster, setSelectedCluster] = useState<string>("all");
  const [autoRefresh, setAutoRefresh] = useState(true);

  const { data: streamData, refetch, isLoading } = useQuery<StreamData>({
    queryKey: ["/api/cluster/public-stream", selectedCluster === "all" ? undefined : selectedCluster],
    refetchInterval: autoRefresh ? 30000 : false, // Refresh every 30 seconds
  });

  const handleRefresh = () => {
    refetch();
  };

  const getEmotionalColor = (resonance: number) => {
    if (resonance >= 0.8) return "text-red-400 bg-red-400/20";
    if (resonance >= 0.6) return "text-orange-400 bg-orange-400/20";
    return "text-blue-400 bg-blue-400/20";
  };

  const getTruthScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400";
    if (score >= 80) return "text-yellow-400";
    return "text-orange-400";
  };

  const clusterOptions = [
    { value: "all", label: "All Clusters" },
    { value: "0", label: "Cluster 0: Grief & Loss" },
    { value: "1", label: "Cluster 1: Family Memories" },
    { value: "2", label: "Cluster 2: Personal Growth" },
  ];

  return (
    <Card className={`bg-slate-800 border-slate-700 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-yellow-400 flex items-center gap-2">
            <Radio className="w-5 h-5" />
            Live Truth Stream
          </CardTitle>
          <div className="flex items-center gap-2">
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
        <p className="text-slate-400 text-sm">
          Real-time discovery of truth capsules across emotional clusters
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Cluster Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <Select value={selectedCluster} onValueChange={setSelectedCluster}>
            <SelectTrigger className="w-64 bg-slate-900 border-slate-600">
              <SelectValue placeholder="Select cluster..." />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-600">
              {clusterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stream Stats */}
        {streamData && (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-900 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="text-slate-300 text-sm">Total</span>
              </div>
              <p className="text-xl font-bold text-blue-400">{streamData.total}</p>
            </div>
            <div className="bg-slate-900 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-slate-300 text-sm">Active</span>
              </div>
              <p className="text-xl font-bold text-green-400">
                {streamData.capsules.filter(c => c.truthScore >= 85).length}
              </p>
            </div>
            <div className="bg-slate-900 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <span className="text-slate-300 text-sm">Latest</span>
              </div>
              <p className="text-sm text-purple-400">
                {streamData.capsules[0] ? formatDistanceToNow(new Date(streamData.capsules[0].created_at), { addSuffix: true }) : 'N/A'}
              </p>
            </div>
          </div>
        )}

        {/* Capsule Stream */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-slate-900 rounded-lg p-4 animate-pulse">
                  <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-slate-700 rounded w-full mb-3"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-slate-700 rounded w-20"></div>
                    <div className="h-6 bg-slate-700 rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : streamData?.capsules.length ? (
            streamData.capsules.map((capsule) => (
              <div key={capsule.id} className="bg-slate-900 rounded-lg p-4 hover:bg-slate-800 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-slate-200 font-medium line-clamp-1">{capsule.title}</h4>
                  <div className="flex items-center gap-1">
                    <Badge className={getTruthScoreColor(capsule.truthScore)}>
                      {capsule.truthScore}%
                    </Badge>
                  </div>
                </div>
                
                <p className="text-slate-400 text-sm mb-3 line-clamp-2">{capsule.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={getEmotionalColor(capsule.emotionalResonance)}>
                      {capsule.clusterTheme}
                    </Badge>
                    <span className="text-slate-500 text-xs">
                      {formatDistanceToNow(new Date(capsule.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500 text-xs">Resonance:</span>
                    <span className={`text-xs font-medium ${getEmotionalColor(capsule.emotionalResonance).split(' ')[0]}`}>
                      {(capsule.emotionalResonance * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-400">
              <Radio className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No capsules in the stream</p>
              <p className="text-sm">Try selecting a different cluster</p>
            </div>
          )}
        </div>

        {/* Last Updated */}
        {streamData && (
          <div className="text-center text-slate-500 text-xs">
            Last updated: {new Date(streamData.timestamp).toLocaleTimeString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}