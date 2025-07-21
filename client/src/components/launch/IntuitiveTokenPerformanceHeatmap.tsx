import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Activity, BarChart3, RefreshCw } from 'lucide-react';

interface NetworkPerformance {
  network: string;
  price: number;
  change24h: number;
  volume: number;
  liquidity: number;
  transactions: number;
  marketCap: number;
  intensity: number; // 0-100 for heatmap intensity
  status: 'excellent' | 'good' | 'moderate' | 'poor';
}

export default function IntuitiveTokenPerformanceHeatmap() {
  const [networks, setNetworks] = useState<NetworkPerformance[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<'volume' | 'liquidity' | 'transactions' | 'change24h'>('volume');
  const [isLive, setIsLive] = useState(true);

  const generateMockData = (): NetworkPerformance[] => {
    const networkList = [
      'Ethereum', 'Polygon', 'BSC', 'Arbitrum', 'Optimism', 'Avalanche',
      'Fantom', 'Solana', 'Cosmos', 'Near', 'Harmony', 'Moonriver'
    ];

    return networkList.map(network => {
      const basePrice = 1.25 + Math.random() * 0.5; // $1.25-$1.75
      const change24h = (Math.random() - 0.5) * 20; // -10% to +10%
      const volume = Math.random() * 10000000; // Up to $10M
      const liquidity = Math.random() * 50000000; // Up to $50M
      const transactions = Math.floor(Math.random() * 100000); // Up to 100k
      const marketCap = basePrice * 1000000000; // Based on 1B supply

      // Calculate intensity based on selected metric
      let intensity = 0;
      switch (selectedMetric) {
        case 'volume':
          intensity = Math.min(100, (volume / 10000000) * 100);
          break;
        case 'liquidity':
          intensity = Math.min(100, (liquidity / 50000000) * 100);
          break;
        case 'transactions':
          intensity = Math.min(100, (transactions / 100000) * 100);
          break;
        case 'change24h':
          intensity = Math.min(100, Math.max(0, (change24h + 10) * 5));
          break;
      }

      let status: NetworkPerformance['status'] = 'moderate';
      if (intensity >= 80) status = 'excellent';
      else if (intensity >= 60) status = 'good';
      else if (intensity >= 40) status = 'moderate';
      else status = 'poor';

      return {
        network,
        price: basePrice,
        change24h,
        volume,
        liquidity,
        transactions,
        marketCap,
        intensity,
        status
      };
    });
  };

  useEffect(() => {
    setNetworks(generateMockData());
    
    if (isLive) {
      const interval = setInterval(() => {
        setNetworks(generateMockData());
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [selectedMetric, isLive]);

  const getHeatmapColor = (intensity: number, status: NetworkPerformance['status']) => {
    const alpha = intensity / 100;
    
    switch (status) {
      case 'excellent':
        return `rgba(34, 197, 94, ${alpha})`; // Green
      case 'good':
        return `rgba(59, 130, 246, ${alpha})`; // Blue
      case 'moderate':
        return `rgba(251, 191, 36, ${alpha})`; // Yellow
      case 'poor':
        return `rgba(239, 68, 68, ${alpha})`; // Red
      default:
        return `rgba(156, 163, 175, ${alpha})`; // Gray
    }
  };

  const formatValue = (value: number, type: string) => {
    switch (type) {
      case 'price':
        return `$${value.toFixed(3)}`;
      case 'change24h':
        return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
      case 'volume':
        return `$${(value / 1000000).toFixed(1)}M`;
      case 'liquidity':
        return `$${(value / 1000000).toFixed(1)}M`;
      case 'transactions':
        return `${(value / 1000).toFixed(0)}k`;
      case 'marketCap':
        return `$${(value / 1000000000).toFixed(2)}B`;
      default:
        return value.toString();
    }
  };

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-3 h-3 text-green-500" />;
    if (change < 0) return <TrendingDown className="w-3 h-3 text-red-500" />;
    return <Activity className="w-3 h-3 text-gray-500" />;
  };

  const getStatusBadge = (status: NetworkPerformance['status']) => {
    const variants = {
      excellent: 'default',
      good: 'secondary',
      moderate: 'outline',
      poor: 'destructive'
    } as const;

    return (
      <Badge variant={variants[status]} className="text-xs">
        {status}
      </Badge>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Intuitive Token Performance Heatmap
        </CardTitle>
        <CardDescription>
          Real-time performance visualization across all networks with dynamic heatmap intensity
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Metric:</span>
            <div className="flex gap-1">
              {(['volume', 'liquidity', 'transactions', 'change24h'] as const).map(metric => (
                <Button
                  key={metric}
                  variant={selectedMetric === metric ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedMetric(metric)}
                >
                  {metric.charAt(0).toUpperCase() + metric.slice(1)}
                </Button>
              ))}
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLive(!isLive)}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLive ? 'animate-spin' : ''}`} />
            {isLive ? 'Live' : 'Paused'}
          </Button>
        </div>

        {/* Heatmap Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {networks.map((network) => (
            <div
              key={network.network}
              className="relative p-4 rounded-lg border transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: getHeatmapColor(network.intensity, network.status),
                backdropFilter: 'blur(8px)'
              }}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{network.network}</span>
                  {getStatusBadge(network.status)}
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>Price:</span>
                    <span className="font-medium">{formatValue(network.price, 'price')}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span>24h:</span>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(network.change24h)}
                      <span className={network.change24h >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatValue(network.change24h, 'change24h')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span>{selectedMetric}:</span>
                    <span className="font-medium">
                      {formatValue(network[selectedMetric], selectedMetric)}
                    </span>
                  </div>
                </div>
                
                {/* Intensity indicator */}
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <div
                    className="bg-white rounded-full h-1.5 transition-all duration-300"
                    style={{ width: `${network.intensity}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-4 text-xs">
            <span className="font-medium">Performance:</span>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-500/80" />
              <span>Excellent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-500/80" />
              <span>Good</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-yellow-500/80" />
              <span>Moderate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-500/80" />
              <span>Poor</span>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Intensity based on {selectedMetric} • Updates every 3s
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-lg font-bold text-green-500">
              {networks.filter(n => n.status === 'excellent').length}
            </div>
            <div className="text-xs text-muted-foreground">Excellent Networks</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">
              ${(networks.reduce((sum, n) => sum + n.volume, 0) / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-muted-foreground">Total Volume</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">
              ${(networks.reduce((sum, n) => sum + n.liquidity, 0) / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-muted-foreground">Total Liquidity</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">
              {(networks.reduce((sum, n) => sum + n.transactions, 0) / 1000).toFixed(0)}k
            </div>
            <div className="text-xs text-muted-foreground">Total TXs</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}