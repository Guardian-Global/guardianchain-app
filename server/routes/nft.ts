import { Router } from "express";
import { isDebugAuthenticated } from "../debugAuth";

const router = Router();

// Upload metadata to IPFS (mock implementation)
router.post("/upload-metadata", isDebugAuthenticated, async (req, res) => {
  try {
    const { capsuleId, metadata } = req.body;
    
    // Mock IPFS hash generation
    const ipfsHash = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    
    console.log(`📦 NFT metadata uploaded for capsule ${capsuleId}:`, {
      ipfsHash,
      metadata: metadata.name
    });
    
    res.json({
      ipfsHash,
      metadataUri: `ipfs://${ipfsHash}`,
      gateway: `https://ipfs.io/ipfs/${ipfsHash}`
    });
  } catch (error) {
    console.error("Error uploading NFT metadata:", error);
    res.status(500).json({ error: "Failed to upload metadata" });
  }
});

// Mint NFT (mock implementation)
router.post("/mint", isDebugAuthenticated, async (req, res) => {
  try {
    const { capsuleId, metadataUri, recipient } = req.body;
    
    // Mock NFT minting
    const tokenId = Math.floor(Math.random() * 1000000);
    const contractAddress = "0x1234567890123456789012345678901234567890";
    const transactionHash = `0x${Math.random().toString(16).substring(2, 66)}`;
    
    console.log(`🎨 NFT minted for capsule ${capsuleId}:`, {
      tokenId,
      contractAddress,
      recipient,
      metadataUri
    });
    
    res.json({
      tokenId,
      contractAddress,
      transactionHash,
      metadataUri,
      recipient,
      blockNumber: Math.floor(Math.random() * 1000000),
      gasUsed: "21000"
    });
  } catch (error) {
    console.error("Error minting NFT:", error);
    res.status(500).json({ error: "Failed to mint NFT" });
  }
});

// Get NFT metadata
router.get("/metadata/:tokenId", async (req, res) => {
  try {
    const { tokenId } = req.params;
    
    // Mock metadata retrieval
    const metadata = {
      name: `Truth Capsule #${tokenId}`,
      description: "A verified truth capsule preserved on GuardianChain",
      image: `https://api.guardianchain.app/nft/${tokenId}/image`,
      attributes: [
        { trait_type: "Truth Score", value: Math.floor(Math.random() * 100) },
        { trait_type: "Verification Level", value: "Verified" },
        { trait_type: "Creation Date", value: new Date().toISOString() }
      ]
    };
    
    console.log(`🎨 NFT metadata requested for token ${tokenId}`);
    
    res.json(metadata);
  } catch (error) {
    console.error("Error fetching NFT metadata:", error);
    res.status(500).json({ error: "Failed to fetch metadata" });
  }
});

export default router;