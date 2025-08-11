import { Router } from "express";
import { consolidatedAuth } from "../auth/authConsolidation";
import { z } from "zod";
import { storage } from "../storage";

const router = Router();

const voteSchema = z.object({
  wallet: z.string().min(1, "Wallet address is required"),
  vote_type: z.enum(["upvote", "downvote"]).default("upvote"),
});

// POST /api/capsules/:id/vote - Vote on a capsule
router.post("/:id/vote", consolidatedAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = voteSchema.parse(req.body);
    const { wallet, vote_type } = validatedData;

    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Invalid capsule ID" });
    }

    console.log(
      `Vote request: capsule ${id}, wallet ${wallet}, type ${vote_type}`,
    );

    // Check if capsule exists
    const capsule = await storage.getCapsule(id);
    if (!capsule) {
      return res.status(404).json({ error: "Capsule not found" });
    }

    // Record the vote
    const vote = await storage.recordVote({
      capsuleId: id,
      voterWallet: wallet,
      voteType: vote_type,
      createdAt: new Date(),
    });

    // No likes property in schema; just return updated vote stats
    const votes = await storage.getVotesByCapsule(id);
    const upvotes = votes.filter((v) => v.voteType === "upvote").length;
    const downvotes = votes.filter((v) => v.voteType === "downvote").length;
    res.status(200).json({
      message: "Vote recorded successfully",
      vote,
      upvotes,
      downvotes,
      score: upvotes - downvotes,
    });
  } catch (error) {
    console.error("Vote recording error:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Invalid vote data",
        details: error.errors,
      });
    }

    res.status(500).json({
      error: "Failed to record vote",
      message: error instanceof Error ? error.message : String(error),
    });
  }
});

// GET /api/capsules/:id/votes - Get vote statistics for a capsule
router.get("/:id/votes", consolidatedAuth, async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Invalid capsule ID" });
    }

    const capsule = await storage.getCapsule(id);
    if (!capsule) {
      return res.status(404).json({ error: "Capsule not found" });
    }

    const votes = await storage.getVotesByCapsule(id);
    const upvotes = votes.filter((vote) => vote.voteType === "upvote").length;
    const downvotes = votes.filter(
      (vote) => vote.voteType === "downvote",
    ).length;

    res.json({
      capsuleId: id,
      totalVotes: votes.length,
      upvotes,
      downvotes,
      score: upvotes - downvotes,
      votes: votes.map((vote) => ({
        id: vote.id,
        wallet: vote.voterWallet,
        type: vote.voteType,
        createdAt: vote.createdAt,
      })),
    });
  } catch (error) {
    console.error("Vote retrieval error:", error);
    res.status(500).json({
      error: "Failed to retrieve votes",
      message: error instanceof Error ? error.message : String(error),
    });
  }
});

// GET /api/capsules/:id/user-vote/:wallet - Check if user has voted on a capsule
router.get("/:id/user-vote/:wallet", consolidatedAuth, async (req, res) => {
  try {
    const { id, wallet } = req.params;

    if (!id || !wallet) {
      return res
        .status(400)
        .json({ error: "Missing capsule ID or wallet address" });
    }

    const userVote = await storage.getUserVote(id, wallet);

    res.json({
      hasVoted: !!userVote,
      voteType: userVote?.voteType || null,
      votedAt: userVote?.createdAt || null,
    });
  } catch (error) {
    console.error("User vote check error:", error);
    res.status(500).json({
      error: "Failed to check user vote",
      message: error instanceof Error ? error.message : String(error),
    });
  }
});

export default router;
