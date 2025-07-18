import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Crown, 
  Zap, 
  Settings, 
  Database, 
  Users, 
  Shield, 
  TrendingUp, 
  DollarSign,
  AlertTriangle,
  Cpu,
  Activity,
  BarChart3,
  RefreshCw,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import MintGTTButton from "@/components/web3/MintGTTButton";
import VeritusNodePanel from "@/components/web3/VeritusNodePanel";

export default function CommanderView() {
  const [mintAmount, setMintAmount] = useState("");
  const [targetWallet, setTargetWallet] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: protocolStats } = useQuery({
    queryKey: ["/api/protocol/stats"],
  });

  const { data: daoStats } = useQuery({
    queryKey: ["/api/dao/stats"],
  });

  const { data: systemHealth } = useQuery({
    queryKey: ["/api/system/health"],
  });

  const mintGTTMutation = useMutation({
    mutationFn: async (data: { amount: number; wallet: string }) => {
      const response = await apiRequest('POST', '/api/mint/gtt', data);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to mint GTT');
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "GTT Minted Successfully",
        description: `Minted ${data.amount} GTT tokens to ${data.wallet}`,
      });
      setMintAmount("");
      setTargetWallet("");
      queryClient.invalidateQueries({ queryKey: ["/api/protocol/stats"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Mint Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const syncIndexMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/system/sync-index', {});
      if (!response.ok) throw new Error('Sync failed');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Index Synced",
        description: "Capsule index has been synchronized successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/system/health"] });
    }
  });

  const handleMintGTT = () => {
    if (!mintAmount || !targetWallet) {
      toast({
        title: "Missing Fields",
        description: "Please enter both amount and wallet address",
        variant: "destructive",
      });
      return;
    }

    mintGTTMutation.mutate({
      amount: parseFloat(mintAmount),
      wallet: targetWallet
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <section className="pt-20 pb-12 bg-gradient-to-br from-purple-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-purple-600 p-3 rounded-lg">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold gradient-text">
                Commander Control Panel
              </h1>
            </div>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Root-level protocol management and system oversight
            </p>
            <Badge variant="outline" className="border-purple-500 text-purple-400">
              Administrator Access Required
            </Badge>
          </div>
        </div>
      </section>

      {/* Protocol Controls */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* GTT Mint Controls */}
            <div className="space-y-4">
              <MintGTTButton 
                variant="card"
                amount={mintAmount}
                recipient={targetWallet}
                onMintSuccess={(txHash, amount) => {
                  toast({
                    title: "On-Chain Mint Successful",
                    description: `Minted ${amount} GTT tokens via smart contract`,
                  });
                  queryClient.invalidateQueries({ queryKey: ["/api/protocol/stats"] });
                }}
              />
              
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Zap className="h-4 w-4 text-blue-400" />
                    Alternative: API Mint (Development)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      type="number"
                      placeholder="100.0"
                      value={mintAmount}
                      onChange={(e) => setMintAmount(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white text-sm"
                    />
                    <Input
                      placeholder="0x..."
                      value={targetWallet}
                      onChange={(e) => setTargetWallet(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white text-sm"
                    />
                  </div>
                  <Button 
                    onClick={handleMintGTT}
                    disabled={mintGTTMutation.isPending}
                    variant="outline"
                    className="w-full border-slate-600 text-xs"
                  >
                    {mintGTTMutation.isPending ? "Minting..." : "Simulate API Mint"}
                  </Button>
                  <div className="text-xs text-slate-400 space-y-1">
                    <p>• Current Supply: {protocolStats?.totalGTT || 0} GTT</p>
                    <p>• Circulating: {protocolStats?.circulatingGTT || 0} GTT</p>
                    <p>• Vault Holdings: {protocolStats?.vaultGTT || 0} GTT</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Controls */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-400" />
                  System Operations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => syncIndexMutation.mutate()}
                  disabled={syncIndexMutation.isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Database className="mr-2 h-4 w-4" />
                  {syncIndexMutation.isPending ? "Syncing..." : "Sync Capsule Index"}
                </Button>
                <Button variant="outline" className="w-full border-slate-600">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh All Caches
                </Button>
                <Button variant="outline" className="w-full border-slate-600">
                  <Download className="mr-2 h-4 w-4" />
                  Export System Logs
                </Button>
                <Button variant="outline" className="w-full border-slate-600">
                  <Cpu className="mr-2 h-4 w-4" />
                  Run Diagnostics
                </Button>
              </CardContent>
            </Card>

            {/* System Health */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-400" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">API Server</span>
                  <Badge variant="default" className="bg-green-600">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Database</span>
                  <Badge variant="default" className="bg-green-600">Healthy</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">IPFS Gateway</span>
                  <Badge variant="default" className="bg-green-600">Connected</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">DocuSign API</span>
                  <Badge variant="default" className="bg-green-600">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Blockchain RPC</span>
                  <Badge variant="default" className="bg-green-600">Synced</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Memory Usage</span>
                  <span className="text-xs text-slate-300">
                    {systemHealth?.memoryUsage || "45%"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Protocol Metrics */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Total Capsules</p>
                    <p className="text-3xl font-bold text-white">
                      {protocolStats?.totalCapsules || 24}
                    </p>
                  </div>
                  <div className="bg-blue-600 p-3 rounded-lg">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  +{protocolStats?.newCapsulesToday || 3} today
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Sealed Capsules</p>
                    <p className="text-3xl font-bold text-green-400">
                      {protocolStats?.sealedCapsules || 15}
                    </p>
                  </div>
                  <div className="bg-green-600 p-3 rounded-lg">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  {protocolStats?.sealRate || 62}% seal rate
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Active Users</p>
                    <p className="text-3xl font-bold text-purple-400">
                      {protocolStats?.activeUsers || 89}
                    </p>
                  </div>
                  <div className="bg-purple-600 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  +{protocolStats?.newUsersToday || 12} today
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">GTT Circulating</p>
                    <p className="text-3xl font-bold text-yellow-400">
                      {protocolStats?.circulatingGTT || 1247}
                    </p>
                  </div>
                  <div className="bg-yellow-600 p-3 rounded-lg">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  +{protocolStats?.gttMintedToday || 45} today
                </p>
              </CardContent>
            </Card>
          </div>

          {/* DAO Governance */}
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-400" />
                  DAO Governance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-400 text-sm">Active Proposals</p>
                    <p className="text-2xl font-bold text-white">
                      {daoStats?.activeProposals || 3}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Total Voters</p>
                    <p className="text-2xl font-bold text-white">
                      {daoStats?.totalVoters || 67}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Top Voter:</span>
                    <span className="text-white font-mono text-xs">
                      {daoStats?.topVoter || "0xB8c...E19"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Treasury:</span>
                    <span className="text-yellow-400">
                      {daoStats?.treasuryBalance || "2,450"} GTT
                    </span>
                  </div>
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Governance Dashboard
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  Analytics Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Grief Score Range:</span>
                    <span className="text-white">0 → 97</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Avg Truth Yield:</span>
                    <span className="text-green-400">156.8 GTT</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Total Views:</span>
                    <span className="text-white">45,223</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Share Rate:</span>
                    <span className="text-blue-400">23.4%</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full border-slate-600">
                  <Download className="mr-2 h-4 w-4" />
                  Export Full Report
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Emergency Controls */}
          <Card className="bg-red-900/20 border-red-700 mt-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="h-5 w-5" />
                Emergency Controls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
                  Pause Protocol
                </Button>
                <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
                  Emergency Withdraw
                </Button>
                <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
                  Lock All Capsules
                </Button>
              </div>
              <p className="text-xs text-red-300 mt-4">
                ⚠️ Emergency controls should only be used in critical situations. 
                All actions are logged and require multi-signature approval.
              </p>
            </CardContent>
          </Card>

          {/* CapsuleFactoryV2 Veritus Admin Panel */}
          <div className="mt-8">
            <VeritusNodePanel />
          </div>
        </div>
      </section>
    </div>
  );
}