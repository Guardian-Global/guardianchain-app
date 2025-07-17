import type { Express } from "express";
import { storage } from "../storage";
import { insertCapsuleSchema } from "@shared/schema";
import { z } from "zod";

// Extended schema for GuardianChain capsules with additional fields
const guardianCapsuleSchema = insertCapsuleSchema.extend({
  tags: z.array(z.string()).optional(),
  evidence: z.array(z.object({
    type: z.enum(["link", "document", "image", "video", "other"]),
    url: z.string().url(),
    description: z.string(),
  })).optional(),
});

export function registerCapsuleRoutes(app: Express) {
  // Create new capsule
  app.post("/api/capsules", async (req, res) => {
    try {
      const validatedData = guardianCapsuleSchema.parse(req.body);
      
      // Process tags and evidence into metadata
      const metadata = {
        tags: validatedData.tags || [],
        evidence: validatedData.evidence || [],
      };

      const capsuleData = {
        ...validatedData,
        metadata,
        griefScore: "0.0",
        gttReward: "10.00", // Default GTT reward
      };

      const capsule = await storage.createCapsule(capsuleData);
      
      res.status(201).json({
        success: true,
        data: capsule,
        message: "Capsule created successfully"
      });
    } catch (error: any) {
      console.error("Error creating capsule:", error);
      res.status(400).json({
        success: false,
        error: error.message || "Failed to create capsule"
      });
    }
  });

  // Get capsule by ID with full details
  app.get("/api/capsules/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const capsule = await storage.getCapsule(id);
      
      if (!capsule) {
        return res.status(404).json({
          success: false,
          error: "Capsule not found"
        });
      }

      res.json({
        success: true,
        data: capsule
      });
    } catch (error: any) {
      console.error("Error fetching capsule:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to fetch capsule"
      });
    }
  });

  // Update capsule (for verification status, rewards, etc.)
  app.patch("/api/capsules/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const capsule = await storage.updateCapsule(id, updates);
      
      res.json({
        success: true,
        data: capsule,
        message: "Capsule updated successfully"
      });
    } catch (error: any) {
      console.error("Error updating capsule:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to update capsule"
      });
    }
  });

  // Get capsules with advanced filtering for GuardianChain
  app.get("/api/capsules", async (req, res) => {
    try {
      const filters = {
        status: req.query.status as string,
        creatorId: req.query.creatorId ? parseInt(req.query.creatorId as string) : undefined,
        isPublic: req.query.isPublic ? req.query.isPublic === "true" : undefined,
        category: req.query.category as string,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
        offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
        sortBy: req.query.sortBy as string || "grief", // Default to grief-score sorting
      };

      let capsules = await storage.getCapsules(filters);
      
      // Apply GuardianChain-specific sorting
      if (filters.sortBy === "grief") {
        capsules = capsules.sort((a, b) => parseFloat(b.griefScore || "0") - parseFloat(a.griefScore || "0"));
      } else if (filters.sortBy === "gtt") {
        capsules = capsules.sort((a, b) => parseFloat(b.gttReward || "0") - parseFloat(a.gttReward || "0"));
      } else if (filters.sortBy === "replay") {
        capsules = capsules.sort((a, b) => (b.replayCount || 0) - (a.replayCount || 0));
      }

      res.json({
        success: true,
        data: capsules,
        meta: {
          total: capsules.length,
          limit: filters.limit,
          offset: filters.offset,
          sortBy: filters.sortBy
        }
      });
    } catch (error: any) {
      console.error("Error fetching capsules:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to fetch capsules"
      });
    }
  });

  // Calculate and update TruthYield rewards
  app.post("/api/capsules/:id/yield", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const capsule = await storage.getCapsule(id);
      
      if (!capsule) {
        return res.status(404).json({
          success: false,
          error: "Capsule not found"
        });
      }

      // TruthYield calculation based on replay count and grief score
      const baseReward = parseFloat(capsule.gttReward || "0");
      const griefMultiplier = parseFloat(capsule.griefScore || "0") / 10;
      const replayBonus = (capsule.replayCount || 0) * 0.1;
      const totalYield = baseReward + (baseReward * griefMultiplier) + replayBonus;

      // Update capsule with new reward
      const updatedCapsule = await storage.updateCapsule(id, {
        gttReward: totalYield.toFixed(2),
        replayCount: (capsule.replayCount || 0) + 1
      });

      // Create transaction record
      await storage.createTransaction({
        userId: capsule.creatorId,
        type: "reward",
        amount: totalYield.toFixed(2),
        capsuleId: id,
        description: `TruthYield reward for capsule: ${capsule.title}`
      });

      res.json({
        success: true,
        data: {
          capsule: updatedCapsule,
          yieldEarned: totalYield,
          replayCount: updatedCapsule.replayCount
        },
        message: "TruthYield calculated and rewarded"
      });
    } catch (error: any) {
      console.error("Error calculating TruthYield:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to calculate TruthYield"
      });
    }
  });
}