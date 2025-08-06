import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  TrendingUp,
  Clock,
  Coins,
  Wallet,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface YieldBreakdown {
  capsuleId: string;
  title: string;
  currentYield: number;
  dailyRate: number;
  apy: number;
  daysActive: number;
}

interface ClaimableData {
  amount: string;
  totalYield: number;
  averageAPY: number;
  capsuleCount: number;
  breakdown: YieldBreakdown[];
  lastUpdated: string;
}

interface YieldHistory {
  date: string;
  totalYield: number;
  capsuleCount: number;
  averageAPY: number;
}

export default function EnhancedVault() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [claiming, setClaiming] = useState(false);
  const [selectedCapsules, setSelectedCapsules] = useState<string[]>([]);

  // Fetch claimable yield data
  const { data: claimableData, isLoading: isLoadingClaimable } = useQuery<ClaimableData>({
    queryKey: ["/api/vault/claimable", user?.id],
    enabled: !!isAuthenticated && !!user,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch yield history
  const { data: historyData, isLoading: isLoadingHistory } = useQuery({
    queryKey: ["/api/vault/history", user?.id],
    enabled: !!isAuthenticated && !!user,
  });

  // Claim yield mutation
  const claimMutation = useMutation({
    mutationFn: async (data: { amount: number; capsuleIds: string[] }) => {
      const response = await fetch("/api/vault/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to claim yield");
      return response.json();
    },
    onSuccess: (result) => {
      toast({
        title: "Yield Claimed Successfully!",
        description: `${result.transaction.amount} GTT has been added to your wallet`,
        variant: "default",
      });
      // Refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/vault/claimable"] });
      queryClient.invalidateQueries({ queryKey: ["/api/vault/history"] });
      setSelectedCapsules([]);
    },
    onError: (error) => {
      toast({
        title: "Claim Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    },
  });

  const handleClaimYield = async () => {
    if (!claimableData || claimableData.totalYield <= 0) return;
    
    setClaiming(true);
    try {
      await claimMutation.mutateAsync({
        amount: claimableData.totalYield,
        capsuleIds: selectedCapsules.length > 0 ? selectedCapsules : claimableData.breakdown.map(b => b.capsuleId),
      });
    } finally {
      setClaiming(false);
    }
  };

  const toggleCapsuleSelection = (capsuleId: string) => {
    setSelectedCapsules(prev => 
      prev.includes(capsuleId) 
        ? prev.filter(id => id !== capsuleId)
        : [...prev, capsuleId]
    );
  };

  const getSelectedYield = () => {
    if (selectedCapsules.length === 0) return claimableData?.totalYield || 0;
    return selectedCapsules.reduce((total, capsuleId) => {
      const capsule = claimableData?.breakdown.find(b => b.capsuleId === capsuleId);
      return total + (capsule?.currentYield || 0);
    }, 0);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 text-white flex items-center justify-center">
        <Card className="bg-slate-800/50 border-slate-700/50 max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="h-16 w-16 text-blue-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3">Access Your Vault</h2>
            <p className="text-gray-300 mb-6">
              Login to view your GTT yield and claim rewards from your truth capsules.
            </p>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/api/login">Login to Continue</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-slate-800/50 bg-slate-800/30 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src="/assets/logo/GUARDIANCHAIN_logo.png"
                alt="GuardianChain"
                className="h-8 w-auto"
              />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                GTT Yield Vault
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-green-400 border-green-500/30">
                {user?.tier || "EXPLORER"}
              </Badge>
              <Button variant="ghost" asChild>
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="capsules">Capsule Breakdown</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Main Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border-yellow-500/30">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-yellow-400">
                    <Coins className="h-5 w-5" />
                    Claimable GTT
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingClaimable ? (
                    <div className="animate-pulse">
                      <div className="h-8 bg-slate-700 rounded mb-2"></div>
                      <div className="h-4 bg-slate-700 rounded w-24"></div>
                    </div>
                  ) : (
                    <>
                      <div className="text-3xl font-bold text-white mb-1">
                        {claimableData?.amount || "0.000000"} GTT
                      </div>
                      <div className="text-sm text-gray-300">
                        ≈ ${((parseFloat(claimableData?.amount || "0")) * 0.0075).toFixed(4)} USD
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-green-500/30">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-green-400">
                    <TrendingUp className="h-5 w-5" />
                    Average APY
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-1">
                    {claimableData?.averageAPY.toFixed(1) || "0.0"}%
                  </div>
                  <div className="text-sm text-gray-300">
                    Across {claimableData?.capsuleCount || 0} capsules
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border-blue-500/30">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-blue-400">
                    <Shield className="h-5 w-5" />
                    Active Capsules
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-1">
                    {claimableData?.capsuleCount || 0}
                  </div>
                  <div className="text-sm text-gray-300">
                    Generating yield
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Claim Section */}
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Claim Your Yield
                </CardTitle>
                <CardDescription>
                  Claim your accumulated GTT yield from verified truth capsules
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                  <div>
                    <div className="text-lg font-semibold">
                      {getSelectedYield().toFixed(6)} GTT Ready to Claim
                    </div>
                    <div className="text-sm text-gray-400">
                      {selectedCapsules.length === 0 ? "All capsules selected" : `${selectedCapsules.length} capsule(s) selected`}
                    </div>
                  </div>
                  <Button
                    onClick={handleClaimYield}
                    disabled={claiming || !claimableData || claimableData.totalYield <= 0}
                    className="bg-yellow-600 hover:bg-yellow-700"
                  >
                    {claiming ? "Processing..." : "Claim GTT"}
                  </Button>
                </div>

                {claimableData && claimableData.totalYield > 0 && (
                  <div className="flex items-center gap-2 text-sm text-green-400">
                    <CheckCircle className="h-4 w-4" />
                    Yield is ready for claiming
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="capsules" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle>Capsule Yield Breakdown</CardTitle>
                <CardDescription>
                  Individual yield performance for each of your truth capsules
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingClaimable ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-16 bg-slate-700 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {claimableData?.breakdown.map((capsule) => (
                      <div
                        key={capsule.capsuleId}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedCapsules.includes(capsule.capsuleId)
                            ? "bg-blue-600/20 border-blue-500/50"
                            : "bg-slate-700/30 border-slate-600/50 hover:border-slate-500/50"
                        }`}
                        onClick={() => toggleCapsuleSelection(capsule.capsuleId)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold">{capsule.title}</h3>
                              <Badge variant="outline" className="text-xs">
                                {capsule.apy.toFixed(1)}% APY
                              </Badge>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm text-gray-400">
                              <div>
                                <span className="text-gray-500">Current Yield:</span>
                                <div className="text-white font-medium">
                                  {capsule.currentYield.toFixed(6)} GTT
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-500">Daily Rate:</span>
                                <div className="text-white font-medium">
                                  {capsule.dailyRate.toFixed(6)} GTT
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-500">Days Active:</span>
                                <div className="text-white font-medium">
                                  {capsule.daysActive}
                                </div>
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    ))}

                    {claimableData?.breakdown.length === 0 && (
                      <div className="text-center py-8 text-gray-400">
                        <AlertCircle className="h-12 w-12 mx-auto mb-3" />
                        <p>No active capsules generating yield yet.</p>
                        <Button asChild className="mt-4">
                          <Link href="/create-capsule">Create Your First Capsule</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle>Yield History</CardTitle>
                <CardDescription>
                  Track your yield growth over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingHistory ? (
                  <div className="animate-pulse space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-12 bg-slate-700 rounded"></div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {historyData?.history?.map((entry: YieldHistory) => (
                      <div
                        key={entry.date}
                        className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="font-medium">{entry.date}</div>
                            <div className="text-sm text-gray-400">
                              {entry.capsuleCount} capsules
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            {entry.totalYield.toFixed(6)} GTT
                          </div>
                          <div className="text-sm text-gray-400">
                            {entry.averageAPY.toFixed(1)}% APY
                          </div>
                        </div>
                      </div>
                    ))}

                    {historyData?.totalGrown && (
                      <div className="mt-4 p-4 bg-green-600/20 border border-green-500/30 rounded-lg">
                        <div className="flex items-center gap-2 text-green-400">
                          <TrendingUp className="h-4 w-4" />
                          <span className="font-semibold">
                            Total Growth: +{historyData.totalGrown.toFixed(6)} GTT
                          </span>
                          <span className="text-sm">
                            over {historyData.periodDays} days
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}