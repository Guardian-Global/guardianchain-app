import express from "express";
import { isDebugAuthenticated } from "../debugAuth"";

const router = express.Router();

// Create new truth bounty
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { title, description, rewardAmount, deadline, category } = req.body;
    const userId = req.user?.id;

    if (!title || !description || !rewardAmount) {
      return res.status(400).json({ 
        error: "Title, description, and reward amount are required" 
      });
    }

    const bounty = {
      id: `bounty_${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      rewardAmount: parseFloat(rewardAmount),
      deadline: deadline ? new Date(deadline) : null,
      category: category || "general",
      createdBy: userId,
      status: "active",
      submissionCount: 0,
      createdAt: new Date().toISOString(),
      blockchain: {
        network: "polygon",
        escrowAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`
      }
    };

    // In production, would save to database and create smart contract escrow
    console.log("Truth Bounty Created:", bounty);

    res.json({
      success: true,
      message: "Truth bounty created successfully",
      data: bounty
    });

  } catch (error) {
    console.error("Bounty creation error:", error);
    res.status(500).json({ 
      error: "Failed to create truth bounty",
      details: error.message 
    });
  }
});

// Get active bounties
router.get("/active", async (req, res) => {
  try {
    const { category, limit = 20, offset = 0 } = req.query;

    // Mock active bounties
    const bounties = [
      {
        id: "bounty_1",
        title: "Corporate Environmental Cover-up Investigation",
        description: "Looking for evidence of environmental data manipulation by major corporations",
        rewardAmount: 500,
        category: "environmental",
        deadline: "2025-02-15T23:59:59Z",
        submissionCount: 3,
        status: "active",
        createdAt: "2025-01-20T10:00:00Z"
      },
      {
        id: "bounty_2",
        title: "Healthcare Data Manipulation Evidence",
        description: "Seeking proof of healthcare research data being altered or suppressed",
        rewardAmount: 750,
        category: "healthcare",
        deadline: "2025-02-20T23:59:59Z",
        submissionCount: 7,
        status: "active",
        createdAt: "2025-01-18T15:30:00Z"
      },
      {
        id: "bounty_3",
        title: "Election Transparency Investigation",
        description: "Documentation of voting irregularities or transparency issues",
        rewardAmount: 1000,
        category: "government",
        deadline: "2025-03-01T23:59:59Z",
        submissionCount: 12,
        status: "active",
        createdAt: "2025-01-15T09:45:00Z"
      }
    ];

    // Filter by category if specified
    const filteredBounties = category 
      ? bounties.filter(b => b.category === category)
      : bounties;

    const paginatedBounties = filteredBounties.slice(
      parseInt(offset.toString()), 
      parseInt(offset.toString()) + parseInt(limit.toString())
    );

    res.json({
      bounties: paginatedBounties,
      total: filteredBounties.length,
      categories: ["general", "corporate", "government", "environmental", "healthcare", "financial", "media", "scientific"]
    });

  } catch (error) {
    console.error("Active bounties error:", error);
    res.status(500).json({ 
      error: "Failed to get active bounties",
      details: error.message 
    });
  }
});

// Submit evidence for bounty
router.post("/:bountyId/submit", authenticateToken, async (req, res) => {
  try {
    const { bountyId } = req.params;
    const { evidence, sources, methodology } = req.body;
    const userId = req.user?.id;

    if (!evidence) {
      return res.status(400).json({ 
        error: "Evidence description is required" 
      });
    }

    const submission = {
      id: `submission_${Date.now()}`,
      bountyId,
      submittedBy: userId,
      evidence: evidence.trim(),
      sources: sources?.trim() || null,
      methodology: methodology?.trim() || null,
      status: "pending_review",
      submittedAt: new Date().toISOString(),
      verificationScore: 0,
      reviewCount: 0
    };

    // In production, would save to database and trigger review process
    console.log("Bounty Submission:", submission);

    res.json({
      success: true,
      message: "Evidence submitted successfully",
      data: submission
    });

  } catch (error) {
    console.error("Bounty submission error:", error);
    res.status(500).json({ 
      error: "Failed to submit evidence",
      details: error.message 
    });
  }
});

// Get bounty submissions
router.get("/:bountyId/submissions", async (req, res) => {
  try {
    const { bountyId } = req.params;

    // Mock submissions for bounty
    const submissions = [
      {
        id: "submission_1",
        submittedBy: "user_123",
        submitterName: "Anonymous Researcher",
        evidence: "Obtained internal documents showing systematic data manipulation",
        verificationScore: 85,
        reviewCount: 3,
        status: "verified",
        submittedAt: "2025-01-25T12:00:00Z"
      },
      {
        id: "submission_2",
        submittedBy: "user_456", 
        submitterName: "Data Scientist",
        evidence: "Statistical analysis revealing anomalies in published datasets",
        verificationScore: 72,
        reviewCount: 2,
        status: "under_review",
        submittedAt: "2025-01-24T16:30:00Z"
      }
    ];

    res.json({
      bountyId,
      submissions,
      total: submissions.length
    });

  } catch (error) {
    console.error("Bounty submissions error:", error);
    res.status(500).json({ 
      error: "Failed to get bounty submissions",
      details: error.message 
    });
  }
});

// Get user's bounties
router.get("/user/bounties", authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;

    // Mock user bounties
    const userBounties = [
      {
        id: "bounty_user_1",
        title: "Corporate Transparency Investigation",
        status: "active",
        submissionCount: 5,
        rewardAmount: 300,
        createdAt: "2025-01-22T10:00:00Z"
      }
    ];

    res.json({
      userId,
      bounties: userBounties,
      total: userBounties.length
    });

  } catch (error) {
    console.error("User bounties error:", error);
    res.status(500).json({ 
      error: "Failed to get user bounties",
      details: error.message 
    });
  }
});

export default router;