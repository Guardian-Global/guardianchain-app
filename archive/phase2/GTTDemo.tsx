import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { GTTYieldButton } from "@/components/gtt/GTTYieldButton";
import { GTTBalanceWidget } from "@/components/gtt/GTTBalanceWidget";
import { triggerGTTYield, calculateGriefYield } from "@/lib/gtt";
import { useToast } from "@/hooks/use-toast";
import {
  Coins,
  Calculator,
  Wallet,
  TrendingUp,
  Shield,
  Zap,
  Star,
  Award,
} from "lucide-react";

export default function GTTDemo() {
  const [authorAddress, setAuthorAddress] = useState(
    "0x1234567890123456789012345678901234567890",
  );
  const [griefTier, setGriefTier] = useState(3);
  const [truthScore, setTruthScore] = useState(75);
  const [verificationCount, setVerificationCount] = useState(3);
  const [capsuleAge, setCapsuleAge] = useState(7);
  const [yieldCalculation, setYieldCalculation] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();

  const handleCalculateYield = async () => {
    setIsCalculating(true);
    try {
      const ageInMs = capsuleAge * 24 * 60 * 60 * 1000; // Convert days to milliseconds
      const result = await calculateGriefYield(
        truthScore,
        verificationCount,
        ageInMs,
      );
      setYieldCalculation(result);

      toast({
        title: "Yield Calculated",
        description: `Total yield: ${result.totalYield} GTT based on grief metrics`,
      });
    } catch (error) {
      toast({
        title: "Calculation Failed",
        description: "Unable to calculate yield. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const handleDirectYieldTest = async () => {
    try {
      await triggerGTTYield(authorAddress, griefTier);
      toast({
        title: "Direct Yield Triggered",
        description: `${griefTier * 10} GTT distributed successfully!`,
      });
    } catch (error) {
      toast({
        title: "Distribution Failed",
        description: "Direct yield distribution failed.",
        variant: "destructive",
      });
    }
  };

  const getTierColor = (tier: number) => {
    switch (tier) {
      case 1:
        return "bg-gray-500";
      case 2:
        return "bg-blue-500";
      case 3:
        return "bg-green-500";
      case 4:
        return "bg-purple-500";
      case 5:
        return "bg-gold-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTierName = (tier: number) => {
    switch (tier) {
      case 1:
        return "Bronze";
      case 2:
        return "Silver";
      case 3:
        return "Gold";
      case 4:
        return "Platinum";
      case 5:
        return "Diamond";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
            <Coins className="h-8 w-8 text-green-400" />
            GTT Yield Distribution Demo
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Experience GuardianChain's grief-based tokenomics system. Test yield
            calculations, distribution mechanisms, and Web3 integration in
            real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* GTT Balance Widget */}
          <div className="lg:col-span-1">
            <GTTBalanceWidget
              walletAddress={authorAddress}
              autoRefresh={true}
              refreshInterval={15000}
            />
          </div>

          {/* Grief Tier Info */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-400" />
                  Grief Tier System
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-3">
                  {[1, 2, 3, 4, 5].map((tier) => (
                    <div
                      key={tier}
                      className={`p-3 rounded-lg text-center cursor-pointer transition-all ${
                        griefTier === tier
                          ? "ring-2 ring-green-400 bg-slate-800"
                          : "bg-slate-800/50 hover:bg-slate-800"
                      }`}
                      onClick={() => setGriefTier(tier)}
                    >
                      <div
                        className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${getTierColor(tier)}`}
                      >
                        <Star className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-sm font-medium text-white">
                        {getTierName(tier)}
                      </div>
                      <div className="text-xs text-slate-400">
                        {tier * 10} GTT
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Yield Calculator */}
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calculator className="h-5 w-5 text-blue-400" />
                Advanced Yield Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-300">Truth Score (0-100)</Label>
                  <Input
                    type="number"
                    value={truthScore}
                    onChange={(e) =>
                      setTruthScore(parseInt(e.target.value) || 0)
                    }
                    min="0"
                    max="100"
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Verifications</Label>
                  <Input
                    type="number"
                    value={verificationCount}
                    onChange={(e) =>
                      setVerificationCount(parseInt(e.target.value) || 0)
                    }
                    min="0"
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div>
                <Label className="text-slate-300">Capsule Age (days)</Label>
                <Input
                  type="number"
                  value={capsuleAge}
                  onChange={(e) => setCapsuleAge(parseInt(e.target.value) || 0)}
                  min="0"
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>

              <Button
                onClick={handleCalculateYield}
                disabled={isCalculating}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isCalculating ? "Calculating..." : "Calculate Grief Yield"}
              </Button>

              {yieldCalculation && (
                <div className="mt-4 p-4 bg-slate-800 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Base Yield:</span>
                    <span className="text-white">
                      {yieldCalculation.baseYield} GTT
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Truth Multiplier:</span>
                    <span className="text-green-400">
                      {yieldCalculation.truthMultiplier.toFixed(2)}x
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Verification Bonus:</span>
                    <span className="text-blue-400">
                      {yieldCalculation.verificationBonus.toFixed(2)}x
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Age Bonus:</span>
                    <span className="text-purple-400">
                      {yieldCalculation.ageBonus.toFixed(2)}x
                    </span>
                  </div>
                  <Separator className="bg-slate-600" />
                  <div className="flex justify-between font-bold">
                    <span className="text-white">Total Yield:</span>
                    <span className="text-green-400">
                      {yieldCalculation.totalYield} GTT
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Direct Distribution */}
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-400" />
                Direct Yield Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-slate-300">Author Address</Label>
                <Input
                  value={authorAddress}
                  onChange={(e) => setAuthorAddress(e.target.value)}
                  placeholder="0x..."
                  className="bg-slate-800 border-slate-600 text-white font-mono text-sm"
                />
              </div>

              <div>
                <Label className="text-slate-300">Selected Grief Tier</Label>
                <div className="flex items-center gap-3 mt-2">
                  <Badge
                    variant="outline"
                    className={`${getTierColor(griefTier)} text-white border-none`}
                  >
                    Tier {griefTier} - {getTierName(griefTier)}
                  </Badge>
                  <span className="text-slate-400">→</span>
                  <span className="text-green-400 font-bold">
                    {griefTier * 10} GTT
                  </span>
                </div>
              </div>

              <Separator className="bg-slate-700" />

              <div className="space-y-3">
                <GTTYieldButton
                  authorAddress={authorAddress}
                  griefTier={griefTier}
                  className="w-full bg-green-600 hover:bg-green-700"
                />

                <Button
                  onClick={handleDirectYieldTest}
                  variant="outline"
                  className="w-full border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Test Direct Distribution
                </Button>
              </div>

              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-center gap-2 text-blue-400 text-sm font-medium mb-1">
                  <Shield className="h-4 w-4" />
                  Development Mode
                </div>
                <p className="text-xs text-slate-400">
                  This demo uses mock transactions for testing. In production,
                  real GTT tokens would be distributed on the Polygon network.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Usage Examples */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Wallet className="h-5 w-5 text-purple-400" />
              Integration Examples
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-white">Basic Usage</h4>
                <div className="bg-slate-800 p-4 rounded-lg font-mono text-sm text-green-400">
                  <div className="text-slate-400">
                    // Trigger GTT yield distribution
                  </div>
                  <div>
                    import &#123; triggerGTTYield &#125; from "@/lib/gtt";
                  </div>
                  <div className="mt-2"></div>
                  <div>await triggerGTTYield("0xAuthorAddressHere", 3);</div>
                  <div className="text-slate-400">// Tier 3 grief = 30 GTT</div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-white">
                  Advanced Calculation
                </h4>
                <div className="bg-slate-800 p-4 rounded-lg font-mono text-sm text-blue-400">
                  <div className="text-slate-400">
                    // Calculate grief-based yield
                  </div>
                  <div>const yield = await calculateGriefYield(</div>
                  <div className="pl-4">truthScore: 85,</div>
                  <div className="pl-4">verifications: 5,</div>
                  <div className="pl-4">ageInMs: 604800000</div>
                  <div>);</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
