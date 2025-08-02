import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { apiRequest } from '@/lib/queryClient';
import { 
  Globe, 
  MapPin, 
  Search, 
  Filter,
  Users,
  Activity,
  TrendingUp,
  Zap,
  Shield,
  Eye,
  Settings,
  RefreshCw,
  Download,
  Share2
} from 'lucide-react';
import GuardianSearch from '@/components/guardian-map/GuardianSearch';
import MapExportTools from '@/components/guardian-map/MapExportTools';
import CapsuleSearch from '@/components/guardian-map/CapsuleSearch';

interface GuardianNode {
  id: string;
  wallet: string;
  latitude: number;
  longitude: number;
  truth_score: number;
  capsule_count: number;
  region: string;
  country: string;
  city: string;
  reputation_tier: 'Bronze' | 'Silver' | 'Gold' | 'Veritas';
  activity_level: 'low' | 'medium' | 'high';
  last_active: string;
  specialties: string[];
  connections: string[];
  influence_radius: number;
}

interface NetworkConnection {
  source: string;
  target: string;
  strength: number;
  connection_type: 'collaboration' | 'verification' | 'influence' | 'mentorship';
  created_at: string;
}

interface MapMetrics {
  total_guardians: number;
  active_guardians: number;
  total_connections: number;
  global_truth_score: number;
  top_regions: Array<{
    region: string;
    guardian_count: number;
    avg_truth_score: number;
  }>;
}

export default function GuardianMap() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showConnections, setShowConnections] = useState(true);
  const [zoomLevel, setZoomLevel] = useState([50]);
  const [mapMode, setMapMode] = useState<'standard' | 'heatmap' | 'connections'>('standard');
  const [filteredGuardians, setFilteredGuardians] = useState<GuardianNode[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch guardian map data
  const { data: mapData, isLoading, refetch } = useQuery({
    queryKey: ['/api/guardian-map/nodes'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/guardian-map/nodes');
      return response.json();
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Initialize filtered guardians when map data loads
  useEffect(() => {
    if (mapData?.guardians) {
      setFilteredGuardians(mapData.guardians);
    }
  }, [mapData]);

  // Fetch network connections
  const { data: connections } = useQuery({
    queryKey: ['/api/guardian-map/connections'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/guardian-map/connections');
      return response.json();
    },
    enabled: showConnections
  });

  // Fetch map metrics
  const { data: metrics } = useQuery({
    queryKey: ['/api/guardian-map/metrics'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/guardian-map/metrics');
      return response.json();
    }
  });

  // Canvas rendering
  useEffect(() => {
    if (!filteredGuardians.length || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const container = containerRef.current;
    if (container) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }

    renderMap(ctx, filteredGuardians, connections?.connections || [], canvas.width, canvas.height);
  }, [filteredGuardians, connections, mapMode, zoomLevel, showConnections]);

  const renderMap = (
    ctx: CanvasRenderingContext2D, 
    guardians: GuardianNode[], 
    networkConnections: NetworkConnection[],
    width: number, 
    height: number
  ) => {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw world map background
    drawWorldBackground(ctx, width, height);
    
    // Use the filtered guardians from state

    // Draw connections first (behind nodes)
    if (showConnections && mapMode === 'connections') {
      drawConnections(ctx, guardians, networkConnections, width, height);
    }

    // Draw heatmap if in heatmap mode
    if (mapMode === 'heatmap') {
      drawHeatmap(ctx, guardians, width, height);
    }

    // Draw guardian nodes
    drawGuardians(ctx, guardians, width, height);

    // Draw influence circles for selected node
    if (selectedNode) {
      const selectedGuardian = guardians.find(g => g.id === selectedNode);
      if (selectedGuardian) {
        drawInfluenceRadius(ctx, selectedGuardian, width, height);
      }
    }
  };

  const drawWorldBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Draw a simple world map outline
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
    ctx.lineWidth = 1;
    
    // Continental outlines (simplified)
    const continents = [
      // North America
      { x: width * 0.15, y: height * 0.3, w: width * 0.25, h: height * 0.4 },
      // South America  
      { x: width * 0.22, y: height * 0.55, w: width * 0.15, h: height * 0.35 },
      // Europe
      { x: width * 0.45, y: height * 0.25, w: width * 0.15, h: height * 0.25 },
      // Africa
      { x: width * 0.48, y: height * 0.4, w: width * 0.12, h: height * 0.4 },
      // Asia
      { x: width * 0.6, y: height * 0.2, w: width * 0.25, h: height * 0.45 },
      // Australia
      { x: width * 0.75, y: height * 0.7, w: width * 0.12, h: height * 0.15 }
    ];

    continents.forEach(continent => {
      ctx.strokeRect(continent.x, continent.y, continent.w, continent.h);
    });
  };

  const drawConnections = (
    ctx: CanvasRenderingContext2D,
    guardians: GuardianNode[],
    networkConnections: NetworkConnection[],
    width: number,
    height: number
  ) => {
    networkConnections.forEach(connection => {
      const source = guardians.find(g => g.id === connection.source);
      const target = guardians.find(g => g.id === connection.target);
      
      if (!source || !target) return;

      const sourcePos = latLongToPixel(source.latitude, source.longitude, width, height);
      const targetPos = latLongToPixel(target.latitude, target.longitude, width, height);

      // Set connection style based on type
      const connectionColors = {
        collaboration: 'rgba(34, 197, 94, 0.6)',
        verification: 'rgba(59, 130, 246, 0.6)',
        influence: 'rgba(168, 85, 247, 0.6)',
        mentorship: 'rgba(249, 115, 22, 0.6)'
      };

      ctx.strokeStyle = connectionColors[connection.connection_type];
      ctx.lineWidth = connection.strength * 3;
      ctx.globalAlpha = 0.7;

      ctx.beginPath();
      ctx.moveTo(sourcePos.x, sourcePos.y);
      ctx.lineTo(targetPos.x, targetPos.y);
      ctx.stroke();

      ctx.globalAlpha = 1;
    });
  };

  const drawHeatmap = (ctx: CanvasRenderingContext2D, guardians: GuardianNode[], width: number, height: number) => {
    // Create heatmap based on guardian density and truth scores
    const heatmapData = new ImageData(width, height);
    
    guardians.forEach(guardian => {
      const pos = latLongToPixel(guardian.latitude, guardian.longitude, width, height);
      const intensity = guardian.truth_score / 200; // Normalize to 0-1
      const radius = guardian.influence_radius * 2;

      // Draw heat circle
      for (let x = Math.max(0, pos.x - radius); x < Math.min(width, pos.x + radius); x++) {
        for (let y = Math.max(0, pos.y - radius); y < Math.min(height, pos.y + radius); y++) {
          const distance = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
          if (distance <= radius) {
            const heatValue = intensity * (1 - distance / radius);
            const pixelIndex = (y * width + x) * 4;
            
            heatmapData.data[pixelIndex] = Math.min(255, heatmapData.data[pixelIndex] + heatValue * 255); // Red
            heatmapData.data[pixelIndex + 1] = Math.min(255, heatmapData.data[pixelIndex + 1] + heatValue * 100); // Green
            heatmapData.data[pixelIndex + 2] = Math.min(255, heatmapData.data[pixelIndex + 2] + heatValue * 50); // Blue
            heatmapData.data[pixelIndex + 3] = Math.min(255, heatmapData.data[pixelIndex + 3] + heatValue * 128); // Alpha
          }
        }
      }
    });

    ctx.putImageData(heatmapData, 0, 0);
  };

  const drawGuardians = (ctx: CanvasRenderingContext2D, guardians: GuardianNode[], width: number, height: number) => {
    guardians.forEach(guardian => {
      const pos = latLongToPixel(guardian.latitude, guardian.longitude, width, height);
      
      // Get tier color
      const tierColors = {
        Veritas: '#fbbf24',
        Gold: '#f59e0b',
        Silver: '#9ca3af',
        Bronze: '#ea580c'
      };

      const color = tierColors[guardian.reputation_tier];
      const radius = Math.max(3, Math.min(15, guardian.truth_score / 10 * (zoomLevel[0] / 50)));

      // Draw outer glow
      const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, radius * 2);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius * 2, 0, Math.PI * 2);
      ctx.fill();

      // Draw main node
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
      ctx.fill();

      // Draw border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw activity indicator
      if (guardian.activity_level === 'high') {
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(pos.x + radius * 0.7, pos.y - radius * 0.7, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Add click detection
      const distance = Math.sqrt((pos.x - pos.x) ** 2 + (pos.y - pos.y) ** 2);
      if (distance <= radius) {
        // This would be handled by a click event listener
      }
    });
  };

  const drawInfluenceRadius = (ctx: CanvasRenderingContext2D, guardian: GuardianNode, width: number, height: number) => {
    const pos = latLongToPixel(guardian.latitude, guardian.longitude, width, height);
    const radius = guardian.influence_radius * 3;

    ctx.strokeStyle = 'rgba(168, 85, 247, 0.5)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  const latLongToPixel = (lat: number, long: number, width: number, height: number) => {
    // Simple equirectangular projection
    const x = ((long + 180) / 360) * width;
    const y = ((90 - lat) / 180) * height;
    return { x, y };
  };

  // Filter handling
  const handleFiltersChange = (filters: any) => {
    if (!mapData?.guardians) return;

    let filtered = mapData.guardians.filter((guardian: GuardianNode) => {
      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matches = guardian.wallet.toLowerCase().includes(query) ||
                       guardian.region.toLowerCase().includes(query) ||
                       guardian.city.toLowerCase().includes(query) ||
                       guardian.country.toLowerCase().includes(query) ||
                       guardian.specialties.some(s => s.toLowerCase().includes(query));
        if (!matches) return false;
      }

      // Region filter
      if (filters.region !== 'all' && guardian.region !== filters.region) return false;

      // Tier filter
      if (filters.tier !== 'all' && guardian.reputation_tier !== filters.tier) return false;

      // Activity level filter
      if (filters.activityLevel !== 'all' && guardian.activity_level !== filters.activityLevel) return false;

      // Truth score range
      if (guardian.truth_score < filters.truthScoreRange[0] || guardian.truth_score > filters.truthScoreRange[1]) return false;

      // Capsule count range
      if (guardian.capsule_count < filters.capsuleCountRange[0] || guardian.capsule_count > filters.capsuleCountRange[1]) return false;

      // Specialties filter
      if (filters.specialties.length > 0) {
        const hasSpecialty = filters.specialties.some((specialty: string) => 
          guardian.specialties.includes(specialty)
        );
        if (!hasSpecialty) return false;
      }

      // Active connections filter
      if (filters.hasActiveConnections && guardian.connections.length === 0) return false;

      // Recently active filter
      if (filters.recentlyActive) {
        const lastActive = new Date(guardian.last_active);
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        if (lastActive < twentyFourHoursAgo) return false;
      }

      return true;
    });

    setFilteredGuardians(filtered);
  };

  // Export handling
  const handleExportData = (format: 'csv' | 'json' | 'excel', options: any) => {
    const exportData = filteredGuardians.map(guardian => ({
      id: guardian.id,
      wallet: guardian.wallet,
      latitude: guardian.latitude,
      longitude: guardian.longitude,
      truth_score: guardian.truth_score,
      capsule_count: guardian.capsule_count,
      region: guardian.region,
      country: guardian.country,
      city: guardian.city,
      reputation_tier: guardian.reputation_tier,
      activity_level: guardian.activity_level,
      last_active: guardian.last_active,
      ...(options.includeSpecialties && { specialties: guardian.specialties.join(', ') }),
      ...(options.includeConnections && { connections: guardian.connections.join(', ') }),
      influence_radius: guardian.influence_radius,
      ...(options.includeTimestamp && { exported_at: new Date().toISOString() })
    }));

    const fileName = `guardianmap_export_${filteredGuardians.length}guardians_${new Date().toISOString().split('T')[0]}`;

    if (format === 'csv') {
      const csv = [
        Object.keys(exportData[0] || {}).join(','),
        ...exportData.map(row => Object.values(row).map(val => `"${val}"`).join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}.csv`;
      a.click();
    } else if (format === 'json') {
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}.json`;
      a.click();
    }
  };

  const handleExportImage = (options: any) => {
    if (!canvasRef.current) return;

    canvasRef.current.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `guardianmap_${new Date().toISOString().split('T')[0]}.png`;
        a.click();
      }
    });
  };

  const handleExportReport = (format: 'pdf' | 'html', options: any) => {
    // This would typically generate a comprehensive report
    console.log('Export report:', format, options);
  };

  const handleShareMap = () => {
    const shareData = {
      title: 'GuardianChain Guardian Map',
      text: `Explore ${filteredGuardians.length} truth guardians across the global network`,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!filteredGuardians.length || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    // Find clicked guardian
    for (const guardian of filteredGuardians) {
      const pos = latLongToPixel(guardian.latitude, guardian.longitude, canvas.width, canvas.height);
      const radius = Math.max(3, Math.min(15, guardian.truth_score / 10 * (zoomLevel[0] / 50)));
      
      const distance = Math.sqrt((clickX - pos.x) ** 2 + (clickY - pos.y) ** 2);
      if (distance <= radius) {
        setSelectedNode(guardian.id);
        return;
      }
    }

    setSelectedNode(null);
  };

  const selectedGuardian = filteredGuardians.find((g: GuardianNode) => g.id === selectedNode);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Guardian Map
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore the global network of truth guardians and their interconnected influence
          </p>
        </div>

        {/* Metrics Overview */}
        {metrics && (
          <div className="max-w-6xl mx-auto mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-black/40 backdrop-blur-xl border-indigo-500/20">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-indigo-400">{metrics.total_guardians}</div>
                  <div className="text-sm text-gray-400">Total Guardians</div>
                </CardContent>
              </Card>
              <Card className="bg-black/40 backdrop-blur-xl border-indigo-500/20">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">{metrics.active_guardians}</div>
                  <div className="text-sm text-gray-400">Active Now</div>
                </CardContent>
              </Card>
              <Card className="bg-black/40 backdrop-blur-xl border-indigo-500/20">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400">{metrics.total_connections}</div>
                  <div className="text-sm text-gray-400">Connections</div>
                </CardContent>
              </Card>
              <Card className="bg-black/40 backdrop-blur-xl border-indigo-500/20">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-400">{metrics.global_truth_score}</div>
                  <div className="text-sm text-gray-400">Global Truth Score</div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Search and Controls */}
        <div className="max-w-7xl mx-auto mb-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* Search Components */}
          <div className="lg:col-span-2 space-y-4">
            {/* Guardian Search */}
            <GuardianSearch
              guardians={mapData?.guardians || []}
              onFiltersChange={handleFiltersChange}
              onExport={handleExportData}
            />
            
            {/* Capsule Search */}
            <CapsuleSearch
              onResultsChange={(capsules) => {
                // Handle capsule search results if needed
                console.log('Capsule search results:', capsules.length);
              }}
              onExport={(capsules, format) => {
                console.log('Export capsules:', capsules.length, format);
              }}
            />
          </div>

          {/* Map Controls & Export */}
          <div className="space-y-4">
            {/* Map Controls */}
            <Card className="bg-black/40 backdrop-blur-xl border-indigo-500/20">
              <CardHeader>
                <CardTitle className="text-indigo-300 text-sm flex items-center justify-between">
                  Map Controls
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => refetch()}
                    className="border-indigo-500/30"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Map Mode</label>
                  <div className="grid grid-cols-1 gap-2">
                    {['standard', 'heatmap', 'connections'].map((mode) => (
                      <Button
                        key={mode}
                        variant={mapMode === mode ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setMapMode(mode as any)}
                        className={mapMode === mode ? 
                          'bg-gradient-to-r from-indigo-600 to-cyan-600' : 
                          'border-indigo-500/30 text-indigo-300'
                        }
                      >
                        {mode === 'standard' && <Globe className="w-4 h-4 mr-1" />}
                        {mode === 'heatmap' && <Activity className="w-4 h-4 mr-1" />}
                        {mode === 'connections' && <Zap className="w-4 h-4 mr-1" />}
                        {mode.charAt(0).toUpperCase() + mode.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">
                    Zoom Level: {zoomLevel[0]}%
                  </label>
                  <Slider
                    value={zoomLevel}
                    onValueChange={setZoomLevel}
                    max={100}
                    min={25}
                    step={5}
                    className="w-full"
                  />
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowConnections(!showConnections)}
                  className={showConnections ? 
                    'w-full bg-indigo-600 border-indigo-500' : 
                    'w-full border-indigo-500/30 text-indigo-300'
                  }
                >
                  <Eye className="w-4 h-4 mr-1" />
                  {showConnections ? 'Hide' : 'Show'} Connections
                </Button>
              </CardContent>
            </Card>

            {/* Export Tools */}
            <MapExportTools
              guardians={filteredGuardians}
              onExportData={handleExportData}
              onExportImage={handleExportImage}
              onExportReport={handleExportReport}
              onShareMap={handleShareMap}
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Map Visualization */}
          <div className="lg:col-span-3">
            <Card className="bg-black/40 backdrop-blur-xl border-indigo-500/20 h-[600px]">
              <CardHeader>
                <CardTitle className="text-indigo-300 flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Global Guardian Network
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div ref={containerRef} className="w-full h-[500px] relative">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
                    </div>
                  ) : (
                    <canvas
                      ref={canvasRef}
                      className="w-full h-full cursor-pointer"
                      onClick={handleCanvasClick}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Guardian Details & Regions */}
          <div className="space-y-4">
            
            {/* Selected Guardian */}
            {selectedGuardian && (
              <Card className="bg-black/40 backdrop-blur-xl border-indigo-500/20">
                <CardHeader>
                  <CardTitle className="text-indigo-300 text-sm">Selected Guardian</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-white font-semibold mb-1">{selectedGuardian.wallet}</h4>
                    <p className="text-gray-400 text-sm">
                      {selectedGuardian.city}, {selectedGuardian.country}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Badge className={`bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border-none`}>
                      <Shield className="w-3 h-3 mr-1" />
                      {selectedGuardian.reputation_tier}
                    </Badge>
                    <Badge variant="outline" className="border-gray-500/30 text-gray-300">
                      {selectedGuardian.activity_level} activity
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Truth Score</span>
                      <span className="text-sm text-indigo-400 font-semibold">{selectedGuardian.truth_score}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Capsules</span>
                      <span className="text-sm text-blue-400 font-semibold">{selectedGuardian.capsule_count}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Connections</span>
                      <span className="text-sm text-purple-400 font-semibold">{selectedGuardian.connections.length}</span>
                    </div>
                  </div>

                  {selectedGuardian.specialties.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Specialties:</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedGuardian.specialties.map((specialty, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-gray-600 text-gray-300">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1 bg-gradient-to-r from-indigo-600 to-cyan-600">
                      <Users className="w-4 h-4 mr-1" />
                      Connect
                    </Button>
                    <Button size="sm" variant="outline" className="border-indigo-500/30">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Top Regions */}
            {metrics?.top_regions && (
              <Card className="bg-black/40 backdrop-blur-xl border-indigo-500/20">
                <CardHeader>
                  <CardTitle className="text-indigo-300 text-sm">Top Regions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {metrics.top_regions.map((region, index) => (
                    <div key={region.region} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold text-gray-400">#{index + 1}</span>
                        <span className="text-sm text-white">{region.region}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-indigo-400">{region.guardian_count}</div>
                        <div className="text-xs text-gray-400">guardians</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Legend */}
            <Card className="bg-black/40 backdrop-blur-xl border-indigo-500/20">
              <CardHeader>
                <CardTitle className="text-indigo-300 text-sm">Legend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <span className="text-xs text-gray-300">Veritas Tier</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-xs text-gray-300">Gold Tier</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                  <span className="text-xs text-gray-300">Silver Tier</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-orange-600"></div>
                  <span className="text-xs text-gray-300">Bronze Tier</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <span className="text-xs text-gray-300">High Activity</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}