import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import CapsuleCard from './CapsuleCard';
import ProfileCapsuleLineage from './ProfileCapsuleLineage';
import { 
  Archive, 
  Award, 
  GitBranch, 
  Coins,
  TrendingUp,
  Network
} from 'lucide-react';

interface ProfileCapsulesViewProps {
  userId: string;
  isOwnProfile?: boolean;
}

interface CapsuleData {
  id: string;
  title: string;
  author: string;
  createdAt: string;
  verified: boolean;
  daoCertified: boolean;
  tier: string;
  isTimeSealed?: boolean;
  unlockDate?: string;
  gttEarned?: number;
  viewCount?: number;
  hasLineage?: boolean;
}

interface ProfileStats {
  totalCapsules: number;
  verifiedCapsules: number;
  daoCertifiedCapsules: number;
  totalGttEarned: number;
  capsulesWithLineage: number;
}

export default function ProfileCapsulesView({ 
  userId, 
  isOwnProfile = false 
}: ProfileCapsulesViewProps) {
  const [selectedCapsuleForLineage, setSelectedCapsuleForLineage] = useState<string | null>(null);

  // Fetch user's capsules
  const { data: capsules = [], isLoading: capsulesLoading } = useQuery<CapsuleData[]>({
    queryKey: ['/api/profile/capsules', userId],
  });

  // Fetch profile stats
  const { data: stats = {} as ProfileStats } = useQuery<ProfileStats>({
    queryKey: ['/api/profile/capsule-stats', userId],
  });

  // Fetch lineage summary
  const { data: lineageSummary = {} as any } = useQuery({
    queryKey: ['/api/capsule/user', userId, 'lineage-summary'],
  });

  const handleViewDetails = (capsuleId: string) => {
    window.open(`/capsule/${capsuleId}`, '_blank');
  };

  const handleViewLineage = (capsuleId: string) => {
    setSelectedCapsuleForLineage(capsuleId);
  };

  if (capsulesLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-700 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Ensure capsules is an array before filtering
  const capsulesArray = Array.isArray(capsules) ? capsules : [];
  
  // Filter capsules by status
  const verifiedCapsules = capsulesArray.filter(c => c.verified);
  const daoCertifiedCapsules = capsulesArray.filter(c => c.daoCertified);
  const capsulesByTier = {
    explorer: capsulesArray.filter(c => c.tier === 'explorer'),
    seeker: capsulesArray.filter(c => c.tier === 'seeker'),
    creator: capsulesArray.filter(c => c.tier === 'creator'),
    sovereign: capsulesArray.filter(c => c.tier === 'sovereign'),
  };

  return (
    <div className="space-y-6">
      {/* Profile Stats Overview */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-cyan-400">{stats.totalCapsules}</div>
              <div className="text-xs text-slate-400">Total Capsules</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{stats.verifiedCapsules}</div>
              <div className="text-xs text-slate-400">Verified</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">{stats.daoCertifiedCapsules}</div>
              <div className="text-xs text-slate-400">DAO Certified</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{stats.totalGttEarned}</div>
              <div className="text-xs text-slate-400">GTT Earned</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-magenta-400">{stats.capsulesWithLineage}</div>
              <div className="text-xs text-slate-400">With Lineage</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Lineage View Modal */}
      {selectedCapsuleForLineage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-lg border border-slate-700 max-w-6xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-cyan-400">Capsule Lineage Network</h2>
                <Button
                  variant="outline"
                  onClick={() => setSelectedCapsuleForLineage(null)}
                  className="text-slate-400 border-slate-600"
                >
                  Close
                </Button>
              </div>
              <ProfileCapsuleLineage 
                capsuleId={selectedCapsuleForLineage} 
                userId={userId}
              />
            </div>
          </div>
        </div>
      )}

      {/* Capsules Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6 bg-slate-800 border-slate-700">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Archive className="w-4 h-4" />
            All ({capsulesArray.length})
          </TabsTrigger>
          <TabsTrigger value="verified" className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            Verified ({verifiedCapsules.length})
          </TabsTrigger>
          <TabsTrigger value="dao" className="flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-400" />
            DAO Certified ({daoCertifiedCapsules.length})
          </TabsTrigger>
          <TabsTrigger value="lineage" className="flex items-center gap-2">
            <GitBranch className="w-4 h-4" />
            Lineage
          </TabsTrigger>
          <TabsTrigger value="earnings" className="flex items-center gap-2">
            <Coins className="w-4 h-4" />
            GTT Earned
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {capsulesArray.map((capsule) => (
              <CapsuleCard
                key={capsule.id}
                capsule={capsule}
                onViewDetails={handleViewDetails}
                onViewLineage={handleViewLineage}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="verified" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {verifiedCapsules.map((capsule) => (
              <CapsuleCard
                key={capsule.id}
                capsule={capsule}
                onViewDetails={handleViewDetails}
                onViewLineage={handleViewLineage}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="dao" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-purple-400">DAO Certified Capsules</h3>
              <Badge variant="outline" className="text-purple-400 border-purple-600">
                {daoCertifiedCapsules.length} certified
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {daoCertifiedCapsules.map((capsule) => (
                <CapsuleCard
                  key={capsule.id}
                  capsule={capsule}
                  onViewDetails={handleViewDetails}
                  onViewLineage={handleViewLineage}
                />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="lineage" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Network className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-semibold text-cyan-400">Capsule Lineage Network</h3>
            </div>
            {lineageSummary ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-cyan-400">Lineage Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total Capsules:</span>
                        <span className="font-semibold">{lineageSummary.totalCapsules}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>With Lineage:</span>
                        <span className="font-semibold">{lineageSummary.capsulesWithLineage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Verified:</span>
                        <span className="font-semibold text-green-400">{lineageSummary.verifiedCapsules}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>DAO Certified:</span>
                        <span className="font-semibold text-purple-400">{lineageSummary.daoCertifiedCapsules}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-cyan-400">Lineage Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {lineageSummary.lineageStats?.slice(0, 5).map((stat: any) => (
                        <div key={stat.capsuleId} className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{stat.title}</div>
                            <div className="text-xs text-slate-400">
                              Parents: {stat.parentCount} | Children: {stat.childCount}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedCapsuleForLineage(stat.capsuleId)}
                            className="text-cyan-400 border-cyan-600"
                          >
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                No lineage data available
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="earnings" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Coins className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-semibold text-yellow-400">GTT Earnings Overview</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {capsules
                .filter(c => c.gttEarned && c.gttEarned > 0)
                .sort((a, b) => (b.gttEarned || 0) - (a.gttEarned || 0))
                .map((capsule) => (
                  <CapsuleCard
                    key={capsule.id}
                    capsule={capsule}
                    onViewDetails={handleViewDetails}
                    onViewLineage={handleViewLineage}
                  />
                ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-semibold text-cyan-400">Profile Analytics</h3>
            </div>
            
            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-400">
                      {Math.round((verifiedCapsules.length / capsulesArray.length) * 100)}%
                    </div>
                    <div className="text-xs text-slate-400">Verification Rate</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">
                      {Math.round((daoCertifiedCapsules.length / capsulesArray.length) * 100)}%
                    </div>
                    <div className="text-xs text-slate-400">DAO Certification Rate</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">
                      {Math.round((stats?.totalGttEarned || 0) / Math.max(capsulesArray.length, 1))}
                    </div>
                    <div className="text-xs text-slate-400">Avg GTT per Capsule</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-magenta-400">
                      {Math.round(((stats?.capsulesWithLineage || 0) / Math.max(capsulesArray.length, 1)) * 100)}%
                    </div>
                    <div className="text-xs text-slate-400">Lineage Coverage</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}