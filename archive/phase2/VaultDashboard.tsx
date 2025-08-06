import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Vault, 
  Coins, 
  TrendingUp, 
  Users, 
  Clock, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  ArrowUpDown,
  BarChart3,
  Timer,
  Wallet
} from "lucide-react";

interface VaultStats {
  totalBalance: number;
  reserveBalance: number;
  distributedToday: number;
  distributedThisWeek: number;
  distributedThisMonth: number;
  totalDistributed: number;
  activeValidators: number;
  pendingRewards: number;
  lastDistribution: number;
  nextDistribution: number;
  recentTransactions: Array<{
    id: string;
    type: string;
    amount: number;
    timestamp: number;
    recipient?: string;
    metadata?: any;
  }>;
  distributionProgress: {
    daily: { used: number; limit: number; percentage: number };
    weekly: { used: number; limit: number; percentage: number };
    monthly: { used: number; limit: number; percentage: number };
  };
}

interface PayoutQueueStats {
  totalRequests: number;
  pendingAmount: number;
  processedToday: number;
  processingErrors: number;
  averageProcessingTime: number;
  queuesByType: Record<string, number>;
  queuesByPriority: Record<string, number>;
  dailyVolume: number;
  weeklyVolume: number;
  successRate: number;
}

export default function VaultDashboard() {
  const { toast } = useToast();
  const [vaultStats, setVaultStats] = useState<VaultStats | null>(null);
  const [payoutStats, setPayoutStats] = useState<PayoutQueueStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadVaultData();
  }, []);

  const loadVaultData = async () => {
    try {
      setLoading(true);
      
      // Load vault statistics
      const vaultResponse = await apiRequest("GET", "/api/dao/vault/stats");
      setVaultStats(vaultResponse.vault);

      // Load payout queue statistics
      try {
        const payoutResponse = await apiRequest("GET", "/api/payout/stats");
        setPayoutStats(payoutResponse.stats);
      } catch (error) {
        console.log("Payout stats not available:", error);
      }

    } catch (error) {
      console.error("Failed to load vault data:", error);
      toast({
        title: "Error",
        description: "Failed to load vault data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const processWeeklyDistribution = async () => {
    try {
      setProcessing(true);
      
      const response = await apiRequest("POST", "/api/dao/vault/distribute");
      
      if (response.success) {
        toast({
          title: "Distribution Successful",
          description: `Distributed ${response.totalDistributed || 0} GTT to community`
        });
        
        // Reload data
        await loadVaultData();
      } else {
        toast({
          title: "Distribution Failed",
          description: response.reason || "Unknown error occurred",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process distribution",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const getHealthScore = (): number => {
    if (!vaultStats) return 0;
    
    let score = 100;
    
    // Deduct for low balance
    if (vaultStats.totalBalance < 10000) score -= 30;
    else if (vaultStats.totalBalance < 25000) score -= 15;
    
    // Deduct for high distribution usage
    if (vaultStats.distributionProgress.daily.percentage > 90) score -= 20;
    else if (vaultStats.distributionProgress.daily.percentage > 70) score -= 10;
    
    // Deduct for low reserve ratio
    const reserveRatio = (vaultStats.reserveBalance / vaultStats.totalBalance) * 100;
    if (reserveRatio < 10) score -= 25;
    else if (reserveRatio < 20) score -= 15;
    
    return Math.max(0, Math.min(100, score));
  };

  const getHealthColor = (score: number): string => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getStatusBadge = (percentage: number) => {
    if (percentage >= 90) return <Badge variant="destructive">Critical</Badge>;
    if (percentage >= 70) return <Badge variant="secondary">High</Badge>;
    if (percentage >= 50) return <Badge variant="outline">Medium</Badge>;
    return <Badge className="bg-green-600">Healthy</Badge>;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (!vaultStats) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Vault Data Unavailable</h3>
            <p className="text-gray-300 mb-4">Unable to load vault statistics</p>
            <Button onClick={loadVaultData}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const healthScore = getHealthScore();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Vault className="h-8 w-8 text-purple-400" />
          <h1 className="text-3xl font-bold text-white">DAO Vault Dashboard</h1>
        </div>
        <p className="text-gray-300 text-lg">
          Community treasury management and automated reward distribution
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Total Balance</p>
                <p className="text-2xl font-bold text-white">{vaultStats.totalBalance.toLocaleString()}</p>
                <p className="text-xs text-gray-400">GTT</p>
              </div>
              <Coins className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Reserve Balance</p>
                <p className="text-2xl font-bold text-white">{vaultStats.reserveBalance.toLocaleString()}</p>
                <p className="text-xs text-gray-400">
                  {((vaultStats.reserveBalance / vaultStats.totalBalance) * 100).toFixed(1)}% of total
                </p>
              </div>
              <Shield className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Health Score</p>
                <p className={`text-2xl font-bold ${getHealthColor(healthScore)}`}>
                  {healthScore}/100
                </p>
                <p className="text-xs text-gray-400">Vault health status</p>
              </div>
              <BarChart3 className={`h-8 w-8 ${getHealthColor(healthScore).replace('text-', 'text-')}`} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Active Validators</p>
                <p className="text-2xl font-bold text-white">{vaultStats.activeValidators}</p>
                <p className="text-xs text-gray-400">Earning rewards</p>
              </div>
              <Users className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="distributions">Distributions</TabsTrigger>
          <TabsTrigger value="payouts">Payout Queue</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Distribution Progress */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <TrendingUp className="h-5 w-5" />
                  Distribution Limits
                </CardTitle>
                <CardDescription>Current usage against daily/weekly/monthly limits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-300">Daily ({vaultStats.distributionProgress.daily.used.toFixed(0)}/{vaultStats.distributionProgress.daily.limit} GTT)</span>
                    {getStatusBadge(vaultStats.distributionProgress.daily.percentage)}
                  </div>
                  <Progress 
                    value={vaultStats.distributionProgress.daily.percentage} 
                    className="h-2"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-300">Weekly ({vaultStats.distributionProgress.weekly.used.toFixed(0)}/{vaultStats.distributionProgress.weekly.limit} GTT)</span>
                    {getStatusBadge(vaultStats.distributionProgress.weekly.percentage)}
                  </div>
                  <Progress 
                    value={vaultStats.distributionProgress.weekly.percentage} 
                    className="h-2"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-300">Monthly ({vaultStats.distributionProgress.monthly.used.toFixed(0)}/{vaultStats.distributionProgress.monthly.limit} GTT)</span>
                    {getStatusBadge(vaultStats.distributionProgress.monthly.percentage)}
                  </div>
                  <Progress 
                    value={vaultStats.distributionProgress.monthly.percentage} 
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Distribution Schedule */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Timer className="h-5 w-5" />
                  Distribution Schedule
                </CardTitle>
                <CardDescription>Automated reward distribution timeline</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <div>
                      <p className="text-white font-medium">Last Distribution</p>
                      <p className="text-sm text-gray-400">
                        {new Date(vaultStats.lastDistribution).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-yellow-400" />
                    <div>
                      <p className="text-white font-medium">Next Distribution</p>
                      <p className="text-sm text-gray-400">
                        {new Date(vaultStats.nextDistribution).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    onClick={processWeeklyDistribution}
                    disabled={processing}
                    className="w-full"
                  >
                    {processing ? "Processing..." : "Process Weekly Distribution"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="distributions" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-2">
                  {vaultStats.distributedToday.toFixed(2)}
                </div>
                <div className="text-gray-300">GTT Distributed Today</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {vaultStats.distributedThisWeek.toFixed(2)}
                </div>
                <div className="text-gray-300">GTT Distributed This Week</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {vaultStats.totalDistributed.toFixed(2)}
                </div>
                <div className="text-gray-300">Total GTT Distributed</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payouts" className="space-y-6">
          {payoutStats ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-white mb-2">
                    {payoutStats.totalRequests}
                  </div>
                  <div className="text-gray-300 text-sm">Total Requests</div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-yellow-400 mb-2">
                    {payoutStats.pendingAmount.toFixed(2)}
                  </div>
                  <div className="text-gray-300 text-sm">Pending Amount (GTT)</div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-green-400 mb-2">
                    {payoutStats.successRate.toFixed(1)}%
                  </div>
                  <div className="text-gray-300 text-sm">Success Rate</div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-2">
                    {Math.round(payoutStats.averageProcessingTime / 1000)}s
                  </div>
                  <div className="text-gray-300 text-sm">Avg Processing Time</div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-8 text-center">
                <p className="text-gray-300">Payout queue statistics not available</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <ArrowUpDown className="h-5 w-5" />
                Recent Transactions
              </CardTitle>
              <CardDescription>Latest vault transactions and distributions</CardDescription>
            </CardHeader>
            <CardContent>
              {vaultStats.recentTransactions.length > 0 ? (
                <div className="space-y-3">
                  {vaultStats.recentTransactions.slice(0, 10).map(tx => (
                    <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          tx.type === 'deposit' ? 'bg-green-600' :
                          tx.type === 'reward' ? 'bg-blue-600' :
                          tx.type === 'burn' ? 'bg-red-600' :
                          'bg-gray-600'
                        }`}>
                          {tx.type === 'deposit' ? <TrendingUp className="h-4 w-4" /> :
                           tx.type === 'reward' ? <Coins className="h-4 w-4" /> :
                           <ArrowUpDown className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="text-white font-medium capitalize">
                            {tx.type.replace('_', ' ')}
                          </p>
                          <p className="text-sm text-gray-400">
                            {new Date(tx.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${
                          tx.type === 'deposit' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {tx.type === 'deposit' ? '+' : '-'}{tx.amount.toFixed(2)} GTT
                        </p>
                        {tx.recipient && (
                          <p className="text-xs text-gray-400">
                            {tx.recipient.slice(0, 10)}...
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Wallet className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-300">No recent transactions</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}