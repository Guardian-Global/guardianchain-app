import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Lock,
  Coins,
  Calendar,
  TrendingUp,
  Shield,
  Calculator,
  Clock,
  Zap,
  Award
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface StakeData {
  id: string;
  gttAmount: number;
  daysLocked: number;
  multiplier: number;
  startedAt: string;
  endsAt: string;
  yieldEarned: number;
  claimed: boolean;
}

export default function VaultStake() {
  const { user, isAuthenticated } = useAuth();
  const [amount, setAmount] = useState("");
  const [days, setDays] = useState(30);
  const [isStaking, setIsStaking] = useState(false);
  const [userStakes, setUserStakes] = useState<StakeData[]>([]);
  const [gttBalance, setGttBalance] = useState(0);

  // Calculate estimated APY based on lock duration
  const calculateAPY = (lockDays: number) => {
    const baseAPY = 0.05; // 5% base
    const bonusAPY = lockDays / 365 * 0.15; // Up to 15% bonus for 1 year
    return (baseAPY + bonusAPY) * 100;
  };

  const estimatedAPY = calculateAPY(days);
  const estimatedYield = (parseFloat(amount) || 0) * (estimatedAPY / 100) * (days / 365);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated) return;
      
      try {
        const [stakesRes, balanceRes] = await Promise.all([
          fetch("/api/yield/stakes"),
          fetch("/api/user/gtt-balance")
        ]);
        
        if (stakesRes.ok) {
          const stakes = await stakesRes.json();
          setUserStakes(stakes);
        }
        
        if (balanceRes.ok) {
          const balance = await balanceRes.json();
          setGttBalance(balance.amount);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, [isAuthenticated]);

  const handleStake = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    setIsStaking(true);
    try {
      const response = await fetch("/api/yield/stake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gttAmount: parseFloat(amount),
          daysLocked: days
        })
      });
      
      if (response.ok) {
        setAmount("");
        // Refresh user stakes
        const stakesRes = await fetch("/api/yield/stakes");
        if (stakesRes.ok) {
          const stakes = await stakesRes.json();
          setUserStakes(stakes);
        }
      }
    } catch (error) {
      console.error("Staking failed:", error);
    } finally {
      setIsStaking(false);
    }
  };

  const handleClaim = async (stakeId: string) => {
    try {
      const response = await fetch(`/api/yield/claim/${stakeId}`, {
        method: "POST"
      });
      
      if (response.ok) {
        // Refresh user stakes
        const stakesRes = await fetch("/api/yield/stakes");
        if (stakesRes.ok) {
          const stakes = await stakesRes.json();
          setUserStakes(stakes);
        }
      }
    } catch (error) {
      console.error("Claim failed:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center p-6">
            <Shield className="w-12 h-12 text-brand-accent mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Authentication Required</h2>
            <p className="text-brand-text-muted mb-4">Please log in to access GTT staking</p>
            <Button onClick={() => window.location.href = '/api/login'}>
              Log In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">🏦 GTT Staking Vault</h1>
          <p className="text-brand-text-muted">
            Lock your GTT tokens to earn yield based on lock duration and platform performance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Staking Form */}
          <Card className="bg-brand-secondary border-brand-surface">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Stake GTT Tokens
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Available Balance: {gttBalance.toFixed(2)} GTT
                </label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Amount to stake"
                  max={gttBalance}
                  className="bg-brand-surface border-brand-surface"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Lock Duration: {days} days
                </label>
                <input
                  type="range"
                  min="7"
                  max="365"
                  value={days}
                  onChange={(e) => setDays(parseInt(e.target.value))}
                  className="w-full h-2 bg-brand-surface rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-brand-text-muted mt-1">
                  <span>7 days</span>
                  <span>365 days</span>
                </div>
              </div>

              <div className="bg-brand-surface p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-brand-text-muted">Estimated APY:</span>
                  <span className="font-semibold text-brand-accent">{estimatedAPY.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-text-muted">Estimated Yield:</span>
                  <span className="font-semibold text-green-400">{estimatedYield.toFixed(4)} GTT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-text-muted">Unlock Date:</span>
                  <span className="text-white">
                    {new Date(Date.now() + days * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <Button
                onClick={handleStake}
                disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > gttBalance || isStaking}
                className="w-full bg-brand-accent hover:bg-brand-accent/90"
              >
                {isStaking ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Staking...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Stake GTT
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* APY Calculator */}
          <Card className="bg-brand-secondary border-brand-surface">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                APY Calculator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand-accent mb-2">
                    {estimatedAPY.toFixed(2)}%
                  </div>
                  <p className="text-brand-text-muted">Annual Percentage Yield</p>
                </div>

                <Progress value={(estimatedAPY / 20) * 100} className="h-3" />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-3 bg-brand-surface rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-1" />
                    <div className="font-semibold">Base APY</div>
                    <div className="text-brand-text-muted">5.00%</div>
                  </div>
                  <div className="text-center p-3 bg-brand-surface rounded-lg">
                    <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
                    <div className="font-semibold">Lock Bonus</div>
                    <div className="text-brand-text-muted">+{((estimatedAPY - 5)).toFixed(2)}%</div>
                  </div>
                </div>

                <Alert>
                  <AlertDescription>
                    Longer lock periods earn higher yields. Maximum 20% APY for 1-year locks.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Stakes */}
        {userStakes.length > 0 && (
          <Card className="mt-8 bg-brand-secondary border-brand-surface">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="w-5 h-5" />
                Your Active Stakes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userStakes.map((stake) => {
                  const isMatured = new Date(stake.endsAt) <= new Date();
                  const daysRemaining = Math.max(0, Math.ceil((new Date(stake.endsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
                  
                  return (
                    <div key={stake.id} className="p-4 bg-brand-surface rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="font-semibold text-white">{stake.gttAmount} GTT</div>
                          <div className="text-sm text-brand-text-muted">
                            {stake.daysLocked} days • {(stake.multiplier * 100).toFixed(2)}% APY
                          </div>
                        </div>
                        <Badge className={isMatured ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"}>
                          {isMatured ? "Matured" : `${daysRemaining} days left`}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-sm">
                          <span className="text-brand-text-muted">Yield Earned: </span>
                          <span className="text-green-400 font-semibold">{stake.yieldEarned.toFixed(4)} GTT</span>
                        </div>
                        
                        {isMatured && !stake.claimed && (
                          <Button
                            size="sm"
                            onClick={() => handleClaim(stake.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Award className="w-4 h-4 mr-1" />
                            Claim
                          </Button>
                        )}
                      </div>
                      
                      {!isMatured && (
                        <Progress 
                          value={((stake.daysLocked - daysRemaining) / stake.daysLocked) * 100} 
                          className="mt-3 h-2"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}