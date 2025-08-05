import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { CapsuleLineageGraph } from '../CapsuleLineageGraph';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Network, GitBranch, Award } from 'lucide-react';

interface ProfileCapsuleLineageProps {
  capsuleId: string;
  userId?: string;
}

interface LineageData {
  nodes: Array<{
    id: string;
    title: string;
    author: string;
    createdAt: string;
    verified: boolean;
    daoCertified: boolean;
    parentId?: string;
    children?: string[];
  }>;
  relationships: Array<{
    from: string;
    to: string;
    relationship: 'parent' | 'reference' | 'verification';
  }>;
  stats: {
    totalNodes: number;
    verifiedNodes: number;
    daoCertifiedNodes: number;
    maxDepth: number;
  };
}

export default function ProfileCapsuleLineage({ 
  capsuleId, 
  userId 
}: ProfileCapsuleLineageProps) {
  const { data: lineageData, isLoading, error } = useQuery<LineageData>({
    queryKey: ['/api/capsule/lineage', capsuleId],
    enabled: !!capsuleId,
  });

  if (isLoading) {
    return (
      <Card className="w-full bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cyan-400">
            <Network className="w-5 h-5" />
            Capsule Lineage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !lineageData) {
    return (
      <Card className="w-full bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cyan-400">
            <Network className="w-5 h-5" />
            Capsule Lineage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-slate-400">
            <p>No lineage data available for this capsule.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleNodeClick = (nodeId: string) => {
    // Navigate to capsule detail or open in modal
    window.open(`/capsule/${nodeId}`, '_blank');
  };

  return (
    <Card className="w-full bg-slate-900 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-cyan-400">
            <Network className="w-5 h-5" />
            Capsule Lineage Network
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-slate-300 border-slate-600">
              <GitBranch className="w-3 h-3 mr-1" />
              {lineageData.stats.totalNodes} nodes
            </Badge>
            {lineageData.stats.daoCertifiedNodes > 0 && (
              <Badge variant="outline" className="text-purple-400 border-purple-600">
                <Award className="w-3 h-3 mr-1" />
                {lineageData.stats.daoCertifiedNodes} DAO certified
              </Badge>
            )}
          </div>
        </div>
        <p className="text-sm text-slate-400">
          Interactive graph showing capsule relationships, verification trails, and DAO certifications
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Lineage Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
              <div className="text-lg font-semibold text-cyan-400">
                {lineageData.stats.totalNodes}
              </div>
              <div className="text-xs text-slate-400">Total Capsules</div>
            </div>
            <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
              <div className="text-lg font-semibold text-green-400">
                {lineageData.stats.verifiedNodes}
              </div>
              <div className="text-xs text-slate-400">Verified</div>
            </div>
            <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
              <div className="text-lg font-semibold text-purple-400">
                {lineageData.stats.daoCertifiedNodes}
              </div>
              <div className="text-xs text-slate-400">DAO Certified</div>
            </div>
            <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
              <div className="text-lg font-semibold text-magenta-400">
                {lineageData.stats.maxDepth}
              </div>
              <div className="text-xs text-slate-400">Max Depth</div>
            </div>
          </div>

          {/* Interactive Lineage Graph */}
          <div className="border border-slate-700 rounded-lg overflow-hidden">
            <CapsuleLineageGraph
              data={lineageData}
              height="500px"
              onNodeClick={handleNodeClick}
            />
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-3 h-1 bg-cyan-400 rounded"></div>
              <span>Parent Relationship</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-1 bg-magenta-400 rounded"></div>
              <span>Reference Link</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-1 bg-purple-400 rounded animate-pulse"></div>
              <span>Verification Trail</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>DAO Certified</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export { ProfileCapsuleLineage };