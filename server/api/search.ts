import { Router } from "express";
import { z } from "zod";
import { storage } from "../storage";

const router = Router();

const searchSchema = z.object({
  q: z.string().min(1, "Search query is required"),
  public_only: z
    .string()
    .transform((val) => val === "true")
    .default("true"),
  sort: z.string().default("recent"),
  page: z
    .string()
    .transform((val) => parseInt(val) || 1)
    .default("1"),
  limit: z
    .string()
    .transform((val) => parseInt(val) || 10)
    .default("10"),
});

// GET /api/search - Search for capsules
router.get("/", async (req, res) => {
  try {
    const validatedQuery = searchSchema.parse(req.query);
    const { q, public_only, sort, page, limit } = validatedQuery;
    const offset = (page - 1) * limit;

    console.log(
      `Search request: "${q}", public_only: ${public_only}, sort: ${sort}, page: ${page}, limit: ${limit}`,
    );

    // Get all capsules from storage
    const allCapsules = await storage.getAllCapsules();

    if (!allCapsules || allCapsules.length === 0) {
      return res.json({
        results: [],
        total: 0,
        query: q,
      });
    }

    // Filter capsules based on search criteria
    let filteredCapsules = allCapsules.filter((capsule) => {
      // Filter by public/private if requested
      if (public_only && capsule.content?.isPrivate) {
        return false;
      }

      // Search in title, description, and tags
      const searchTerm = q.toLowerCase();
      const titleMatch = capsule.title?.toLowerCase().includes(searchTerm);
      const descriptionMatch = capsule.description
        ?.toLowerCase()
        .includes(searchTerm);
      const tagsMatch = capsule.tags?.some((tag) =>
        tag.toLowerCase().includes(searchTerm),
      );

      return titleMatch || descriptionMatch || tagsMatch;
    });

    // Sort results based on the sort parameter
    filteredCapsules.sort((a, b) => {
      const searchTerm = q.toLowerCase();

      if (sort === "relevant") {
        const aScore =
          (a.title?.toLowerCase().includes(searchTerm) ? 3 : 0) +
          (a.description?.toLowerCase().includes(searchTerm) ? 2 : 0) +
          (a.tags?.some((tag) => tag.toLowerCase().includes(searchTerm))
            ? 1
            : 0);

        const bScore =
          (b.title?.toLowerCase().includes(searchTerm) ? 3 : 0) +
          (b.description?.toLowerCase().includes(searchTerm) ? 2 : 0) +
          (b.tags?.some((tag) => tag.toLowerCase().includes(searchTerm))
            ? 1
            : 0);

        return bScore - aScore;
      } else if (sort === "popular") {
        // Sort by likes, views, or shares (mock popularity for now)
        const aPopularity =
          parseInt(a.likes || "0") +
          parseInt(a.views || "0") +
          parseInt(a.shares || "0");
        const bPopularity =
          parseInt(b.likes || "0") +
          parseInt(b.views || "0") +
          parseInt(b.shares || "0");
        return bPopularity - aPopularity;
      } else {
        // Default: sort by most recent (created_at)
        const aDate = new Date(a.createdAt || a.created_at || 0).getTime();
        const bDate = new Date(b.createdAt || b.created_at || 0).getTime();
        return bDate - aDate;
      }
    });

    // Apply pagination
    const total = filteredCapsules.length;
    const paginatedResults = filteredCapsules.slice(offset, offset + limit);

    // Clean up results for client
    const results = paginatedResults.map((capsule) => ({
      id: capsule.id,
      title: capsule.title,
      description: capsule.description,
      tags: capsule.tags || [],
      isPrivate: capsule.content?.isPrivate || false,
      created_at: capsule.created_at || new Date().toISOString(),
      content: {
        encrypted: capsule.content?.encrypted || false,
        minted: capsule.content?.minted || false,
        tx_hash: capsule.content?.tx_hash,
      },
    }));

    res.json({
      results,
      total,
      query: q,
      sort,
      page,
      showing: results.length,
      offset,
      limit,
      hasMore: offset + limit < total,
    });
  } catch (error) {
    console.error("Search error:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Invalid search parameters",
        details: error.errors,
      });
    }

    res.status(500).json({
      error: "Search failed",
      message: error.message,
    });
  }
});

export default router;
