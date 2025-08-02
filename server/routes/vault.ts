import { Router } from "express";
import { storage } from "../storage";
import { isDebugAuthenticated } from "../debugAuth";

const router = Router();

// Get timeline entries for a user's capsule vault
router.get("/timeline/:userId", isDebugAuthenticated, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // For now, return mock data since we're setting up the infrastructure
    const mockTimelineEntries = [
      {
        id: "entry-1",
        userId,
        capsuleId: "capsule-1",
        entryType: "media",
        caption: "Just uploaded my first truth capsule!",
        visibility: "public",
        likesCount: 12,
        commentsCount: 3,
        sharesCount: 1,
        isPinned: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        capsule: {
          id: "capsule-1",
          title: "My First Truth",
          content: "This is my first truth capsule on GuardianChain.",
          mediaType: "image",
          mediaUrl: "/placeholder-image.jpg",
          thumbnailUrl: "/placeholder-thumb.jpg",
          nftTokenId: null,
          isNftMinted: false,
          isTruthVaultSealed: false,
        }
      },
      {
        id: "entry-2", 
        userId,
        capsuleId: "capsule-2",
        entryType: "post",
        caption: "Sharing an important memory from my childhood.",
        visibility: "public",
        likesCount: 25,
        commentsCount: 8,
        sharesCount: 4,
        isPinned: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        capsule: {
          id: "capsule-2",
          title: "Childhood Memory",
          content: "A precious memory from when I was seven years old, playing in my grandmother's garden.",
          mediaType: null,
          mediaUrl: null,
          thumbnailUrl: null,
          nftTokenId: "0x123...abc",
          isNftMinted: true,
          isTruthVaultSealed: true,
        }
      }
    ];

    res.json(mockTimelineEntries);
  } catch (error) {
    console.error("Error fetching timeline entries:", error);
    res.status(500).json({ error: "Failed to fetch timeline entries" });
  }
});

// Create a new timeline entry
router.post("/timeline", isDebugAuthenticated, async (req, res) => {
  try {
    const { capsuleId, entryType, caption, visibility } = req.body;
    const userId = req.user?.id;

    if (!capsuleId || !entryType) {
      return res.status(400).json({ 
        error: "Missing required fields: capsuleId, entryType" 
      });
    }

    const timelineEntry = {
      id: `entry-${Date.now()}`,
      userId,
      capsuleId,
      entryType,
      caption: caption || "",
      visibility: visibility || "public",
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      isPinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // In a real implementation, this would use storage.createCapsuleVaultEntry
    // await storage.createCapsuleVaultEntry(timelineEntry);

    res.status(201).json(timelineEntry);
  } catch (error) {
    console.error("Error creating timeline entry:", error);
    res.status(500).json({ error: "Failed to create timeline entry" });
  }
});

// Update a timeline entry
router.put("/timeline/:entryId", isDebugAuthenticated, async (req, res) => {
  try {
    const { entryId } = req.params;
    const updateData = req.body;

    // In a real implementation, this would use storage.updateCapsuleVaultEntry
    // const updatedEntry = await storage.updateCapsuleVaultEntry(entryId, updateData);

    const updatedEntry = {
      id: entryId,
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    res.json(updatedEntry);
  } catch (error) {
    console.error("Error updating timeline entry:", error);
    res.status(500).json({ error: "Failed to update timeline entry" });
  }
});

// Delete a timeline entry
router.delete("/timeline/:entryId", isDebugAuthenticated, async (req, res) => {
  try {
    const { entryId } = req.params;

    // In a real implementation, this would use storage.deleteCapsuleVaultEntry
    // await storage.deleteCapsuleVaultEntry(entryId);

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting timeline entry:", error);
    res.status(500).json({ error: "Failed to delete timeline entry" });
  }
});

export default router;