import React, { useState } from "react";
import { useAccount, useContractWrite } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { VERITAS_NFT_ABI, getContractAddress } from "@/lib/contracts";
import { BRAND_COLORS, BRAND_NAME } from "@/lib/constants";
import { Sparkles, Loader2, Hash, User } from "lucide-react";

export default function MintCapsuleNFT() {
  const { address, chainId } = useAccount();
  const { toast } = useToast();

  const [capsuleHash, setCapsuleHash] = useState("");
  const [recipient, setRecipient] = useState(address || "");
  const [griefScore, setGriefScore] = useState("50");

  const nftAddress = getContractAddress("nft", chainId);

  // Mint transaction
  const { write: mint, isLoading: isMintPending } = useContractWrite({
    address: nftAddress,
    abi: VERITAS_NFT_ABI,
    functionName: "mint",
    args: [recipient || address, capsuleHash, parseInt(griefScore) || 50],
    onSuccess: (data) => {
      toast({
        title: "Capsule NFT Minted!",
        description: `Transaction hash: ${data.hash}`,
      });
      setCapsuleHash("");
      setGriefScore("50");
    },
    onError: (error) => {
      toast({
        title: "Minting Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  React.useEffect(() => {
    if (address && !recipient) {
      setRecipient(address);
    }
  }, [address, recipient]);

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Sparkles
            className="w-5 h-5"
            style={{ color: BRAND_COLORS.GUARDIAN }}
          />
          Mint Capsule NFT Certificate
        </CardTitle>
        <p className="text-slate-400 text-sm">
          Create an immutable NFT certificate for your verified truth capsule
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label
            htmlFor="capsuleHash"
            className="text-white flex items-center gap-2"
          >
            <Hash className="w-4 h-4" />
            Capsule Hash
          </Label>
          <Input
            id="capsuleHash"
            value={capsuleHash}
            onChange={(e) => setCapsuleHash(e.target.value)}
            placeholder="0x1234abcd... (IPFS hash or content identifier)"
            className="bg-slate-700/50 border-slate-600 text-white"
          />
          <p className="text-xs text-slate-400">
            Enter the IPFS hash or unique identifier for your capsule content
          </p>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="recipient"
            className="text-white flex items-center gap-2"
          >
            <User className="w-4 h-4" />
            Recipient Address
          </Label>
          <Input
            id="recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            className="bg-slate-700/50 border-slate-600 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="griefScore" className="text-white">
            Grief Score (0-100)
          </Label>
          <Input
            id="griefScore"
            type="number"
            min="0"
            max="100"
            value={griefScore}
            onChange={(e) => setGriefScore(e.target.value)}
            className="bg-slate-700/50 border-slate-600 text-white"
          />
          <p className="text-xs text-slate-400">
            Higher scores indicate more emotionally significant content
          </p>
        </div>

        <div className="p-4 bg-slate-700/30 rounded-lg">
          <h4 className="text-white font-medium mb-2">NFT Features:</h4>
          <ul className="text-sm text-slate-300 space-y-1">
            <li>• Immutable proof of capsule ownership</li>
            <li>• Soulbound token (non-transferable)</li>
            <li>• Grief score-based rarity</li>
            <li>• Governance rights holder</li>
            <li>• Yield distribution eligibility</li>
          </ul>
        </div>

        <Button
          onClick={() => mint?.()}
          disabled={isMintPending || !mint || !address}
          className="w-full"
          style={{ backgroundColor: BRAND_COLORS.GUARDIAN }}
        >
          {isMintPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Minting NFT...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Mint Capsule NFT
            </>
          )}
        </Button>

        {!address && (
          <p className="text-sm text-amber-400 text-center">
            Please connect your wallet to mint NFTs
          </p>
        )}
      </CardContent>
    </Card>
  );
}
