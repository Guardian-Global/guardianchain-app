import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  GitBranch, 
  Clock, 
  User, 
  ExternalLink, 
  ChevronRight,
  TreePine,
  Link as LinkIcon
} from 'lucide-react';
import { Link } from 'wouter';

interface LineageNode {
  id: string;
  title: string;
  author: string;
  date: string;
  griefScore?: number;
  generation: number;
  relationship: 'parent' | 'child' | 'sibling' | 'root';
  verificationStatus: 'verified' | 'pending' | 'unverified';
}

interface AncestryTreeProps {
  lineage: LineageNode[];
  currentCapsuleId: string;
}

export default function AncestryTree({ lineage, currentCapsuleId }: AncestryTreeProps) {
  const sortedLineage = [...lineage].sort((a, b) => a.generation - b.generation);
  const maxGeneration = Math.max(...lineage.map(node => node.generation));
  
  const getRelationshipColor = (relationship: string) => {
    switch (relationship) {
      case 'root': return 'bg-purple-600';
      case 'parent': return 'bg-blue-600';
      case 'child': return 'bg-green-600';
      case 'sibling': return 'bg-yellow-600';
      default: return 'bg-slate-600';
    }
  };

  const getVerificationIcon = (status: string) => {
    switch (status) {
      case 'verified': return '✓';
      case 'pending': return '⏳';
      default: return '○';
    }
  };

  const getVerificationColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <TreePine className="w-5 h-5 mr-2 text-green-400" />
          Capsule Thread Ancestry
        </CardTitle>
        <p className="text-slate-400 text-sm">
          Trace the lineage and connections of this memory capsule through its family tree
        </p>
      </CardHeader>
      
      <CardContent>
        {lineage.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <TreePine className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>This capsule has no ancestry connections</p>
            <p className="text-sm">It stands alone as an original memory</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Tree Statistics */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-white">{lineage.length}</div>
                <div className="text-xs text-slate-400">Total Nodes</div>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-white">{maxGeneration + 1}</div>
                <div className="text-xs text-slate-400">Generations</div>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-white">
                  {lineage.filter(node => node.verificationStatus === 'verified').length}
                </div>
                <div className="text-xs text-slate-400">Verified</div>
              </div>
            </div>

            {/* Ancestry Tree */}
            <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600">
              {sortedLineage.map((node, index) => (
                <div 
                  key={node.id} 
                  className={`relative flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    node.id === currentCapsuleId 
                      ? 'bg-blue-600/20 border border-blue-600/30' 
                      : 'bg-slate-700/30 hover:bg-slate-700/50'
                  }`}
                >
                  {/* Generation Indicator */}
                  <div className="flex items-center">
                    <div className="flex flex-col items-center mr-3">
                      <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-xs text-white font-bold">
                        G{node.generation}
                      </div>
                      {index < sortedLineage.length - 1 && (
                        <div className="w-0.5 h-6 bg-slate-600 mt-2"></div>
                      )}
                    </div>
                    
                    {/* Connection Line */}
                    <div className="flex items-center mr-3">
                      <GitBranch className="w-4 h-4 text-slate-500" />
                      <ChevronRight className="w-3 h-3 text-slate-500 ml-1" />
                    </div>
                  </div>

                  {/* Node Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge className={`${getRelationshipColor(node.relationship)} text-white text-xs`}>
                          {node.relationship}
                        </Badge>
                        <span className={`text-xs ${getVerificationColor(node.verificationStatus)}`}>
                          {getVerificationIcon(node.verificationStatus)}
                        </span>
                        {node.id === currentCapsuleId && (
                          <Badge className="bg-blue-600 text-white text-xs">
                            Current
                          </Badge>
                        )}
                      </div>
                      
                      {node.griefScore && (
                        <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
                          {node.griefScore}/10
                        </Badge>
                      )}
                    </div>
                    
                    <h4 className="text-white font-medium text-sm mb-1 truncate">
                      {node.title}
                    </h4>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-xs text-slate-400">
                        <div className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {node.author}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(node.date).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <Link href={`/capsule/${node.id}`}>
                        <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white h-6 px-2">
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Ancestry Actions */}
            <div className="border-t border-slate-700 pt-4 flex justify-between items-center">
              <div className="flex items-center text-xs text-slate-400">
                <LinkIcon className="w-3 h-3 mr-1" />
                <span>Connected memories preserve family legacy</span>
              </div>
              
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                  View Full Tree
                </Button>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Add Connection
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}