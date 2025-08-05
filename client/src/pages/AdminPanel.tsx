import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, CheckCircle, XCircle, Clock, Users, BarChart3, FileText } from 'lucide-react';
import { CapsuleLineageGraph } from '@/components/CapsuleLineageGraph';

interface PendingCertification {
  id: string;
  title: string;
  author: string;
  createdAt: string;
  daoCertified: boolean;
  restrictedContent: boolean;
}

interface DaoStats {
  certified: number;
  pending: number;
  lineageRecords: number;
  recentCertifications: Array<{
    id: string;
    title: string;
    certificationDate: string;
  }>;
}

export default function AdminPanel() {
  const [selectedCapsule, setSelectedCapsule] = useState<string>('');
  const [certificationReason, setCertificationReason] = useState<string>('');
  const [lineageViewCapsule, setLineageViewCapsule] = useState<string>('');
  const queryClient = useQueryClient();

  // Query for pending certifications
  const { data: pendingCertifications, isLoading: loadingPending } = useQuery({
    queryKey: ['/api/dao/certifications/pending'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Query for DAO statistics
  const { data: daoStats, isLoading: loadingStats } = useQuery({
    queryKey: ['/api/dao/stats'],
    refetchInterval: 60000, // Refresh every minute
  });

  // Query for lineage data
  const { data: lineageData } = useQuery({
    queryKey: ['/api/dao/lineage', lineageViewCapsule],
    enabled: !!lineageViewCapsule,
  });

  // Certification mutation
  const certifyMutation = useMutation({
    mutationFn: async ({ capsuleId, reason }: { capsuleId: string; reason: string }) => {
      return await apiRequest(`/api/dao/certify/${capsuleId}`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
        headers: { 'Content-Type': 'application/json' }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dao/certifications/pending'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dao/stats'] });
      setSelectedCapsule('');
      setCertificationReason('');
    },
  });

  // Revoke certification mutation
  const revokeMutation = useMutation({
    mutationFn: async ({ capsuleId, reason }: { capsuleId: string; reason: string }) => {
      return await apiRequest(`/api/dao/certify/${capsuleId}`, {
        method: 'DELETE',
        body: JSON.stringify({ reason }),
        headers: { 'Content-Type': 'application/json' }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dao/certifications/pending'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dao/stats'] });
    },
  });

  const handleCertify = () => {
    if (selectedCapsule) {
      certifyMutation.mutate({
        capsuleId: selectedCapsule,
        reason: certificationReason || 'DAO approved for minting'
      });
    }
  };

  const handleRevoke = (capsuleId: string) => {
    revokeMutation.mutate({
      capsuleId,
      reason: 'Certification revoked by admin'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            DAO Admin Panel
          </h1>
          <p className="text-slate-300">
            Manage capsule certifications, lineage tracking, and governance operations
          </p>
        </div>

        <Tabs defaultValue="certifications" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-md bg-slate-800">
            <TabsTrigger value="certifications" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Certifications
            </TabsTrigger>
            <TabsTrigger value="lineage" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Lineage
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Statistics
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="certifications" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pending Certifications */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-400" />
                    Pending Certifications
                  </CardTitle>
                  <CardDescription>
                    {loadingPending ? 'Loading...' : `${pendingCertifications?.count || 0} capsules awaiting certification`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {pendingCertifications?.pendingCertifications?.map((capsule: PendingCertification) => (
                      <div
                        key={capsule.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedCapsule === capsule.id
                            ? 'border-cyan-400 bg-cyan-400/10'
                            : 'border-slate-600 hover:border-slate-500'
                        }`}
                        onClick={() => setSelectedCapsule(capsule.id)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-sm">{capsule.title}</h4>
                          {capsule.restrictedContent && (
                            <Badge variant="destructive" className="text-xs">
                              Restricted
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-slate-400">by {capsule.author}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {new Date(capsule.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Certification Actions */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-400" />
                    Certification Actions
                  </CardTitle>
                  <CardDescription>
                    Review and approve capsules for DAO certification
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Selected Capsule</label>
                    <Input
                      value={selectedCapsule}
                      onChange={(e) => setSelectedCapsule(e.target.value)}
                      placeholder="Enter capsule ID or select from list"
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Certification Reason</label>
                    <Textarea
                      value={certificationReason}
                      onChange={(e) => setCertificationReason(e.target.value)}
                      placeholder="Reason for certification (optional)"
                      className="bg-slate-700 border-slate-600 min-h-[80px]"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleCertify}
                      disabled={!selectedCapsule || certifyMutation.isPending}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Certify
                    </Button>
                    <Button
                      onClick={() => selectedCapsule && handleRevoke(selectedCapsule)}
                      disabled={!selectedCapsule || revokeMutation.isPending}
                      variant="destructive"
                      className="flex-1"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Revoke
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="lineage" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle>Capsule Lineage Visualization</CardTitle>
                <CardDescription>
                  View provenance history and relationships between capsules
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Capsule ID</label>
                  <div className="flex gap-2">
                    <Input
                      value={lineageViewCapsule}
                      onChange={(e) => setLineageViewCapsule(e.target.value)}
                      placeholder="Enter capsule ID to view lineage"
                      className="bg-slate-700 border-slate-600"
                    />
                    <Button
                      onClick={() => setLineageViewCapsule('')}
                      variant="outline"
                      className="border-slate-600"
                    >
                      Clear
                    </Button>
                  </div>
                </div>

                {lineageData && (
                  <div className="border border-slate-600 rounded-lg p-4">
                    <CapsuleLineageGraph
                      data={lineageData}
                      height="500px"
                      onNodeClick={(nodeId) => {
                        console.log('Node clicked:', nodeId);
                        // Could navigate to capsule details
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    Certified
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-400">
                    {daoStats?.certified || 0}
                  </div>
                  <p className="text-sm text-slate-400 mt-1">Total certified capsules</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-400" />
                    Pending
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-400">
                    {daoStats?.pending || 0}
                  </div>
                  <p className="text-sm text-slate-400 mt-1">Awaiting certification</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-400" />
                    Lineage Records
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-400">
                    {daoStats?.lineageRecords || 0}
                  </div>
                  <p className="text-sm text-slate-400 mt-1">Provenance entries</p>
                </CardContent>
              </Card>
            </div>

            {daoStats?.recentCertifications && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle>Recent Certifications</CardTitle>
                  <CardDescription>
                    Latest approved capsules
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {daoStats.recentCertifications.map((cert) => (
                      <div key={cert.id} className="flex justify-between items-center py-2 border-b border-slate-700 last:border-0">
                        <div>
                          <p className="font-medium">{cert.title}</p>
                          <p className="text-xs text-slate-400">ID: {cert.id}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-green-400">Certified</p>
                          <p className="text-xs text-slate-500">
                            {cert.certificationDate ? new Date(cert.certificationDate).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage user permissions and access levels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-slate-400">
                  <Users className="w-12 h-12 mx-auto mb-4" />
                  <p>User management features coming soon</p>
                  <p className="text-sm mt-2">Will include tier management, permissions, and activity monitoring</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}