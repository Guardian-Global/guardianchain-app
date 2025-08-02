import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  Zap, 
  CheckCircle, 
  AlertCircle,
  ExternalLink 
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface MintCapsuleButtonProps {
  capsuleId: string;
  fileUrl?: string;
  metadata?: any;
  onMintComplete?: () => void;
  className?: string;
}

interface MintState {
  step: 'ready' | 'uploading' | 'minting' | 'complete' | 'error';
  ipfsHash?: string;
  tokenId?: number;
  transactionHash?: string;
  error?: string;
}

export default function MintCapsuleButton({
  capsuleId,
  fileUrl,
  metadata,
  onMintComplete,
  className = ""
}: MintCapsuleButtonProps) {
  const { toast } = useToast();
  const [mintState, setMintState] = useState<MintState>({ step: 'ready' });

  const uploadMetadataMutation = useMutation({
    mutationFn: async () => {
      const nftMetadata = {
        name: metadata?.title || `Truth Capsule #${capsuleId}`,
        description: metadata?.summary || "A verified truth capsule preserved on GuardianChain",
        image: fileUrl || `https://api.guardianchain.app/capsules/${capsuleId}/image`,
        attributes: [
          { trait_type: "Truth Score", value: metadata?.truthScore || 85 },
          { trait_type: "Emotional Resonance", value: metadata?.emotionalResonance || 75 },
          { trait_type: "Verification Level", value: "Verified" },
          { trait_type: "Creation Date", value: new Date().toISOString() }
        ]
      };

      return await apiRequest("POST", "/api/nft/upload-metadata", {
        capsuleId,
        metadata: nftMetadata
      });
    },
    onSuccess: (response: any) => {
      setMintState({ 
        step: 'minting', 
        ipfsHash: response.ipfsHash 
      });
      mintNFTMutation.mutate(response);
    },
    onError: (error: any) => {
      setMintState({ 
        step: 'error', 
        error: error.message || "Failed to upload metadata" 
      });
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload NFT metadata",
        variant: "destructive",
      });
    },
  });

  const mintNFTMutation = useMutation({
    mutationFn: async (metadataResponse: any) => {
      return await apiRequest("POST", "/api/nft/mint", {
        capsuleId,
        metadataUri: metadataResponse.metadataUri,
        recipient: "0x1234567890123456789012345678901234567890" // Mock address
      });
    },
    onSuccess: (response: any) => {
      setMintState({ 
        step: 'complete',
        tokenId: response.tokenId,
        transactionHash: response.transactionHash
      });
      
      onMintComplete?.();
      
      toast({
        title: "NFT Minted Successfully!",
        description: `Token ID: ${response.tokenId}`,
      });
    },
    onError: (error: any) => {
      setMintState({ 
        step: 'error', 
        error: error.message || "Failed to mint NFT" 
      });
      toast({
        title: "Minting Failed",
        description: error.message || "Failed to mint NFT",
        variant: "destructive",
      });
    },
  });

  const handleMint = () => {
    setMintState({ step: 'uploading' });
    uploadMetadataMutation.mutate();
  };

  const getButtonContent = () => {
    switch (mintState.step) {
      case 'ready':
        return (
          <>
            <Zap className="w-4 h-4 mr-2" />
            Mint as NFT
          </>
        );
      case 'uploading':
        return (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Uploading Metadata...
          </>
        );
      case 'minting':
        return (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Minting NFT...
          </>
        );
      case 'complete':
        return (
          <>
            <CheckCircle className="w-4 h-4 mr-2" />
            NFT Minted!
          </>
        );
      case 'error':
        return (
          <>
            <AlertCircle className="w-4 h-4 mr-2" />
            Retry Minting
          </>
        );
      default:
        return "Mint NFT";
    }
  };

  const isLoading = mintState.step === 'uploading' || mintState.step === 'minting';
  const isComplete = mintState.step === 'complete';
  const hasError = mintState.step === 'error';

  return (
    <div className="space-y-3">
      <Button
        onClick={handleMint}
        disabled={isLoading || isComplete}
        variant={hasError ? "destructive" : isComplete ? "default" : "default"}
        className={className}
      >
        {getButtonContent()}
      </Button>

      {mintState.step === 'complete' && mintState.tokenId && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="secondary">Token ID: {mintState.tokenId}</Badge>
          {mintState.transactionHash && (
            <div className="flex items-center gap-1">
              <ExternalLink className="w-3 h-3" />
              <span className="truncate">
                {mintState.transactionHash.slice(0, 10)}...
              </span>
            </div>
          )}
        </div>
      )}

      {mintState.error && (
        <div className="text-xs text-destructive">
          {mintState.error}
        </div>
      )}
    </div>
  );
}