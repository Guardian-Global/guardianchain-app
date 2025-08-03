import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const ReactFlow = dynamic(() => import("reactflow").then(mod => mod.default), { ssr: false });

export default function TruthNet() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    fetch("/api/truth-net")
      .then((res) => res.json())
      .then((data) => {
        setNodes(data.nodes);
        setEdges(data.edges);
      });
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🌐 TruthNet: Global Capsule Map</h1>
      <div className="h-[600px] border rounded">
        <ReactFlow nodes={nodes} edges={edges} fitView />
      </div>
    </div>
  );
}
