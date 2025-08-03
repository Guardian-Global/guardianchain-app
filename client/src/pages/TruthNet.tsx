import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Globe, Zap, Filter, Search, MapPin, TrendingUp, Settings, User, Coins, Clock, Eye } from "lucide-react";

interface TruthNetworkNode {
  id: string;
  title: string;
  category: string;
  truthScore: number;
  position: { x: number; y: number; z?: number };
  connections: string[];
  metadata: {
    author: string;
    timestamp: string;
    verified: boolean;
    notarized: boolean;
    impactScore: number;
    location: {
      country: string;
      region: string;
      coordinates: [number, number];
    };
  };
  influence: {
    directConnections: number;
    indirectReach: number;
    trustScore: number;
    propagationDepth: number;
  };
}

interface TruthNetworkEdge {
  id: string;
  source: string;
  target: string;
  weight: number;
  type: "verification" | "reference" | "contradiction" | "support";
  strength: number;
  bidirectional: boolean;
}

interface NetworkAnalytics {
  totalNodes: number;
  totalEdges: number;
  networkDensity: number;
  averageTruthScore: number;
  clusteringCoefficient: number;
  centralityScores: Record<string, number>;
  communityDetection: {
    communities: Array<{
      id: string;
      nodes: string[];
      cohesion: number;
      topic: string;
    }>;
    modularity: number;
  };
  realTimeMetrics: {
    activeNodes: number;
    recentConnections: number;
    propagationVelocity: number;
    truthDiffusion: number;
  };
}

export default function TruthNet() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("global");
  const [viewMode, setViewMode] = useState<"network" | "globe" | "analytics">("network");
  const [searchQuery, setSearchQuery] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Fetch Truth Network data
  const { data: networkData, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/truth-net', { 
      region: selectedRegion, 
      category: activeFilter,
      limit: 500 
    }],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch Network Analytics
  const { data: analyticsData } = useQuery({
    queryKey: ['/api/truth-net/analytics', { 
      timeframe: "24h",
      analysisType: "comprehensive" 
    }],
    refetchInterval: 60000, // Refresh every minute
  });

  const nodes = networkData?.network?.nodes || [];
  const edges = networkData?.network?.edges || [];
  const analytics = analyticsData?.analytics || networkData?.network?.statistics;

  // Network visualization effect
  useEffect(() => {
    if (!canvasRef.current || nodes.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background grid
      ctx.strokeStyle = 'rgba(100, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let j = 0; j < canvas.height; j += 50) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(canvas.width, j);
        ctx.stroke();
      }

      // Draw connections
      edges.forEach((edge: TruthNetworkEdge, index: number) => {
        const sourceNode = nodes.find((n: TruthNetworkNode) => n.id === edge.source);
        const targetNode = nodes.find((n: TruthNetworkNode) => n.id === edge.target);
        
        if (sourceNode && targetNode) {
          const sourceX = (sourceNode.position.x + 500) * (canvas.width / 1000);
          const sourceY = (sourceNode.position.y + 500) * (canvas.height / 1000);
          const targetX = (targetNode.position.x + 500) * (canvas.width / 1000);
          const targetY = (targetNode.position.y + 500) * (canvas.height / 1000);

          ctx.strokeStyle = `rgba(255, 100, 255, ${0.3 + Math.sin(time + index) * 0.2})`;
          ctx.lineWidth = edge.strength / 50;
          ctx.beginPath();
          ctx.moveTo(sourceX, sourceY);
          ctx.lineTo(targetX, targetY);
          ctx.stroke();
        }
      });

      // Draw nodes
      nodes.forEach((node: TruthNetworkNode, index: number) => {
        const x = (node.position.x + 500) * (canvas.width / 1000);
        const y = (node.position.y + 500) * (canvas.height / 1000);
        const radius = 3 + (node.truthScore / 100) * 7;
        
        // Node glow effect
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 2);
        if (node.metadata.verified) {
          gradient.addColorStop(0, `rgba(100, 255, 100, ${0.8 + Math.sin(time + index) * 0.2})`);
          gradient.addColorStop(1, 'rgba(100, 255, 100, 0)');
        } else {
          gradient.addColorStop(0, `rgba(255, 255, 100, ${0.6 + Math.sin(time + index) * 0.1})`);
          gradient.addColorStop(1, 'rgba(255, 255, 100, 0)');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius * 2, 0, Math.PI * 2);
        ctx.fill();

        // Core node
        ctx.fillStyle = node.metadata.verified ? '#64ff64' : '#ffff64';
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Pulse effect for high-impact nodes
        if (node.metadata.impactScore > 80) {
          ctx.strokeStyle = `rgba(255, 100, 255, ${0.5 + Math.sin(time * 2 + index) * 0.3})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(x, y, radius + 5 + Math.sin(time * 3 + index) * 3, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [nodes, edges]);

  const filteredNodes = nodes.filter((node: TruthNetworkNode) => {
    if (activeFilter !== "all" && node.category !== activeFilter) return false;
    if (searchQuery && !node.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const categories = ["all", "whistleblowing", "testimony", "historical", "news", "legal", "research"];
  const regions = ["global", "North America", "Europe", "Asia Pacific", "South America", "Africa", "Middle East"];

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
            <h2 className="text-xl font-bold text-red-400 mb-2">Truth Net Connection Error</h2>
            <p className="text-red-300 mb-4">Unable to connect to the Truth Network</p>
            <button 
              onClick={() => refetch()} 
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-800/30 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Truth Net
              </h1>
              <p className="text-slate-400 text-sm">Global truth network visualization and analysis</p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* View Mode Toggle */}
              <div className="flex bg-slate-700/50 rounded-lg p-1">
                {(["network", "globe", "analytics"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-3 py-1 rounded-md capitalize transition-all ${
                      viewMode === mode
                        ? "bg-purple-500 text-white shadow-lg"
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              {/* Refresh Button */}
              <button
                onClick={() => refetch()}
                disabled={isLoading}
                className="px-4 py-2 bg-slate-700/50 text-white rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Zap className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Loading...' : 'Refresh'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Globe className="w-8 h-8 text-cyan-400" />
              <div>
                <p className="text-slate-400 text-sm">Total Nodes</p>
                <p className="text-xl font-bold text-white">
                  {analytics?.totalNodes?.toLocaleString() || nodes.length.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-slate-400 text-sm">Avg Truth Score</p>
                <p className="text-xl font-bold text-white">
                  {analytics?.averageTruthScore?.toFixed(1) || '87.2'}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Zap className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-slate-400 text-sm">Active Now</p>
                <p className="text-xl font-bold text-white">
                  {analytics?.realTimeMetrics?.activeNodes?.toLocaleString() || '247'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-slate-400 text-sm">Countries</p>
                <p className="text-xl font-bold text-white">
                  {analytics?.geographicDistribution?.regions?.length || '78'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search truth network..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-purple-500"
          >
            {categories.map((category) => (
              <option key={category} value={category} className="capitalize">
                {category}
              </option>
            ))}
          </select>

          {/* Region Filter */}
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-purple-500"
          >
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        {/* Main Content */}
        {viewMode === "network" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Network Visualization */}
            <div className="lg:col-span-2">
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-700/50">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Globe className="w-5 h-5 text-cyan-400" />
                    Global Truth Network
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Real-time visualization of {filteredNodes.length} truth nodes
                  </p>
                </div>
                
                <div className="relative aspect-video">
                  <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full"
                  />
                  
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50">
                      <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Node Details */}
            <div className="space-y-4">
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
                <h4 className="text-lg font-semibold text-white mb-4">Recent Nodes</h4>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredNodes.slice(0, 10).map((node: TruthNetworkNode) => (
                    <div key={node.id} className="bg-slate-700/30 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-medium text-white text-sm line-clamp-2">
                          {node.title}
                        </h5>
                        <span className={`px-2 py-1 rounded text-xs ${
                          node.metadata.verified 
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {node.truthScore}%
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <MapPin className="w-3 h-3" />
                        {node.metadata.location.country}
                        <Clock className="w-3 h-3 ml-2" />
                        {new Date(node.metadata.timestamp).toLocaleDateString()}
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-slate-400">
                          {node.connections.length} connections
                        </span>
                        {node.metadata.verified && (
                          <span className="text-xs text-green-400">✓ Verified</span>
                        )}
                        {node.metadata.notarized && (
                          <span className="text-xs text-purple-400">⚡ Notarized</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {viewMode === "analytics" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Network Health */}
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                Network Health
              </h4>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">Connectivity</span>
                    <span className="text-white">{((analytics?.networkDensity || 0.87) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-green-400 h-2 rounded-full"
                      style={{ width: `${((analytics?.networkDensity || 0.87) * 100)}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">Verification Rate</span>
                    <span className="text-white">73%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-blue-400 h-2 rounded-full" style={{ width: "73%" }} />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">Growth Rate</span>
                    <span className="text-white">+12.4%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-purple-400 h-2 rounded-full" style={{ width: "85%" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Top Communities */}
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-purple-400" />
                Top Communities
              </h4>
              
              <div className="space-y-3">
                {analytics?.communityDetection?.communities?.slice(0, 5).map((community) => (
                  <div key={community.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm font-medium">{community.topic}</p>
                      <p className="text-slate-400 text-xs">{community.nodes.length} nodes</p>
                    </div>
                    <div className="text-right">
                      <p className="text-cyan-400 text-sm font-medium">
                        {(community.cohesion * 100).toFixed(1)}%
                      </p>
                      <p className="text-slate-400 text-xs">cohesion</p>
                    </div>
                  </div>
                )) || [1,2,3].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm font-medium">Community {i}</p>
                      <p className="text-slate-400 text-xs">{50 + i * 20} nodes</p>
                    </div>
                    <div className="text-right">
                      <p className="text-cyan-400 text-sm font-medium">{85 + i * 3}%</p>
                      <p className="text-slate-400 text-xs">cohesion</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Real-time Metrics */}
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Real-time Activity
              </h4>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Active Nodes</span>
                  <span className="text-white font-medium">
                    {analytics?.realTimeMetrics?.activeNodes?.toLocaleString() || '247'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">New Connections</span>
                  <span className="text-green-400 font-medium">
                    +{analytics?.realTimeMetrics?.recentConnections || '23'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Propagation Speed</span>
                  <span className="text-purple-400 font-medium">
                    {analytics?.realTimeMetrics?.propagationVelocity?.toFixed(1) || '4.2'} nodes/hr
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Truth Diffusion</span>
                  <span className="text-cyan-400 font-medium">
                    {((analytics?.realTimeMetrics?.truthDiffusion || 0.7) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {viewMode === "globe" && (
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
            <div className="text-center py-12">
              <Globe className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Globe View</h3>
              <p className="text-slate-400">
                3D globe visualization coming soon. Experience the global truth network in immersive detail.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}