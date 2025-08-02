import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Zap, 
  Coins, 
  CheckCircle, 
  Loader2,
  Sparkles,
  ShieldCheck
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface MintCapsuleButtonProps {
  capsuleId: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  truthScore?: number;
  onMintComplete?: (result: MintResult) => void;
  className?: string;
}

interface MintResult {
  success: boolean;
  tokenId: string;
  transactionHash: string;
  ipfsHash: string;
  contractAddress?: string;
  gasUsed?: string;
}

export default function MintCapsuleButton({
  capsuleId,
  fileUrl,
  fileName,
  fileType,
  truthScore = 85,
  onMintComplete,
  className = ""
}: MintCapsuleButtonProps) {
  const [isMinting, setIsMinting] = useState(false);
  const [mintResult, setMintResult] = useState<MintResult | null>(null);
  const { toast } = useToast();

  const handleMint = async () => {
    setIsMinting(true);
    
    try {
      const result = await apiRequest('/api/nft/auto-mint', {
        method: 'POST',
        body: JSON.stringify({
          capsuleId,
          fileUrl,
          fileName,
          fileType,
          truthScore,
          metadata: {
            name: `Capsule: ${fileName}`,
            description: `Sovereign memory capsule with Truth Score: ${truthScore}`,
            attributes: [
              { trait_type: "Truth Score", value: truthScore },
              { trait_type: "File Type", value: fileType },
              { trait_type: "Capsule ID", value: capsuleId }
            ]
          }
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      setMintResult(result);
      onMintComplete?.(result);
      
      toast({
        title: "NFT Minted Successfully!",
        description: `Token ID: ${result.tokenId} - Your capsule is now immortalized on the blockchain.`,
        variant: "default"
      });

    } catch (error) {
      console.error('Minting failed:', error);
      toast({
        title: "Minting Failed",
        description: "Unable to mint NFT. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsMinting(false);
    }
  };

  if (mintResult) {
    return (
      <Card className={`border-green-200 bg-green-50 dark:bg-green-950 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                NFT Minted Successfully
              </p>
              <p className="text-xs text-green-600 dark:text-green-400">
                Token ID: {mintResult.tokenId}
              </p>
            </div>
            <Badge variant="secondary" className="text-xs">
              <Sparkles className="w-3 h-3 mr-1" />
              Immortalized
            </Badge>
          </div>
          
          <div className="mt-3 flex gap-2 text-xs">
            <Badge variant="outline" className="text-green-700">
              <ShieldCheck className="w-3 h-3 mr-1" />
              Verified
            </Badge>
            <Badge variant="outline" className="text-blue-700">
              Truth Score: {truthScore}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Button
      onClick={handleMint}
      disabled={isMinting}
      className={`bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white ${className}`}
    >
      {isMinting ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Minting NFT...
        </>
      ) : (
        <>
          <Zap className="w-4 h-4 mr-2" />
          Mint as NFT
          <Coins className="w-4 h-4 ml-2" />
        </>
      )}
    </Button>
  );
}