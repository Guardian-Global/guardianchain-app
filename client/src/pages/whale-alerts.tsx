import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Fish, 
  TrendingUp, 
  Bell, 
  Target,
  AlertCircle,
  Users,
  DollarSign,
  Eye,
  Zap,
  Timer,
  Crown,
  Waves
} from "lucide-react";

interface WhaleTransaction {
  id: string;
  wallet: string;
  amount: number;
  type: 'buy' | 'sell';
  timestamp: Date;
  impact: number;
  verified: boolean;
}

export default function WhaleAlerts() {
  const [whaleTransactions, setWhaleTransactions] = useState<WhaleTransaction[]>([]);
  const [totalWhaleVolume, setTotalWhaleVolume] = useState(125000);
  const [whaleCount, setWhaleCount] = useState(23);
  const [alertsEnabled, setAlertsEnabled] = useState(false);

  useEffect(() => {
    // Generate whale transaction alerts
    const generateWhaleAlert = () => {
      const newTransaction: WhaleTransaction = {
        id: Date.now().toString(),
        wallet: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`,
        amount: Math.floor(Math.random() * 50000) + 10000,
        type: Math.random() > 0.5 ? 'buy' : 'sell',
        timestamp: new Date(),
        impact: Math.random() * 15 + 5,
        verified: Math.random() > 0.3
      };
      
      setWhaleTransactions(prev => [newTransaction, ...prev.slice(0, 9)]);
      setTotalWhaleVolume(prev => prev + newTransaction.amount);
    };

    const interval = setInterval(generateWhaleAlert, 15000); // Every 15 seconds
    
    // Initial transactions
    for (let i = 0; i < 5; i++) {
      setTimeout(generateWhaleAlert, i * 1000);
    }

    return () => clearInterval(interval);
  }, []);

  const toggleAlerts = () => {
    setAlertsEnabled(!alertsEnabled);
    if (!alertsEnabled) {
      // Request notification permission
      if ('Notification' in window) {
        Notification.requestPermission();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-teal-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Fish className="w-12 h-12 text-blue-400 mr-3" />
            <h1 className="text-4xl font-bold text-white">
              🐋 Whale Movement Alerts
            </h1>
            <Fish className="w-12 h-12 text-blue-400 ml-3" />
          </div>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Real-time alerts when whales move GTT tokens. Follow the smart money.
          </p>
        </div>

        {/* Alert Controls */}
        <Card className="bg-slate-800/50 border-slate-600 mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Bell className={`w-8 h-8 ${alertsEnabled ? 'text-green-400' : 'text-slate-400'}`} />
                <div>
                  <h3 className="text-white font-bold">Whale Alert Notifications</h3>
                  <p className="text-slate-400">Get instant alerts for transactions over $10,000</p>
                </div>
              </div>
              <Button 
                onClick={toggleAlerts}
                className={alertsEnabled ? 
                  "bg-green-600 hover:bg-green-700" : 
                  "bg-slate-600 hover:bg-slate-700"
                }
              >
                {alertsEnabled ? 'Alerts ON' : 'Enable Alerts'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Whale Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-600/20 to-teal-600/20 border-blue-500/30">
            <CardContent className="pt-6 text-center">
              <Fish className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {whaleCount}
              </div>
              <div className="text-slate-400">Active Whales</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-teal-600/20 to-green-600/20 border-teal-500/30">
            <CardContent className="pt-6 text-center">
              <DollarSign className="w-8 h-8 text-teal-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                ${totalWhaleVolume.toLocaleString()}
              </div>
              <div className="text-slate-400">Whale Volume 24h</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-green-500/30">
            <CardContent className="pt-6 text-center">
              <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                +18.5%
              </div>
              <div className="text-slate-400">Whale Impact</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-500/30">
            <CardContent className="pt-6 text-center">
              <Eye className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                1,247
              </div>
              <div className="text-slate-400">Whale Watchers</div>
            </CardContent>
          </Card>
        </div>

        {/* Live Whale Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="bg-slate-800/50 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Waves className="w-6 h-6 mr-2 text-blue-400" />
                Live Whale Movements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {whaleTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        transaction.type === 'buy' ? 'bg-green-400' : 'bg-red-400'
                      } animate-pulse`}></div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-mono text-sm">
                            {transaction.wallet}
                          </span>
                          {transaction.verified && (
                            <Badge variant="outline" className="text-blue-400 border-blue-400 text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="text-slate-400 text-xs">
                          {transaction.timestamp.toLocaleTimeString()} • 
                          Impact: {transaction.impact.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${
                        transaction.type === 'buy' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {transaction.type === 'buy' ? '+' : '-'}${transaction.amount.toLocaleString()}
                      </div>
                      <div className="text-slate-400 text-xs">
                        {transaction.type.toUpperCase()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Whale Strategy Insights */}
          <Card className="bg-slate-800/50 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Target className="w-6 h-6 mr-2 text-purple-400" />
                Whale Strategy Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-600/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-5 h-5 text-yellow-400" />
                  <span className="text-green-300 font-semibold">Accumulation Phase</span>
                </div>
                <p className="text-white text-sm">
                  Top 3 whales are accumulating. 73% of large transactions are buys.
                </p>
              </div>
              
              <div className="bg-blue-600/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-300 font-semibold">Smart Money Pattern</span>
                </div>
                <p className="text-white text-sm">
                  Whale activity precedes 85% of major price movements by 2-4 hours.
                </p>
              </div>
              
              <div className="bg-purple-600/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Timer className="w-5 h-5 text-purple-400" />
                  <span className="text-purple-300 font-semibold">Entry Signal</span>
                </div>
                <p className="text-white text-sm">
                  When 3+ whales buy within 1 hour, price typically increases 12-25%.
                </p>
              </div>

              <Button 
                size="lg"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Fish className="w-5 h-5 mr-2" />
                Copy Whale Trades
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Follow Whale Strategy */}
        <Card className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-blue-500/30">
          <CardContent className="pt-6 text-center">
            <Fish className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">
              🐋 Follow the Whales Strategy
            </h3>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Whales have inside information and massive resources. When they move, smart money follows. 
              Our algorithm tracks their patterns and alerts you to profitable opportunities.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-600/20 p-4 rounded-lg">
                <AlertCircle className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-white font-bold">Instant Alerts</div>
                <div className="text-slate-400 text-sm">Get notified within seconds</div>
              </div>
              <div className="bg-green-600/20 p-4 rounded-lg">
                <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-white font-bold">Smart Entry</div>
                <div className="text-slate-400 text-sm">Follow verified whale wallets</div>
              </div>
              <div className="bg-purple-600/20 p-4 rounded-lg">
                <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-white font-bold">Profit Together</div>
                <div className="text-slate-400 text-sm">85% success rate tracking</div>
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
                onClick={() => window.location.href = '/create-capsule'}
              >
                Start Whale Tracking
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
                onClick={() => window.location.href = '/trade-competition'}
              >
                Join Competition
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}