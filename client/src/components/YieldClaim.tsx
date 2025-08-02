import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Coins,
  Zap,
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface YieldClaimProps {
  availableYield: number;
  totalEarned?: number;
  nextClaimTime?: string;
  claimHistory?: Array<{
    amount: number;
    timestamp: string;
    txHash?: string;
  }>;
}

export default function YieldClaim({
  availableYield,
  totalEarned = 0,
  nextClaimTime,
  claimHistory = [],
}: YieldClaimProps) {
  const [message, setMessage] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const claimMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/yield/claim"),
    onSuccess: (data) => {
      setMessage(`Successfully claimed ${availableYield} GTT tokens!`);
      toast({
        title: "Yield Claimed Successfully",
        description: `${availableYield} GTT tokens have been added to your wallet`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/yield"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/balance"] });
    },
    onError: (error: any) => {
      setMessage("Failed to claim yield. Please try again.");
      toast({
        title: "Claim Failed",
        description: error.message || "Unable to process yield claim",
        variant: "destructive",
      });
    },
  });

  const isClaimable = availableYield > 0;
  const isOnCooldown = nextClaimTime && new Date(nextClaimTime) > new Date();
  const canClaim = isClaimable && !isOnCooldown && !claimMutation.isPending;

  const formatTimeRemaining = (timeString: string) => {
    const now = new Date();
    const target = new Date(timeString);
    const diff = target.getTime() - now.getTime();

    if (diff <= 0) return null;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  return (
    <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center">
            <Coins className="w-5 h-5 mr-2 text-yellow-400" />
            Yield Claims
          </div>
          <Badge className="bg-yellow-600 text-white">
            {availableYield.toFixed(4)} GTT
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Main Claim Section */}
        <div className="bg-slate-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white flex items-center">
                <DollarSign className="w-4 h-4 mr-1 text-green-400" />
                Available Yield
              </h3>
              <p className="text-2xl font-bold text-yellow-400">
                {availableYield.toFixed(6)} GTT
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-slate-400">Total Earned</p>
              <p className="text-lg font-semibold text-green-400">
                {totalEarned.toFixed(4)} GTT
              </p>
            </div>
          </div>

          <Button
            onClick={() => claimMutation.mutate()}
            disabled={!canClaim}
            className={`w-full ${
              canClaim
                ? "bg-green-600 hover:bg-green-700"
                : "bg-slate-600 cursor-not-allowed"
            }`}
          >
            {claimMutation.isPending ? (
              <>
                <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                Processing...
              </>
            ) : !isClaimable ? (
              <>
                <AlertCircle className="w-4 h-4 mr-2" />
                No Yield Available
              </>
            ) : isOnCooldown ? (
              <>
                <Clock className="w-4 h-4 mr-2" />
                Cooldown: {formatTimeRemaining(nextClaimTime!)}
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Claim Yield
              </>
            )}
          </Button>

          {message && (
            <div
              className={`mt-3 p-3 rounded-lg ${
                message.includes("Successfully")
                  ? "bg-green-600/20 border border-green-600/30 text-green-400"
                  : "bg-red-600/20 border border-red-600/30 text-red-400"
              }`}
            >
              <div className="flex items-center">
                {message.includes("Successfully") ? (
                  <CheckCircle className="w-4 h-4 mr-2" />
                ) : (
                  <AlertCircle className="w-4 h-4 mr-2" />
                )}
                {message}
              </div>
            </div>
          )}
        </div>

        {/* Yield Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Yield Progress</span>
            <span className="text-slate-300">
              {((availableYield / 10) * 100).toFixed(1)}%
            </span>
          </div>
          <Progress
            value={(availableYield / 10) * 100}
            className="bg-slate-700"
          />
          <p className="text-xs text-slate-500">
            Next milestone at 10 GTT for bonus multiplier
          </p>
        </div>

        {/* Recent Claims History */}
        {claimHistory.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-slate-300 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              Recent Claims
            </h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {claimHistory.slice(0, 5).map((claim, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center text-xs bg-slate-700/30 rounded p-2"
                >
                  <span className="text-green-400">
                    +{claim.amount.toFixed(4)} GTT
                  </span>
                  <span className="text-slate-500">
                    {new Date(claim.timestamp).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
