import React, { useState } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CAPSULE_FACTORY_V2_ABI, getContractAddress } from "@/lib/contracts";
import { BRAND_COLORS } from "@/lib/constants";
import { Loader2, Upload, Sparkles } from "lucide-react";

export default function CapsuleCreator() {
  const { address, chainId } = useAccount();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [contentHash, setContentHash] = useState("");
  const [yieldEstimate, setYieldEstimate] = useState(100);

  const { writeContract, data: hash, isPending } = useWriteContract();

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!address || !chainId) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to create a capsule",
        variant: "destructive",
      });
      return;
    }

    if (!title || !summary || !contentHash) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const factoryAddress = getContractAddress(
        chainId,
        "factoryV2"
      ) as `0x${string}`;

      writeContract({
        address: factoryAddress,
        abi: CAPSULE_FACTORY_V2_ABI,
        functionName: "createCapsule",
        args: [contentHash, title, summary, BigInt(yieldEstimate)],
      });

      toast({
        title: "Creating Capsule",
        description: "Transaction submitted. Please wait for confirmation...",
      });
    } catch (error) {
      console.error("Error creating capsule:", error);
      toast({
        title: "Creation Failed",
        description: "Failed to create capsule. Please try again.",
        variant: "destructive",
      });
    }
  };

  React.useEffect(() => {
    if (hash && !isConfirming && !isPending) {
      toast({
        title: "Capsule Created Successfully!",
        description: `Your memory capsule "${title}" has been created and is pending verification.`,
      });

      // Reset form
      setTitle("");
      setSummary("");
      setContentHash("");
      setYieldEstimate(100);
    }
  }, [hash, isConfirming, isPending, title, toast]);

  const isLoading = isPending || isConfirming;

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Sparkles
            className="w-5 h-5"
            style={{ color: BRAND_COLORS.GUARDIAN }}
          />
          Create Memory Capsule
        </CardTitle>
        <p className="text-slate-400 text-sm">
          Store your truth permanently on the blockchain with CapsuleFactoryV2
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">
              Story Title *
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your story title..."
              className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary" className="text-white">
              Story Summary *
            </Label>
            <Textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Provide a brief summary of your story..."
              rows={3}
              className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 resize-none"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contentHash" className="text-white">
              Content Hash *
            </Label>
            <Input
              id="contentHash"
              value={contentHash}
              onChange={(e) => setContentHash(e.target.value)}
              placeholder="IPFS hash or content identifier..."
              className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
              required
            />
            <p className="text-xs text-slate-500">
              Upload your content to IPFS first, then paste the hash here
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="yieldEstimate" className="text-white">
              Emotional Yield Estimate
            </Label>
            <Input
              id="yieldEstimate"
              type="number"
              value={yieldEstimate}
              onChange={(e) => setYieldEstimate(parseInt(e.target.value) || 0)}
              min="1"
              max="1000"
              className="bg-slate-700/50 border-slate-600 text-white"
            />
            <p className="text-xs text-slate-500">
              Estimate the emotional impact value (1-1000). This will be
              reviewed by Veritus.
            </p>
          </div>

          <Button
            type="submit"
            disabled={isLoading || !address}
            className="w-full"
            style={{
              backgroundColor: BRAND_COLORS.GUARDIAN,
              color: "white",
            }}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isPending ? "Creating..." : "Confirming..."}
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Create Capsule
              </>
            )}
          </Button>

          {!address && (
            <p className="text-center text-sm text-slate-400">
              Connect your wallet to create memory capsules
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
