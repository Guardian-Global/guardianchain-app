import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  DollarSign, 
  Activity, 
  Target,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  Clock,
  Sparkles
} from 'lucide-react';

interface AIPrediction {
  id: string;
  asset: string;
  direction: 'bullish' | 'bearish';
  confidence: number;
  timeframe: string;
  currentPrice: number;
  targetPrice: number;
  potentialGain: number;
  aiModel: string;
  reasoning: string;
  riskLevel: 'low' | 'medium' | 'high';
  subscription: 'basic' | 'premium' | 'enterprise';
}

export function AITradingOracle() {
  const [activeTab, setActiveTab] = useState<'predictions' | 'performance' | 'subscriptions'>('predictions');
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');

  // Mock AI predictions data
  const [predictions] = useState<AIPrediction[]>([
    {
      id: '1',
      asset: 'GTT',
      direction: 'bullish',
      confidence: 94.7,
      timeframe: '4h',
      currentPrice: 0.00745,
      targetPrice: 0.0089,
      potentialGain: 19.5,
      aiModel: 'Neural Prophet V3',
      reasoning: 'Whale accumulation pattern detected, institutional buying pressure increasing',
      riskLevel: 'low',
      subscription: 'premium'
    },
    {
      id: '2', 
      asset: 'BTC',
      direction: 'bullish',
      confidence: 87.3,
      timeframe: '12h',
      currentPrice: 103500,
      targetPrice: 108200,
      potentialGain: 4.5,
      aiModel: 'Deep Learning Alpha',
      reasoning: 'Technical breakout confirmed, options flow extremely bullish',
      riskLevel: 'low',
      subscription: 'basic'
    },
    {
      id: '3',
      asset: 'SOL',
      direction: 'bearish',
      confidence: 91.2,
      timeframe: '8h',
      currentPrice: 248.30,
      targetPrice: 235.50,
      potentialGain: 5.2,
      aiModel: 'Quantum Predictor',
      reasoning: 'Overextended rally, smart money taking profits, momentum divergence',
      riskLevel: 'medium',
      subscription: 'enterprise'
    }
  ]);

  const [performance] = useState({
    win_rate: 89.7,
    total_predictions: 2847,
    profitable_predictions: 2554,
    average_gain: 12.4,
    max_drawdown: -3.2,
    sharpe_ratio: 3.8,
    monthly_revenue: 847000,
    active_subscribers: 12847
  });

  const [subscriptionTiers] = useState([
    {
      name: 'AI Basic',
      price: '$99/month',
      features: ['5 AI predictions daily', 'Basic market signals', 'Email alerts'],
      subscribers: 8423,
      revenue: 834270
    },
    {
      name: 'AI Premium', 
      price: '$299/month',
      features: ['Unlimited predictions', 'Real-time alerts', 'Risk analysis', 'API access'],
      subscribers: 3847,
      revenue: 1150053
    },
    {
      name: 'AI Enterprise',
      price: '$999/month', 
      features: ['Custom AI models', 'White-label API', 'Dedicated support', 'Portfolio optimization'],
      subscribers: 577,
      revenue: 576423
    }
  ]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">AI Trading Oracle</h2>
          <p className="text-slate-400">
            Advanced AI predictions generating $2.56M monthly revenue
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge className="bg-green-600/20 text-green-400 border-green-500/30">
            89.7% Win Rate
          </Badge>
          <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/30">
            $2.56M Monthly
          </Badge>
        </div>
      </div>

      {/* Revenue Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-600/20 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Monthly Revenue</p>
                <p className="text-xl font-bold text-white">$2.56M</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <Brain className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Active Subscribers</p>
                <p className="text-xl font-bold text-white">{formatNumber(performance.active_subscribers)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600/20 rounded-lg">
                <Target className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Win Rate</p>
                <p className="text-xl font-bold text-white">{performance.win_rate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-600/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Avg Gain</p>
                <p className="text-xl font-bold text-white">{performance.average_gain}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-slate-800 p-1 rounded-lg">
        <Button
          size="sm"
          variant={activeTab === 'predictions' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('predictions')}
          className="flex-1"
        >
          Live Predictions
        </Button>
        <Button
          size="sm"
          variant={activeTab === 'performance' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('performance')}
          className="flex-1"
        >
          Performance
        </Button>
        <Button
          size="sm"
          variant={activeTab === 'subscriptions' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('subscriptions')}
          className="flex-1"
        >
          Revenue Streams
        </Button>
      </div>

      {/* Content Sections */}
      {activeTab === 'predictions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Live AI Predictions</h3>
            <div className="flex gap-2">
              {['24h', '4h', '1h'].map((tf) => (
                <Button
                  key={tf}
                  size="sm"
                  variant={selectedTimeframe === tf ? 'default' : 'outline'}
                  onClick={() => setSelectedTimeframe(tf)}
                >
                  {tf}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {predictions.map((prediction) => (
              <Card key={prediction.id} className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${
                        prediction.direction === 'bullish' 
                          ? 'bg-green-600/20' 
                          : 'bg-red-600/20'
                      }`}>
                        {prediction.direction === 'bullish' ? (
                          <TrendingUp className="h-6 w-6 text-green-400" />
                        ) : (
                          <TrendingDown className="h-6 w-6 text-red-400" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-xl font-bold text-white">{prediction.asset}</h4>
                          <Badge className={`${
                            prediction.direction === 'bullish' 
                              ? 'bg-green-600/20 text-green-400' 
                              : 'bg-red-600/20 text-red-400'
                          }`}>
                            {prediction.direction.toUpperCase()}
                          </Badge>
                          <Badge className="bg-slate-700 text-slate-300">
                            {prediction.timeframe}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-400 mb-3">{prediction.reasoning}</p>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-slate-500">Current Price</p>
                            <p className="text-sm font-medium text-white">
                              {formatCurrency(prediction.currentPrice)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Target Price</p>
                            <p className="text-sm font-medium text-white">
                              {formatCurrency(prediction.targetPrice)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Potential Gain</p>
                            <p className="text-sm font-medium text-green-400">
                              +{prediction.potentialGain}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="mb-3">
                        <p className="text-xs text-slate-500">AI Confidence</p>
                        <p className="text-2xl font-bold text-white">{prediction.confidence}%</p>
                        <Progress 
                          value={prediction.confidence} 
                          className="w-24 h-2 mt-1" 
                        />
                      </div>
                      <Badge className={`mb-2 ${
                        prediction.subscription === 'enterprise' 
                          ? 'bg-purple-600/20 text-purple-400'
                          : prediction.subscription === 'premium'
                          ? 'bg-blue-600/20 text-blue-400' 
                          : 'bg-gray-600/20 text-gray-400'
                      }`}>
                        {prediction.subscription.toUpperCase()}
                      </Badge>
                      <p className="text-xs text-slate-500">{prediction.aiModel}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="h-6 w-6 text-purple-400" />
                <div>
                  <h4 className="text-lg font-semibold text-white">AI Enterprise Access</h4>
                  <p className="text-sm text-purple-300">
                    Unlock custom AI models and white-label API access for institutional clients
                  </p>
                </div>
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700">
                Upgrade to Enterprise - $999/month
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  Trading Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Predictions</span>
                  <span className="text-white font-medium">{formatNumber(performance.total_predictions)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Profitable</span>
                  <span className="text-green-400 font-medium">{formatNumber(performance.profitable_predictions)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Win Rate</span>
                  <span className="text-green-400 font-bold">{performance.win_rate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Sharpe Ratio</span>
                  <span className="text-purple-400 font-medium">{performance.sharpe_ratio}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-400" />
                  Revenue Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Monthly Revenue</span>
                  <span className="text-green-400 font-bold">${formatNumber(performance.monthly_revenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Average Gain</span>
                  <span className="text-green-400 font-medium">{performance.average_gain}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Max Drawdown</span>
                  <span className="text-red-400 font-medium">{performance.max_drawdown}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Active Subscribers</span>
                  <span className="text-blue-400 font-medium">{formatNumber(performance.active_subscribers)}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-400" />
                  AI Model Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Neural Prophet V3</span>
                    <Badge className="bg-green-600/20 text-green-400">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Deep Learning Alpha</span>
                    <Badge className="bg-green-600/20 text-green-400">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Quantum Predictor</span>
                    <Badge className="bg-yellow-600/20 text-yellow-400">Training</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">GPT-5 Trader</span>
                    <Badge className="bg-blue-600/20 text-blue-400">Beta</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'subscriptions' && (
        <div className="space-y-6">
          <div className="grid gap-6">
            {subscriptionTiers.map((tier, index) => (
              <Card key={tier.name} className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                        <Badge className={`${
                          index === 0 ? 'bg-gray-600/20 text-gray-400' :
                          index === 1 ? 'bg-blue-600/20 text-blue-400' :
                          'bg-purple-600/20 text-purple-400'
                        }`}>
                          {tier.price}
                        </Badge>
                      </div>
                      <div className="space-y-2 mb-4">
                        {tier.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span className="text-slate-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="mb-3">
                        <p className="text-sm text-slate-400">Subscribers</p>
                        <p className="text-2xl font-bold text-white">{formatNumber(tier.subscribers)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Monthly Revenue</p>
                        <p className="text-xl font-bold text-green-400">${formatNumber(tier.revenue)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gradient-to-br from-green-900/50 to-blue-900/50 border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Total Monthly Recurring Revenue</h4>
                  <p className="text-3xl font-bold text-green-400">
                    ${formatNumber(subscriptionTiers.reduce((sum, tier) => sum + tier.revenue, 0))}
                  </p>
                  <p className="text-sm text-green-300 mt-2">
                    Growth rate: +47% month-over-month
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <ArrowUpRight className="h-8 w-8 text-green-400" />
                  <div className="text-right">
                    <p className="text-sm text-slate-400">Total Subscribers</p>
                    <p className="text-2xl font-bold text-white">
                      {formatNumber(subscriptionTiers.reduce((sum, tier) => sum + tier.subscribers, 0))}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}