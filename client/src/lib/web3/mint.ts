import { writeContract, waitForTransaction } from "@wagmi/core";
import { parseEther } from "viem";
import { uploadJSONToIPFS } from "../ipfs";

// Contract ABIs and addresses would be imported from contracts.ts
const VERITAS_NFT_ADDRESS = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"; // Local deployment

const VERITAS_NFT_ABI = [
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "string", name: "uri", type: "string" },
      { internalType: "uint256", name: "griefScore", type: "uint256" },
    ],
    name: "mint",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];

interface CapsuleMetadata {
  name: string;
  description: string;
  image?: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  grief_score: number;
  creator: string;
  timestamp: number;
  content_blocks: Array<{
    type: string;
    content: string;
  }>;
}

export async function mintCapsuleNFT(
  capsuleData: {
    title: string;
    blocks: Array<{ type: string; content: string }>;
    metadata: {
      category: string;
      tags: string[];
      griefScore: number;
      credibilityScore: number;
    };
  },
  userAddress: string,
): Promise<{ hash: string; tokenId: number }> {
  try {
    // Create NFT metadata
    const metadata: CapsuleMetadata = {
      name: capsuleData.title || "GUARDIANCHAIN Truth Capsule",
      description: `A verified truth capsule created on the GUARDIANCHAIN protocol with a grief score of ${capsuleData.metadata.griefScore}`,
      attributes: [
        { trait_type: "Category", value: capsuleData.metadata.category },
        { trait_type: "Grief Score", value: capsuleData.metadata.griefScore },
        {
          trait_type: "Credibility Score",
          value: capsuleData.metadata.credibilityScore,
        },
        { trait_type: "Block Count", value: capsuleData.blocks.length },
        { trait_type: "Creator Type", value: "Truth Seeker" },
        { trait_type: "Verification Status", value: "Sealed" },
      ],
      grief_score: capsuleData.metadata.griefScore,
      creator: userAddress,
      timestamp: Date.now(),
      content_blocks: capsuleData.blocks,
    };

    // Add tags as attributes
    capsuleData.metadata.tags.forEach((tag, index) => {
      if (index < 3) {
        // Limit to 3 tag attributes
        metadata.attributes.push({
          trait_type: `Tag ${index + 1}`,
          value: tag,
        });
      }
    });

    // Upload metadata to IPFS
    console.log("Uploading metadata to IPFS...");
    const metadataUri = await uploadJSONToIPFS(metadata);
    console.log("Metadata uploaded to:", metadataUri);

    // Mint NFT with metadata URI
    console.log("Minting NFT...");
    const { hash } = await writeContract({
      address: VERITAS_NFT_ADDRESS,
      abi: VERITAS_NFT_ABI,
      functionName: "mint",
      args: [userAddress, metadataUri, BigInt(capsuleData.metadata.griefScore)],
    });

    console.log("Transaction hash:", hash);

    // Wait for transaction confirmation
    const receipt = await waitForTransaction({ hash });
    console.log("Transaction confirmed:", receipt);

    // Extract token ID from transaction logs (simplified)
    const tokenId = Math.floor(Math.random() * 10000); // In real implementation, parse from logs

    return { hash, tokenId };
  } catch (error) {
    console.error("NFT minting failed:", error);
    throw new Error(
      `Failed to mint NFT: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    );
  }
}

export async function getTokenMetadata(
  tokenId: number,
): Promise<CapsuleMetadata | null> {
  try {
    // This would typically call the contract's tokenURI function
    // For now, return mock data
    return {
      name: "GUARDIANCHAIN Truth Capsule #" + tokenId,
      description: "A verified truth capsule on the GUARDIANCHAIN protocol",
      attributes: [],
      grief_score: 85,
      creator: "0x...",
      timestamp: Date.now(),
      content_blocks: [],
    };
  } catch (error) {
    console.error("Failed to fetch token metadata:", error);
    return null;
  }
}
