import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Unlock, CheckCircle, AlertCircle, Clock } from "lucide-react";

interface RedeemResult {
  success: boolean;
  capsuleId?: string;
  redeemedAt?: string;
  reward?: number;
  reason?: string;
}

export default function CapsuleRedeemer() {
  const [capsuleId, setCapsuleId] = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [result, setResult] = useState<RedeemResult | null>(null);
  const { toast } = useToast();

  const handleRedeem = async () => {
    if (!capsuleId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid Capsule ID",
        variant: "destructive",
      });
      return;
    }

    setIsRedeeming(true);
    setResult(null);

    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success/failure
      const success = Math.random() > 0.3;
      
      if (success) {
        const mockResult: RedeemResult = {
          success: true,
          capsuleId,
          redeemedAt: new Date().toISOString(),
          reward: Math.floor(Math.random() * 1000) + 100,
        };
        setResult(mockResult);
        toast({
          title: "Redemption Successful",
          description: `Capsule ${capsuleId} has been redeemed for ${mockResult.reward} GTT`,
        });
      } else {
        setResult({
          success: false,
          reason: "Capsule not eligible for redemption or already claimed",
        });
        toast({
          title: "Redemption Failed",
          description: "This capsule cannot be redeemed at this time",
          variant: "destructive",
        });
      }
    } catch (error) {
      setResult({
        success: false,
        reason: "Network error occurred",
      });
      toast({
        title: "Error",
        description: "Failed to process redemption",
        variant: "destructive",
      });
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <Card className="bg-brand-secondary border-brand-surface">
      <CardHeader>
        <CardTitle className="text-brand-light flex items-center gap-2">
          <Unlock className="w-5 h-5 text-brand-accent" />
          Capsule Redemption Portal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-brand-light">
            Capsule ID
          </label>
          <Input
            type="text"
            placeholder="Enter your capsule ID..."
            value={capsuleId}
            onChange={(e) => setCapsuleId(e.target.value)}
            className="bg-brand-surface border-brand-primary/20 text-brand-light"
            disabled={isRedeeming}
          />
        </div>

        <Button
          onClick={handleRedeem}
          disabled={isRedeeming || !capsuleId.trim()}
          className="w-full bg-brand-accent hover:bg-brand-accent/90 text-white"
        >
          {isRedeeming ? (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 animate-spin" />
              Processing Redemption...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Unlock className="w-4 h-4" />
              Redeem Capsule
            </div>
          )}
        </Button>

        {result && (
          <div className={`p-4 rounded-lg border ${
            result.success 
              ? "bg-green-500/10 border-green-500/30" 
              : "bg-red-500/10 border-red-500/30"
          }`}>
            {result.success ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Redemption Successful</span>
                </div>
                <div className="text-sm text-brand-light/80 space-y-1">
                  <div>Capsule ID: <Badge variant="outline">{result.capsuleId}</Badge></div>
                  <div>Reward: <span className="text-brand-warning font-medium">{result.reward} GTT</span></div>
                  <div>Redeemed: {new Date(result.redeemedAt!).toLocaleString()}</div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="w-5 h-5" />
                <span>{result.reason}</span>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-brand-light/60 space-y-1">
          <p>• Time-locked capsules become eligible for redemption after maturation</p>
          <p>• Redemption rewards are based on truth score and community validation</p>
          <p>• Each capsule can only be redeemed once</p>
        </div>
      </CardContent>
    </Card>
  );
}