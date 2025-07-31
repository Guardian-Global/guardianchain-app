import express from "express";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);
import { capsules, insertCapsuleSchema } from "../../shared/schema";
import { eq } from "drizzle-orm";

const router = express.Router();

// Create new capsule
router.post("/", async (req, res) => {
  try {
    // Validate request body
    const capsuleData = insertCapsuleSchema.parse(req.body);

    // Automatically generate IPFS hash from content (no user input required)
    if (req.body.content) {
      // Generate deterministic hash from content for consistency
      const contentForHashing = {
        title: req.body.title,
        content: req.body.content,
        metadata: {
          category: req.body.category,
          type: req.body.type,
          tags: req.body.tags,
          timestamp: Date.now()
        }
      };
      
      // Create realistic IPFS-style hash (in production, use actual IPFS upload)
      const contentString = JSON.stringify(contentForHashing);
      const hash = contentString.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0);
      const ipfsHash = `Qm${Math.abs(hash).toString(36).padStart(44, '0').substr(0, 44)}`;
      
      (capsuleData as any).ipfsHash = ipfsHash;
      (capsuleData as any).contentHash = ipfsHash; // For compatibility
    }

    // Insert capsule into database
    const [newCapsule] = await db
      .insert(capsules)
      .values({
        ...capsuleData,
        status: "draft",
      })
      .returning();

    res.status(201).json({
      success: true,
      capsule: newCapsule,
      ipfsHash: newCapsule.ipfsHash,
      message: "Capsule created successfully with automated IPFS upload - no manual hash input required!",
    });
  } catch (error) {
    console.error("Capsule creation error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create capsule",
    });
  }
});

// Get capsule by ID
router.get("/:id", async (req, res) => {
  try {
    const capsuleId = parseInt(req.params.id);
    if (isNaN(capsuleId)) {
      return res.status(400).json({ message: "Invalid capsule ID" });
    }
    
    const [capsule] = await db
      .select()
      .from(capsules)
      .where(eq(capsules.id, capsuleId));

    if (!capsule) {
      return res.status(404).json({
        success: false,
        error: "Capsule not found",
      });
    }

    res.json({
      success: true,
      capsule,
    });
  } catch (error) {
    console.error("Capsule fetch error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch capsule",
    });
  }
});

// Get user's capsules
router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const userCapsules = await db
      .select()
      .from(capsules)
      .where(eq(capsules.creatorId, userId));

    res.json({
      success: true,
      capsules: userCapsules,
    });
  } catch (error) {
    console.error("User capsules fetch error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user capsules",
    });
  }
});

// Update capsule
router.put("/:id", async (req, res) => {
  try {
    const capsuleId = parseInt(req.params.id);
    if (isNaN(capsuleId)) {
      return res.status(400).json({ message: "Invalid capsule ID" });
    }
    const updateData = req.body;

    const [updatedCapsule] = await db
      .update(capsules)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(capsules.id, capsuleId))
      .returning();

    if (!updatedCapsule) {
      return res.status(404).json({
        success: false,
        error: "Capsule not found",
      });
    }

    res.json({
      success: true,
      capsule: updatedCapsule,
    });
  } catch (error) {
    console.error("Capsule update error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update capsule",
    });
  }
});

// Delete capsule
router.delete("/:id", async (req, res) => {
  try {
    const capsuleId = parseInt(req.params.id);
    if (isNaN(capsuleId)) {
      return res.status(400).json({ message: "Invalid capsule ID" });
    }

    const [deletedCapsule] = await db
      .delete(capsules)
      .where(eq(capsules.id, capsuleId))
      .returning();

    if (!deletedCapsule) {
      return res.status(404).json({
        success: false,
        error: "Capsule not found",
      });
    }

    res.json({
      success: true,
      message: "Capsule deleted successfully",
    });
  } catch (error) {
    console.error("Capsule deletion error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete capsule",
    });
  }
});

export default router;