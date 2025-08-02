import { useState } from "react";
import {
  Award,
  Zap,
  CheckCircle,
  Hash,
  Wallet,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const ClaimNFT = () => {
  const [tokenId, setTokenId] = useState("");
  const [claimResult, setClaimResult] = useState<{
    claimed: boolean;
    nftData?: {
      tokenId: string;
      contractAddress: string;
      transactionHash: string;
      rarityScore: number;
      attributes: Array<{ trait_type: string; value: string }>;
    };
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleClaim = async () => {
    if (!tokenId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a capsule hash or ID",
        variant: "destructive",
      });
      return;
    }

    if (tokenId.length < 3) {
      toast({
        title: "Error",
        description: "Capsule ID must be at least 3 characters",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate minting process
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Mock successful mint
    const mockNFTData = {
      tokenId: `${Date.now()}`,
      contractAddress: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
      transactionHash: `0x${Math.random().toString(16).substring(2, 66)}`,
      rarityScore: Math.floor(Math.random() * 100) + 1,
      attributes: [
        { trait_type: "Verification Level", value: "Guardian Certified" },
        {
          trait_type: "Grief Score",
          value: (Math.floor(Math.random() * 30) + 70).toString(),
        },
        { trait_type: "Seal Type", value: "DocuSign Verified" },
        {
          trait_type: "Category",
          value: ["Technology", "Legal", "Health", "Environment"][
            Math.floor(Math.random() * 4)
          ],
        },
      ],
    };

    setClaimResult({
      claimed: true,
      nftData: mockNFTData,
    });

    toast({
      title: "NFT Claimed Successfully!",
      description: "Your Veritas Certificate has been minted to your wallet",
    });

    setIsLoading(false);
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Award className="h-5 w-5 text-purple-400" />
          </div>
          <span className="text-white">Claim Veritas Certificate NFT</span>
        </CardTitle>
        <p className="text-slate-400">
          Mint an NFT certificate tied to your verified capsule and GTT identity
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Enter Capsule Hash or ID"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              onKeyPress={(e) => e.key === "Enter" && handleClaim()}
            />
          </div>
          <Button
            onClick={handleClaim}
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                Minting...
              </div>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Claim NFT
              </>
            )}
          </Button>
        </div>

        {claimResult && claimResult.claimed && (
          <Card className="border-green-500/30 bg-green-900/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="h-8 w-8 text-green-400" />
                <div>
                  <h3 className="text-lg font-semibold text-green-400">
                    🎓 Certificate Minted!
                  </h3>
                  <p className="text-sm text-slate-300">
                    Your Veritas NFT has been successfully minted to your wallet
                  </p>
                </div>
              </div>

              {claimResult.nftData && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-slate-400">
                          Token ID
                        </label>
                        <p className="text-white font-mono text-sm">
                          #{claimResult.nftData.tokenId}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-400">
                          Contract Address
                        </label>
                        <p className="text-blue-400 font-mono text-xs break-all">
                          {claimResult.nftData.contractAddress}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-400">
                          Rarity Score
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-yellow-400">
                            {claimResult.nftData.rarityScore}
                          </span>
                          <Badge
                            className={`${
                              claimResult.nftData.rarityScore > 80
                                ? "bg-red-600"
                                : claimResult.nftData.rarityScore > 60
                                  ? "bg-orange-600"
                                  : "bg-green-600"
                            } text-white`}
                          >
                            {claimResult.nftData.rarityScore > 80
                              ? "Legendary"
                              : claimResult.nftData.rarityScore > 60
                                ? "Rare"
                                : "Common"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-slate-400">
                          Attributes
                        </label>
                        <div className="space-y-2">
                          {claimResult.nftData.attributes.map((attr, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center p-2 bg-slate-700/50 rounded"
                            >
                              <span className="text-xs text-slate-400">
                                {attr.trait_type}
                              </span>
                              <span className="text-xs text-white font-semibold">
                                {attr.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-600 pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-slate-400">
                          Transaction Hash
                        </label>
                        <p className="text-blue-400 font-mono text-xs break-all">
                          {claimResult.nftData.transactionHash}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View on Explorer
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="bg-slate-700/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-400">
              NFT Requirements
            </span>
          </div>
          <ul className="text-xs text-slate-400 space-y-1">
            <li>• Valid capsule ID or hash required</li>
            <li>• Must have verified GuardianChain identity</li>
            <li>• Sufficient GTT balance for minting fees</li>
            <li>• Connected wallet with Polygon network</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClaimNFT;
