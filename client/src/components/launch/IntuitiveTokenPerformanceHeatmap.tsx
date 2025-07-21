import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion } from "framer-motion";

export default function IntuitiveTokenPerformanceHeatmap() {
  const performanceData = [
    { period: "1H", change: 2.4, volume: 45600 },
    { period: "6H", change: -1.2, volume: 234500 },
    { period: "12H", change: 5.8, volume: 456700 },
    { period: "1D", change: 12.3, volume: 987600 },
    { period: "3D", change: -3.1, volume: 2345600 },
    { period: "1W", change: 18.7, volume: 4567800 },
    { period: "1M", change: 45.2, volume: 12456700 },
    { period: "3M", change: 120.5, volume: 23457800 }
  ];

  const getPerformanceColor = (change: number) => {
    if (change > 10) return 'bg-green-500';
    if (change > 0) return 'bg-green-400';
    if (change > -5) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  const getPerformanceIntensity = (change: number) => {
    const absChange = Math.abs(change);
    if (absChange > 50) return 'opacity-100';
    if (absChange > 20) return 'opacity-80';
    if (absChange > 10) return 'opacity-60';
    if (absChange > 5) return 'opacity-40';
    return 'opacity-30';
  };

  const getIcon = (change: number) => {
    if (change > 1) return <TrendingUp className="w-4 h-4" />;
    if (change < -1) return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-green-500" />
          Token Performance Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Heatmap Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {performanceData.map((item, index) => (
              <motion.div
                key={item.period}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  p-4 rounded-lg relative overflow-hidden
                  ${getPerformanceColor(item.change)}
                  ${getPerformanceIntensity(item.change)}
                `}
              >
                <div className="relative z-10 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold">{item.period}</span>
                    {getIcon(item.change)}
                  </div>
                  <div className="text-lg font-bold">
                    {item.change > 0 ? '+' : ''}{item.change.toFixed(1)}%
                  </div>
                  <div className="text-xs opacity-80">
                    Vol: ${(item.volume / 1000).toFixed(0)}K
                  </div>
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20"></div>
              </motion.div>
            ))}
          </div>

          {/* Performance Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-green-400">6/8</div>
              <div className="text-sm text-slate-400">Positive Periods</div>
              <Badge className="bg-green-500/20 text-green-400">Strong Performance</Badge>
            </div>
            
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-blue-400">45.2%</div>
              <div className="text-sm text-slate-400">Best Month</div>
              <Badge className="bg-blue-500/20 text-blue-400">1M Period</Badge>
            </div>
            
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-purple-400">$23.4M</div>
              <div className="text-sm text-slate-400">Peak Volume</div>
              <Badge className="bg-purple-500/20 text-purple-400">3M Period</Badge>
            </div>
          </div>

          {/* Trend Analysis */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-300">Trend Analysis</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-700/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-semibold text-green-400">Bullish Momentum</span>
                </div>
                <p className="text-xs text-slate-400">
                  Strong upward trend across longer timeframes with increasing volume
                </p>
              </div>
              
              <div className="p-3 bg-slate-700/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-semibold text-blue-400">Volume Growth</span>
                </div>
                <p className="text-xs text-slate-400">
                  Trading volume consistently increasing over extended periods
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}