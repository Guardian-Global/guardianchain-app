import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Globe, Zap, Filter, Search, MapPin, TrendingUp, Settings, User, Coins, Clock } from "lucide-react";

interface TruthNode {
  id: string;
  title: string;
  category: string;
  emotion: string;
  truthScore: number;
  location: { lat: number; lng: number; country: string };
  connections: string[];
  timestamp: string;
  author: string;
  verified: boolean;
}

const mockTruthNodes: TruthNode[] = [
  {
    id: "node_001",
    title: "Climate Documentation",
    category: "Environmental",
    emotion: "Concern",
    truthScore: 94,
    location: { lat: 40.7128, lng: -74.0060, country: "USA" },
    connections: ["node_003", "node_007"],
    timestamp: "2025-08-02T14:30:00Z",
    author: "Dr. Sarah Chen",
    verified: true
  },
  {
    id: "node_002", 
    title: "Corporate Whistleblower",
    category: "Investigation",
    emotion: "Anger",
    truthScore: 87,
    location: { lat: 51.5074, lng: -0.1278, country: "UK" },
    connections: ["node_001", "node_005"],
    timestamp: "2025-08-01T09:15:00Z",
    author: "Anonymous",
    verified: true
  },
  {
    id: "node_003",
    title: "Family Legacy",
    category: "Personal",
    emotion: "Grief",
    truthScore: 96,
    location: { lat: 35.6762, lng: 139.6503, country: "Japan" },
    connections: ["node_001", "node_004"],
    timestamp: "2025-07-30T18:45:00Z",
    author: "Kenji Nakamura",
    verified: true
  },
  {
    id: "node_004",
    title: "Historical Archive",
    category: "Historical",
    emotion: "Reverence",
    truthScore: 99,
    location: { lat: 48.8566, lng: 2.3522, country: "France" },
    connections: ["node_002", "node_003"],
    timestamp: "2025-07-28T11:20:00Z",
    author: "Prof. Marie Dubois",
    verified: true
  },
  {
    id: "node_005",
    title: "Tech Innovation",
    category: "Technology",
    emotion: "Excitement",
    truthScore: 91,
    location: { lat: 37.7749, lng: -122.4194, country: "USA" },
    connections: ["node_002", "node_006"],
    timestamp: "2025-07-25T16:00:00Z",
    author: "Alex Kim",
    verified: false
  }
];

export default function TruthNet() {
  const [selectedNode, setSelectedNode] = useState<TruthNode | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"global" | "network" | "timeline">("global");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { data: truthNodes } = useQuery({
    queryKey: ["/api/truth-net"],
  });

  const nodes: TruthNode[] = truthNodes?.nodes || mockTruthNodes;

  const filteredNodes = nodes.filter((node: TruthNode) => {
    const matchesFilter = filter === "all" || node.category.toLowerCase() === filter.toLowerCase();
    const matchesSearch = searchQuery === "" || 
      node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // Canvas visualization effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connections between nodes
      filteredNodes.forEach((node: TruthNode) => {
        const nodeX = (node.location.lng + 180) * (canvas.offsetWidth / 360);
        const nodeY = (90 - node.location.lat) * (canvas.offsetHeight / 180);

        node.connections.forEach((connectionId: string) => {
          const connectedNode = filteredNodes.find((n: TruthNode) => n.id === connectionId);
          if (connectedNode) {
            const connectedX = (connectedNode.location.lng + 180) * (canvas.offsetWidth / 360);
            const connectedY = (90 - connectedNode.location.lat) * (canvas.offsetHeight / 180);

            ctx.beginPath();
            ctx.moveTo(nodeX, nodeY);
            ctx.lineTo(connectedX, connectedY);
            ctx.strokeStyle = `rgba(139, 92, 246, ${node.truthScore / 200})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });

        // Draw node
        ctx.beginPath();
        ctx.arc(nodeX, nodeY, Math.max(3, node.truthScore / 20), 0, 2 * Math.PI);
        ctx.fillStyle = node.verified ? 
          `rgba(34, 197, 94, ${node.truthScore / 100})` : 
          `rgba(239, 68, 68, ${node.truthScore / 100})`;
        ctx.fill();

        // Pulse effect for high-truth nodes
        if (node.truthScore > 95) {
          ctx.beginPath();
          ctx.arc(nodeX, nodeY, Math.max(5, node.truthScore / 15), 0, 2 * Math.PI);
          ctx.strokeStyle = `rgba(34, 197, 94, ${Math.sin(Date.now() / 1000) * 0.5 + 0.5})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [filteredNodes]);

  const categories = ["all", "environmental", "investigation", "personal", "historical", "technology"];

  const getEmotionColor = (emotion: string) => {
    const colors = {
      "Grief": "text-purple-400",
      "Anger": "text-red-400", 
      "Concern": "text-yellow-400",
      "Excitement": "text-green-400",
      "Reverence": "text-blue-400",
      "Hope": "text-cyan-400"
    };
    return colors[emotion as keyof typeof colors] || "text-gray-400";
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-purple-500/20 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Globe className="w-8 h-8 text-purple-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">Truth Net</h1>
                <p className="text-gray-400">Global visualization of truth memory network</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setViewMode("global")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  viewMode === "global" ? 'bg-purple-500 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                <Globe className="w-4 h-4 inline mr-2" />
                Global
              </button>
              <button
                onClick={() => setViewMode("network")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  viewMode === "network" ? 'bg-purple-500 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                <Zap className="w-4 h-4 inline mr-2" />
                Network
              </button>
              <button
                onClick={() => setViewMode("timeline")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  viewMode === "timeline" ? 'bg-purple-500 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                <TrendingUp className="w-4 h-4 inline mr-2" />
                Timeline
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search truth nodes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-sm text-gray-400">
              {filteredNodes.length} nodes • {filteredNodes.filter(n => n.verified).length} verified
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-200px)]">
        {/* Main Visualization */}
        <div className="flex-1 relative">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}
          />
          
          {/* Overlay Info */}
          <div className="absolute top-4 left-4 bg-slate-800/90 backdrop-blur-sm rounded-lg p-4 border border-purple-500/20">
            <h3 className="font-semibold text-white mb-2">Network Stats</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Nodes:</span>
                <span className="text-white">{filteredNodes.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Verified:</span>
                <span className="text-green-400">{filteredNodes.filter((n: TruthNode) => n.verified).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Avg Truth Score:</span>
                <span className="text-purple-400">
                  {Math.round(filteredNodes.reduce((acc: number, n: TruthNode) => acc + n.truthScore, 0) / filteredNodes.length)}%
                </span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-slate-800/90 backdrop-blur-sm rounded-lg p-4 border border-purple-500/20">
            <h4 className="font-semibold text-white mb-2 text-sm">Legend</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-gray-300">Verified Node</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span className="text-gray-300">Unverified Node</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-0.5 bg-purple-400" />
                <span className="text-gray-300">Truth Connection</span>
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="w-80 bg-slate-800/50 border-l border-purple-500/20 p-6 overflow-y-auto">
          <h3 className="font-semibold text-white mb-4">Truth Nodes</h3>
          
          <div className="space-y-3">
            {filteredNodes.map((node: TruthNode) => (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedNode?.id === node.id
                    ? 'bg-purple-500/20 border-purple-500/50'
                    : 'bg-slate-700/30 border-slate-600/50 hover:bg-slate-700/50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-white text-sm leading-tight">{node.title}</h4>
                  <div className="flex items-center space-x-1 ml-2">
                    {node.verified && <Eye className="w-3 h-3 text-green-400" />}
                    <span className="text-xs text-purple-400">{node.truthScore}%</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-xs">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-400">{node.location.country}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">{node.category}</span>
                    <span className={getEmotionColor(node.emotion)}>{node.emotion}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    by {node.author}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}