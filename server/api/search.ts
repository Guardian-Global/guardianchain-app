import { Router } from "express";
import { z } from "zod";
import { storage } from "../storage";

const router = Router();

const searchSchema = z.object({
  q: z.string().min(1, "Search query is required"),
  public_only: z.string().transform(val => val === "true").default("true"),
  limit: z.string().transform(val => parseInt(val) || 20).default("20"),
  offset: z.string().transform(val => parseInt(val) || 0).default("0")
});

// GET /api/search - Search for capsules
router.get("/", async (req, res) => {
  try {
    const validatedQuery = searchSchema.parse(req.query);
    const { q, public_only, limit, offset } = validatedQuery;

    console.log(`Search request: "${q}", public_only: ${public_only}, limit: ${limit}, offset: ${offset}`);

    // Get all capsules from storage
    const allCapsules = await storage.getAllCapsules();
    
    if (!allCapsules || allCapsules.length === 0) {
      return res.json({
        results: [],
        total: 0,
        query: q
      });
    }

    // Filter capsules based on search criteria
    let filteredCapsules = allCapsules.filter(capsule => {
      // Filter by public/private if requested
      if (public_only && capsule.content?.isPrivate) {
        return false;
      }

      // Search in title, description, and tags
      const searchTerm = q.toLowerCase();
      const titleMatch = capsule.title?.toLowerCase().includes(searchTerm);
      const descriptionMatch = capsule.description?.toLowerCase().includes(searchTerm);
      const tagsMatch = capsule.tags?.some(tag => 
        tag.toLowerCase().includes(searchTerm)
      );

      return titleMatch || descriptionMatch || tagsMatch;
    });

    // Sort by relevance (title matches first, then description, then tags)
    filteredCapsules.sort((a, b) => {
      const searchTerm = q.toLowerCase();
      
      const aScore = (
        (a.title?.toLowerCase().includes(searchTerm) ? 3 : 0) +
        (a.description?.toLowerCase().includes(searchTerm) ? 2 : 0) +
        (a.tags?.some(tag => tag.toLowerCase().includes(searchTerm)) ? 1 : 0)
      );
      
      const bScore = (
        (b.title?.toLowerCase().includes(searchTerm) ? 3 : 0) +
        (b.description?.toLowerCase().includes(searchTerm) ? 2 : 0) +
        (b.tags?.some(tag => tag.toLowerCase().includes(searchTerm)) ? 1 : 0)
      );
      
      return bScore - aScore;
    });

    // Apply pagination
    const total = filteredCapsules.length;
    const paginatedResults = filteredCapsules.slice(offset, offset + limit);

    // Clean up results for client
    const results = paginatedResults.map(capsule => ({
      id: capsule.id,
      title: capsule.title,
      description: capsule.description,
      tags: capsule.tags || [],
      isPrivate: capsule.content?.isPrivate || false,
      created_at: capsule.created_at || new Date().toISOString(),
      content: {
        encrypted: capsule.content?.encrypted || false,
        minted: capsule.content?.minted || false,
        tx_hash: capsule.content?.tx_hash
      }
    }));

    res.json({
      results,
      total,
      query: q,
      showing: results.length,
      offset,
      limit
    });

  } catch (error) {
    console.error("Search error:", error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Invalid search parameters",
        details: error.errors
      });
    }

    res.status(500).json({
      error: "Search failed",
      message: error.message
    });
  }
});

export default router;