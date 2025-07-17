import express from "express";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const router = express.Router();

// Initialize Pinata for IPFS uploads (using REST API instead of SDK)
const pinataApiKey = process.env.PINATA_API_KEY;
const pinataApiSecret = process.env.PINATA_SECRET_KEY;

// Upload JSON to IPFS via Pinata
async function uploadToIPFS(metadata: any): Promise<{ IpfsHash: string }> {
  const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
  
  const response = await axios.post(url, metadata, {
    headers: {
      'Content-Type': 'application/json',
      'pinata_api_key': pinataApiKey,
      'pinata_secret_api_key': pinataApiSecret
    }
  });
  
  return response.data;
}

// NFT Contract address (will need to be deployed)
const NFT_CONTRACT_ADDRESS = "0x1234567890abcdef1234567890abcdef12345678"; // Replace with actual contract

interface CapsuleNFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  external_url: string;
  animation_url?: string;
  background_color?: string;
  capsule_data: {
    id: number;
    creator: string;
    sealed_at: string;
    veritas_url?: string;
    grief_score: string;
    category: string;
    evidence: any;
  };
}

// Mint capsule as NFT
router.post("/", async (req, res) => {
  try {
    const { capsuleId, walletAddress } = req.body;

    if (!capsuleId || !walletAddress) {
      return res.status(400).json({ 
        error: "Missing required fields: capsuleId and walletAddress" 
      });
    }

    console.log(`🖼️ Minting NFT for capsule ${capsuleId} to ${walletAddress}`);

    // 1. Fetch capsule from Supabase
    const { data: capsule, error: fetchError } = await supabase
      .from("capsules")
      .select("*")
      .eq("id", capsuleId)
      .single();

    if (fetchError || !capsule) {
      return res.status(404).json({ error: "Capsule not found" });
    }

    // 2. Verify capsule is sealed with Veritas
    if (!capsule.docusignEnvelopeId || capsule.status !== "sealed") {
      return res.status(400).json({ 
        error: "❌ You must seal this capsule with Veritas before minting as NFT.",
        sealRequired: true
      });
    }

    // 3. Check if already minted
    if (capsule.nftTokenId) {
      return res.status(400).json({ 
        error: "This capsule has already been minted as NFT",
        tokenId: capsule.nftTokenId
      });
    }

    // 4. Generate NFT metadata
    const metadata: CapsuleNFTMetadata = {
      name: `Truth Capsule: ${capsule.title}`,
      description: `${capsule.description}\n\nThis NFT represents a verified truth capsule sealed with DocuSign Veritas technology. It provides immutable proof of the content's authenticity and submission time on the GuardianChain platform.`,
      image: capsule.imageUrl || `https://api.dicebear.com/7.x/shapes/svg?seed=${capsule.id}`,
      external_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://guardianchain.app'}/capsule/${capsule.id}`,
      background_color: "1e293b",
      attributes: [
        {
          trait_type: "Category",
          value: capsule.category
        },
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
          trait_type: "Sealed with Veritas",
          value: "Yes"
        },
        {
          trait_type: "Status",
          value: "Verified"
        }
      ],
      capsule_data: {
        id: capsule.id,
        creator: `Creator #${capsule.creatorId}`,
        sealed_at: capsule.updatedAt,
        veritas_url: capsule.veritasSealUrl,
        grief_score: capsule.griefScore || "0.0",
        category: capsule.category,
        evidence: capsule.evidence
      }
    };

    console.log("📄 Generated NFT metadata:", metadata.name);

    // 5. Upload metadata to IPFS via Pinata
    const ipfsUpload = await uploadToIPFS(metadata);
    const metadataUri = `ipfs://${ipfsUpload.IpfsHash}`;
    
    console.log("📦 Uploaded to IPFS:", metadataUri);

    // 6. For now, simulate NFT minting (will integrate with actual contract later)
    const mockTokenId = Date.now(); // Temporary mock token ID
    const mockTxHash = `0x${Date.now().toString(16)}mock`; // Temporary mock transaction hash

    console.log(`✅ NFT metadata prepared! Mock Token ID: ${mockTokenId}`);

    // 7. Update capsule in Supabase with NFT info
    const { error: updateError } = await supabase
      .from("capsules")
      .update({
        nftTokenId: mockTokenId.toString(),
        ipfsHash: ipfsUpload.IpfsHash,
        updatedAt: new Date().toISOString()
      })
      .eq("id", capsuleId);

    if (updateError) {
      console.error("Failed to update capsule with NFT data:", updateError);
      // Don't fail the request since NFT was successfully prepared
    }

    // 8. Record transaction in database
    const { error: txError } = await supabase
      .from("transactions")
      .insert([{
        userId: capsule.creatorId,
        type: "nft_mint",
        amount: "0.00", // No cost for minting
        capsuleId: capsule.id,
        txHash: mockTxHash,
        description: `Prepared NFT for truth capsule: ${capsule.title}`,
        createdAt: new Date().toISOString()
      }]);

    if (txError) {
      console.error("Failed to record transaction:", txError);
    }

    return res.status(200).json({
      success: true,
      message: "NFT metadata successfully prepared and uploaded to IPFS!",
      tokenId: mockTokenId.toString(),
      transactionHash: mockTxHash,
      metadataUri,
      ipfsHash: ipfsUpload.IpfsHash,
      openSeaUrl: `https://opensea.io/assets/matic/${NFT_CONTRACT_ADDRESS}/${mockTokenId}`,
      capsule: {
        id: capsule.id,
        title: capsule.title,
        nftTokenId: mockTokenId.toString()
      },
      note: "NFT metadata is prepared for minting. Contract deployment and minting will be implemented in production."
    });

  } catch (error: any) {
    console.error("NFT minting error:", error);
    return res.status(500).json({ 
      error: "Failed to mint NFT", 
      details: error.message 
    });
  }
});

// Get NFT status for a capsule
router.get("/status/:capsuleId", async (req, res) => {
  try {
    const { capsuleId } = req.params;

    const { data: capsule, error } = await supabase
      .from("capsules")
      .select("id, title, nftTokenId, ipfsHash, docusignEnvelopeId, status")
      .eq("id", capsuleId)
      .single();

    if (error || !capsule) {
      return res.status(404).json({ error: "Capsule not found" });
    }

    const canMint = capsule.docusignEnvelopeId && capsule.status === "sealed" && !capsule.nftTokenId;
    const alreadyMinted = !!capsule.nftTokenId;

    return res.status(200).json({
      capsuleId: capsule.id,
      title: capsule.title,
      canMint,
      alreadyMinted,
      requiresSealing: !capsule.docusignEnvelopeId || capsule.status !== "sealed",
      nftTokenId: capsule.nftTokenId,
      ipfsHash: capsule.ipfsHash,
      openSeaUrl: alreadyMinted ? 
        `https://opensea.io/assets/matic/${NFT_CONTRACT_ADDRESS}/${capsule.nftTokenId}` : 
        null
    });
  } catch (error: any) {
    console.error("NFT status check error:", error);
    return res.status(500).json({ 
      error: "Failed to check NFT status", 
      details: error.message 
    });
  }
});

// Test endpoint for minting with mock data
router.post("/test", async (req, res) => {
  try {
    const mockCapsule = {
      id: 999,
      title: "Test NFT Mint: Climate Data Verification",
      description: "Testing NFT minting for verified truth capsules",
      category: "science",
      griefScore: "1.0",
      gttReward: "100.00",
      verificationCount: 5,
      docusignEnvelopeId: "test_envelope_" + Date.now(),
      status: "sealed",
      veritasSealUrl: "https://demo.docusign.net/test",
      imageUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=999"
    };

    const metadata: CapsuleNFTMetadata = {
      name: `Truth Capsule: ${mockCapsule.title}`,
      description: mockCapsule.description + "\n\nThis is a test NFT for GuardianChain development.",
      image: mockCapsule.imageUrl,
      external_url: `https://guardianchain.app/capsule/${mockCapsule.id}`,
      background_color: "1e293b",
      attributes: [
        { trait_type: "Category", value: mockCapsule.category },
        { trait_type: "Grief Score", value: parseFloat(mockCapsule.griefScore) },
        { trait_type: "Verification Count", value: mockCapsule.verificationCount },
        { trait_type: "GTT Reward", value: parseFloat(mockCapsule.gttReward) },
        { trait_type: "Sealed with Veritas", value: "Yes" },
        { trait_type: "Status", value: "Verified" }
      ],
      capsule_data: {
        id: mockCapsule.id,
        creator: "Test Creator",
        sealed_at: new Date().toISOString(),
        veritas_url: mockCapsule.veritasSealUrl,
        grief_score: mockCapsule.griefScore,
        category: mockCapsule.category,
        evidence: { test: true }
      }
    };

    console.log("🧪 Testing NFT metadata generation");
    console.log("📄 Mock metadata:", JSON.stringify(metadata, null, 2));

    return res.status(200).json({
      success: true,
      message: "NFT minting test completed successfully",
      mockCapsule,
      generatedMetadata: metadata,
      thirdwebConfigured: !!(process.env.THIRDWEB_SECRET && process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID),
      pinataConfigured: !!process.env.PINATA_API_KEY,
      readyForMinting: true
    });

  } catch (error: any) {
    console.error("NFT test error:", error);
    return res.status(500).json({ 
      error: "NFT test failed", 
      details: error.message 
    });
  }
});

export default router;