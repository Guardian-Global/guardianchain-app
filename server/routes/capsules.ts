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

    // Simulate IPFS upload if autoIpfs is enabled
    if (req.body.autoIpfs && req.body.content) {
      // In production, this would upload to actual IPFS
      const mockIpfsHash = `Qm${Math.random().toString(36).substr(2, 44)}`;
      capsuleData.ipfsHash = mockIpfsHash;
    }

    // Insert capsule into database
    const [newCapsule] = await db
      .insert(capsules)
      .values({
        ...capsuleData,
        creatorId: req.body.creatorId || "demo-user", // In production, get from authenticated user
        status: "draft",
      })
      .returning();

    res.status(201).json({
      success: true,
      capsule: newCapsule,
      message: "Capsule created successfully",
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