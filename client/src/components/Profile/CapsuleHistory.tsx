import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, Calendar, Eye, Share2, Vote, 
  CheckCircle, Clock, AlertCircle, XCircle 
} from 'lucide-react';
import { BRAND_COLORS, BRAND_NAME } from '@/lib/constants';
import { CapsuleType } from '@/types/capsule';

interface CapsuleHistoryItem {
  id: string;
  title: string;
  type: CapsuleType;
  status: 'draft' | 'pending' | 'verified' | 'rejected';
  createdAt: string;
  stats: {
    views: number;
    shares: number;
    votes: number;
  };
  griefScore: number;
  truthYield: number;
}

interface CapsuleHistoryProps {
  userAddress?: string;
  capsules?: CapsuleHistoryItem[];
}

const defaultCapsules: CapsuleHistoryItem[] = [
  {
    id: "cap-001",
    title: "First Truth Capsule - Platform Introduction",
    type: "STANDARD",
    status: "verified",
    createdAt: "2024-07-01",
    stats: { views: 2847, shares: 45, votes: 23 },
    griefScore: 95,
    truthYield: 127.5
  },
  {
    id: "cap-002",
    title: "Evidence of Corporate Fraud Case #2024-001",
    type: "FRAUD_PROOF",
    status: "verified",
    createdAt: "2024-07-15",
    stats: { views: 5231, shares: 128, votes: 67 },
    griefScore: 88,
    truthYield: 445.2
  },
  {
    id: "cap-003",
    title: "AI-Generated Content Verification Study",
    type: "AI_GENERATED",
    status: "pending",
    createdAt: "2024-07-20",
    stats: { views: 892, shares: 12, votes: 8 },
    griefScore: 92,
    truthYield: 78.3
  },
  {
    id: "cap-004",
    title: "Witness Account: Traffic Incident Documentation",
    type: "WITNESS_TESTIMONY",
    status: "verified",
    createdAt: "2024-07-18",
    stats: { views: 1456, shares: 34, votes: 19 },
    griefScore: 91,
    truthYield: 156.8
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'verified': return <CheckCircle className="w-4 h-4 text-green-400" />;
    case 'pending': return <Clock className="w-4 h-4 text-yellow-400" />;
    case 'rejected': return <XCircle className="w-4 h-4 text-red-400" />;
    default: return <AlertCircle className="w-4 h-4 text-gray-400" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'verified': return 'bg-green-600/20 text-green-400';
    case 'pending': return 'bg-yellow-600/20 text-yellow-400';
    case 'rejected': return 'bg-red-600/20 text-red-400';
    default: return 'bg-gray-600/20 text-gray-400';
  }
};

const getTypeColor = (type: CapsuleType) => {
  switch (type) {
    case 'FRAUD_PROOF': return 'bg-red-600/20 text-red-400';
    case 'WITNESS_TESTIMONY': return 'bg-orange-600/20 text-orange-400';
    case 'AI_GENERATED': return 'bg-cyan-600/20 text-cyan-400';
    case 'VERITAS_CERTIFICATE': return 'bg-purple-600/20 text-purple-400';
    default: return 'bg-blue-600/20 text-blue-400';
  }
};

export default function CapsuleHistory({ userAddress, capsules = defaultCapsules }: CapsuleHistoryProps) {
  const totalViews = capsules.reduce((sum, cap) => sum + cap.stats.views, 0);
  const totalShares = capsules.reduce((sum, cap) => sum + cap.stats.shares, 0);
  const verifiedCount = capsules.filter(cap => cap.status === 'verified').length;
  const totalYield = capsules.reduce((sum, cap) => sum + cap.truthYield, 0);

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-lg" style={{ backgroundColor: `${BRAND_COLORS.GUARDIAN}20` }}>
            <FileText className="h-5 w-5" style={{ color: BRAND_COLORS.GUARDIAN }} />
          </div>
          <div>
            <span className="text-white">Capsule History</span>
            <div className="text-sm text-slate-400">{capsules.length} total capsules created</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-slate-700/30 rounded-lg">
            <div className="text-lg font-bold text-white">{totalViews.toLocaleString()}</div>
            <div className="text-xs text-slate-400">Total Views</div>
          </div>
          <div className="text-center p-3 bg-slate-700/30 rounded-lg">
            <div className="text-lg font-bold text-white">{totalShares}</div>
            <div className="text-xs text-slate-400">Total Shares</div>
          </div>
          <div className="text-center p-3 bg-slate-700/30 rounded-lg">
            <div className="text-lg font-bold text-green-400">{verifiedCount}</div>
            <div className="text-xs text-slate-400">Verified</div>
          </div>
          <div className="text-center p-3 bg-slate-700/30 rounded-lg">
            <div className="text-lg font-bold text-yellow-400">{totalYield.toFixed(1)}</div>
            <div className="text-xs text-slate-400">GTT Earned</div>
          </div>
        </div>

        {/* Capsule List */}
        <div className="space-y-4">
          <h4 className="text-white font-semibold">Recent Capsules</h4>
          <div className="space-y-3">
            {capsules.map((capsule) => (
              <Card key={capsule.id} className="bg-slate-700/30 border-slate-600 hover:bg-slate-700/40 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-white font-semibold text-sm">{capsule.title}</h3>
                        {getStatusIcon(capsule.status)}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getTypeColor(capsule.type)}>
                          {capsule.type.replace(/_/g, ' ')}
                        </Badge>
                        <Badge className={getStatusColor(capsule.status)}>
                          {capsule.status.toUpperCase()}
                        </Badge>
                        <div className="flex items-center gap-1 text-slate-400 text-xs">
                          <Calendar className="w-3 h-3" />
                          {new Date(capsule.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-400 font-semibold text-sm">
                        +{capsule.truthYield.toFixed(1)} GTT
                      </div>
                      <div className="text-slate-400 text-xs">
                        Grief: {capsule.griefScore}%
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-slate-400 text-xs">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {capsule.stats.views.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Share2 className="w-3 h-3" />
                        {capsule.stats.shares}
                      </div>
                      <div className="flex items-center gap-1">
                        <Vote className="w-3 h-3" />
                        {capsule.stats.votes}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-600">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Performance Insights */}
        <div className="bg-slate-700/20 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-3">Performance Insights</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-slate-400">Most Viewed Type</div>
              <div className="text-white font-semibold">FRAUD_PROOF</div>
            </div>
            <div>
              <div className="text-slate-400">Average Grief Score</div>
              <div className="text-white font-semibold">
                {(capsules.reduce((sum, cap) => sum + cap.griefScore, 0) / capsules.length).toFixed(1)}%
              </div>
            </div>
            <div>
              <div className="text-slate-400">Verification Rate</div>
              <div className="text-white font-semibold">
                {((verifiedCount / capsules.length) * 100).toFixed(1)}%
              </div>
            </div>
            <div>
              <div className="text-slate-400">Total GTT Earned</div>
              <div className="text-yellow-400 font-semibold">
                {totalYield.toFixed(1)} GTT
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}