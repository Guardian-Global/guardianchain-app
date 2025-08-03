import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Coins, Globe, TrendingUp, Zap, Network } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ChainPerformance {
  name: string;
  chain: string;
  capsules: number;
  reputation: number;
  stakingRewards: number;
  isActive: boolean;
}

export default function MultichainStaking() {
  const [walletAddress, setWalletAddress] = useState("");
  const [stakeAmount, setStakeAmount] = useState("");
  const [selectedChain, setSelectedChain] = useState("ethereum");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: chainData, isLoading: chainLoading } = useQuery({
    queryKey: ["/api/dao/multichain-performance"],
  });

  const { data: stakingStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/staking/stats"],
  });

  const stakeMutation = useMutation({
    mutationFn: async (data: { wallet: string; amount: number; chain: string }) => {
      return apiRequest("POST", "/api/staking/mint", data);
    },
    onSuccess: () => {
      setWalletAddress("");
      setStakeAmount("");
      queryClient.invalidateQueries({ queryKey: ["/api/staking/stats"] });
      toast({
        title: "Staking Successful",
        description: "Your GTT has been staked across multichain validators.",
      });
    },
    onError: () => {
      toast({
        title: "Staking Failed",
        description: "Failed to stake GTT. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleStake = () => {
    if (walletAddress && stakeAmount && parseFloat(stakeAmount) > 0) {
      stakeMutation.mutate({
        wallet: walletAddress,
        amount: parseFloat(stakeAmount),
        chain: selectedChain
      });
    }
  };

  if (chainLoading || statsLoading) {
    return (
      <Card className="bg-brand-secondary border-brand-surface">
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-brand-light/60">Loading multichain staking data...</p>
        </CardContent>
      </Card>
    );
  }

  const getChainColor = (chain: string) => {
    switch (chain.toLowerCase()) {
      case "ethereum": return "text-blue-400 border-blue-500";
      case "polygon": return "text-purple-400 border-purple-500";
      case "base": return "text-blue-300 border-blue-300";
      case "arbitrum": return "text-blue-500 border-blue-600";
      default: return "text-gray-400 border-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      {/* Staking Interface */}
      <Card className="bg-brand-secondary border-brand-surface">
        <CardHeader>
          <CardTitle className="text-brand-light flex items-center gap-2">
            <Coins className="w-5 h-5 text-brand-accent" />
            Multichain GTT Staking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-brand-light/80">Wallet Address</label>
              <Input
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="0x..."
                className="bg-brand-surface border-brand-light/20 text-brand-light"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-brand-light/80">Stake Amount (GTT)</label>
              <Input
                type="number"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                placeholder="1000"
                className="bg-brand-surface border-brand-light/20 text-brand-light"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-brand-light/80">Target Chain</label>
              <Select value={selectedChain} onValueChange={setSelectedChain}>
                <SelectTrigger className="bg-brand-surface border-brand-light/20 text-brand-light">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ethereum">Ethereum</SelectItem>
                  <SelectItem value="polygon">Polygon</SelectItem>
                  <SelectItem value="base">Base</SelectItem>
                  <SelectItem value="arbitrum">Arbitrum</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button
            onClick={handleStake}
            disabled={!walletAddress || !stakeAmount || stakeMutation.isPending}
            className="w-full bg-brand-primary hover:bg-brand-primary/80"
          >
            {stakeMutation.isPending ? "Staking..." : "Stake GTT"}
          </Button>
        </CardContent>
      </Card>

      {/* Staking Statistics */}
      <Card className="bg-brand-secondary border-brand-surface">
        <CardHeader>
          <CardTitle className="text-brand-light flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-accent" />
            Staking Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-brand-surface rounded">
              <div className="text-xl font-bold text-brand-warning">
                {stakingStats?.totalStaked?.toLocaleString() || "847,230"}
              </div>
              <div className="text-xs text-brand-light/60">Total Staked</div>
            </div>
            <div className="text-center p-3 bg-brand-surface rounded">
              <div className="text-xl font-bold text-brand-success">
                {stakingStats?.rewardsDistributed?.toLocaleString() || "156,890"}
              </div>
              <div className="text-xs text-brand-light/60">Rewards Distributed</div>
            </div>
            <div className="text-center p-3 bg-brand-surface rounded">
              <div className="text-xl font-bold text-brand-accent">
                {stakingStats?.activeValidators || "47"}
              </div>
              <div className="text-xs text-brand-light/60">Active Validators</div>
            </div>
            <div className="text-center p-3 bg-brand-surface rounded">
              <div className="text-xl font-bold text-brand-light">
                {stakingStats?.supportedChains || "4"}
              </div>
              <div className="text-xs text-brand-light/60">Supported Chains</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Multichain Performance */}
      <Card className="bg-brand-secondary border-brand-surface">
        <CardHeader>
          <CardTitle className="text-brand-light flex items-center gap-2">
            <Network className="w-5 h-5 text-brand-accent" />
            Multichain Validator Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {chainData?.map((validator: ChainPerformance, index: number) => (
              <div key={index} className="p-4 bg-brand-surface rounded-lg border border-brand-light/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center">
                      <Globe className="w-4 h-4 text-brand-accent" />
                    </div>
                    <div>
                      <h4 className="font-medium text-brand-light">{validator.name}</h4>
                      <Badge 
                        variant="outline"
                        className={getChainColor(validator.chain)}
                      >
                        {validator.chain}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={validator.isActive ? "default" : "secondary"}
                      className={validator.isActive ? "bg-green-500 text-white" : "bg-red-500 text-white"}
                    >
                      {validator.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center p-2 bg-brand-dark/30 rounded">
                    <div className="font-bold text-brand-accent">{validator.capsules}</div>
                    <div className="text-xs text-brand-light/60">Capsules</div>
                  </div>
                  <div className="text-center p-2 bg-brand-dark/30 rounded">
                    <div className="font-bold text-brand-warning">{validator.reputation}</div>
                    <div className="text-xs text-brand-light/60">Reputation</div>
                  </div>
                  <div className="text-center p-2 bg-brand-dark/30 rounded">
                    <div className="font-bold text-brand-success">
                      {validator.stakingRewards?.toLocaleString() || "2,340"}
                    </div>
                    <div className="text-xs text-brand-light/60">Staking Rewards</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}