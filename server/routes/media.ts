import { Router } from "express";
import { ObjectStorageService } from "../objectStorage";
import { isDebugAuthenticated } from "../debugAuth";

const router = Router();

// Get upload URL for media files
router.post("/upload-url", isDebugAuthenticated, async (req, res) => {
  try {
    const { fileName, fileType, uploadType } = req.body;

    if (!fileName || !fileType || !uploadType) {
      return res.status(400).json({
        error: "Missing required fields: fileName, fileType, uploadType",
      });
    }

    const objectStorageService = new ObjectStorageService();
    const uploadURL = await objectStorageService.getObjectEntityUploadURL();

    res.json({ uploadURL });
  } catch (error) {
    console.error("Error generating upload URL:", error);
    res.status(500).json({ error: "Failed to generate upload URL" });
  }
});

// Handle post-upload metadata
router.post("/upload-complete", isDebugAuthenticated, async (req, res) => {
  try {
    const { mediaUrl, fileName, fileType, fileSize, uploadType } = req.body;
    const userId = req.user?.id;

    if (!mediaUrl || !fileName || !fileType) {
      return res.status(400).json({
        error: "Missing required fields: mediaUrl, fileName, fileType",
      });
    }

    const objectStorageService = new ObjectStorageService();

    // Set ACL policy for the uploaded file
    const objectPath = await objectStorageService.trySetObjectEntityAclPolicy(
      mediaUrl,
      {
        owner: userId,
        visibility: "public", // Default to public for profile media
        aclRules: [],
      },
    );

    // Store metadata in database if needed
    // This would integrate with your capsule creation logic

    res.json({
      success: true,
      objectPath,
      mediaUrl: objectPath,
    });
  } catch (error) {
    console.error("Error completing upload:", error);
    res.status(500).json({ error: "Failed to complete upload" });
  }
});

export default router;
