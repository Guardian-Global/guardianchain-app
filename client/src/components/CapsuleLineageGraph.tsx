import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  MarkerType,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';

interface LineageData {
  nodes: Array<{
    id: string;
    title: string;
    author: string;
    createdAt: string;
    verified: boolean;
    daoCertified: boolean;
  }>;
  relationships: Array<{
    from: string;
    to: string;
    relationship: string;
    strength?: number;
  }>;
  stats: {
    totalNodes: number;
    verifiedNodes: number;
    daoCertifiedNodes: number;
    maxDepth: number;
  };
  centerNode?: string;
}

interface CapsuleLineageGraphProps {
  data: LineageData;
  height?: string;
  onNodeClick?: (nodeId: string) => void;
}

// Custom node component for capsules
const CapsuleNode = ({ data }: { data: any }) => {
  return (
    <div className={`
      px-4 py-3 rounded-lg border-2 min-w-[200px] max-w-[250px]
      ${data.daoCertified 
        ? 'bg-purple-900/40 border-purple-500' 
        : data.verified 
          ? 'bg-green-900/40 border-green-500'
          : 'bg-slate-800 border-slate-600'
      }
      hover:shadow-lg transition-all duration-200
    `}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-white text-sm truncate">
          {data.title}
        </h3>
        <div className="flex gap-1">
          {data.verified && (
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          )}
          {data.daoCertified && (
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
          )}
        </div>
      </div>
      <p className="text-xs text-slate-400 truncate">by {data.author}</p>
      <p className="text-xs text-slate-500 mt-1">
        {new Date(data.createdAt).toLocaleDateString()}
      </p>
      
      {/* Connection handles */}
      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-cyan-400 rounded-full opacity-0 hover:opacity-100"></div>
      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-cyan-400 rounded-full opacity-0 hover:opacity-100"></div>
      <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-cyan-400 rounded-full opacity-0 hover:opacity-100"></div>
      <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-cyan-400 rounded-full opacity-0 hover:opacity-100"></div>
    </div>
  );
};

const nodeTypes = {
  capsule: CapsuleNode,
};

export function CapsuleLineageGraph({ 
  data, 
  height = "500px", 
  onNodeClick 
}: CapsuleLineageGraphProps) {
  // Convert lineage data to ReactFlow format
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = data.nodes.map((node, index) => {
      const isCenter = node.id === data.centerNode;
      
      return {
        id: node.id,
        type: 'capsule',
        position: isCenter 
          ? { x: 400, y: 300 } // Center the main node
          : { 
              x: 200 + (index % 3) * 300, 
              y: 100 + Math.floor(index / 3) * 150 
            },
        data: {
          ...node,
          isCenter,
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      };
    });

    const edges: Edge[] = data.relationships.map((rel, index) => ({
      id: `edge-${index}`,
      source: rel.from,
      target: rel.to,
      type: 'smoothstep',
      animated: rel.relationship === 'verification',
      style: {
        stroke: rel.relationship === 'verification' 
          ? '#a855f7' 
          : rel.relationship === 'reference' 
            ? '#ec4899' 
            : '#06b6d4',
        strokeWidth: Math.max(1, (rel.strength || 0.5) * 3),
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: rel.relationship === 'verification' 
          ? '#a855f7' 
          : rel.relationship === 'reference' 
            ? '#ec4899' 
            : '#06b6d4',
      },
      label: rel.relationship,
      labelStyle: {
        fontSize: '10px',
        fill: '#94a3b8',
      },
    }));

    return { initialNodes: nodes, initialEdges: edges };
  }, [data]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      if (onNodeClick) {
        onNodeClick(node.id);
      }
    },
    [onNodeClick]
  );

  return (
    <div style={{ height }} className="bg-slate-950 rounded-lg border border-slate-700">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{
          padding: 50,
          includeHiddenNodes: false,
        }}
        attributionPosition="bottom-left"
        className="rounded-lg"
      >
        <Controls 
          className="bg-slate-800 border-slate-600 text-slate-200"
          style={{
            button: {
              backgroundColor: '#1e293b',
              color: '#e2e8f0',
              border: '1px solid #475569',
            }
          }}
        />
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1}
          color="#334155"
        />
        
        {/* Overlay with stats */}
        <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur rounded-lg p-3 border border-slate-700">
          <h4 className="text-sm font-semibold text-cyan-400 mb-2">Network Stats</h4>
          <div className="space-y-1 text-xs text-slate-300">
            <div>Total Nodes: {data.stats.totalNodes}</div>
            <div>Verified: {data.stats.verifiedNodes}</div>
            <div>DAO Certified: {data.stats.daoCertifiedNodes}</div>
            <div>Max Depth: {data.stats.maxDepth}</div>
          </div>
        </div>
      </ReactFlow>
    </div>
  );
}

export default CapsuleLineageGraph;