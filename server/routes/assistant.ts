import { Router } from "express";
import OpenAI from "openai";

const router = Router();

// Initialize OpenAI client
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// AI Assistant endpoint with OpenAI GPT-4 integration
router.post("/api/assistant", async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // If OpenAI is not configured, return a helpful response
    if (!openai) {
      return res.json({
        reply: "AI Assistant is in development mode. For full AI capabilities, please configure the OpenAI API key in your environment variables.",
        source: "fallback"
      });
    }

    // Create a system prompt for GuardianChain context
    const systemPrompt = `You are the Guardian AI Assistant for GuardianChain, a blockchain-based truth verification platform. 

Core Knowledge:
- GuardianChain enables users to create immutable "truth capsules" on blockchain
- Users earn GTT (Guardian Truth Tokens) through verified content creation
- Platform features DAO governance, community verification, and memory sovereignty
- Built on Base Network for ultra-low fee transactions
- Supports NFT minting, time-locked capsules, and decentralized storage via IPFS
- Community-driven verification through validator consensus

Key Features to Help Users With:
1. Capsule Creation - Guide users through creating their first truth capsule
2. GTT Token Economics - Explain earning mechanisms and yield systems
3. DAO Governance - Help with voting, proposals, and community participation
4. Truth Verification - Explain how community consensus validates content
5. Platform Navigation - Direct users to relevant sections and features

Tone: Professional, helpful, and knowledgeable about Web3 concepts while remaining accessible to newcomers.

Always provide actionable guidance and direct users to specific platform features when relevant.`;

    // Call OpenAI API with GPT-4o model
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content || 
      "I apologize, but I couldn't generate a response. Please try again.";

    res.json({
      reply,
      source: "openai",
      model: "gpt-4o"
    });

  } catch (error) {
    console.error("AI Assistant error:", error);
    
    // Provide a helpful fallback response
    const fallbackReply = `I encountered an issue processing your request about: "${req.body.message}". 

For immediate help:
• Visit our Documentation section for detailed guides
• Check the FAQ for common questions  
• Use the platform's built-in help tooltips
• Contact our community support channels

Is there a specific aspect of GuardianChain I can help clarify?`;

    res.json({
      reply: fallbackReply,
      source: "fallback_error",
      error: "AI service temporarily unavailable"
    });
  }
});

export default router;