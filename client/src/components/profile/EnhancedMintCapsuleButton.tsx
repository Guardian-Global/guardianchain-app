import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Shield, 
  ExternalLink,
  CheckCircle,
  Loader2
} from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface EnhancedMintCapsuleButtonProps {
  capsuleId?: string;
  capsuleTitle?: string;
  capsuleContent?: string;
  file?: File;
  className?: string;
  variant?: 'card' | 'button';
}

export default function EnhancedMintCapsuleButton({ 
  capsuleId, 
  capsuleTitle, 
  capsuleContent, 
  file,
  className = "",
  variant = 'card' 
}: EnhancedMintCapsuleButtonProps) {
  const [txHash, setTxHash] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mintMutation = useMutation({
    mutationFn: async () => {
      if (file) {
        // Handle file-based minting from extracted component
        const formData = new FormData();
        formData.append("file", file);
        return apiRequest("POST", "/api/mint", formData);
      } else {
        // Handle capsule-based minting
        return apiRequest("POST", "/api/capsules/mint", {
          capsuleId,
          title: capsuleTitle,
          content: capsuleContent
        });
      }
    },
    onSuccess: (data) => {
      setTxHash(data.txHash);
      toast({
        title: "NFT Minted Successfully!",
        description: `Your ${file ? 'file' : 'capsule'} "${capsuleTitle || file?.name}" has been minted as an NFT on the blockchain.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/capsules"] });
    },
    onError: (error) => {
      toast({
        title: "Minting Failed",
        description: "Failed to mint your capsule as an NFT. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (variant === 'button') {
    return (
      <div className={`mt-2 ${className}`}>
        <Button 
          onClick={() => mintMutation.mutate()} 
          disabled={mintMutation.isPending || !!txHash} 
          className="px-4 py-2 bg-gradient-to-r from-[#00ffe1] to-[#ff00d4] text-black hover:opacity-90 rounded"
        >
          {mintMutation.isPending ? "Minting..." : txHash ? "Minted!" : "Mint as Capsule NFT"}
        </Button>
        {txHash && (
          <p className="text-sm mt-2 text-[#8b949e]">
            ✅ Minted! View on{" "}
            <a 
              href={`https://basescan.org/tx/${txHash}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline text-[#00ffe1] hover:text-[#ff00d4]"
            >
              BaseScan
            </a>
          </p>
        )}
      </div>
    );
  }

  if (txHash) {
    return (
      <Card className={`bg-green-500/10 border-green-500/30 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-6 w-6 text-green-400" />
            <div className="flex-1">
              <h4 className="font-medium text-green-400">NFT Minted Successfully!</h4>
              <p className="text-sm text-[#8b949e] mt-1">
                Your {file ? 'file' : 'capsule'} has been permanently sealed on the blockchain
              </p>
            </div>
          </div>
          <div className="mt-3 flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="border-green-500/30 text-green-400 hover:bg-green-500/10"
              onClick={() => window.open(`https://basescan.org/tx/${txHash}`, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View on BaseScan
            </Button>
            <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
              NFT Minted
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-[#161b22] border-[#30363d] hover:border-[#00ffe1] transition-colors ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#00ffe1]/10 rounded-lg">
              <Zap className="h-5 w-5 text-[#00ffe1]" />
            </div>
            <div>
              <h4 className="font-medium text-[#f0f6fc]">Mint as NFT</h4>
              <p className="text-sm text-[#8b949e]">
                Permanently seal this {file ? 'file' : 'capsule'} on the blockchain
              </p>
            </div>
          </div>
          <Button 
            onClick={() => mintMutation.mutate()}
            disabled={mintMutation.isPending}
            className="bg-gradient-to-r from-[#00ffe1] to-[#ff00d4] text-black hover:opacity-90"
          >
            {mintMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Minting...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Mint NFT
              </>
            )}
          </Button>
        </div>
        
        <div className="mt-4 p-3 bg-[#0d1117] rounded-lg border border-[#30363d]">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#8b949e]">Estimated Gas Fee</span>
            <span className="text-[#f0f6fc] font-medium">~$0.01</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-[#8b949e]">Network</span>
            <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs">
              Base Network
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Legacy compatibility exports
export { EnhancedMintCapsuleButton as MintCapsuleButton };

// Simple compatibility function for extracted component
export function MintCapsuleButton({ file }: { file: File }) {
  return <EnhancedMintCapsuleButton file={file} variant="button" />;
}