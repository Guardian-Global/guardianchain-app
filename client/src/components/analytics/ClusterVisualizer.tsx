import { useEffect, useState, useRef } from "react";
import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ScriptableContext,
} from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, Download, ZoomIn, RotateCcw, Filter } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface CapsuleData {
  id: string;
  title: string;
  description: string;
  year: number;
  cluster: number;
  x: number;
  y: number;
  emotional_score: number;
  grief_score: number;
  category: string;
  tags: string[];
}

interface ClusterVisualizerProps {
  clusteringData?: {
    visualization_data: {
      x_coordinates: number[];
      y_coordinates: number[];
      cluster_labels: number[];
      capsule_ids: string[];
      titles: string[];
    };
    capsule_data: CapsuleData[];
    cluster_themes: { [key: string]: any };
  };
}

export default function ClusterVisualizer({ clusteringData }: ClusterVisualizerProps) {
  const [data, setData] = useState<CapsuleData[]>([]);
  const [selectedCluster, setSelectedCluster] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const chartRef = useRef<ChartJS<"scatter">>(null);

  useEffect(() => {
    if (clusteringData?.capsule_data) {
      // Transform clustering data into visualization format
      const transformedData = clusteringData.capsule_data.map((capsule, index) => ({
        ...capsule,
        x: clusteringData.visualization_data.x_coordinates[index] || 0,
        y: clusteringData.visualization_data.y_coordinates[index] || 0,
        cluster: clusteringData.visualization_data.cluster_labels[index] || 0,
      }));
      setData(transformedData);
    }
  }, [clusteringData]);

  // Dynamic color palette for clusters
  const getClusterColor = (clusterId: number): string => {
    const colors = [
      "#4f46e5", // Indigo
      "#22c55e", // Green
      "#f59e0b", // Amber
      "#ec4899", // Pink
      "#0ea5e9", // Sky
      "#8b5cf6", // Violet
      "#ef4444", // Red
      "#06b6d4", // Cyan
    ];
    return colors[clusterId % colors.length];
  };

  const getClusterColorWithAlpha = (clusterId: number, alpha: number = 0.7): string => {
    const color = getClusterColor(clusterId);
    // Convert hex to rgba
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Apply filters to data
  const filteredData = data.filter(d =>
    (selectedCluster === null || d.cluster === selectedCluster) &&
    (selectedYear === null || d.year === +selectedYear)
  );

  // Get unique clusters and years from original data
  const uniqueClusters = Array.from(new Set(data.map(d => d.cluster))).sort((a, b) => a - b);
  const uniqueYears = Array.from(new Set(data.map(d => d.year))).sort((a, b) => a - b);

  // Prepare scatter plot data with filtered data
  const scatterData = {
    datasets: Array.from(new Set(filteredData.map(d => d.cluster))).map((clusterId) => {
      const clusterData = filteredData.filter((d) => d.cluster === clusterId);
      const isSelected = selectedCluster === null || selectedCluster === clusterId;
      
      return {
        label: clusteringData?.cluster_themes?.[clusterId]?.theme_name || `Cluster ${clusterId}`,
        data: clusterData.map((d) => ({
          x: d.x,
          y: d.y,
          capsule: d, // Store full capsule data for tooltips
        })),
        backgroundColor: (context: ScriptableContext<"scatter">) => {
          return getClusterColorWithAlpha(clusterId, isSelected ? 0.8 : 0.3);
        },
        borderColor: getClusterColor(clusterId),
        borderWidth: isSelected ? 2 : 1,
        pointRadius: isSelected ? 8 : 6,
        pointHoverRadius: 10,
        hidden: selectedCluster !== null && selectedCluster !== clusterId,
      };
    }),
  };

  // Chart options with enhanced interactivity
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "Semantic Dimension X",
          color: "#e2e8f0",
          font: { size: 12, weight: "500" as const },
        },
        grid: { color: "#334155", lineWidth: 0.5 },
        ticks: { color: "#94a3b8", font: { size: 10 } },
      },
      y: {
        title: {
          display: true,
          text: "Semantic Dimension Y",
          color: "#e2e8f0",
          font: { size: 12, weight: "500" as const },
        },
        grid: { color: "#334155", lineWidth: 0.5 },
        ticks: { color: "#94a3b8", font: { size: 10 } },
      },
    },
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          color: "#e2e8f0",
          font: { size: 11 },
          usePointStyle: true,
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        titleColor: "#f1f5f9",
        bodyColor: "#cbd5e1",
        borderColor: "#475569",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: (context: any) => {
            const capsule = context[0]?.raw?.capsule;
            return capsule?.title || "Unknown Capsule";
          },
          label: (context: any) => {
            const capsule = context[0]?.raw?.capsule;
            if (!capsule) return "";
            
            return [
              `${capsule.title} — ${capsule.year}`,
              `Category: ${capsule.category}`,
              `Emotional Score: ${capsule.emotional_score}/10`,
              `Grief Score: ${capsule.grief_score}/10`,
              `Tags: ${capsule.tags?.slice(0, 3).join(", ") || "None"}`,
            ];
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "nearest" as const,
    },
    onClick: (event: any, elements: any[]) => {
      if (elements.length > 0) {
        const datasetIndex = elements[0].datasetIndex;
        const clusterId = uniqueClusters[datasetIndex];
        setSelectedCluster(selectedCluster === clusterId ? null : clusterId);
      }
    },
  };

  const handleResetView = () => {
    setSelectedCluster(null);
    setSelectedYear(null);
    setZoomLevel(1);
    if (chartRef.current) {
      chartRef.current.resetZoom();
    }
  };

  const handleDownloadChart = () => {
    if (chartRef.current) {
      const url = chartRef.current.toBase64Image();
      const link = document.createElement("a");
      link.download = "capsule-clusters-visualization.png";
      link.href = url;
      link.click();
    }
  };

  const getClusterStats = () => {
    if (!data.length) return null;
    
    const clusterStats = uniqueClusters.map(clusterId => {
      const clusterData = data.filter(d => d.cluster === clusterId);
      const avgEmotional = clusterData.reduce((sum, d) => sum + d.emotional_score, 0) / clusterData.length;
      const avgGrief = clusterData.reduce((sum, d) => sum + d.grief_score, 0) / clusterData.length;
      
      return {
        id: clusterId,
        name: clusteringData?.cluster_themes?.[clusterId]?.theme_name || `Cluster ${clusterId}`,
        size: clusterData.length,
        avgEmotional: avgEmotional.toFixed(1),
        avgGrief: avgGrief.toFixed(1),
        color: getClusterColor(clusterId),
      };
    });
    
    return clusterStats;
  };

  const clusterStats = getClusterStats();

  if (!data.length) {
    return (
      <Card className="bg-brand-secondary border-brand-surface">
        <CardContent className="p-8 text-center">
          <BarChart3 className="w-16 h-16 text-brand-light/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-brand-light mb-2">
            Cluster Visualization
          </h3>
          <p className="text-brand-light/60">
            Run clustering analysis to see the interactive scatter plot visualization
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Visualization Controls */}
      <Card className="bg-brand-secondary border-brand-surface">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-brand-light flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-brand-accent" />
              Interactive Cluster Visualization
            </CardTitle>
            
            <div className="flex gap-2">
              <Button
                onClick={handleResetView}
                variant="outline"
                size="sm"
                className="border-brand-surface bg-brand-dark text-brand-light hover:bg-brand-surface"
                data-testid="button-reset-view"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset View
              </Button>
              
              <Button
                onClick={handleDownloadChart}
                variant="outline"
                size="sm"
                className="border-brand-surface bg-brand-dark text-brand-light hover:bg-brand-surface"
                data-testid="button-download-chart"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
          
          {/* Filter Controls */}
          <div className="flex gap-4 items-center pt-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-brand-light/60" />
              <span className="text-sm text-brand-light/60">Filters:</span>
            </div>
            
            <Select value={selectedCluster?.toString() || "all"} onValueChange={(value) => setSelectedCluster(value === "all" ? null : parseInt(value))}>
              <SelectTrigger className="w-40 bg-brand-dark border-brand-surface text-brand-light">
                <SelectValue placeholder="All Clusters" />
              </SelectTrigger>
              <SelectContent className="bg-brand-dark border-brand-surface">
                <SelectItem value="all" className="text-brand-light">All Clusters</SelectItem>
                {uniqueClusters.map(cluster => (
                  <SelectItem key={cluster} value={cluster.toString()} className="text-brand-light">
                    Cluster {cluster}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedYear || "all"} onValueChange={(value) => setSelectedYear(value === "all" ? null : value)}>
              <SelectTrigger className="w-40 bg-brand-dark border-brand-surface text-brand-light">
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent className="bg-brand-dark border-brand-surface">
                <SelectItem value="all" className="text-brand-light">All Years</SelectItem>
                {uniqueYears.map(year => (
                  <SelectItem key={year} value={year.toString()} className="text-brand-light">
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {(selectedCluster !== null || selectedYear !== null) && (
              <Badge variant="secondary" className="bg-brand-accent/20 text-brand-accent">
                {filteredData.length} of {data.length} capsules
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="h-96 bg-brand-dark rounded-lg p-4">
            <Scatter
              ref={chartRef}
              data={scatterData}
              options={options}
            />
          </div>
        </CardContent>
      </Card>

      {/* Cluster Statistics */}
      {clusterStats && (
        <Card className="bg-brand-secondary border-brand-surface">
          <CardHeader>
            <CardTitle className="text-brand-light">Cluster Overview</CardTitle>
            <p className="text-brand-light/60 text-sm">
              Click on clusters in the chart or badges below to focus on specific themes
            </p>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clusterStats.map((cluster) => (
                <div
                  key={cluster.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedCluster === cluster.id
                      ? "border-brand-accent bg-brand-accent/10"
                      : "border-brand-surface bg-brand-surface hover:border-brand-accent/50"
                  }`}
                  onClick={() => setSelectedCluster(selectedCluster === cluster.id ? null : cluster.id)}
                  data-testid={`cluster-overview-${cluster.id}`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: cluster.color }}
                    ></div>
                    <h4 className="font-medium text-brand-light">{cluster.name}</h4>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-brand-light/60">Size:</span>
                      <Badge variant="secondary" className="bg-brand-dark text-brand-light">
                        {cluster.size} capsules
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-brand-light/60">Emotional:</span>
                      <span className="text-brand-light font-medium">{cluster.avgEmotional}/10</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-brand-light/60">Grief:</span>
                      <span className="text-brand-light font-medium">{cluster.avgGrief}/10</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}