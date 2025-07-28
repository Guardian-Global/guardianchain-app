import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  DollarSign,
  Clock,
  Users,
  Zap,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VaultStats {
  tvl: string;
  apy: string;
  userStaked: string;
  pendingRewards: string;
  sharePrice: string;
  nextCompoundTime: string;
  totalUsers: number;
  performanceFee: string;
}

interface UserPosition {
  stakedAmount: string;
  shares: string;
  totalRewardsEarned: string;
  autoCompoundedAmount: string;
  lastDepositTime: string;
}

export default function VaultDashboard() {
  const { toast } = useToast();
  const [vaultStats, setVaultStats] = useState<VaultStats>({
    tvl: "0",
    apy: "0",
    userStaked: "0",
    pendingRewards: "0",
    sharePrice: "1.00",
    nextCompoundTime: "",
    totalUsers: 0,
    performanceFee: "2%",
  });

  const [userPosition, setUserPosition] = useState<UserPosition>({
    stakedAmount: "0",
    shares: "0",
    totalRewardsEarned: "0",
    autoCompoundedAmount: "0",
    lastDepositTime: "",
  });

  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawShares, setWithdrawShares] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch vault data
  useEffect(() => {
    fetchVaultData();
    const interval = setInterval(fetchVaultData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchVaultData = async () => {
    try {
      // In production, this would call actual smart contract methods
      // For demo, we'll use realistic mock data

      const mockStats: VaultStats = {
        tvl: "2,547,832",
        apy: "25.7",
        userStaked: "15,000",
        pendingRewards: "1,247.50",
        sharePrice: "1.0847",
        nextCompoundTime: new Date(
          Date.now() + 6 * 60 * 60 * 1000
        ).toISOString(), // 6 hours from now
        totalUsers: 1247,
        performanceFee: "2%",
      };

      const mockPosition: UserPosition = {
        stakedAmount: "15,000",
        shares: "13,833.24",
        totalRewardsEarned: "3,247.89",
        autoCompoundedAmount: "1,847.32",
        lastDepositTime: new Date(
          Date.now() - 15 * 24 * 60 * 60 * 1000
        ).toISOString(), // 15 days ago
      };

      setVaultStats(mockStats);
      setUserPosition(mockPosition);
    } catch (error) {
      console.error("Error fetching vault data:", error);
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid deposit amount",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // In production, this would interact with the AutoCompoundVault contract
      // Mock the deposit process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast({
        title: "Deposit Successful",
        description: `Successfully deposited ${depositAmount} GTT to the vault`,
      });

      setDepositAmount("");
      fetchVaultData();
    } catch (error) {
      toast({
        title: "Deposit Failed",
        description: "Failed to deposit tokens to vault",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawShares || parseFloat(withdrawShares) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid number of shares to withdraw",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // In production, this would interact with the AutoCompoundVault contract
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast({
        title: "Withdrawal Successful",
        description: `Successfully withdrew ${withdrawShares} shares from the vault`,
      });

      setWithdrawShares("");
      fetchVaultData();
    } catch (error) {
      toast({
        title: "Withdrawal Failed",
        description: "Failed to withdraw from vault",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompound = async () => {
    setIsLoading(true);

    try {
      // In production, this would call the compound() function on the smart contract
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Compound Triggered",
        description: "Successfully triggered auto-compound for all users",
      });

      fetchVaultData();
    } catch (error) {
      toast({
        title: "Compound Failed",
        description: "Failed to trigger compound",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const timeUntilCompound = () => {
    if (!vaultStats.nextCompoundTime) return "";

    const now = new Date();
    const compoundTime = new Date(vaultStats.nextCompoundTime);
    const diff = compoundTime.getTime() - now.getTime();

    if (diff <= 0) return "Ready to compound";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-green-600 bg-clip-text text-transparent">
          Auto-Compound Vault
        </h2>
        <p className="text-muted-foreground">
          Maximize your GTT yield with automated compounding
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Value Locked
                </p>
                <p className="text-2xl font-bold">{vaultStats.tvl} GTT</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Current APY
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {vaultStats.apy}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active Users
                </p>
                <p className="text-2xl font-bold">
                  {vaultStats.totalUsers.toLocaleString()}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Next Compound
                </p>
                <p className="text-lg font-bold">{timeUntilCompound()}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="deposit">Deposit</TabsTrigger>
          <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Position */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Your Position
                </CardTitle>
                <CardDescription>
                  Your current vault position and earnings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Staked Amount
                    </p>
                    <p className="text-xl font-bold">
                      {userPosition.stakedAmount} GTT
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Your Shares</p>
                    <p className="text-xl font-bold">{userPosition.shares}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Pending Rewards
                    </p>
                    <p className="text-xl font-bold text-green-600">
                      {vaultStats.pendingRewards} GTT
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Earned
                    </p>
                    <p className="text-xl font-bold text-green-600">
                      {userPosition.totalRewardsEarned} GTT
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">
                      Auto-Compounded
                    </span>
                    <Badge variant="secondary">
                      {userPosition.autoCompoundedAmount} GTT
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Share Price
                    </span>
                    <Badge variant="outline">${vaultStats.sharePrice}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vault Information */}
            <Card>
              <CardHeader>
                <CardTitle>Vault Information</CardTitle>
                <CardDescription>
                  Detailed vault configuration and performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Performance Fee
                    </p>
                    <p className="text-lg font-semibold">
                      {vaultStats.performanceFee}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Compound Frequency
                    </p>
                    <p className="text-lg font-semibold">24 hours</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Auto-Compound Progress
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {timeUntilCompound()}
                    </span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>

                <Button
                  onClick={handleCompound}
                  disabled={isLoading}
                  className="w-full"
                  variant="outline"
                >
                  Trigger Manual Compound
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="deposit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowUpRight className="h-5 w-5" />
                Deposit GTT Tokens
              </CardTitle>
              <CardDescription>
                Stake your GTT tokens to earn auto-compounding rewards
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deposit-amount">Amount to Deposit</Label>
                <Input
                  id="deposit-amount"
                  type="number"
                  placeholder="Enter GTT amount"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  You will receive shares proportional to your deposit
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Current Share Price
                  </p>
                  <p className="font-semibold">${vaultStats.sharePrice}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Estimated Shares
                  </p>
                  <p className="font-semibold">
                    {depositAmount
                      ? (
                          parseFloat(depositAmount) /
                          parseFloat(vaultStats.sharePrice)
                        ).toFixed(2)
                      : "0"}
                  </p>
                </div>
              </div>

              <Button
                onClick={handleDeposit}
                disabled={isLoading || !depositAmount}
                className="w-full"
              >
                {isLoading ? "Processing..." : "Deposit to Vault"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdraw" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowDownLeft className="h-5 w-5" />
                Withdraw from Vault
              </CardTitle>
              <CardDescription>
                Redeem your shares for GTT tokens plus earned rewards
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="withdraw-shares">Shares to Withdraw</Label>
                <Input
                  id="withdraw-shares"
                  type="number"
                  placeholder="Enter number of shares"
                  value={withdrawShares}
                  onChange={(e) => setWithdrawShares(e.target.value)}
                  max={userPosition.shares}
                />
                <p className="text-sm text-muted-foreground">
                  Available shares: {userPosition.shares}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Current Share Price
                  </p>
                  <p className="font-semibold">${vaultStats.sharePrice}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">GTT Amount</p>
                  <p className="font-semibold">
                    {withdrawShares
                      ? (
                          parseFloat(withdrawShares) *
                          parseFloat(vaultStats.sharePrice)
                        ).toFixed(2)
                      : "0"}
                  </p>
                </div>
              </div>

              <Button
                onClick={handleWithdraw}
                disabled={isLoading || !withdrawShares}
                className="w-full"
                variant="outline"
              >
                {isLoading ? "Processing..." : "Withdraw from Vault"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
