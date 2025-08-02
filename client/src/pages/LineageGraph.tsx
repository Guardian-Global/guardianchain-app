import React from 'react';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { apiRequest } from '@/lib/queryClient';
import { 
  GitBranch, 
  Eye, 
  TrendingUp, 
  Users, 
  Heart,
  Clock,
  Search,
  ExternalLink,
  Award,
  ArrowRight,
  CircleDot
} from 'lucide-react';

interface LineageNode {
  capsuleId: string;
  title: string;
  griefTier: number;
  influence: number;
  depth: number;
  children: LineageNode[];
  createdAt?: string;
  author?: string;
}

interface LineageMetrics {
  totalLineages: number;
  avgGriefFlow: number;
  topInfluencers: Array<{
    capsuleId: string;
    title: string;
    influenceScore: number;
    descendantCount: number;
  }>;
}

export default function LineageGraph() {
  const { user, isAuthenticated } = useAuth();
  const [searchId, setSearchId] = useState('');
  const [selectedNode, setSelectedNode] = useState<LineageNode | null>(null);

  // Fetch lineage tree
  const { data: lineageTree, isLoading: treeLoading } = useQuery({
    queryKey: ['/api/lineage/tree', searchId || 'root'],
    enabled: !!searchId || true,
    refetchInterval: 30000
  });

  // Fetch lineage analytics
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['/api/lineage/analytics'],
    refetchInterval: 30000
  });

  const renderLineageNode = (node: LineageNode, level: number = 0) => {
    const indentStyle = level > 0 ? { marginLeft: `${Math.min(level * 16, 64)}px` } : {};
    
    return (
      <div key={node.capsuleId} style={indentStyle} className="mb-4">
        <Card 
          className={`bg-black/40 backdrop-blur-xl border-blue-500/20 cursor-pointer transition-all hover:border-blue-400/40 ${
            selectedNode?.capsuleId === node.capsuleId ? 'ring-2 ring-blue-400/50' : ''
          }`}
          onClick={() => setSelectedNode(node)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <CircleDot className={`w-4 h-4 ${
                  node.griefTier >= 4 ? 'text-red-400' : 
                  node.griefTier >= 2 ? 'text-yellow-400' : 'text-green-400'
                }`} />
                <h3 className="font-semibold text-white truncate">
                  {node.title || `Capsule ${node.capsuleId.slice(0, 8)}...`}
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                  Grief {node.griefTier}
                </Badge>
                <Badge variant="outline" className="border-blue-500/30 text-blue-300">
                  {node.influence}% Influence
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-400">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <GitBranch className="w-3 h-3 mr-1" />
                  {node.children.length} descendants
                </span>
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  Depth {node.depth}
                </span>
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-blue-400 hover:text-blue-300"
                onClick={(e) => {
                  e.stopPropagation();
                  // Would open capsule details
                }}
              >
                <Eye className="w-3 h-3 mr-1" />
                View
              </Button>
            </div>
            
            {level < 3 && (
              <div className="mt-3 pl-4 border-l border-gray-600">
                {node.children.map(child => renderLineageNode(child, level + 1))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Truth Lineage Graph
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Visualize how memories, trauma, and truth propagate through society. 
            Explore the cryptographic family tree of human experience.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Lineage Tree Visualization */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Search Controls */}
            <Card className="bg-black/40 backdrop-blur-xl border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-300 flex items-center">
                  <Search className="w-6 h-6 mr-2" />
                  Explore Lineage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <Input
                    placeholder="Enter capsule ID to trace lineage..."
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    className="bg-slate-800/50 border-blue-500/30 text-white placeholder:text-gray-400"
                  />
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => setSearchId('root')}
                  >
                    Show Root Tree
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Lineage Tree */}
            <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-2xl text-purple-300 flex items-center">
                  <GitBranch className="w-6 h-6 mr-2" />
                  Memory Inheritance Tree
                </CardTitle>
              </CardHeader>
              <CardContent>
                {treeLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-gray-400">Loading lineage tree...</p>
                  </div>
                ) : lineageTree ? (
                  <div className="max-h-96 overflow-y-auto">
                    {renderLineageNode(lineageTree)}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <GitBranch className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No lineage data found. Start by searching for a capsule ID.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Analytics Sidebar */}
          <div className="space-y-6">
            
            {/* Selected Node Details */}
            {selectedNode && (
              <Card className="bg-black/40 backdrop-blur-xl border-green-500/20">
                <CardHeader>
                  <CardTitle className="text-xl text-green-300 flex items-center">
                    <Eye className="w-5 h-5 mr-2" />
                    Capsule Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400">Title</p>
                    <p className="text-white font-medium">{selectedNode.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Capsule ID</p>
                    <p className="text-blue-300 text-sm font-mono">{selectedNode.capsuleId}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-gray-400">Grief Tier</p>
                      <p className="text-white">{selectedNode.griefTier}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Influence</p>
                      <p className="text-white">{selectedNode.influence}%</p>
                    </div>
                  </div>
                  <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                    <ExternalLink className="w-3 h-3 mr-2" />
                    View Full Capsule
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Network Analytics */}
            <Card className="bg-black/40 backdrop-blur-xl border-yellow-500/20">
              <CardHeader>
                <CardTitle className="text-xl text-yellow-300 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Network Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analyticsLoading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin w-6 h-6 border-4 border-yellow-500 border-t-transparent rounded-full mx-auto mb-2" />
                    <p className="text-sm text-gray-400">Loading analytics...</p>
                  </div>
                ) : analytics ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-300">{analytics.totalLineages}</p>
                        <p className="text-xs text-gray-400">Total Lineages</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-300">{analytics.avgGriefFlow.toFixed(1)}</p>
                        <p className="text-xs text-gray-400">Avg Grief Flow</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">Analytics unavailable</p>
                )}
              </CardContent>
            </Card>

            {/* Top Influencers */}
            <Card className="bg-black/40 backdrop-blur-xl border-orange-500/20">
              <CardHeader>
                <CardTitle className="text-xl text-orange-300 flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Top Influencers
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analytics?.topInfluencers ? (
                  <div className="space-y-3">
                    {analytics.topInfluencers.slice(0, 5).map((influencer, index) => (
                      <div key={influencer.capsuleId} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === 0 ? 'bg-yellow-500 text-black' :
                            index === 1 ? 'bg-gray-400 text-black' :
                            index === 2 ? 'bg-orange-600 text-white' :
                            'bg-gray-600 text-white'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium truncate">
                              {influencer.title || `Capsule ${influencer.capsuleId.slice(0, 8)}...`}
                            </p>
                            <p className="text-xs text-gray-400">
                              {influencer.descendantCount} descendants
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="border-orange-500/30 text-orange-300 text-xs">
                          {influencer.influenceScore}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No influencer data available</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}