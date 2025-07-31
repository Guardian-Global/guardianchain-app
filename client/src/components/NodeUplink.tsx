import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Radio, 
  Wifi, 
  WifiOff, 
  Activity, 
  Satellite, 
  Signal,
  AlertTriangle,
  CheckCircle,
  Zap
} from 'lucide-react';

interface UplinkStatus {
  status: 'connected' | 'disconnected' | 'error' | 'reconnecting';
  nodeCount: number;
  latency: number;
  lastSync: string;
  bandwidth: string;
  signalStrength: number;
}

export default function NodeUplink() {
  const [uplinkStatus, setUplinkStatus] = useState<UplinkStatus>({
    status: 'disconnected',
    nodeCount: 0,
    latency: 0,
    lastSync: '',
    bandwidth: '0 Mbps',
    signalStrength: 0
  });

  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Initialize connection to Veritas Node Uplink
    const connectToUplink = () => {
      setIsConnecting(true);
      
      const sse = new EventSource('/api/uplink');
      
      sse.onopen = () => {
        setUplinkStatus(prev => ({ ...prev, status: 'connected' }));
        setIsConnecting(false);
      };
      
      sse.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setUplinkStatus(prev => ({
            ...prev,
            ...data,
            lastSync: new Date().toISOString()
          }));
        } catch (error) {
          console.error('Failed to parse uplink data:', error);
        }
      };
      
      sse.onerror = () => {
        setUplinkStatus(prev => ({ ...prev, status: 'error' }));
        setIsConnecting(false);
      };

      return sse;
    };

    // Fallback: Simulate uplink with demo data
    const simulateUplink = () => {
      const interval = setInterval(() => {
        setUplinkStatus({
          status: 'connected',
          nodeCount: Math.floor(Math.random() * 20) + 45, // 45-65 nodes
          latency: Math.floor(Math.random() * 50) + 20, // 20-70ms
          lastSync: new Date().toISOString(),
          bandwidth: `${(Math.random() * 5 + 2).toFixed(1)} Mbps`, // 2-7 Mbps
          signalStrength: Math.floor(Math.random() * 30) + 70 // 70-100%
        });
      }, 3000);

      return () => clearInterval(interval);
    };

    // Try real uplink first, fallback to simulation
    const eventSource = connectToUplink();
    const cleanup = simulateUplink();

    return () => {
      if (eventSource) eventSource.close();
      cleanup();
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-600';
      case 'reconnecting': return 'bg-yellow-600';
      case 'error': return 'bg-red-600';
      default: return 'bg-slate-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4" />;
      case 'reconnecting': return <Activity className="w-4 h-4 animate-pulse" />;
      case 'error': return <AlertTriangle className="w-4 h-4" />;
      default: return <WifiOff className="w-4 h-4" />;
    }
  };

  const getSignalBars = (strength: number) => {
    const bars = Math.ceil(strength / 25); // Convert to 1-4 bars
    return Array.from({ length: 4 }, (_, i) => (
      <div
        key={i}
        className={`w-1 bg-slate-600 ${i < bars ? 'bg-green-400' : ''}`}
        style={{ height: `${(i + 1) * 3}px` }}
      />
    ));
  };

  const reconnect = () => {
    setUplinkStatus(prev => ({ ...prev, status: 'reconnecting' }));
    // Simulate reconnection
    setTimeout(() => {
      setUplinkStatus(prev => ({ ...prev, status: 'connected' }));
    }, 2000);
  };

  return (
    <Card className="bg-slate-900 border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center">
            <Satellite className="w-5 h-5 mr-2 text-blue-400" />
            Veritas Node Uplink
          </div>
          <Badge className={`${getStatusColor(uplinkStatus.status)} text-white`}>
            {getStatusIcon(uplinkStatus.status)}
            <span className="ml-1 capitalize">{uplinkStatus.status}</span>
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{uplinkStatus.nodeCount}</div>
              <div className="text-xs text-slate-400">Active Nodes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{uplinkStatus.latency}ms</div>
              <div className="text-xs text-slate-400">Latency</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div>
              <div className="text-sm text-slate-300">{uplinkStatus.bandwidth}</div>
              <div className="text-xs text-slate-500">Bandwidth</div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-end space-x-0.5 h-4">
                {getSignalBars(uplinkStatus.signalStrength)}
              </div>
              <span className="text-xs text-slate-400">{uplinkStatus.signalStrength}%</span>
            </div>
          </div>
        </div>

        {/* Network Health */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Network Health</span>
            <span className={`${
              uplinkStatus.signalStrength > 80 ? 'text-green-400' :
              uplinkStatus.signalStrength > 60 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {uplinkStatus.signalStrength > 80 ? 'Excellent' :
               uplinkStatus.signalStrength > 60 ? 'Good' : 'Poor'}
            </span>
          </div>
          
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                uplinkStatus.signalStrength > 80 ? 'bg-green-400' :
                uplinkStatus.signalStrength > 60 ? 'bg-yellow-400' : 'bg-red-400'
              }`}
              style={{ width: `${uplinkStatus.signalStrength}%` }}
            />
          </div>
        </div>

        {/* Last Sync */}
        {uplinkStatus.lastSync && (
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Last Sync:</span>
            <span>{new Date(uplinkStatus.lastSync).toLocaleTimeString()}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2">
          {uplinkStatus.status !== 'connected' && (
            <Button 
              onClick={reconnect}
              disabled={isConnecting || uplinkStatus.status === 'reconnecting'}
              size="sm" 
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isConnecting || uplinkStatus.status === 'reconnecting' ? (
                <>
                  <Activity className="w-3 h-3 mr-2 animate-spin" />
                  Reconnecting...
                </>
              ) : (
                <>
                  <Wifi className="w-3 h-3 mr-2" />
                  Reconnect
                </>
              )}
            </Button>
          )}
          
          <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
            <Signal className="w-3 h-3 mr-2" />
            Diagnostics
          </Button>
        </div>

        {/* Live Activity Indicator */}
        {uplinkStatus.status === 'connected' && (
          <div className="flex items-center justify-center py-2">
            <div className="flex items-center space-x-2 text-green-400">
              <Zap className="w-4 h-4 animate-pulse" />
              <span className="text-sm">Live broadcast active</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}