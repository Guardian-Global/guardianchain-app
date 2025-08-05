import { Router } from "express";
import { consolidatedAuth } from "../auth/authConsolidation";
import multer from "multer";

const router = Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

/**
 * Pin capsule metadata to IPFS
 */
router.post("/pin", consolidatedAuth, async (req: any, res) => {
  try {
    const { metadata, name } = req.body;
    
    console.log("📎 IPFS metadata pin requested:", { name, metadataKeys: Object.keys(metadata) });

    if (!metadata || !name) {
      return res.status(400).json({ 
        error: "Missing required fields: metadata and name" 
      });
    }

    // In production, integrate with actual IPFS service (Pinata, Web3.Storage, etc.)
    // For now, we'll simulate the IPFS response
    
    const mockCID = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    const ipfsUrl = `https://ipfs.io/ipfs/${mockCID}`;
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log("✅ Metadata pinned to IPFS:", { cid: mockCID, ipfsUrl });

    res.json({
      success: true,
      cid: mockCID,
      ipfsUrl,
      size: JSON.stringify(metadata).length,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("❌ IPFS metadata pinning error:", error);
    res.status(500).json({ 
      error: "Failed to pin metadata to IPFS" 
    });
  }
});

/**
 * Pin media file to IPFS
 */
router.post("/pin-media", consolidatedAuth, upload.single("file"), async (req: any, res) => {
  try {
    const file = req.file;
    const { name } = req.body;
    
    console.log("📎 IPFS media pin requested:", { 
      fileName: file?.originalname, 
      size: file?.size,
      mimeType: file?.mimetype 
    });

    if (!file) {
      return res.status(400).json({ 
        error: "No file provided" 
      });
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg", "image/png", "image/gif", "image/webp",
      "video/mp4", "video/webm", "video/quicktime",
      "audio/mpeg", "audio/wav", "audio/ogg",
      "application/pdf", "text/plain"
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({ 
        error: `Unsupported file type: ${file.mimetype}` 
      });
    }

    // In production, integrate with actual IPFS service
    // For now, simulate the IPFS response
    
    const mockCID = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    const ipfsUrl = `https://ipfs.io/ipfs/${mockCID}`;
    
    // Simulate upload time based on file size
    const uploadTime = Math.min(2000, file.size / 1000); // Max 2 seconds
    await new Promise(resolve => setTimeout(resolve, uploadTime));
    
    console.log("✅ Media pinned to IPFS:", { 
      cid: mockCID, 
      ipfsUrl, 
      fileName: file.originalname,
      size: file.size 
    });

    res.json({
      success: true,
      cid: mockCID,
      ipfsUrl,
      fileName: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("❌ IPFS media pinning error:", error);
    res.status(500).json({ 
      error: "Failed to pin media to IPFS" 
    });
  }
});

/**
 * Get IPFS content by CID
 */
router.get("/content/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    
    console.log("📥 IPFS content requested:", { cid });

    if (!cid || !cid.startsWith("Qm")) {
      return res.status(400).json({ 
        error: "Invalid IPFS CID format" 
      });
    }

    // In production, fetch from actual IPFS network
    // For now, return mock data
    const mockContent = {
      title: "Mock Capsule Content",
      description: "This is mock content from IPFS",
      createdAt: new Date().toISOString(),
      creator: "0x1234567890123456789012345678901234567890",
      isPrivate: false,
      hasVeritasSeal: true,
    };

    res.json({
      success: true,
      content: mockContent,
      cid,
      fetchedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error("❌ IPFS content fetch error:", error);
    res.status(500).json({ 
      error: "Failed to fetch content from IPFS" 
    });
  }
});

/**
 * Check IPFS node status
 */
router.get("/status", async (req, res) => {
  try {
    // In production, check actual IPFS node connectivity
    const status = {
      connected: true,
      nodeId: "12D3KooWMockNodeId123456789",
      version: "0.13.0",
      totalStorage: "10GB",
      usedStorage: "2.5GB",
      pinnedObjects: 1247,
      lastUpdated: new Date().toISOString(),
    };

    res.json({
      success: true,
      status,
    });

  } catch (error) {
    console.error("❌ IPFS status check error:", error);
    res.status(500).json({ 
      error: "Failed to check IPFS status" 
    });
  }
});

export default router;