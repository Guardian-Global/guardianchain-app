import { useState } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther } from "viem";
import {
  Image,
  Loader2,
  CheckCircle,
  XCircle,
  Shield,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { getContractAddress, CONTRACT_ABIS } from "@/lib/contracts";

interface MintNFTButtonProps {
  capsuleId?: string;
  recipient?: string;
  onMintSuccess?: (txHash: string, tokenId: string) => void;
  variant?: "button" | "card";
}

export default function MintNFTButton({
  capsuleId: initialCapsuleId,
  recipient: initialRecipient,
  onMintSuccess,
  variant = "button",
}: MintNFTButtonProps) {
  const [tokenUri, setTokenUri] = useState("");
  const [capsuleId, setCapsuleId] = useState(initialCapsuleId || "");
  const [recipient, setRecipient] = useState(initialRecipient || "");
  const [soulbound, setSoulbound] = useState(true);
  const [griefScore, setGriefScore] = useState("42");
  const [vaultLabel, setVaultLabel] = useState("VERIFIED");
  const [signature, setSignature] = useState("GUARDIAN_SEAL_V1");

  const { address, chainId } = useAccount();
  const { toast } = useToast();

  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const handleMint = async () => {
    if (!tokenUri || !capsuleId || !recipient) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
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
      const nftAddress = getContractAddress(chainId, "nft");

      writeContract({
        address: nftAddress as `0x${string}`,
        abi: CONTRACT_ABIS.VeritasCapsuleNFT,
        functionName: "mintVeritasCapsule",
        args: [
          recipient as `0x${string}`,
          tokenUri,
          BigInt(capsuleId),
          soulbound,
          BigInt(griefScore),
          vaultLabel,
          signature,
        ],
      });
    } catch (error: any) {
      toast({
        title: "Mint Failed",
        description: error.message || "Failed to mint Veritas NFT",
        variant: "destructive",
      });
    }
  };

  // Handle success
  if (isConfirmed && hash) {
    if (onMintSuccess) {
      onMintSuccess(hash, capsuleId);
    }

    toast({
      title: "NFT Minted Successfully!",
      description: `Veritas Capsule NFT for capsule ${capsuleId} has been minted`,
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
            <Image className="h-5 w-5 text-purple-400" />
            Mint Veritas Capsule NFT
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tokenUri" className="text-slate-300">
                Metadata URI (IPFS)
              </Label>
              <Input
                id="tokenUri"
                placeholder="ipfs://QmHash..."
                value={tokenUri}
                onChange={(e) => setTokenUri(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="capsuleId" className="text-slate-300">
                Capsule ID
              </Label>
              <Input
                id="capsuleId"
                type="number"
                placeholder="123"
                value={capsuleId}
                onChange={(e) => setCapsuleId(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="griefScore" className="text-slate-300">
                Grief Score
              </Label>
              <Input
                id="griefScore"
                type="number"
                placeholder="42"
                value={griefScore}
                onChange={(e) => setGriefScore(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="vaultLabel" className="text-slate-300">
                Vault Label
              </Label>
              <Input
                id="vaultLabel"
                placeholder="VERIFIED"
                value={vaultLabel}
                onChange={(e) => setVaultLabel(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="soulbound"
              checked={soulbound}
              onCheckedChange={(checked) => setSoulbound(checked as boolean)}
            />
            <Label
              htmlFor="soulbound"
              className="text-slate-300 flex items-center gap-2"
            >
              <Shield className="h-4 w-4" />
              Soulbound (Non-transferable)
            </Label>
          </div>

          <Button
            onClick={handleMint}
            disabled={isPending || isConfirming || !address}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {isPending || isConfirming ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isPending ? "Confirming..." : "Minting..."}
              </>
            ) : isConfirmed ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                NFT Minted Successfully
              </>
            ) : (
              <>
                <Image className="mr-2 h-4 w-4" />
                Mint Veritas NFT
              </>
            )}
          </Button>

          {hash && (
            <div className="text-xs text-slate-400">
              <p>Transaction Hash:</p>
              <p className="font-mono break-all">{hash}</p>
            </div>
          )}

          <div className="text-xs text-slate-400 bg-slate-800 p-3 rounded">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-3 w-3" />
              <span className="font-semibold">NFT Properties</span>
            </div>
            <ul className="space-y-1">
              <li>• Links capsule to permanent NFT record</li>
              <li>• Grief score determines rarity/value</li>
              <li>• Soulbound NFTs cannot be transferred</li>
              <li>• Metadata stored on IPFS for permanence</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Button
      onClick={handleMint}
      disabled={isPending || isConfirming || !address}
      className="bg-purple-600 hover:bg-purple-700"
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
          <Image className="mr-2 h-4 w-4" />
          Mint NFT
        </>
      )}
    </Button>
  );
}
