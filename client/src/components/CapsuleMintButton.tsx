import { useState } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Coins } from "lucide-react";

interface CapsuleMintButtonProps {
  title: string;
  content: string;
  griefTier: number;
  onMintSuccess?: (tokenId: string, txHash: string) => void;
  disabled?: boolean;
}

// CapsuleNFT ABI (minimal for minting)
const CAPSULE_NFT_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "title", "type": "string" },
      { "internalType": "string", "name": "content", "type": "string" },
      { "internalType": "uint256", "name": "griefTier", "type": "uint256" },
      { "internalType": "string", "name": "tokenURI", "type": "string" }
    ],
    "name": "mint",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const CAPSULE_NFT_ADDRESS = "0x0000000000000000000000000000000000000000"; // Update when deployed

export default function CapsuleMintButton({ 
  title, 
  content, 
  griefTier, 
  onMintSuccess,
  disabled = false 
}: CapsuleMintButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const { toast } = useToast();

  async function mintCapsuleNFT() {
    if (!title || !content || griefTier < 1 || griefTier > 5) {
      toast({
        title: "Invalid Data",
        description: "Please provide valid title, content, and grief tier (1-5)",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Check if MetaMask is available
      if (!window.ethereum) {
        throw new Error("MetaMask not found. Please install MetaMask to mint NFTs.");
      }

      // Connect to MetaMask
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Check if we're on the correct network (Polygon)
      const network = await provider.getNetwork();
      if (network.chainId !== 137n) {
        throw new Error("Please switch to Polygon network in MetaMask");
      }

      // Check if contract is deployed
      if (CAPSULE_NFT_ADDRESS === "0x0000000000000000000000000000000000000000") {
        // Development mode - simulate minting
        const simulatedTokenId = Math.floor(Math.random() * 10000) + 1;
        const simulatedTxHash = `0x${Math.random().toString(16).slice(2, 18)}...`;
        
        setTimeout(() => {
          setTxHash(simulatedTxHash);
          onMintSuccess?.(simulatedTokenId.toString(), simulatedTxHash);
          
          toast({
            title: "NFT Minted (Simulated)",
            description: `Guardian Capsule #${simulatedTokenId} created successfully!`,
          });
        }, 2000);
        
        return;
      }

      // Production mode - actual contract interaction
      const contract = new ethers.Contract(
        CAPSULE_NFT_ADDRESS,
        CAPSULE_NFT_ABI,
        signer
      );

      // Generate metadata URI
      const baseUrl = window.location.origin;
      
      // Estimate gas
      const gasEstimate = await contract.mint.estimateGas(
        title,
        content,
        griefTier,
        `${baseUrl}/api/metadata/` // TokenURI will be appended with tokenId
      );

      // Execute mint transaction
      const tx = await contract.mint(
        title,
        content,
        griefTier,
        `${baseUrl}/api/metadata/`,
        {
          gasLimit: gasEstimate * 120n / 100n, // Add 20% buffer
        }
      );

      toast({
        title: "Transaction Submitted",
        description: "Your capsule NFT is being minted. Please wait for confirmation.",
      });

      // Wait for transaction confirmation
      const receipt = await tx.wait();
      
      // Extract token ID from events
      const mintEvent = receipt.logs.find((log: any) => 
        log.topics[0] === ethers.id("CapsuleMinted(uint256,address,string,uint256)")
      );
      
      let tokenId = "Unknown";
      if (mintEvent) {
        tokenId = ethers.toNumber(mintEvent.topics[1]);
      }

      setTxHash(receipt.hash);
      onMintSuccess?.(tokenId.toString(), receipt.hash);

      toast({
        title: "NFT Minted Successfully!",
        description: `Guardian Capsule #${tokenId} has been created and stored on-chain.`,
      });

    } catch (error: any) {
      console.error('❌ NFT minting failed:', error);
      
      let errorMessage = "Failed to mint NFT";
      if (error.message.includes("user rejected")) {
        errorMessage = "Transaction was cancelled by user";
      } else if (error.message.includes("insufficient funds")) {
        errorMessage = "Insufficient funds for transaction";
      } else if (error.message.includes("MetaMask")) {
        errorMessage = error.message;
      } else if (error.message.includes("network")) {
        errorMessage = "Please switch to Polygon network";
      }

      toast({
        title: "Minting Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <Button
        onClick={mintCapsuleNFT}
        disabled={disabled || isLoading}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Minting NFT...
          </>
        ) : (
          <>
            <Coins className="mr-2 h-4 w-4" />
            Mint Guardian Capsule NFT
          </>
        )}
      </Button>

      {txHash && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-800 font-medium">
            NFT Minted Successfully!
          </p>
          <p className="text-xs text-green-600 mt-1">
            Transaction: {txHash.slice(0, 10)}...{txHash.slice(-8)}
          </p>
          <a
            href={`https://polygonscan.com/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:text-blue-800 underline mt-1 inline-block"
          >
            View on PolygonScan
          </a>
        </div>
      )}

      <div className="text-xs text-gray-500 space-y-1">
        <p>• NFT will include title, grief tier, and metadata</p>
        <p>• Content is stored securely on-chain</p>
        <p>• Requires small MATIC for gas fees</p>
      </div>
    </div>
  );
}