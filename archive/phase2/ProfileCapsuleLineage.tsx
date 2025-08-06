import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CapsuleLineageGraph from '../CapsuleLineageGraph';
import { 
  GitBranch, 
  Network, 
  Award, 
  Shield, 
  TrendingUp,
  Eye,
  Users,
  Activity
} from 'lucide-react';

interface ProfileCapsuleLineageProps {
  capsuleId: string;
  userId: string;
}

interface LineageNode {
  id: string;
  title: string;
  author: string;
  createdAt: string;
  verified: boolean;
  daoCertified: boolean;
}

interface LineageRelationship {
  from: string;
  to: string;
  relationship: string;
  strength: number;
}

interface LineageData {
  nodes: LineageNode[];
  relationships: LineageRelationship[];
  stats: {
    totalNodes: number;
    verifiedNodes: number;
    daoCertifiedNodes: number;
    maxDepth: number;
  };
  centerNode: string;
}

export default function ProfileCapsuleLineage({ 
  capsuleId, 
  userId 
}: ProfileCapsuleLineageProps) {
  const [viewMode, setViewMode] = useState<'graph' | 'list'>('graph');

  // Fetch lineage data for specific capsule
  const { data: lineageData, isLoading } = useQuery<LineageData>({
    queryKey: ['/api/capsule', capsuleId, 'lineage'],
    enabled: !!capsuleId,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-700 rounded mb-4"></div>
          <div className="h-64 bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!lineageData || lineageData.nodes.length === 0) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-8 text-center">
          <Network className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-400 mb-2">No Lineage Data</h3>
          <p className="text-slate-500">
            This capsule doesn't have any lineage relationships yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleNodeClick = (nodeId: string) => {
    window.open(`/capsule/${nodeId}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Lineage Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-cyan-400">{lineageData.stats.totalNodes}</div>
            <div className="text-xs text-slate-400">Connected Nodes</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{lineageData.stats.verifiedNodes}</div>
            <div className="text-xs text-slate-400">Verified</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{lineageData.stats.daoCertifiedNodes}</div>
            <div className="text-xs text-slate-400">DAO Certified</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">{lineageData.stats.maxDepth}</div>
            <div className="text-xs text-slate-400">Max Depth</div>
          </CardContent>
        </Card>
      </div>

      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-cyan-400">Lineage Network Visualization</h3>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={viewMode === 'graph' ? 'default' : 'outline'}
            onClick={() => setViewMode('graph')}
            className="text-cyan-400 border-cyan-600"
          >
            <Network className="w-4 h-4 mr-1" />
            Graph
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'list' ? 'default' : 'outline'}
            onClick={() => setViewMode('list')}
            className="text-cyan-400 border-cyan-600"
          >
            <Activity className="w-4 h-4 mr-1" />
            List
          </Button>
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'graph' ? (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center gap-2">
              <GitBranch className="w-5 h-5" />
              Interactive Lineage Graph
            </CardTitle>
            <p className="text-slate-400 text-sm">
              Click and drag nodes to explore relationships. Hover over connections to see relationship types.
            </p>
          </CardHeader>
          <CardContent>
            <CapsuleLineageGraph 
              data={lineageData}
              height="600px"
              onNodeClick={handleNodeClick}
            />
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Lineage Relationships
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lineageData.relationships.map((rel, index) => {
                const sourceNode = lineageData.nodes.find(n => n.id === rel.from);
                const targetNode = lineageData.nodes.find(n => n.id === rel.to);
                
                return (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-white">{sourceNode?.title}</h4>
                          {sourceNode?.verified && <Shield className="w-4 h-4 text-green-400" />}
                          {sourceNode?.daoCertified && <Award className="w-4 h-4 text-purple-400" />}
                        </div>
                        <p className="text-xs text-slate-400">by {sourceNode?.author}</p>
                      </div>
                      
                      <div className="flex items-center gap-2 px-3">
                        <div className="h-px bg-slate-600 flex-1 w-8"></div>
                        <Badge variant="outline" className="text-cyan-400 border-cyan-600">
                          {rel.relationship}
                        </Badge>
                        <div className="h-px bg-slate-600 flex-1 w-8"></div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-white">{targetNode?.title}</h4>
                          {targetNode?.verified && <Shield className="w-4 h-4 text-green-400" />}
                          {targetNode?.daoCertified && <Award className="w-4 h-4 text-purple-400" />}
                        </div>
                        <p className="text-xs text-slate-400">by {targetNode?.author}</p>
                      </div>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleNodeClick(targetNode?.id || '')}
                      className="text-cyan-400 border-cyan-600"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Relationship Legend */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-sm text-slate-400">Relationship Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-slate-300">Verification</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
              <span className="text-slate-300">Reference</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
              <span className="text-slate-300">Fork/Derive</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-slate-300">Edit/Update</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}