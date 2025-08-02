import React from 'react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { apiRequest } from '@/lib/queryClient';
import { 
  Map, 
  MapPin, 
  Users, 
  Search,
  Filter,
  Globe,
  TrendingUp,
  Shield,
  Heart,
  Clock,
  Eye
} from 'lucide-react';

interface GuardianNode {
  id: string;
  wallet: string;
  location: {
    city: string;
    country: string;
    coordinates: [number, number];
  };
  smri: {
    truth_score: number;
    reputation_tier: string;
    capsule_count: number;
    last_active: string;
  };
  network: {
    connections: number;
    lineage_depth: number;
    influence_radius: number;
  };
}

interface NetworkMetrics {
  total_guardians: number;
  active_guardians: number;
  global_truth_score: number;
  countries_active: number;
  strongest_lineage: string;
}

export default function GuardianMap() {
  const { user, isAuthenticated } = useAuth();
  const [selectedRegion, setSelectedRegion] = useState('global');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState('all');
  const [selectedNode, setSelectedNode] = useState<GuardianNode | null>(null);

  // Fetch guardian network data
  const { data: networkData } = useQuery({
    queryKey: ['/api/guardian-map/network', selectedRegion],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/guardian-map/network?region=${selectedRegion}`);
      return response.json();
    },
    refetchInterval: 120000
  });

  // Fetch global network metrics
  const { data: metrics } = useQuery({
    queryKey: ['/api/guardian-map/metrics'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/guardian-map/metrics');
      return response.json();
    },
    refetchInterval: 60000
  });

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'veritas': return 'bg-purple-500';
      case 'gold': return 'bg-yellow-500';
      case 'silver': return 'bg-gray-400';
      case 'bronze': return 'bg-orange-600';
      default: return 'bg-gray-600';
    }
  };

  const getTierSize = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'veritas': return 'w-6 h-6';
      case 'gold': return 'w-5 h-5';
      case 'silver': return 'w-4 h-4';
      case 'bronze': return 'w-3 h-3';
      default: return 'w-3 h-3';
    }
  };

  const filteredNodes = networkData?.nodes?.filter((node: GuardianNode) => {
    const matchesSearch = !searchQuery || 
      node.wallet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.location.country.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTier = filterTier === 'all' || node.smri.reputation_tier.toLowerCase() === filterTier.toLowerCase();
    
    return matchesSearch && matchesTier;
  }) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-4">
            Guardian Map
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore the global network of truth guardians. Discover connections, track influence, and witness how memories spread across the world.
          </p>
        </div>

        {/* Global Metrics */}
        {metrics && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Card className="bg-black/40 backdrop-blur-xl border-blue-500/20">
              <CardContent className="text-center py-4">
                <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{metrics.total_guardians}</p>
                <p className="text-sm text-gray-400">Total Guardians</p>
              </CardContent>
            </Card>
            
            <Card className="bg-black/40 backdrop-blur-xl border-green-500/20">
              <CardContent className="text-center py-4">
                <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{metrics.active_guardians}</p>
                <p className="text-sm text-gray-400">Active Today</p>
              </CardContent>
            </Card>
            
            <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
              <CardContent className="text-center py-4">
                <Shield className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{metrics.global_truth_score.toLocaleString()}</p>
                <p className="text-sm text-gray-400">Global Truth Score</p>
              </CardContent>
            </Card>
            
            <Card className="bg-black/40 backdrop-blur-xl border-yellow-500/20">
              <CardContent className="text-center py-4">
                <Globe className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{metrics.countries_active}</p>
                <p className="text-sm text-gray-400">Countries</p>
              </CardContent>
            </Card>
            
            <Card className="bg-black/40 backdrop-blur-xl border-red-500/20">
              <CardContent className="text-center py-4">
                <Heart className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{metrics.strongest_lineage}</p>
                <p className="text-sm text-gray-400">Deepest Lineage</p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Map Visualization */}
          <div className="lg:col-span-3">
            <Card className="bg-black/40 backdrop-blur-xl border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-300 flex items-center justify-between">
                  <div className="flex items-center">
                    <Map className="w-6 h-6 mr-2" />
                    Global Guardian Network
                  </div>
                  <div className="flex items-center space-x-2">
                    <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                      <SelectTrigger className="w-32 bg-slate-800 border-blue-500/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-blue-500/30">
                        <SelectItem value="global">Global</SelectItem>
                        <SelectItem value="americas">Americas</SelectItem>
                        <SelectItem value="europe">Europe</SelectItem>
                        <SelectItem value="asia">Asia</SelectItem>
                        <SelectItem value="africa">Africa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                
                {/* Search and Filter Controls */}
                <div className="flex space-x-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search guardians, cities, or countries..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-slate-800/50 border-blue-500/30 text-white placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                  
                  <Select value={filterTier} onValueChange={setFilterTier}>
                    <SelectTrigger className="w-32 bg-slate-800 border-blue-500/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-blue-500/30">
                      <SelectItem value="all">All Tiers</SelectItem>
                      <SelectItem value="veritas">Veritas</SelectItem>
                      <SelectItem value="gold">Gold</SelectItem>
                      <SelectItem value="silver">Silver</SelectItem>
                      <SelectItem value="bronze">Bronze</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Mock World Map with Guardian Nodes */}
                <div className="relative bg-slate-800/30 rounded-lg h-96 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-green-900/20" />
                  
                  {/* World Map Placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Globe className="w-24 h-24 text-blue-400/50 mx-auto mb-4" />
                      <p className="text-gray-400">Interactive Guardian Map</p>
                      <p className="text-sm text-gray-500">
                        {filteredNodes.length} guardians visible in {selectedRegion}
                      </p>
                    </div>
                  </div>

                  {/* Guardian Nodes Overlay */}
                  <div className="absolute inset-0">
                    {filteredNodes.slice(0, 20).map((node: GuardianNode, index: number) => (
                      <div
                        key={node.id}
                        className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${getTierSize(node.smri.reputation_tier)} ${getTierColor(node.smri.reputation_tier)} rounded-full opacity-80 hover:opacity-100 transition-opacity`}
                        style={{
                          left: `${20 + (index % 10) * 8}%`,
                          top: `${20 + Math.floor(index / 10) * 15}%`
                        }}
                        onClick={() => setSelectedNode(node)}
                      />
                    ))}
                  </div>
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center space-x-6 mt-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-purple-500 rounded-full" />
                    <span className="text-sm text-gray-400">Veritas</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full" />
                    <span className="text-sm text-gray-400">Gold</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gray-400 rounded-full" />
                    <span className="text-sm text-gray-400">Silver</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-orange-600 rounded-full" />
                    <span className="text-sm text-gray-400">Bronze</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Guardian Details Sidebar */}
          <div>
            {selectedNode ? (
              <Card className="bg-black/40 backdrop-blur-xl border-green-500/20">
                <CardHeader>
                  <CardTitle className="text-xl text-green-300 flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Guardian Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Wallet</p>
                    <p className="text-white font-mono text-sm break-all">
                      {selectedNode.wallet.includes('@') ? selectedNode.wallet.split('@')[0] : selectedNode.wallet}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400">Location</p>
                    <p className="text-white">{selectedNode.location.city}, {selectedNode.location.country}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400">Reputation</p>
                    <div className="flex items-center space-x-2">
                      <Badge className={`${getTierColor(selectedNode.smri.reputation_tier)} text-white border-none`}>
                        {selectedNode.smri.reputation_tier}
                      </Badge>
                      <span className="text-white font-bold">{selectedNode.smri.truth_score}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-gray-400">Capsules</p>
                      <p className="text-white font-bold">{selectedNode.smri.capsule_count}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Connections</p>
                      <p className="text-white font-bold">{selectedNode.network.connections}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400">Last Active</p>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-green-400" />
                      <span className="text-white text-sm">{selectedNode.smri.last_active}</span>
                    </div>
                  </div>
                  
                  <Button 
                    size="sm" 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      // Would navigate to guardian's profile
                    }}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-black/40 backdrop-blur-xl border-gray-500/20">
                <CardContent className="text-center py-12">
                  <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
                  <p className="text-gray-300">Select a guardian on the map</p>
                  <p className="text-gray-400 text-sm">Click any node to view guardian details</p>
                </CardContent>
              </Card>
            )}

            {/* Network Statistics */}
            <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20 mt-6">
              <CardHeader>
                <CardTitle className="text-xl text-purple-300">Network Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Average Truth Score</span>
                  <span className="text-white font-bold">
                    {metrics ? Math.round(metrics.global_truth_score / metrics.total_guardians) : 0}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Active Rate</span>
                  <span className="text-white font-bold">
                    {metrics ? Math.round((metrics.active_guardians / metrics.total_guardians) * 100) : 0}%
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Lineage Depth</span>
                  <span className="text-white font-bold">{metrics?.strongest_lineage || 0}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}