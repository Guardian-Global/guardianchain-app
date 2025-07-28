import { useState } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther } from "viem";
import { Zap, Loader2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getContractAddress, CONTRACT_ABIS } from "@/lib/contracts";

interface MintGTTButtonProps {
  amount?: string;
  recipient?: string;
  onMintSuccess?: (txHash: string, amount: string) => void;
  variant?: "button" | "card";
}

export default function MintGTTButton({
  amount: initialAmount,
  recipient: initialRecipient,
  onMintSuccess,
  variant = "button",
}: MintGTTButtonProps) {
  const [amount, setAmount] = useState(initialAmount || "");
  const [recipient, setRecipient] = useState(initialRecipient || "");
  const { address, chainId } = useAccount();
  const { toast } = useToast();

  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const handleMint = async () => {
    if (!amount || !recipient) {
      toast({
        title: "Missing Information",
        description: "Please enter both amount and recipient address",
        variant: "destructive",
      });
      return;
    }

    if (!chainId) {
      toast({
        title: "No Network",
        description: "Please connect to a supported network",
        variant: "destructive",
      });
      return;
    }

    try {
      const gttAddress = getContractAddress(chainId, "gtt");

      writeContract({
        address: gttAddress as `0x${string}`,
        abi: CONTRACT_ABIS.GTTToken,
        functionName: "mint",
        args: [recipient as `0x${string}`, parseEther(amount)],
      });
    } catch (error: any) {
      toast({
        title: "Mint Failed",
        description: error.message || "Failed to mint GTT tokens",
        variant: "destructive",
      });
    }
  };

  // Handle success
  if (isConfirmed && hash) {
    if (onMintSuccess) {
      onMintSuccess(hash, amount);
    }

    toast({
      title: "Mint Successful!",
      description: `Minted ${amount} GTT tokens to ${recipient}`,
    });
  }

  // Handle error
  if (error) {
    toast({
      title: "Transaction Failed",
      description: error.message,
      variant: "destructive",
    });
  }

  if (variant === "card") {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-400" />
            Mint GTT Tokens
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="amount" className="text-slate-300">
              Amount (GTT)
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="100.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>

          <div>
            <Label htmlFor="recipient" className="text-slate-300">
              Recipient Address
            </Label>
            <Input
              id="recipient"
              placeholder="0x..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>

          <Button
            onClick={handleMint}
            disabled={isPending || isConfirming || !address}
            className="w-full bg-yellow-600 hover:bg-yellow-700"
          >
            {isPending || isConfirming ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isPending ? "Confirming..." : "Minting..."}
              </>
            ) : isConfirmed ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Minted Successfully
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Mint GTT Tokens
              </>
            )}
          </Button>

          {hash && (
            <div className="text-xs text-slate-400">
              <p>Transaction Hash:</p>
              <p className="font-mono break-all">{hash}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Button
      onClick={handleMint}
      disabled={isPending || isConfirming || !address}
      className="bg-yellow-600 hover:bg-yellow-700"
    >
      {isPending || isConfirming ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {isPending ? "Confirming..." : "Minting..."}
        </>
      ) : error ? (
        <>
          <XCircle className="mr-2 h-4 w-4" />
          Mint Failed
        </>
      ) : isConfirmed ? (
        <>
          <CheckCircle className="mr-2 h-4 w-4" />
          Minted
        </>
      ) : (
        <>
          <Zap className="mr-2 h-4 w-4" />
          Mint GTT
        </>
      )}
    </Button>
  );
}
