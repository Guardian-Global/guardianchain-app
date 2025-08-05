import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Connection,
  ConnectionMode,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

interface LineageNode {
  id: string;
  title: string;
  author: string;
  createdAt: string;
  verified: boolean;
  daoCertified: boolean;
  parentId?: string;
  children?: string[];
}

interface LineageData {
  nodes: LineageNode[];
  relationships: Array<{
    from: string;
    to: string;
    relationship: 'parent' | 'reference' | 'verification';
  }>;
}

interface CapsuleLineageGraphProps {
  data: LineageData;
  height?: string;
  onNodeClick?: (nodeId: string) => void;
}

// Custom node component for capsules
const CapsuleNode = ({ data }: { data: any }) => {
  return (
    <div className="px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg min-w-[200px] max-w-[300px]">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-sm text-white truncate pr-2">
          {data.title}
        </h3>
        <div className="flex gap-1 flex-shrink-0">
          {data.verified && (
            <div className="w-2 h-2 bg-green-400 rounded-full" title="Verified" />
          )}
          {data.daoCertified && (
            <div className="w-2 h-2 bg-purple-400 rounded-full" title="DAO Certified" />
          )}
        </div>
      </div>
      <p className="text-xs text-slate-400 mb-1">by {data.author}</p>
      <p className="text-xs text-slate-500">
        {new Date(data.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
};

const nodeTypes = {
  capsule: CapsuleNode,
};

export function CapsuleLineageGraph({ 
  data, 
  height = "400px", 
  onNodeClick 
}: CapsuleLineageGraphProps) {
  // Convert lineage data to ReactFlow format
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = data.nodes.map((node, index) => ({
      id: node.id,
      type: 'capsule',
      position: { 
        x: (index % 3) * 300 + 100, 
        y: Math.floor(index / 3) * 150 + 100 
      },
      data: {
        title: node.title,
        author: node.author,
        createdAt: node.createdAt,
        verified: node.verified,
        daoCertified: node.daoCertified,
      },
    }));

    const edges: Edge[] = data.relationships.map((rel, index) => ({
      id: `edge-${index}`,
      source: rel.from,
      target: rel.to,
      type: 'default',
      animated: rel.relationship === 'verification',
      style: {
        stroke: rel.relationship === 'parent' 
          ? '#00ffe1' 
          : rel.relationship === 'reference' 
          ? '#ff00d4' 
          : '#7c3aed',
        strokeWidth: 2,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: rel.relationship === 'parent' 
          ? '#00ffe1' 
          : rel.relationship === 'reference' 
          ? '#ff00d4' 
          : '#7c3aed',
      },
      label: rel.relationship,
      labelStyle: { 
        fontSize: 10, 
        color: '#94a3b8',
        backgroundColor: '#1e293b',
        padding: '2px 4px',
        borderRadius: '4px',
      },
    }));

    return { initialNodes: nodes, initialEdges: edges };
  }, [data]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClickHandler = useCallback(
    (event: React.MouseEvent, node: Node) => {
      onNodeClick?.(node.id);
    },
    [onNodeClick]
  );

  return (
    <div style={{ height }} className="bg-slate-900 rounded-lg border border-slate-700">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClickHandler}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        attributionPosition="bottom-left"
        className="bg-slate-900"
      >
        <Background 
          color="#475569" 
          gap={20} 
          size={1}
          className="bg-slate-900"
        />
        <Controls 
          className="bg-slate-800 border-slate-600 text-white"
          showZoom={true}
          showFitView={true}
          showInteractive={false}
        />
        <MiniMap 
          nodeColor="#64748b"
          nodeStrokeColor="#94a3b8"
          nodeStrokeWidth={2}
          maskColor="rgba(15, 23, 42, 0.8)"
          className="bg-slate-800 border border-slate-600"
        />
      </ReactFlow>
    </div>
  );
}

export default CapsuleLineageGraph;