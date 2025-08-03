/**
 * NFT minting utilities for GuardianChain capsules
 * Integrates with our existing Web3 infrastructure
 */

import { ethers } from "ethers";

// GuardianChain Capsule NFT Contract ABI (minimal interface)
const CAPSULE_NFT_ABI = [
  "function mint(address to, string memory uri, bytes32 proofHash) public returns (uint256)",
  "function safeMint(address to, string memory uri) public returns (uint256)",
  "function tokenURI(uint256 tokenId) public view returns (string memory)",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "function balanceOf(address owner) public view returns (uint256)",
  "function approve(address to, uint256 tokenId) public",
  "function setApprovalForAll(address operator, bool approved) public",
  "function transferFrom(address from, address to, uint256 tokenId) public",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  "event CapsuleMinted(address indexed owner, uint256 indexed tokenId, string uri, bytes32 proofHash)"
];

// Contract addresses by chain
const CAPSULE_NFT_CONTRACTS = {
  137: "0x742d35Cc6431C4a91C3f6b1b0DBF1B19B4Fb8A4E", // Polygon
  8453: "0x1234567890123456789012345678901234567890", // Base (placeholder)
  1: "0xAbCdEfGhIjKlMnOpQrStUvWxYz1234567890AbCd", // Ethereum (placeholder)
};

export interface MintResult {
  success: boolean;
  tokenId?: string;
  transactionHash?: string;
  contractAddress?: string;
  error?: string;
}

/**
 * Mint a capsule as an NFT on the blockchain
 */
export async function mintCapsuleNFT(
  walletAddress: string,
  ipfsMetadataUrl: string,
  chainId: number = 137,
  proofHash?: string
): Promise<MintResult> {
  try {
    console.log("🎨 Starting NFT mint process:", {
      walletAddress,
      ipfsMetadataUrl,
      chainId,
      proofHash
    });

    // Get contract address for the chain
    const contractAddress = CAPSULE_NFT_CONTRACTS[chainId as keyof typeof CAPSULE_NFT_CONTRACTS];
    if (!contractAddress) {
      throw new Error(`Capsule NFT contract not deployed on chain ${chainId}`);
    }

    // Check for wallet connection
    if (typeof window === "undefined" || !window.ethereum) {
      throw new Error("MetaMask or compatible wallet not found");
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    // Verify the connected address matches
    const connectedAddress = await signer.getAddress();
    if (connectedAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      throw new Error("Connected wallet address doesn't match specified address");
    }

    // Create contract instance
    const contract = new ethers.Contract(contractAddress, CAPSULE_NFT_ABI, signer);

    // Estimate gas for the transaction
    let gasEstimate: bigint;
    let transaction: any;

    if (proofHash) {
      // Use advanced mint with proof hash
      gasEstimate = await contract.mint.estimateGas(
        walletAddress,
        ipfsMetadataUrl,
        proofHash
      );
      
      transaction = await contract.mint(
        walletAddress,
        ipfsMetadataUrl,
        proofHash,
        { gasLimit: gasEstimate * BigInt(120) / BigInt(100) } // Add 20% buffer
      );
    } else {
      // Use simple safe mint
      gasEstimate = await contract.safeMint.estimateGas(
        walletAddress,
        ipfsMetadataUrl
      );
      
      transaction = await contract.safeMint(
        walletAddress,
        ipfsMetadataUrl,
        { gasLimit: gasEstimate * BigInt(120) / BigInt(100) } // Add 20% buffer
      );
    }

    console.log("⏳ Transaction submitted:", transaction.hash);

    // Wait for transaction confirmation
    const receipt = await transaction.wait();
    
    if (receipt.status !== 1) {
      throw new Error("Transaction failed");
    }

    // Extract token ID from logs
    let tokenId: string | undefined;
    
    for (const log of receipt.logs) {
      try {
        const parsedLog = contract.interface.parseLog(log);
        if (parsedLog?.name === "Transfer" || parsedLog?.name === "CapsuleMinted") {
          tokenId = parsedLog.args.tokenId?.toString();
          break;
        }
      } catch (e) {
        // Skip logs that don't match our ABI
        continue;
      }
    }

    console.log("✅ NFT minted successfully:", {
      tokenId,
      transactionHash: receipt.hash,
      contractAddress,
      gasUsed: receipt.gasUsed.toString()
    });

    return {
      success: true,
      tokenId,
      transactionHash: receipt.hash,
      contractAddress,
    };

  } catch (error: any) {
    console.error("❌ NFT minting failed:", error);
    
    let errorMessage = "NFT minting failed";
    
    if (error.code === "ACTION_REJECTED") {
      errorMessage = "Transaction was rejected by user";
    } else if (error.code === "INSUFFICIENT_FUNDS") {
      errorMessage = "Insufficient funds for gas fees";
    } else if (error.code === "NETWORK_ERROR") {
      errorMessage = "Network connection error";
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Check if address owns any capsule NFTs
 */
export async function getCapsuleNFTBalance(
  walletAddress: string,
  chainId: number = 137
): Promise<number> {
  try {
    const contractAddress = CAPSULE_NFT_CONTRACTS[chainId as keyof typeof CAPSULE_NFT_CONTRACTS];
    if (!contractAddress || typeof window === "undefined" || !window.ethereum) {
      return 0;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, CAPSULE_NFT_ABI, provider);
    
    const balance = await contract.balanceOf(walletAddress);
    return parseInt(balance.toString());
  } catch (error) {
    console.error("Error fetching NFT balance:", error);
    return 0;
  }
}

/**
 * Get metadata URI for a specific token ID
 */
export async function getCapsuleNFTMetadata(
  tokenId: string,
  chainId: number = 137
): Promise<string | null> {
  try {
    const contractAddress = CAPSULE_NFT_CONTRACTS[chainId as keyof typeof CAPSULE_NFT_CONTRACTS];
    if (!contractAddress || typeof window === "undefined" || !window.ethereum) {
      return null;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, CAPSULE_NFT_ABI, provider);
    
    const uri = await contract.tokenURI(tokenId);
    return uri;
  } catch (error) {
    console.error("Error fetching NFT metadata:", error);
    return null;
  }
}

/**
 * Generate proof hash for Veritas sealed capsules
 */
export function generateProofHash(
  title: string,
  description: string,
  timestamp: string,
  creatorAddress: string
): string {
  const data = `${title}:${description}:${timestamp}:${creatorAddress}`;
  return ethers.keccak256(ethers.toUtf8Bytes(data));
}

/**
 * Check if NFT minting is available for the current chain
 */
export function isNFTMintingAvailable(chainId: number): boolean {
  return chainId in CAPSULE_NFT_CONTRACTS;
}

/**
 * Get the contract address for a specific chain
 */
export function getCapsuleContractAddress(chainId: number): string | null {
  return CAPSULE_NFT_CONTRACTS[chainId as keyof typeof CAPSULE_NFT_CONTRACTS] || null;
}