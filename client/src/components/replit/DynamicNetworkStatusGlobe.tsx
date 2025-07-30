import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Globe, 
  Zap, 
  Shield, 
  Users, 
  Activity,
  MapPin,
  Wifi,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Database,
  Clock
} from 'lucide-react';

interface NetworkNode {
  id: string;
  name: string;
  location: string;
  coordinates: { lat: number; lng: number };
  status: 'online' | 'offline' | 'degraded';
  uptime: number;
  latency: number;
  connections: number;
  isActive: boolean;
}

interface NetworkMetric {
  id: string;
  name: string;
  value: string;
  change: number;
  status: 'good' | 'warning' | 'critical';
  icon: React.ComponentType<any>;
}

const NETWORK_NODES: NetworkNode[] = [
  {
    id: 'us-east',
    name: 'US East (Virginia)',
    location: 'Virginia, USA',
    coordinates: { lat: 37.4316, lng: -78.6569 },
    status: 'online',
    uptime: 99.98,
    latency: 12,
    connections: 2847,
    isActive: true
  },
  {
    id: 'us-west',
    name: 'US West (California)',
    location: 'California, USA',
    coordinates: { lat: 36.7783, lng: -119.4179 },
    status: 'online',
    uptime: 99.94,
    latency: 8,
    connections: 1923,
    isActive: true
  },
  {
    id: 'eu-central',
    name: 'EU Central (Frankfurt)',
    location: 'Frankfurt, Germany',
    coordinates: { lat: 50.1109, lng: 8.6821 },
    status: 'online',
    uptime: 99.96,
    latency: 15,
    connections: 3156,
    isActive: true
  },
  {
    id: 'ap-southeast',
    name: 'Asia Pacific (Singapore)',
    location: 'Singapore',
    coordinates: { lat: 1.3521, lng: 103.8198 },
    status: 'degraded',
    uptime: 97.82,
    latency: 45,
    connections: 1654,
    isActive: false
  },
  {
    id: 'ap-northeast',
    name: 'Asia Pacific (Tokyo)',
    location: 'Tokyo, Japan',
    coordinates: { lat: 35.6762, lng: 139.6503 },
    status: 'online',
    uptime: 99.91,
    latency: 22,
    connections: 2341,
    isActive: true
  },
  {
    id: 'sa-east',
    name: 'South America (São Paulo)',
    location: 'São Paulo, Brazil',
    coordinates: { lat: -23.5505, lng: -46.6333 },
    status: 'offline',
    uptime: 0,
    latency: 0,
    connections: 0,
    isActive: false
  }
];

const NETWORK_METRICS: NetworkMetric[] = [
  {
    id: 'total-nodes',
    name: 'Active Nodes',
    value: '5/6',
    change: 0,
    status: 'warning',
    icon: Globe
  },
  {
    id: 'avg-latency',
    name: 'Avg Latency',
    value: '20.4ms',
    change: -2.1,
    status: 'good',
    icon: Zap
  },
  {
    id: 'total-connections',
    name: 'Total Connections',
    value: '10.9K',
    change: 15.3,
    status: 'good',
    icon: Users
  },
  {
    id: 'network-uptime',
    name: 'Network Uptime',
    value: '99.72%',
    change: -0.28,
    status: 'good',
    icon: Shield
  },
  {
    id: 'data-throughput',
    name: 'Data Throughput',
    value: '847 MB/s',
    change: 8.7,
    status: 'good',
    icon: Activity
  },
  {
    id: 'gtt-transactions',
    name: 'GTT Transactions',
    value: '2.3K/min',
    change: 23.4,
    status: 'good',
    icon: Database
  }
];

export default function DynamicNetworkStatusGlobe() {
  const [nodes, setNodes] = useState(NETWORK_NODES);
  const [metrics, setMetrics] = useState(NETWORK_METRICS);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      // Simulate real-time network updates
      setNodes(prev => prev.map(node => ({
        ...node,
        latency: node.status === 'online' 
          ? Math.max(5, node.latency + (Math.random() - 0.5) * 10)
          : 0,
        connections: node.status === 'online'
          ? Math.max(0, node.connections + Math.floor((Math.random() - 0.5) * 100))
          : 0,
        uptime: node.status === 'online'
          ? Math.min(100, node.uptime + (Math.random() - 0.5) * 0.1)
          : node.uptime
      })));

      // Update metrics
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        change: (Math.random() - 0.5) * 10
      })));

      setLastUpdate(new Date());
    }, 3000);

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'degraded': return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'offline': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default: return <Globe className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'border-green-500/50 bg-green-900/20';
      case 'degraded': return 'border-yellow-500/50 bg-yellow-900/20';
      case 'offline': return 'border-red-500/50 bg-red-900/20';
      default: return 'border-slate-700 bg-slate-800/50';
    }
  };

  const getMetricStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
  };

  const onlineNodes = nodes.filter(node => node.status === 'online').length;
  const totalConnections = nodes.reduce((sum, node) => sum + node.connections, 0);
  const avgLatency = nodes.filter(node => node.status === 'online')
    .reduce((sum, node, _, arr) => sum + node.latency / arr.length, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Dynamic Network Status Globe
        </h1>
        <p className="text-xl text-slate-300">
          Real-time global network monitoring with live status updates
        </p>
      </div>

      {/* Network Overview */}
      <Card className="bg-slate-800/50 border-blue-500/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-3">
              <Globe className="h-6 w-6 text-blue-400" />
              Global Network Status
            </CardTitle>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-400">
                  Last update: {lastUpdate.toLocaleTimeString()}
                </span>
              </div>
              <Button 
                onClick={toggleMonitoring}
                variant={isMonitoring ? "default" : "outline"}
                size="sm"
              >
                {isMonitoring ? (
                  <>
                    <Activity className="mr-2 h-4 w-4" />
                    Live
                  </>
                ) : (
                  <>
                    <Wifi className="mr-2 h-4 w-4" />
                    Start Monitoring
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-400">{onlineNodes}</p>
              <p className="text-sm text-slate-400">Nodes Online</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-400">{totalConnections.toLocaleString()}</p>
              <p className="text-sm text-slate-400">Active Connections</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-purple-400">{Math.round(avgLatency)}ms</p>
              <p className="text-sm text-slate-400">Average Latency</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Network Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric) => {
          const IconComponent = metric.icon;
          return (
            <Card key={metric.id} className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <IconComponent className={`h-5 w-5 ${getMetricStatusColor(metric.status)}`} />
                    <div>
                      <p className="text-white font-semibold">{metric.value}</p>
                      <p className="text-sm text-slate-400">{metric.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center space-x-1 ${
                      metric.change > 0 ? 'text-green-400' : 
                      metric.change < 0 ? 'text-red-400' : 'text-slate-400'
                    }`}>
                      <TrendingUp className={`h-4 w-4 ${metric.change < 0 ? 'rotate-180' : ''}`} />
                      <span className="text-sm">{Math.abs(metric.change).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Network Nodes */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            <MapPin className="h-6 w-6 text-cyan-400" />
            Network Nodes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nodes.map((node) => (
              <Card 
                key={node.id} 
                className={`border transition-all duration-300 cursor-pointer hover:scale-105 ${getStatusColor(node.status)}`}
                onClick={() => setSelectedNode(node)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(node.status)}
                      <div>
                        <h3 className="text-white font-semibold">{node.name}</h3>
                        <p className="text-sm text-slate-400">{node.location}</p>
                      </div>
                    </div>
                    <Badge className={`text-xs ${
                      node.status === 'online' ? 'bg-green-600' :
                      node.status === 'degraded' ? 'bg-yellow-600' : 'bg-red-600'
                    }`}>
                      {node.status.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center">
                      <p className="text-white font-semibold">{node.uptime.toFixed(2)}%</p>
                      <p className="text-slate-400 text-xs">Uptime</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white font-semibold">{node.latency}ms</p>
                      <p className="text-slate-400 text-xs">Latency</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white font-semibold">{node.connections.toLocaleString()}</p>
                      <p className="text-slate-400 text-xs">Connections</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Node Details */}
      {selectedNode && (
        <Card className="bg-slate-800/50 border-cyan-500/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <MapPin className="h-6 w-6 text-cyan-400" />
              {selectedNode.name} - Detailed View
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Node Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Location:</span>
                    <span className="text-white">{selectedNode.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status:</span>
                    <Badge className={`text-xs ${
                      selectedNode.status === 'online' ? 'bg-green-600' :
                      selectedNode.status === 'degraded' ? 'bg-yellow-600' : 'bg-red-600'
                    }`}>
                      {selectedNode.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Coordinates:</span>
                    <span className="text-white font-mono text-sm">
                      {selectedNode.coordinates.lat.toFixed(4)}, {selectedNode.coordinates.lng.toFixed(4)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Performance Metrics</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Uptime:</span>
                    <span className={`font-semibold ${
                      selectedNode.uptime > 99 ? 'text-green-400' :
                      selectedNode.uptime > 95 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {selectedNode.uptime.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Latency:</span>
                    <span className={`font-semibold ${
                      selectedNode.latency < 20 ? 'text-green-400' :
                      selectedNode.latency < 50 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {selectedNode.latency}ms
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Active Connections:</span>
                    <span className="text-blue-400 font-semibold">
                      {selectedNode.connections.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => setSelectedNode(null)}
              variant="outline"
              className="w-full border-slate-600 text-white"
            >
              Close Details
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}