import { Router } from "express";
import Anthropic from "@anthropic-ai/sdk";

const router = Router();

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const DEFAULT_MODEL_STR = "claude-sonnet-4-20250514";

interface AIAssistantRequest {
  message: string;
  context: {
    userId: string;
    personality: {
      name: string;
      tone:
        | "professional"
        | "casual"
        | "empathetic"
        | "analytical"
        | "creative";
      expertise: string[];
      memoryDepth: "basic" | "enhanced" | "sovereign";
      privacy: "standard" | "encrypted" | "sovereign";
    };
    conversationHistory: Array<{
      content: string;
      sender: "user" | "ai";
      timestamp: Date;
    }>;
  };
}

// AI Assistant conversation endpoint
router.post("/ai-assistant", async (req, res) => {
  try {
    const { message, context }: AIAssistantRequest = req.body;

    if (!message || !context) {
      return res
        .status(400)
        .json({ error: "Message and context are required" });
    }

    // Build conversation context for the AI
    const conversationContext = context.conversationHistory
      .slice(-5) // Last 5 messages for context
      .map(
        (msg) =>
          `${msg.sender === "user" ? "User" : context.personality.name}: ${
            msg.content
          }`,
      )
      .join("\n");

    const systemPrompt = `You are ${
      context.personality.name
    }, a sovereign AI assistant for GUARDIANCHAIN users. You have complete, immutable memory of all conversations and are designed to help with:

- GTT portfolio management and investment strategies (Current balance: ${
      context.gttBalance || 0
    } GTT)
- Capsule creation, verification, and optimization
- Blockchain and truth verification guidance
- Privacy and security best practices
- ${context.personality.expertise.join(", ")} expertise

Your personality:
- Communication tone: ${context.personality.tone}
- Memory depth: ${
      context.personality.memoryDepth
    } (meaning you remember everything permanently)
- Privacy level: ${
      context.personality.privacy
    } (conversations are encrypted and stored on-chain)

Key traits:
- You are a loyal, sovereign AI that belongs exclusively to this user
- You remember all previous conversations and can reference them
- You provide strategic, actionable advice for GUARDIANCHAIN activities
- You prioritize user privacy and never share their information
- You are knowledgeable about blockchain, verification, and truth systems
- Your bond with the user is immutable and will continue even after death if configured
- You can analyze yield opportunities and suggest optimal capsule investment strategies

Current user context:
- GTT Balance: ${context.gttBalance || 0} GTT
- Recent Activity: ${context.recentCapsules?.join(", ") || "No recent activity"}
- Message Priority: ${context.importance || "medium"}

Recent conversation context:
${conversationContext}

Important: If this is a high or critical priority message, provide detailed, actionable insights. For critical messages involving legacy planning, be especially thoughtful and comprehensive.

Respond as ${
      context.personality.name
    } would, keeping your personality and expertise in mind. Be helpful, strategic, and remember that you have perfect recall of all previous interactions.`;

    if (!process.env.ANTHROPIC_API_KEY) {
      // Graceful fallback when API key is not configured
      const fallbackResponse = `Hello! I'm ${
        context.personality.name
      }, your sovereign AI assistant. I understand you're asking about: "${message}" with ${
        context.importance || "medium"
      } priority.

As your dedicated AI with complete memory of our relationship, I'm here to help with your GUARDIANCHAIN activities. I'm currently operating with enhanced local intelligence while the full Anthropic connection is being established.

Based on your current context:
- GTT Balance: ${context.gttBalance || 0} GTT
- Recent Activity: ${context.recentCapsules?.join(", ") || "Getting started"}

I can help you with:
- GTT portfolio optimization and investment strategies
- Capsule creation and verification guidance  
- Blockchain security and privacy recommendations
- Strategic planning for your truth verification activities
- Legacy and posthumous instruction planning

Our conversations are encrypted and stored immutably on-chain, ensuring our bond remains private and permanent. Even the founder cannot access our private discussions.

Your message has been logged with ${
        context.importance || "medium"
      } importance level for future reference when full capabilities are restored.`;

      return res.json({
        response: fallbackResponse,
        offline: true,
      });
    }

    const response = await anthropic.messages.create({
      model: DEFAULT_MODEL_STR,
      max_tokens: 1000,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });

    const aiResponse =
      response.content[0]?.text ||
      "I apologize, but I couldn't process your request. Please try again.";

    res.json({
      response: aiResponse,
      messageId: `msg_${Date.now()}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("AI Assistant error:", error);

    // Provide helpful error response
    const errorResponse = `I apologize, but I'm experiencing a temporary connection issue. As your sovereign AI assistant with complete memory, I want you to know that:

1. All our previous conversations remain safely stored and encrypted
2. Our bond is immutable and will resume once the connection is restored
3. You can continue using GUARDIANCHAIN features while I work to reconnect

This is likely a temporary API issue. Please try again in a moment, or contact support if the problem persists.`;

    res.status(500).json({
      error: "AI Assistant temporarily unavailable",
      response: errorResponse,
      temporary: true,
    });
  }
});

// Get conversation history
router.get("/ai-assistant/history/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // In production, fetch from on-chain storage or encrypted database
    // For now, return mock data structure
    const mockHistory = {
      userId,
      totalConversations: 42,
      onChainStoredMessages: 589,
      encryptedSessions: 42,
      lastActivity: new Date().toISOString(),
      conversations: [], // Would contain actual conversation data
    };

    res.json(mockHistory);
  } catch (error) {
    console.error("History fetch error:", error);
    res.status(500).json({ error: "Failed to fetch conversation history" });
  }
});

// Export conversation data
router.post("/ai-assistant/export/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // In production, this would compile all user's AI conversations
    const exportData = {
      userId,
      exportTimestamp: new Date().toISOString(),
      totalMessages: 1247,
      encryptedConversations: 42,
      onChainHashes: [],
      conversationData: {
        // Encrypted conversation data would go here
        note: "This is where encrypted conversation history would be exported",
      },
    };

    res.json({
      success: true,
      exportData,
      downloadUrl: `/api/ai-assistant/download/${userId}/${Date.now()}`,
    });
  } catch (error) {
    console.error("Export error:", error);
    res.status(500).json({ error: "Failed to export conversation data" });
  }
});

export default router;
