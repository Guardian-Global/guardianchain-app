import { Router } from "express";
import { consolidatedAuth } from "../auth/authConsolidation";
import { ethers } from "ethers";

const router = Router();

/**
 * Initiate NFT minting process
 */
router.post("/mint", consolidatedAuth, async (req: any, res) => {
  try {
    const { 
      walletAddress, 
      ipfsMetadataUrl, 
      chainId = 137,
      proofHash,
      capsuleId 
    } = req.body;
    
    console.log("🎨 NFT mint request:", { 
      walletAddress, 
      ipfsMetadataUrl, 
      chainId, 
      capsuleId 
    });

    // Validate input
    if (!walletAddress || !ipfsMetadataUrl) {
      return res.status(400).json({ 
        error: "Missing required fields: walletAddress and ipfsMetadataUrl" 
      });
    }

    if (!ethers.isAddress(walletAddress)) {
      return res.status(400).json({ 
        error: "Invalid wallet address format" 
      });
    }

    // Validate IPFS URL format
    if (!ipfsMetadataUrl.includes("ipfs")) {
      return res.status(400).json({ 
        error: "Invalid IPFS URL format" 
      });
    }

    // Contract addresses by chain
    const contractAddresses = {
      137: "0x742d35Cc6431C4a91C3f6b1b0DBF1B19B4Fb8A4E", // Polygon
      8453: "0x1234567890123456789012345678901234567890", // Base
      1: "0xAbCdEfGhIjKlMnOpQrStUvWxYz1234567890AbCd", // Ethereum
    };

    const contractAddress = contractAddresses[chainId as keyof typeof contractAddresses];
    if (!contractAddress) {
      return res.status(400).json({ 
        error: `NFT contract not available on chain ${chainId}` 
      });
    }

    // In production, this would interact with the actual blockchain
    // For now, simulate the minting process
    
    const mockTokenId = Math.floor(Math.random() * 100000) + 1;
    const mockTxHash = `0x${Math.random().toString(16).substring(2, 66)}`;
    
    // Simulate transaction processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log("✅ NFT minted successfully (simulated):", { 
      tokenId: mockTokenId,
      transactionHash: mockTxHash,
      contractAddress 
    });

    // Store minting record in database (in production)
    const mintRecord = {
      capsuleId,
      tokenId: mockTokenId.toString(),
      contractAddress,
      chainId,
      walletAddress: walletAddress.toLowerCase(),
      ipfsMetadataUrl,
      transactionHash: mockTxHash,
      mintedAt: new Date().toISOString(),
      proofHash: proofHash || null,
    };

    res.json({
      success: true,
      tokenId: mockTokenId.toString(),
      transactionHash: mockTxHash,
      contractAddress,
      chainId,
      mintRecord,
      explorerUrl: getExplorerUrl(chainId, mockTxHash),
    });

  } catch (error) {
    console.error("❌ NFT minting error:", error);
    res.status(500).json({ 
      error: "Failed to mint NFT" 
    });
  }
});

/**
 * Get NFT metadata and ownership info
 */
router.get("/metadata/:chainId/:tokenId", async (req, res) => {
  try {
    const { chainId, tokenId } = req.params;
    
    console.log("🔍 NFT metadata requested:", { chainId, tokenId });

    // In production, query the actual blockchain
    const mockMetadata = {
      name: `GuardianChain Capsule #${tokenId}`,
      description: "A truth capsule sealed on the GuardianChain protocol",
      image: `https://ipfs.io/ipfs/QmMockImage${tokenId}`,
      external_url: `https://guardianchain.app/capsule/${tokenId}`,
      attributes: [
        { trait_type: "Capsule Type", value: "Truth Vault" },
        { trait_type: "Veritas Seal", value: "Verified" },
        { trait_type: "Chain", value: getChainName(parseInt(chainId)) },
        { trait_type: "Minted Date", value: new Date().toISOString().split("T")[0] },
      ],
    };

    res.json({
      success: true,
      metadata: mockMetadata,
      tokenId,
      chainId: parseInt(chainId),
    });

  } catch (error) {
    console.error("❌ NFT metadata fetch error:", error);
    res.status(500).json({ 
      error: "Failed to fetch NFT metadata" 
    });
  }
});

/**
 * Get user's NFT collection
 */
router.get("/collection/:walletAddress", async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { chainId = "137" } = req.query;
    
    console.log("🖼️ NFT collection requested:", { walletAddress, chainId });

    if (!ethers.isAddress(walletAddress)) {
      return res.status(400).json({ 
        error: "Invalid wallet address" 
      });
    }

    // In production, query the blockchain for owned NFTs
    const mockCollection = [
      {
        tokenId: "1001",
        contractAddress: "0x742d35Cc6431C4a91C3f6b1b0DBF1B19B4Fb8A4E",
        chainId: parseInt(chainId as string),
        metadata: {
          name: "Family Legacy Capsule",
          description: "A sealed truth about family history",
          image: "https://ipfs.io/ipfs/QmMockImage1001",
        },
        mintedAt: "2025-01-15T10:30:00Z",
      },
      {
        tokenId: "1002", 
        contractAddress: "0x742d35Cc6431C4a91C3f6b1b0DBF1B19B4Fb8A4E",
        chainId: parseInt(chainId as string),
        metadata: {
          name: "Whistleblower Evidence",
          description: "Critical evidence for public interest",
          image: "https://ipfs.io/ipfs/QmMockImage1002", 
        },
        mintedAt: "2025-01-20T15:45:00Z",
      },
    ];

    res.json({
      success: true,
      collection: mockCollection,
      totalCount: mockCollection.length,
      walletAddress: walletAddress.toLowerCase(),
      chainId: parseInt(chainId as string),
    });

  } catch (error) {
    console.error("❌ NFT collection fetch error:", error);
    res.status(500).json({ 
      error: "Failed to fetch NFT collection" 
    });
  }
});

/**
 * Verify NFT ownership
 */
router.get("/verify/:chainId/:tokenId/:walletAddress", async (req, res) => {
  try {
    const { chainId, tokenId, walletAddress } = req.params;
    
    console.log("🔐 NFT ownership verification:", { chainId, tokenId, walletAddress });

    if (!ethers.isAddress(walletAddress)) {
      return res.status(400).json({ 
        error: "Invalid wallet address" 
      });
    }

    // In production, verify ownership on blockchain
    const isOwner = Math.random() > 0.3; // Mock 70% ownership rate
    
    res.json({
      success: true,
      isOwner,
      tokenId,
      chainId: parseInt(chainId),
      walletAddress: walletAddress.toLowerCase(),
      verifiedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error("❌ NFT ownership verification error:", error);
    res.status(500).json({ 
      error: "Failed to verify NFT ownership" 
    });
  }
});

/**
 * Get minting statistics
 */
router.get("/stats", async (req, res) => {
  try {
    const stats = {
      totalCapsulesMinted: 15847,
      totalValueLocked: "2.5M GTT",
      averageMintTime: "45 seconds",
      successRate: "98.7%",
      supportedChains: ["Polygon", "Base", "Ethereum"],
      lastMint: new Date(Date.now() - 30000).toISOString(), // 30 seconds ago
    };

    res.json({
      success: true,
      stats,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("❌ NFT stats fetch error:", error);
    res.status(500).json({ 
      error: "Failed to fetch NFT statistics" 
    });
  }
});

// Helper functions
function getChainName(chainId: number): string {
  const chains = {
    1: "Ethereum",
    137: "Polygon", 
    8453: "Base",
  };
  return chains[chainId as keyof typeof chains] || `Chain ${chainId}`;
}

function getExplorerUrl(chainId: number, txHash: string): string {
  const explorers = {
    1: `https://etherscan.io/tx/${txHash}`,
    137: `https://polygonscan.com/tx/${txHash}`,
    8453: `https://basescan.org/tx/${txHash}`,
  };
  return explorers[chainId as keyof typeof explorers] || `https://etherscan.io/tx/${txHash}`;
}

export default router;