import React, { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Network, GitBranch, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface LineageNode {
  id: string;
  title: string;
  x: number;
  y: number;
  createdAt: Date | null;
}

interface LineageEdge {
  id: string;
  source: string;
  target: string;
  createdAt: Date | null;
}

interface LineageGraphData {
  nodes: LineageNode[];
  edges: LineageEdge[];
}

interface LineageVisualizerProps {
  className?: string;
}

export default function LineageVisualizer({ className }: LineageVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const { data: graphData, isLoading } = useQuery<{
    success: boolean;
    graph: LineageGraphData;
  }>({
    queryKey: ["/api/lineage/graph"],
  });

  useEffect(() => {
    if (!graphData?.graph || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dark theme styling
    ctx.fillStyle = "#0f172a"; // slate-900
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const { nodes, edges } = graphData.graph;

    // Draw edges first (so they appear behind nodes)
    ctx.strokeStyle = "#475569"; // slate-600
    ctx.lineWidth = 2;
    
    edges.forEach(edge => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);
      
      if (sourceNode && targetNode) {
        ctx.beginPath();
        ctx.moveTo(sourceNode.x, sourceNode.y);
        ctx.lineTo(targetNode.x, targetNode.y);
        ctx.stroke();
        
        // Draw arrow head
        const angle = Math.atan2(targetNode.y - sourceNode.y, targetNode.x - sourceNode.x);
        const headLength = 10;
        
        ctx.beginPath();
        ctx.moveTo(targetNode.x, targetNode.y);
        ctx.lineTo(
          targetNode.x - headLength * Math.cos(angle - Math.PI / 6),
          targetNode.y - headLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(targetNode.x, targetNode.y);
        ctx.lineTo(
          targetNode.x - headLength * Math.cos(angle + Math.PI / 6),
          targetNode.y - headLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();
      }
    });

    // Draw nodes
    nodes.forEach(node => {
      // Node circle
      ctx.fillStyle = "#1e293b"; // slate-800
      ctx.strokeStyle = "#facc15"; // yellow-400
      ctx.lineWidth = 3;
      
      ctx.beginPath();
      ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      
      // Node text
      ctx.fillStyle = "#f1f5f9"; // slate-100
      ctx.font = "12px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(
        node.title.length > 10 ? node.title.substring(0, 10) + "..." : node.title,
        node.x,
        node.y + 35
      );
    });

  }, [graphData]);

  if (isLoading) {
    return (
      <Card className={`bg-slate-800 border-slate-700 ${className}`}>
        <CardHeader>
          <CardTitle className="text-yellow-400 flex items-center gap-2">
            <GitBranch className="w-5 h-5" />
            Truth Lineage Graph
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-slate-800 border-slate-700 ${className}`}>
      <CardHeader>
        <CardTitle className="text-yellow-400 flex items-center gap-2">
          <GitBranch className="w-5 h-5" />
          Truth Lineage Graph
        </CardTitle>
        <p className="text-slate-400 text-sm">
          Visual representation of truth capsule inheritance patterns
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Network className="w-4 h-4 text-blue-400" />
                <span className="text-slate-300 text-sm">Nodes</span>
              </div>
              <p className="text-xl font-bold text-blue-400">
                {graphData?.graph.nodes.length || 0}
              </p>
            </div>
            <div className="bg-slate-900 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-green-400" />
                <span className="text-slate-300 text-sm">Connections</span>
              </div>
              <p className="text-xl font-bold text-green-400">
                {graphData?.graph.edges.length || 0}
              </p>
            </div>
          </div>

          {/* Canvas */}
          <div className="relative">
            <canvas
              ref={canvasRef}
              className="w-full h-64 border border-slate-600 rounded-lg"
              style={{ background: "#0f172a" }}
            />
            {(!graphData?.graph.nodes.length) && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Clock className="w-12 h-12 text-slate-500 mx-auto mb-2" />
                  <p className="text-slate-400">No lineage data yet</p>
                  <p className="text-slate-500 text-sm">Create connected capsules to see relationships</p>
                </div>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-slate-800 border-2 border-yellow-400 rounded-full"></div>
              <span>Truth Capsule</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-slate-600"></div>
              <span>Inheritance Link</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}