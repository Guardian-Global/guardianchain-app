import { Router } from "express";
import type { Request, Response } from "express";

const router = Router();

// Mock DAO data - in production this would connect to blockchain and database
const mockProposals = [
  {
    id: "prop_001",
    title: "Increase Truth Verification Rewards",
    description: "Proposal to increase GTT rewards for verified truth capsules by 25% to incentivize more community participation.",
    status: "active",
    votesFor: 1250,
    votesAgainst: 340,
    totalVotes: 1590,
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    requiredGTT: 100,
    proposer: "0x1234...5678",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: "prop_002", 
    title: "Community Treasury Allocation",
    description: "Allocate 10% of treasury funds to community-driven truth verification initiatives and bounty programs.",
    status: "active",
    votesFor: 890,
    votesAgainst: 120,
    totalVotes: 1010,
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    requiredGTT: 50,
    proposer: "0xabcd...efgh",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: "prop_003",
    title: "New Capsule Category: Environmental Truth",
    description: "Add environmental impact verification as a new capsule category with specialized validation protocols.",
    status: "passed",
    votesFor: 2100,
    votesAgainst: 450,
    totalVotes: 2550,
    endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // ended yesterday
    requiredGTT: 75,
    proposer: "0x9876...4321",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
  }
];

const mockStats = {
  totalMembers: 12847,
  totalGTT: 8945672,
  activeProposals: 2,
  treasuryBalance: 2890456,
  totalProposals: 47,
  passedProposals: 32,
  rejectedProposals: 13,
  averageParticipation: 67.5
};

// Get all DAO proposals
router.get("/proposals", (req: Request, res: Response) => {
  try {
    const { status, limit = 10, offset = 0 } = req.query;
    
    let filteredProposals = mockProposals;
    
    if (status && status !== 'all') {
      filteredProposals = mockProposals.filter(p => p.status === status);
    }
    
    const startIndex = parseInt(offset as string);
    const endIndex = startIndex + parseInt(limit as string);
    
    const paginatedProposals = filteredProposals.slice(startIndex, endIndex);
    
    res.json({
      proposals: paginatedProposals,
      total: filteredProposals.length,
      hasMore: endIndex < filteredProposals.length
    });
  } catch (error) {
    console.error("Error fetching DAO proposals:", error);
    res.status(500).json({ error: "Failed to fetch proposals" });
  }
});

// Get DAO statistics
router.get("/stats", (req: Request, res: Response) => {
  try {
    res.json(mockStats);
  } catch (error) {
    console.error("Error fetching DAO stats:", error);
    res.status(500).json({ error: "Failed to fetch DAO statistics" });
  }
});

// Get single proposal by ID
router.get("/proposals/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const proposal = mockProposals.find(p => p.id === id);
    
    if (!proposal) {
      return res.status(404).json({ error: "Proposal not found" });
    }
    
    res.json(proposal);
  } catch (error) {
    console.error("Error fetching proposal:", error);
    res.status(500).json({ error: "Failed to fetch proposal" });
  }
});

// Cast vote on proposal
router.post("/vote", (req: Request, res: Response) => {
  try {
    const { proposalId, vote, gttAmount } = req.body;
    
    if (!proposalId || !vote || !gttAmount) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    if (!['for', 'against'].includes(vote)) {
      return res.status(400).json({ error: "Vote must be 'for' or 'against'" });
    }
    
    const proposal = mockProposals.find(p => p.id === proposalId);
    if (!proposal) {
      return res.status(404).json({ error: "Proposal not found" });
    }
    
    if (proposal.status !== 'active') {
      return res.status(400).json({ error: "Proposal is not active" });
    }
    
    // In production, this would:
    // 1. Verify user has enough GTT
    // 2. Record vote on blockchain
    // 3. Update proposal vote counts
    // 4. Lock user's GTT for voting period
    
    console.log(`Vote cast: ${vote} on proposal ${proposalId} with ${gttAmount} GTT`);
    
    res.json({
      success: true,
      message: "Vote cast successfully",
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`, // Mock tx hash
      votingPower: gttAmount
    });
  } catch (error) {
    console.error("Error casting vote:", error);
    res.status(500).json({ error: "Failed to cast vote" });
  }
});

// Create new proposal (requires higher GTT threshold)
router.post("/proposals", (req: Request, res: Response) => {
  try {
    const { title, description, requiredGTT = 100 } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" });
    }
    
    // In production, verify user has enough GTT to create proposal
    const minimumGTT = 1000; // Minimum GTT to create proposal
    
    const newProposal = {
      id: `prop_${Date.now()}`,
      title,
      description,
      status: "active" as const,
      votesFor: 0,
      votesAgainst: 0,
      totalVotes: 0,
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days
      requiredGTT,
      proposer: "0x1234...5678", // Would be actual user address
      createdAt: new Date().toISOString(),
    };
    
    mockProposals.unshift(newProposal);
    
    res.status(201).json({
      success: true,
      proposal: newProposal,
      message: "Proposal created successfully"
    });
  } catch (error) {
    console.error("Error creating proposal:", error);
    res.status(500).json({ error: "Failed to create proposal" });
  }
});

// Get user's voting history
router.get("/my-votes", (req: Request, res: Response) => {
  try {
    // Mock voting history - in production would query from blockchain/database
    const mockVotingHistory = [
      {
        proposalId: "prop_001",
        proposalTitle: "Increase Truth Verification Rewards",
        vote: "for",
        gttAmount: 250,
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
        transactionHash: "0xabc123...",
      },
      {
        proposalId: "prop_003",
        proposalTitle: "New Capsule Category: Environmental Truth",
        vote: "for",
        gttAmount: 500,
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        transactionHash: "0xdef456...",
      }
    ];
    
    res.json(mockVotingHistory);
  } catch (error) {
    console.error("Error fetching voting history:", error);
    res.status(500).json({ error: "Failed to fetch voting history" });
  }
});

export default router;