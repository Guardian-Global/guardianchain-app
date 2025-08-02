import React from "react";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import {
  GitBranch,
  Search,
  Filter,
  Zap,
  Heart,
  Users,
  TrendingUp,
  Clock,
  Share2,
  Eye,
  Download,
} from "lucide-react";

interface LineageNode {
  id: string;
  title: string;
  creator: string;
  created_at: string;
  grief_score: number;
  influence_count: number;
  verification_status: "verified" | "pending" | "unverified";
  capsule_type: string;
  children: string[];
  parents: string[];
  x?: number;
  y?: number;
  level?: number;
}

interface LineageConnection {
  source: string;
  target: string;
  influence_type: "inspired" | "referenced" | "contradicted" | "expanded";
  strength: number;
}

export default function LineageGraph() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [viewMode, setViewMode] = useState<"tree" | "force" | "timeline">(
    "tree",
  );
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch lineage data
  const { data: lineageData, isLoading } = useQuery({
    queryKey: ["/api/lineage/graph", searchQuery, filterType],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (filterType !== "all") params.append("type", filterType);

      const response = await apiRequest("GET", `/api/lineage/graph?${params}`);
      return response.json();
    },
  });

  // Graph layout calculation
  useEffect(() => {
    if (!lineageData?.nodes || !svgRef.current) return;

    const svg = svgRef.current;
    const width = svg.clientWidth || 800;
    const height = svg.clientHeight || 600;

    // Calculate positions based on view mode
    const positionedNodes = calculateLayout(
      lineageData.nodes,
      lineageData.connections,
      viewMode,
      width,
      height,
    );

    renderGraph(svg, positionedNodes, lineageData.connections, width, height);
  }, [lineageData, viewMode]);

  const calculateLayout = (
    nodes: LineageNode[],
    connections: LineageConnection[],
    mode: string,
    width: number,
    height: number,
  ) => {
    switch (mode) {
      case "tree":
        return calculateTreeLayout(nodes, connections, width, height);
      case "force":
        return calculateForceLayout(nodes, connections, width, height);
      case "timeline":
        return calculateTimelineLayout(nodes, width, height);
      default:
        return nodes;
    }
  };

  const calculateTreeLayout = (
    nodes: LineageNode[],
    connections: LineageConnection[],
    width: number,
    height: number,
  ) => {
    const levels = new Map<string, number>();
    const positioned = new Map<string, { x: number; y: number }>();

    // Find root nodes (no parents)
    const rootNodes = nodes.filter(
      (node) => !connections.some((conn) => conn.target === node.id),
    );

    // Assign levels using BFS
    const queue = rootNodes.map((node) => ({ node, level: 0 }));
    const processed = new Set<string>();

    while (queue.length > 0) {
      const { node, level } = queue.shift()!;
      if (processed.has(node.id)) continue;

      levels.set(node.id, level);
      processed.add(node.id);

      // Add children to queue
      const children = connections
        .filter((conn) => conn.source === node.id)
        .map((conn) => nodes.find((n) => n.id === conn.target))
        .filter(Boolean);

      children.forEach((child) => {
        if (!processed.has(child!.id)) {
          queue.push({ node: child!, level: level + 1 });
        }
      });
    }

    // Position nodes
    const maxLevel = Math.max(...Array.from(levels.values()));
    const levelGroups = new Map<number, LineageNode[]>();

    nodes.forEach((node) => {
      const level = levels.get(node.id) || 0;
      if (!levelGroups.has(level)) levelGroups.set(level, []);
      levelGroups.get(level)!.push(node);
    });

    return nodes.map((node) => {
      const level = levels.get(node.id) || 0;
      const levelNodes = levelGroups.get(level) || [];
      const nodeIndex = levelNodes.indexOf(node);

      return {
        ...node,
        x: (width / (maxLevel + 1)) * level + 50,
        y: (height / (levelNodes.length + 1)) * (nodeIndex + 1),
        level,
      };
    });
  };

  const calculateForceLayout = (
    nodes: LineageNode[],
    connections: LineageConnection[],
    width: number,
    height: number,
  ) => {
    // Simple force-directed layout simulation
    const positioned = nodes.map((node) => ({
      ...node,
      x: Math.random() * (width - 100) + 50,
      y: Math.random() * (height - 100) + 50,
      vx: 0,
      vy: 0,
    }));

    // Run simulation iterations
    for (let i = 0; i < 100; i++) {
      // Repulsion between nodes
      positioned.forEach((nodeA, indexA) => {
        positioned.forEach((nodeB, indexB) => {
          if (indexA === indexB) return;

          const dx = nodeA.x! - nodeB.x!;
          const dy = nodeA.y! - nodeB.y!;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = 1000 / (distance * distance);

          nodeA.vx! += (dx / distance) * force;
          nodeA.vy! += (dy / distance) * force;
        });
      });

      // Attraction along connections
      connections.forEach((conn) => {
        const source = positioned.find((n) => n.id === conn.source);
        const target = positioned.find((n) => n.id === conn.target);
        if (!source || !target) return;

        const dx = target.x! - source.x!;
        const dy = target.y! - source.y!;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = distance * 0.01;

        source.vx! += (dx / distance) * force;
        source.vy! += (dy / distance) * force;
        target.vx! -= (dx / distance) * force;
        target.vy! -= (dy / distance) * force;
      });

      // Apply velocity and damping
      positioned.forEach((node) => {
        node.vx! *= 0.9;
        node.vy! *= 0.9;
        node.x! += node.vx!;
        node.y! += node.vy!;

        // Keep within bounds
        node.x! = Math.max(50, Math.min(width - 50, node.x!));
        node.y! = Math.max(50, Math.min(height - 50, node.y!));
      });
    }

    return positioned;
  };

  const calculateTimelineLayout = (
    nodes: LineageNode[],
    width: number,
    height: number,
  ) => {
    const sortedNodes = [...nodes].sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );

    return sortedNodes.map((node, index) => ({
      ...node,
      x: (width / (sortedNodes.length + 1)) * (index + 1),
      y: height / 2 + (Math.random() - 0.5) * 200,
      level: index,
    }));
  };

  const renderGraph = (
    svg: SVGSVGElement,
    nodes: LineageNode[],
    connections: LineageConnection[],
    width: number,
    height: number,
  ) => {
    // Clear previous content
    svg.innerHTML = "";

    // Create defs for gradients and patterns
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");

    // Add gradient for connections
    const gradient = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "linearGradient",
    );
    gradient.setAttribute("id", "connectionGradient");
    gradient.innerHTML = `
      <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:0.4" />
    `;
    defs.appendChild(gradient);
    svg.appendChild(defs);

    // Render connections
    connections.forEach((conn) => {
      const source = nodes.find((n) => n.id === conn.source);
      const target = nodes.find((n) => n.id === conn.target);
      if (!source || !target) return;

      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line",
      );
      line.setAttribute("x1", source.x!.toString());
      line.setAttribute("y1", source.y!.toString());
      line.setAttribute("x2", target.x!.toString());
      line.setAttribute("y2", target.y!.toString());
      line.setAttribute("stroke", "url(#connectionGradient)");
      line.setAttribute("stroke-width", (conn.strength * 3).toString());
      line.setAttribute("opacity", "0.6");

      // Add arrow marker
      if (conn.influence_type === "inspired") {
        line.setAttribute("marker-end", "url(#arrowhead)");
      }

      svg.appendChild(line);
    });

    // Render nodes
    nodes.forEach((node) => {
      const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
      group.setAttribute("transform", `translate(${node.x}, ${node.y})`);
      group.setAttribute("cursor", "pointer");

      // Node circle
      const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle",
      );
      circle.setAttribute("r", (10 + node.grief_score * 2).toString());
      circle.setAttribute("fill", getNodeColor(node));
      circle.setAttribute("stroke", "#ffffff");
      circle.setAttribute("stroke-width", "2");

      // Node label
      const text = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text",
      );
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("dy", "25");
      text.setAttribute("fill", "#ffffff");
      text.setAttribute("font-size", "12");
      text.textContent =
        node.title.length > 20
          ? node.title.substring(0, 20) + "..."
          : node.title;

      group.appendChild(circle);
      group.appendChild(text);

      // Add click handler
      group.addEventListener("click", () => setSelectedNode(node.id));

      svg.appendChild(group);
    });

    // Add arrow marker definition
    const marker = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "marker",
    );
    marker.setAttribute("id", "arrowhead");
    marker.setAttribute("markerWidth", "10");
    marker.setAttribute("markerHeight", "7");
    marker.setAttribute("refX", "9");
    marker.setAttribute("refY", "3.5");
    marker.setAttribute("orient", "auto");

    const polygon = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polygon",
    );
    polygon.setAttribute("points", "0 0, 10 3.5, 0 7");
    polygon.setAttribute("fill", "#8b5cf6");
    marker.appendChild(polygon);

    defs.appendChild(marker);
  };

  const getNodeColor = (node: LineageNode) => {
    if (node.verification_status === "verified") return "#22c55e";
    if (node.verification_status === "pending") return "#f59e0b";
    return "#6b7280";
  };

  const selectedNodeData = lineageData?.nodes?.find(
    (n: LineageNode) => n.id === selectedNode,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Truth Lineage Protocol
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore the interconnected web of truth capsules and their influence
            on the Guardian ecosystem
          </p>
        </div>

        {/* Controls */}
        <div className="max-w-6xl mx-auto mb-6">
          <Card className="bg-black/40 backdrop-blur-xl border-indigo-500/20">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 items-center">
                {/* Search */}
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search truth capsules..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-slate-800/50 border-indigo-500/30 text-white placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Filter */}
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-48 bg-slate-800 border-indigo-500/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-indigo-500/30">
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="testimony">Testimony</SelectItem>
                    <SelectItem value="evidence">Evidence</SelectItem>
                    <SelectItem value="legacy">Legacy</SelectItem>
                    <SelectItem value="whistleblower">Whistleblower</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode */}
                <div className="flex space-x-2">
                  {["tree", "force", "timeline"].map((mode) => (
                    <Button
                      key={mode}
                      variant={viewMode === mode ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode(mode as any)}
                      className={
                        viewMode === mode
                          ? "bg-gradient-to-r from-indigo-600 to-cyan-600"
                          : "border-indigo-500/30 text-indigo-300"
                      }
                    >
                      {mode === "tree" && (
                        <GitBranch className="w-4 h-4 mr-1" />
                      )}
                      {mode === "force" && <Zap className="w-4 h-4 mr-1" />}
                      {mode === "timeline" && (
                        <Clock className="w-4 h-4 mr-1" />
                      )}
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Graph Visualization */}
          <div className="lg:col-span-3">
            <Card className="bg-black/40 backdrop-blur-xl border-indigo-500/20 h-[600px]">
              <CardHeader>
                <CardTitle className="text-indigo-300 flex items-center">
                  <GitBranch className="w-5 h-5 mr-2" />
                  Lineage Visualization
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div ref={containerRef} className="w-full h-[500px] relative">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
                    </div>
                  ) : (
                    <svg
                      ref={svgRef}
                      className="w-full h-full"
                      viewBox="0 0 800 500"
                      preserveAspectRatio="xMidYMid meet"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Node Details */}
          <div className="space-y-4">
            {/* Stats Overview */}
            <Card className="bg-black/40 backdrop-blur-xl border-indigo-500/20">
              <CardHeader>
                <CardTitle className="text-indigo-300 text-sm">
                  Network Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Total Nodes</span>
                  <span className="text-white font-semibold">
                    {lineageData?.nodes?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Connections</span>
                  <span className="text-white font-semibold">
                    {lineageData?.connections?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Verified</span>
                  <span className="text-green-400 font-semibold">
                    {lineageData?.nodes?.filter(
                      (n: LineageNode) => n.verification_status === "verified",
                    ).length || 0}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Selected Node Details */}
            {selectedNodeData && (
              <Card className="bg-black/40 backdrop-blur-xl border-indigo-500/20">
                <CardHeader>
                  <CardTitle className="text-indigo-300 text-sm">
                    Selected Capsule
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-white font-semibold mb-2">
                      {selectedNodeData.title}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      by {selectedNodeData.creator}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Badge
                      className={`${getNodeColor(selectedNodeData)} text-white border-none`}
                    >
                      {selectedNodeData.verification_status}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-gray-500/30 text-gray-300"
                    >
                      {selectedNodeData.capsule_type}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Heart className="w-4 h-4 text-red-400" />
                      <span className="text-sm text-gray-300">
                        Grief Score: {selectedNodeData.grief_score}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-gray-300">
                        Influences: {selectedNodeData.influence_count}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-300">
                        {new Date(
                          selectedNodeData.created_at,
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-cyan-600"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-indigo-500/30"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Export Options */}
            <Card className="bg-black/40 backdrop-blur-xl border-indigo-500/20">
              <CardHeader>
                <CardTitle className="text-indigo-300 text-sm">
                  Export
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full border-indigo-500/30 text-indigo-300"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Graph
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
