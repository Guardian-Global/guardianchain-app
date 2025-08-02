import React, { useState, useEffect } from 'react';
import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  GitBranch, 
  Eye, 
  Heart, 
  Share2, 
  ArrowUp, 
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Maximize2,
  Search,
  Filter
} from 'lucide-react';

interface LineageNode {
  id: string;
  title: string;
  author: string;
  createdAt: string;
  griefScore: number;
  type: 'original' | 'inspired' | 'response' | 'evolution';
  connections: {
    parents: string[];
    children: string[];
    influences: string[];
  };
  metadata: {
    viewCount: number;
    likeCount: number;
    shareCount: number;
    verificationLevel: string;
  };
}

interface LineageGraph {
  rootCapsule: LineageNode;
  nodes: LineageNode[];
  edges: {
    from: string;
    to: string;
    type: 'inspired_by' | 'responds_to' | 'evolves_from' | 'influences';
    strength: number;
  }[];
  stats: {
    totalNodes: number;
    maxDepth: number;
    totalInfluence: number;
    lineageScore: number;
  };
}

export default function CapsuleLineage() {
  const params = useParams();
  const capsuleId = params.id;
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'tree' | 'network' | 'timeline'>('tree');
  const [zoomLevel, setZoomLevel] = useState(100);

  const { data: lineageData, isLoading } = useQuery<LineageGraph>({
    queryKey: ['/api/capsules', capsuleId, 'lineage'],
    enabled: !!capsuleId
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!lineageData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto text-center py-12">
          <GitBranch className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2">Lineage Not Found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            This capsule doesn't have lineage data available.
          </p>
        </div>
      </div>
    );
  }

  const getNodeTypeColor = (type: string) => {
    switch (type) {
      case 'original': return 'bg-blue-500';
      case 'inspired': return 'bg-green-500';
      case 'response': return 'bg-yellow-500';
      case 'evolution': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getNodeTypeLabel = (type: string) => {
    switch (type) {
      case 'original': return 'Original';
      case 'inspired': return 'Inspired';
      case 'response': return 'Response';
      case 'evolution': return 'Evolution';
      default: return 'Unknown';
    }
  };

  const renderTreeView = () => (
    <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 min-h-96 overflow-auto">
      <div className="flex flex-col items-center space-y-8">
        {/* Root Node */}
        <div className="relative">
          <Card 
            className={`cursor-pointer transition-all transform hover:scale-105 ${
              selectedNode === lineageData.rootCapsule.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedNode(lineageData.rootCapsule.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full ${getNodeTypeColor(lineageData.rootCapsule.type)}`} />
                <div>
                  <h4 className="font-semibold">{lineageData.rootCapsule.title}</h4>
                  <p className="text-sm text-gray-500">{lineageData.rootCapsule.author}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Connection Lines and Child Nodes */}
        {lineageData.nodes.filter(node => 
          lineageData.rootCapsule.connections.children.includes(node.id)
        ).length > 0 && (
          <>
            <div className="w-px h-8 bg-gray-300 dark:bg-gray-600" />
            <div className="flex space-x-8">
              {lineageData.nodes
                .filter(node => lineageData.rootCapsule.connections.children.includes(node.id))
                .map((node) => (
                  <div key={node.id} className="flex flex-col items-center">
                    <Card 
                      className={`cursor-pointer transition-all transform hover:scale-105 ${
                        selectedNode === node.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => setSelectedNode(node.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${getNodeTypeColor(node.type)}`} />
                          <div>
                            <h5 className="font-medium text-sm">{node.title}</h5>
                            <p className="text-xs text-gray-500">{node.author}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );

  const renderNetworkView = () => (
    <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 min-h-96">
      <div className="text-center text-gray-500 mt-20">
        <GitBranch className="w-16 h-16 mx-auto mb-4" />
        <p>Network visualization coming soon</p>
        <p className="text-sm">This will show the full network graph of influences and connections</p>
      </div>
    </div>
  );

  const renderTimelineView = () => (
    <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 min-h-96">
      <div className="space-y-6">
        {lineageData.nodes
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
          .map((node, index) => (
            <div key={node.id} className="flex items-center space-x-4">
              <div className="flex flex-col items-center">
                <div className={`w-4 h-4 rounded-full ${getNodeTypeColor(node.type)}`} />
                {index < lineageData.nodes.length - 1 && (
                  <div className="w-px h-12 bg-gray-300 dark:bg-gray-600 mt-2" />
                )}
              </div>
              <Card 
                className={`flex-1 cursor-pointer transition-all hover:shadow-md ${
                  selectedNode === node.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedNode(node.id)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{node.title}</h4>
                      <p className="text-sm text-gray-500">{node.author}</p>
                      <Badge variant="outline" className="mt-1">
                        {getNodeTypeLabel(node.type)}
                      </Badge>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <p>{new Date(node.createdAt).toLocaleDateString()}</p>
                      <p>Grief: {node.griefScore}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
      </div>
    </div>
  );

  const selectedNodeData = selectedNode 
    ? lineageData.nodes.find(n => n.id === selectedNode) || lineageData.rootCapsule
    : lineageData.rootCapsule;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <GitBranch className="w-12 h-12 text-purple-500 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Truth Lineage
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore the connections and influences between truth capsules.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{lineageData.stats.totalNodes}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Connected Capsules</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{lineageData.stats.maxDepth}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Max Depth</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{lineageData.stats.totalInfluence}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Influence</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{lineageData.stats.lineageScore}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Lineage Score</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Visualization */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <GitBranch className="w-5 h-5 mr-2" />
                    Lineage Visualization
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      variant={viewMode === 'tree' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('tree')}
                    >
                      Tree
                    </Button>
                    <Button
                      variant={viewMode === 'network' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('network')}
                    >
                      Network
                    </Button>
                    <Button
                      variant={viewMode === 'timeline' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('timeline')}
                    >
                      Timeline
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {viewMode === 'tree' && renderTreeView()}
                {viewMode === 'network' && renderNetworkView()}
                {viewMode === 'timeline' && renderTimelineView()}
              </CardContent>
            </Card>
          </div>

          {/* Selected Node Details */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Capsule Details</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedNodeData && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">{selectedNodeData.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        by {selectedNodeData.author}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${getNodeTypeColor(selectedNodeData.type)}`} />
                      <Badge variant="outline">
                        {getNodeTypeLabel(selectedNodeData.type)}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Created:</span>
                        <span>{new Date(selectedNodeData.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Grief Score:</span>
                        <span>{selectedNodeData.griefScore}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Verification:</span>
                        <span>{selectedNodeData.metadata.verificationLevel}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          <span>Views</span>
                        </div>
                        <span>{selectedNodeData.metadata.viewCount}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <Heart className="w-4 h-4 mr-1" />
                          <span>Likes</span>
                        </div>
                        <span>{selectedNodeData.metadata.likeCount}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <Share2 className="w-4 h-4 mr-1" />
                          <span>Shares</span>
                        </div>
                        <span>{selectedNodeData.metadata.shareCount}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Connections</h4>
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between">
                          <span>Parents:</span>
                          <span>{selectedNodeData.connections.parents.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Children:</span>
                          <span>{selectedNodeData.connections.children.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Influences:</span>
                          <span>{selectedNodeData.connections.influences.length}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button className="w-full" size="sm">
                        View Full Capsule
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}