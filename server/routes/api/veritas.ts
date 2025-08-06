// server/routes/api/veritas.ts
import { Router } from 'express';
import { consolidatedAuth } from '../../auth/authConsolidation';
import crypto from 'crypto';

const router = Router();

// Mock proposals data for development
const mockProposals = [
  {
    id: 1,
    proposer: '0x742d35Cc6634C0532925a3b8D47C0c34b3AA3f5E',
    title: 'Increase Attestation Fee to 150 GTT',
    description: 'Proposal to increase the attestation fee from 100 GTT to 150 GTT to better align with network value and reduce spam attestations.',
    target: '0x0000000000000000000000000000000000000000',
    callData: '0x',
    startTime: Math.floor(Date.now() / 1000) - 3600, // Started 1 hour ago
    endTime: Math.floor(Date.now() / 1000) + 6 * 24 * 3600, // Ends in 6 days
    executionTime: Math.floor(Date.now() / 1000) + 7 * 24 * 3600, // Can execute in 7 days
    forVotes: '1250000000000000000000000', // 1.25M GTT
    againstVotes: '750000000000000000000000', // 750K GTT
    executed: false,
    cancelled: false,
    state: 'Active'
  },
  {
    id: 2,
    proposer: '0x123d35Cc6634C0532925a3b8D47C0c34b3AA3f5E',
    title: 'Update Minimum GTT for Proposals',
    description: 'Reduce the minimum GTT requirement for creating proposals from 100K to 50K GTT to encourage more community participation.',
    target: '0x0000000000000000000000000000000000000000',
    callData: '0x',
    startTime: Math.floor(Date.now() / 1000) - 2 * 24 * 3600, // Started 2 days ago
    endTime: Math.floor(Date.now() / 1000) + 5 * 24 * 3600, // Ends in 5 days
    executionTime: Math.floor(Date.now() / 1000) + 6 * 24 * 3600, // Can execute in 6 days
    forVotes: '2100000000000000000000000', // 2.1M GTT
    againstVotes: '400000000000000000000000', // 400K GTT
    executed: false,
    cancelled: false,
    state: 'Active'
  },
  {
    id: 3,
    proposer: '0x456d35Cc6634C0532925a3b8D47C0c34b3AA3f5E',
    title: 'Treasury Allocation for Marketing',
    description: 'Allocate 500K GTT from the treasury for marketing initiatives to increase platform adoption and awareness.',
    target: '0x0000000000000000000000000000000000000000',
    callData: '0x',
    startTime: Math.floor(Date.now() / 1000) - 5 * 24 * 3600, // Started 5 days ago
    endTime: Math.floor(Date.now() / 1000) - 1 * 24 * 3600, // Ended 1 day ago
    executionTime: Math.floor(Date.now() / 1000) + 1 * 24 * 3600, // Can execute in 1 day
    forVotes: '3200000000000000000000000', // 3.2M GTT
    againstVotes: '800000000000000000000000', // 800K GTT
    executed: false,
    cancelled: false,
    state: 'Succeeded'
  }
];

const userVotes = new Map(); // Mock storage for user votes

// Get all proposals
router.get('/proposals', consolidatedAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Add user vote information to proposals
    const proposalsWithVotes = mockProposals.map(proposal => {
      const userVote = userVotes.get(`${proposal.id}-${userId}`);
      return {
        ...proposal,
        hasVoted: !!userVote,
        userVote: userVote?.support,
        userVoteWeight: userVote?.weight || '0'
      };
    });

    res.json(proposalsWithVotes);
  } catch (error) {
    console.error('Error fetching proposals:', error);
    res.status(500).json({ error: 'Failed to fetch proposals' });
  }
});

// Get specific proposal
router.get('/proposals/:id', consolidatedAuth, async (req, res) => {
  try {
    const proposalId = parseInt(req.params.id);
    const userId = req.user?.id;
    
    const proposal = mockProposals.find(p => p.id === proposalId);
    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    const userVote = userVotes.get(`${proposalId}-${userId}`);
    const proposalWithVote = {
      ...proposal,
      hasVoted: !!userVote,
      userVote: userVote?.support,
      userVoteWeight: userVote?.weight || '0'
    };

    res.json(proposalWithVote);
  } catch (error) {
    console.error('Error fetching proposal:', error);
    res.status(500).json({ error: 'Failed to fetch proposal' });
  }
});

// Create new proposal
router.post('/proposals', consolidatedAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { title, description, target, callData } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    // Mock GTT balance check - in production, check actual balance
    const mockGTTBalance = 150000; // 150K GTT
    const minRequired = 100000; // 100K GTT

    if (mockGTTBalance < minRequired) {
      return res.status(400).json({ 
        error: 'Insufficient GTT balance',
        required: minRequired,
        balance: mockGTTBalance
      });
    }

    const newProposalId = Math.max(...mockProposals.map(p => p.id)) + 1;
    const startTime = Math.floor(Date.now() / 1000);
    const endTime = startTime + 7 * 24 * 3600; // 7 days
    const executionTime = endTime + 1 * 24 * 3600; // 1 day delay

    const newProposal = {
      id: newProposalId,
      proposer: `0x${userId.slice(-40)}`, // Mock address from user ID
      title: title.trim(),
      description: description.trim(),
      target: target || '0x0000000000000000000000000000000000000000',
      callData: callData || '0x',
      startTime,
      endTime,
      executionTime,
      forVotes: '0',
      againstVotes: '0',
      executed: false,
      cancelled: false,
      state: 'Active'
    };

    mockProposals.push(newProposal);

    res.status(201).json({
      success: true,
      proposalId: newProposalId,
      proposal: newProposal
    });
  } catch (error) {
    console.error('Error creating proposal:', error);
    res.status(500).json({ error: 'Failed to create proposal' });
  }
});

// Vote on proposal
router.post('/proposals/:id/vote', consolidatedAuth, async (req, res) => {
  try {
    const proposalId = parseInt(req.params.id);
    const userId = req.user?.id;
    const { support } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (typeof support !== 'boolean') {
      return res.status(400).json({ error: 'Support must be true or false' });
    }

    const proposal = mockProposals.find(p => p.id === proposalId);
    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    if (proposal.state !== 'Active') {
      return res.status(400).json({ error: 'Proposal is not active' });
    }

    const voteKey = `${proposalId}-${userId}`;
    const existingVote = userVotes.get(voteKey);

    if (existingVote) {
      return res.status(400).json({ error: 'Already voted on this proposal' });
    }

    // Mock GTT balance for voting power - in production, get from contract
    const mockVotingPower = '25000000000000000000000'; // 25K GTT

    if (mockVotingPower === '0') {
      return res.status(400).json({ error: 'No voting power' });
    }

    // Record the vote
    userVotes.set(voteKey, {
      support,
      weight: mockVotingPower,
      timestamp: Date.now()
    });

    // Update proposal vote counts
    if (support) {
      const currentFor = BigInt(proposal.forVotes);
      const additionalVotes = BigInt(mockVotingPower);
      proposal.forVotes = (currentFor + additionalVotes).toString();
    } else {
      const currentAgainst = BigInt(proposal.againstVotes);
      const additionalVotes = BigInt(mockVotingPower);
      proposal.againstVotes = (currentAgainst + additionalVotes).toString();
    }

    res.json({
      success: true,
      vote: {
        proposalId,
        support,
        weight: mockVotingPower,
        timestamp: Date.now()
      },
      proposal: {
        forVotes: proposal.forVotes,
        againstVotes: proposal.againstVotes
      }
    });
  } catch (error) {
    console.error('Error voting on proposal:', error);
    res.status(500).json({ error: 'Failed to cast vote' });
  }
});

// Get user's voting history
router.get('/votes', consolidatedAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userVoteHistory = [];
    for (const [key, vote] of userVotes.entries()) {
      if (key.endsWith(`-${userId}`)) {
        const proposalId = parseInt(key.split('-')[0]);
        const proposal = mockProposals.find(p => p.id === proposalId);
        
        if (proposal) {
          userVoteHistory.push({
            proposalId,
            proposalTitle: proposal.title,
            support: vote.support,
            weight: vote.weight,
            timestamp: vote.timestamp
          });
        }
      }
    }

    res.json(userVoteHistory);
  } catch (error) {
    console.error('Error fetching vote history:', error);
    res.status(500).json({ error: 'Failed to fetch vote history' });
  }
});

// Attest Veritas hash (for admin/DAO members)
router.post('/attest', consolidatedAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { hash, metadata } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!hash) {
      return res.status(400).json({ error: 'Hash is required' });
    }

    // Validate hash format
    if (!/^[a-fA-F0-9]{64}$/.test(hash)) {
      return res.status(400).json({ error: 'Invalid hash format' });
    }

    // Mock GTT balance check for attestation
    const mockGTTBalance = 25000;
    const minRequired = 1000;

    if (mockGTTBalance < minRequired) {
      return res.status(400).json({ 
        error: 'Insufficient GTT balance for attestation',
        required: minRequired,
        balance: mockGTTBalance
      });
    }

    // Generate attestation record
    const attestation = {
      hash,
      attester: userId,
      timestamp: new Date().toISOString(),
      metadata: metadata || {},
      txHash: `0x${crypto.randomBytes(32).toString('hex')}`, // Mock transaction hash
      blockNumber: Math.floor(Math.random() * 1000000) + 18000000, // Mock block number
      verified: true
    };

    res.json({
      success: true,
      attestation
    });
  } catch (error) {
    console.error('Error attesting hash:', error);
    res.status(500).json({ error: 'Failed to attest hash' });
  }
});

// Verify Veritas hash
router.get('/verify/:hash', async (req, res) => {
  try {
    const { hash } = req.params;

    if (!hash) {
      return res.status(400).json({ error: 'Hash is required' });
    }

    // Validate hash format
    if (!/^[a-fA-F0-9]{64}$/.test(hash)) {
      return res.status(400).json({ error: 'Invalid hash format' });
    }

    // Mock verification - in production, check smart contract
    const isVerified = Math.random() > 0.3; // 70% chance of being verified

    if (isVerified) {
      res.json({
        verified: true,
        hash,
        attester: '0x742d35Cc6634C0532925a3b8D47C0c34b3AA3f5E',
        timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        txHash: `0x${crypto.randomBytes(32).toString('hex')}`,
        blockNumber: Math.floor(Math.random() * 1000000) + 18000000
      });
    } else {
      res.json({
        verified: false,
        hash
      });
    }
  } catch (error) {
    console.error('Error verifying hash:', error);
    res.status(500).json({ error: 'Failed to verify hash' });
  }
});

export default router;