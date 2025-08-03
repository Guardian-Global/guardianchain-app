import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3,
  Brain,
  Loader2,
  Target,
  TrendingUp,
  Users,
  Calendar,
  Heart,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import ClusterVisualizer from "./ClusterVisualizer";
import MemoryYieldChart from "./MemoryYieldChart";
import LineageVisualizer from "../lineage/LineageVisualizer";
import ClusterThemeVoting from "../dao/ClusterThemeVoting";
import PublicClusterStream from "./PublicClusterStream";
import ThemeYieldChart from "../gtt/ThemeYieldChart";

interface ClusterTheme {
  theme_name: string;
  size: number;
  avg_emotional_score: number;
  avg_grief_score: number;
  common_tags: string[];
  era_range: string;
  sample_titles: string[];
}

interface ClusteringAnalysis {
  clustering_summary: {
    total_capsules: number;
    n_clusters: number;
    clustering_algorithm: string;
    embedding_model: string;
    analysis_timestamp: string;
  };
  cluster_themes: { [key: number]: ClusterTheme };
  visualization_data: {
    x_coordinates: number[];
    y_coordinates: number[];
    cluster_labels: number[];
    capsule_ids: string[];
    titles: string[];
  };
}

interface ClusteringResponse {
  success: boolean;
  analysis: ClusteringAnalysis;
  message: string;
}

export default function CapsuleClusteringDashboard() {
  const [selectedCluster, setSelectedCluster] = useState<number | null>(null);
  const { toast } = useToast();

  // Check for cached results
  const { data: cachedResults, refetch: refetchCached } = useQuery<ClusteringResponse>({
    queryKey: ["/api/capsules/clustering/results"],
    retry: false,
  });

  // Run new clustering analysis
  const clusteringMutation = useMutation<ClusteringResponse, Error, {}>({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/capsules/clustering/analyze", {
        includePersonal: true,
        includeProfessional: true,
        maxClusters: 8
      });
      return response as ClusteringResponse;
    },
    onSuccess: (data) => {
      toast({
        title: "Analysis Complete",
        description: `Discovered ${data.analysis.clustering_summary.n_clusters} thematic clusters`,
      });
      refetchCached();
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze capsule clusters",
        variant: "destructive",
      });
    },
  });

  const analysis = clusteringMutation.data?.analysis || cachedResults?.analysis;

  const getClusterColor = (clusterId: number): string => {
    const colors = [
      "bg-blue-500", "bg-purple-500", "bg-green-500", "bg-yellow-500",
      "bg-pink-500", "bg-indigo-500", "bg-red-500", "bg-teal-500"
    ];
    return colors[clusterId % colors.length];
  };

  const getEmotionalIntensity = (score: number): string => {
    if (score >= 8) return "Very High";
    if (score >= 6) return "High";
    if (score >= 4) return "Medium";
    if (score >= 2) return "Low";
    return "Very Low";
  };

  const getGriefLevel = (score: number): string => {
    if (score >= 8) return "Intense";
    if (score >= 6) return "Significant";
    if (score >= 4) return "Moderate";
    if (score >= 2) return "Mild";
    return "Minimal";
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <Card className="bg-brand-secondary border-brand-surface">
        <CardHeader>
          <CardTitle className="text-brand-light flex items-center gap-2">
            <Brain className="w-6 h-6 text-brand-accent" />
            AI Capsule Clustering Dashboard
          </CardTitle>
          <p className="text-brand-light/60 text-sm">
            Advanced AI analysis of truth capsules by emotional patterns, themes, and temporal characteristics
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Button
              onClick={() => clusteringMutation.mutate({})}
              disabled={clusteringMutation.isPending}
              className="bg-brand-primary hover:bg-brand-primary/80"
              data-testid="button-run-clustering"
            >
              {clusteringMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing Patterns...
                </>
              ) : (
                <>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Run New Analysis
                </>
              )}
            </Button>
            
            {analysis && (
              <div className="flex items-center gap-4 text-sm text-brand-light/60">
                <span>Last analyzed: {new Date(analysis.clustering_summary.analysis_timestamp).toLocaleDateString()}</span>
                <Badge variant="outline" className="text-brand-accent border-brand-accent">
                  {analysis.clustering_summary.total_capsules} capsules
                </Badge>
                <Badge variant="outline" className="text-green-400 border-green-400">
                  {analysis.clustering_summary.n_clusters} clusters
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-brand-secondary border-brand-surface">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-8 h-8 text-blue-400" />
                  <div>
                    <p className="text-xs text-brand-light/60">Total Capsules</p>
                    <p className="text-xl font-bold text-brand-light">
                      {analysis.clustering_summary.total_capsules}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-brand-secondary border-brand-surface">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Target className="w-8 h-8 text-purple-400" />
                  <div>
                    <p className="text-xs text-brand-light/60">Discovered Clusters</p>
                    <p className="text-xl font-bold text-brand-light">
                      {analysis.clustering_summary.n_clusters}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-brand-secondary border-brand-surface">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Brain className="w-8 h-8 text-green-400" />
                  <div>
                    <p className="text-xs text-brand-light/60">AI Model</p>
                    <p className="text-sm font-semibold text-brand-light">
                      {analysis.clustering_summary.embedding_model}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-brand-secondary border-brand-surface">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Zap className="w-8 h-8 text-yellow-400" />
                  <div>
                    <p className="text-xs text-brand-light/60">Algorithm</p>
                    <p className="text-sm font-semibold text-brand-light">
                      {analysis.clustering_summary.clustering_algorithm}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cluster Themes Grid */}
          <Card className="bg-brand-secondary border-brand-surface">
            <CardHeader>
              <CardTitle className="text-brand-light flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-brand-accent" />
                Discovered Themes & Patterns
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {Object.entries(analysis.cluster_themes).map(([clusterId, theme]) => (
                  <Card
                    key={clusterId}
                    className={`bg-brand-surface border-brand-light/10 cursor-pointer transition-all hover:border-brand-accent/50 ${
                      selectedCluster === parseInt(clusterId) ? 'border-brand-accent ring-1 ring-brand-accent/30' : ''
                    }`}
                    onClick={() => setSelectedCluster(parseInt(clusterId))}
                    data-testid={`cluster-card-${clusterId}`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${getClusterColor(parseInt(clusterId))}`}></div>
                        <CardTitle className="text-brand-light text-lg">
                          {theme.theme_name}
                        </CardTitle>
                      </div>
                      <Badge variant="outline" className="text-brand-accent border-brand-accent w-fit">
                        {theme.size} capsules
                      </Badge>
                    </CardHeader>
                    
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-brand-light/60 flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            Emotional Intensity
                          </span>
                          <span className="text-xs text-brand-light font-medium">
                            {getEmotionalIntensity(theme.avg_emotional_score)}
                          </span>
                        </div>
                        <div className="w-full bg-brand-dark rounded-full h-1.5">
                          <div 
                            className="bg-gradient-to-r from-blue-400 to-purple-400 h-1.5 rounded-full"
                            style={{ width: `${(theme.avg_emotional_score / 10) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-brand-light/60">Grief Level</span>
                          <span className="text-xs text-brand-light font-medium">
                            {getGriefLevel(theme.avg_grief_score)}
                          </span>
                        </div>
                        <div className="w-full bg-brand-dark rounded-full h-1.5">
                          <div 
                            className="bg-gradient-to-r from-red-400 to-orange-400 h-1.5 rounded-full"
                            style={{ width: `${(theme.avg_grief_score / 10) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-1 text-xs text-brand-light/60">
                          <Calendar className="w-3 h-3" />
                          Era: {theme.era_range}
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {theme.common_tags.slice(0, 3).map((tag, index) => (
                            <Badge 
                              key={index}
                              variant="secondary" 
                              className="text-xs bg-brand-dark text-brand-light/70"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {theme.sample_titles.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-xs text-brand-light/60">Sample Capsules:</p>
                          <div className="space-y-1">
                            {theme.sample_titles.slice(0, 2).map((title, index) => (
                              <p key={index} className="text-xs text-brand-light/80 truncate">
                                • {title}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Interactive Cluster Visualization */}
          <ClusterVisualizer clusteringData={analysis} />

          {/* GTT Yield Analysis */}
          <MemoryYieldChart />

          {/* Truth Lineage Graph */}
          <LineageVisualizer />

          {/* Public Truth Stream */}
          <PublicClusterStream />

          {/* GTT Theme Yield Analysis */}
          <ThemeYieldChart />

          {/* Selected Cluster Details */}
          {selectedCluster !== null && analysis.cluster_themes[selectedCluster] && (
            <>
              <Card className="bg-brand-secondary border-brand-accent">
                <CardHeader>
                  <CardTitle className="text-brand-light flex items-center gap-2">
                    <Users className="w-5 h-5 text-brand-accent" />
                    Cluster Analysis: {analysis.cluster_themes[selectedCluster].theme_name}
                  </CardTitle>
                </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-brand-surface rounded-lg p-4">
                    <h4 className="text-brand-light font-medium mb-2">Emotional Profile</h4>
                    <p className="text-2xl font-bold text-blue-400">
                      {analysis.cluster_themes[selectedCluster].avg_emotional_score.toFixed(1)}/10
                    </p>
                    <p className="text-xs text-brand-light/60">
                      {getEmotionalIntensity(analysis.cluster_themes[selectedCluster].avg_emotional_score)}
                    </p>
                  </div>
                  
                  <div className="bg-brand-surface rounded-lg p-4">
                    <h4 className="text-brand-light font-medium mb-2">Grief Intensity</h4>
                    <p className="text-2xl font-bold text-red-400">
                      {analysis.cluster_themes[selectedCluster].avg_grief_score.toFixed(1)}/10
                    </p>
                    <p className="text-xs text-brand-light/60">
                      {getGriefLevel(analysis.cluster_themes[selectedCluster].avg_grief_score)}
                    </p>
                  </div>
                  
                  <div className="bg-brand-surface rounded-lg p-4">
                    <h4 className="text-brand-light font-medium mb-2">Time Range</h4>
                    <p className="text-lg font-bold text-green-400">
                      {analysis.cluster_themes[selectedCluster].era_range}
                    </p>
                    <p className="text-xs text-brand-light/60">
                      {analysis.cluster_themes[selectedCluster].size} capsules
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-brand-light font-medium mb-2">Common Themes</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.cluster_themes[selectedCluster].common_tags.map((tag, index) => (
                      <Badge 
                        key={index}
                        className="bg-brand-accent/20 text-brand-accent border-brand-accent"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-brand-light font-medium mb-2">Sample Capsules</h4>
                  <div className="space-y-2">
                    {analysis.cluster_themes[selectedCluster].sample_titles.map((title, index) => (
                      <div key={index} className="bg-brand-surface rounded p-3">
                        <p className="text-brand-light text-sm">{title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* DAO Theme Voting */}
            <ClusterThemeVoting
              clusterId={selectedCluster}
              currentTheme={analysis.cluster_themes[selectedCluster].theme_name}
            />
            </>
          )}
        </>
      )}

      {/* Empty State */}
      {!analysis && !clusteringMutation.isPending && (
        <Card className="bg-brand-secondary border-brand-surface">
          <CardContent className="p-8 text-center">
            <Brain className="w-16 h-16 text-brand-light/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-brand-light mb-2">
              AI Clustering Analysis
            </h3>
            <p className="text-brand-light/60 mb-4">
              Discover hidden patterns and themes in your truth capsules using advanced AI clustering
            </p>
            <Button
              onClick={() => clusteringMutation.mutate({})}
              className="bg-brand-primary hover:bg-brand-primary/80"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Start Analysis
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}