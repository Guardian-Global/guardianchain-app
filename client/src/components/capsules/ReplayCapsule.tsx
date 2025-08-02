import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Play, Coins, Shield } from "lucide-react";

interface ReplayCapsuleProps {
  capsuleId: string;
  authorId?: string;
  accessCost?: number;
  onReplayComplete?: () => void;
}

const ReplayCapsule = ({
  capsuleId,
  authorId,
  accessCost = 2.5,
  onReplayComplete,
}: ReplayCapsuleProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleReplay = async () => {
    setLoading(true);
    try {
      const response = await apiRequest("POST", `/api/replay-capsule`, {
        capsuleId,
        authorId,
        yieldAmount: accessCost,
      });

      if (response.ok) {
        const result = await response.json();

        toast({
          title: "Capsule Replayed Successfully",
          description: `GTT yield of ${result.yieldAmount} issued to author. Truth value confirmed and recorded on blockchain.`,
        });

        // Trigger GTT payout to author
        await apiRequest("POST", "/api/distribute-gtt-yield", {
          recipientId: authorId,
          amount: result.yieldAmount,
          reason: "capsule_replay",
          capsuleId,
        });

        onReplayComplete?.();
      }
    } catch (error) {
      toast({
        title: "Replay Failed",
        description:
          "Unable to replay capsule and distribute yield. Please try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return (
    <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-slate-600">
      <div className="flex items-center gap-3 mb-3">
        <Shield className="h-5 w-5 text-green-400" />
        <div>
          <h3 className="text-sm font-medium text-white">
            Replay & Yield Distribution
          </h3>
          <p className="text-xs text-slate-400">
            Unlock capsule content and reward the author with GTT tokens
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-slate-300">
          <span className="text-slate-400">Yield Amount:</span>
          <span className="ml-2 font-medium text-green-400">
            {accessCost} GTT
          </span>
        </div>
        <div className="text-xs text-slate-500">Per replay transaction</div>
      </div>

      <Button
        onClick={handleReplay}
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 text-white"
      >
        {loading ? (
          "Processing Replay..."
        ) : (
          <>
            <Play className="h-4 w-4 mr-2" />
            <Coins className="h-4 w-4 mr-1" />
            Replay + Release Yield
          </>
        )}
      </Button>

      <p className="text-xs text-slate-500 mt-2 text-center">
        This action will verify the capsule content and distribute rewards to
        the author
      </p>
    </div>
  );
};

export default ReplayCapsule;
