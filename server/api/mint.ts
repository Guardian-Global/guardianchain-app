import type { Express } from "express";
import { storage } from "../storage";

// Thirdweb NFT minting integration for GuardianChain
export function registerMintRoutes(app: Express) {
  // Mint NFT for verified capsule
  app.post("/api/mint/:capsuleId", async (req, res) => {
    try {
      const capsuleId = parseInt(req.params.capsuleId);
      const { walletAddress } = req.body;
      
      const capsule = await storage.getCapsule(capsuleId);
      
      if (!capsule) {
        return res.status(404).json({
          success: false,
          error: "Capsule not found"
        });
      }

      if (capsule.status !== "verified") {
        return res.status(400).json({
          success: false,
          error: "Only verified capsules can be minted as NFTs"
        });
      }

      if (capsule.nftTokenId) {
        return res.status(400).json({
          success: false,
          error: "Capsule has already been minted as NFT"
        });
      }

      // Mock Thirdweb integration - replace with actual Thirdweb SDK calls
      const mockTokenId = `nft_${Date.now()}_${capsuleId}`;
      const mockTransactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      const mockContractAddress = "0x742d35Cc6535C0532925a3b8D100d8Cc9C0D4C67";
      
      // NFT metadata
      const nftMetadata = {
        name: `Truth Capsule #${capsuleId}: ${capsule.title}`,
        description: capsule.description,
        image: capsule.imageUrl || `https://api.dicebear.com/7.x/shapes/svg?seed=${capsuleId}`,
        attributes: [
          {
            trait_type: "Grief Score",
            value: capsule.griefScore
          },
          {
            trait_type: "Verification Count",
            value: capsule.verificationCount
          },
          {
            trait_type: "GTT Reward",
            value: capsule.gttReward
          },
          {
            trait_type: "Category",
            value: capsule.category
          },
          {
            trait_type: "Veritas Sealed",
            value: capsule.docusignEnvelopeId ? "Yes" : "No"
          }
        ],
        properties: {
          capsuleId: capsuleId,
          creator: capsule.creatorId,
          griefScore: capsule.griefScore,
          veritasSealed: !!capsule.docusignEnvelopeId,
          ipfsHash: capsule.ipfsHash
        }
      };

      // Update capsule with NFT info
      const updatedCapsule = await storage.updateCapsule(capsuleId, {
        nftTokenId: mockTokenId,
        metadata: {
          ...capsule.metadata,
          nft: {
            tokenId: mockTokenId,
            contractAddress: mockContractAddress,
            transactionHash: mockTransactionHash,
            mintedAt: new Date().toISOString(),
            metadata: nftMetadata
          }
        }
      });

      // Create transaction record for minting
      await storage.createTransaction({
        userId: capsule.creatorId,
        type: "nft_mint",
        amount: "0.00",
        capsuleId: capsuleId,
        txHash: mockTransactionHash,
        description: `NFT minted for capsule: ${capsule.title}`
      });

      // Award bonus GTT for minting
      const mintBonus = 50; // 50 GTT bonus for minting
      await storage.createTransaction({
        userId: capsule.creatorId,
        type: "mint_bonus",
        amount: mintBonus.toString(),
        capsuleId: capsuleId,
        description: `Minting bonus for NFT creation`
      });

      res.json({
        success: true,
        data: {
          capsule: updatedCapsule,
          nft: {
            tokenId: mockTokenId,
            contractAddress: mockContractAddress,
            transactionHash: mockTransactionHash,
            metadata: nftMetadata,
            mintBonus: mintBonus
          }
        },
        message: "NFT minted successfully"
      });
    } catch (error: any) {
      console.error("Error minting NFT:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to mint NFT"
      });
    }
  });

  // Get NFT metadata
  app.get("/api/mint/metadata/:tokenId", async (req, res) => {
    try {
      const { tokenId } = req.params;
      
      // Find capsule by token ID
      const capsules = await storage.getCapsules({ limit: 1000, offset: 0 });
      const capsule = capsules.find(c => c.nftTokenId === tokenId);
      
      if (!capsule) {
        return res.status(404).json({
          success: false,
          error: "NFT not found"
        });
      }

      const metadata = capsule.metadata as any;
      const nftData = metadata?.nft || {};

      res.json({
        success: true,
        data: {
          name: `Truth Capsule #${capsule.id}: ${capsule.title}`,
          description: capsule.description,
          image: capsule.imageUrl || `https://api.dicebear.com/7.x/shapes/svg?seed=${capsule.id}`,
          external_url: `${process.env.FRONTEND_URL || 'http://localhost:5000'}/capsule/${capsule.id}`,
          attributes: [
            {
              trait_type: "Grief Score",
              value: parseFloat(capsule.griefScore || "0")
            },
            {
              trait_type: "Verification Count",
              value: capsule.verificationCount || 0
            },
            {
              trait_type: "GTT Reward",
              value: parseFloat(capsule.gttReward || "0")
            },
            {
              trait_type: "Category",
              value: capsule.category
            },
            {
              trait_type: "Veritas Sealed",
              value: capsule.docusignEnvelopeId ? "Yes" : "No"
            },
            {
              trait_type: "Replay Count",
              value: capsule.replayCount || 0
            }
          ]
        }
      });
    } catch (error: any) {
      console.error("Error fetching NFT metadata:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to fetch NFT metadata"
      });
    }
  });

  // Get all minted NFTs
  app.get("/api/mint/collection", async (req, res) => {
    try {
      const capsules = await storage.getCapsules({ limit: 1000, offset: 0 });
      const mintedNFTs = capsules.filter(capsule => capsule.nftTokenId);

      const nftCollection = mintedNFTs.map(capsule => ({
        capsuleId: capsule.id,
        tokenId: capsule.nftTokenId,
        title: capsule.title,
        griefScore: capsule.griefScore,
        gttReward: capsule.gttReward,
        veritas: !!capsule.docusignEnvelopeId,
        metadata: capsule.metadata
      }));

      res.json({
        success: true,
        data: nftCollection,
        meta: {
          total: nftCollection.length,
          verified: nftCollection.filter(nft => nft.veritas).length
        }
      });
    } catch (error: any) {
      console.error("Error fetching NFT collection:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to fetch NFT collection"
      });
    }
  });

  // Check if capsule can be minted
  app.get("/api/mint/check/:capsuleId", async (req, res) => {
    try {
      const capsuleId = parseInt(req.params.capsuleId);
      const capsule = await storage.getCapsule(capsuleId);
      
      if (!capsule) {
        return res.status(404).json({
          success: false,
          error: "Capsule not found"
        });
      }

      const canMint = capsule.status === "verified" && !capsule.nftTokenId;
      const requirements = {
        verified: capsule.status === "verified",
        notMinted: !capsule.nftTokenId,
        hasVeritas: !!capsule.docusignEnvelopeId,
        griefScore: parseFloat(capsule.griefScore || "0")
      };

      res.json({
        success: true,
        data: {
          canMint,
          requirements,
          capsule: {
            id: capsule.id,
            title: capsule.title,
            status: capsule.status,
            griefScore: capsule.griefScore,
            nftTokenId: capsule.nftTokenId
          }
        }
      });
    } catch (error: any) {
      console.error("Error checking mint eligibility:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to check mint eligibility"
      });
    }
  });
}