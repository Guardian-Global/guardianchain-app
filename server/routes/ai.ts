import express from "express";
import Anthropic from "@anthropic-ai/sdk";

const router = express.Router();

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Default model constant
const DEFAULT_MODEL_STR = "claude-3-5-sonnet-20241022";

// AI Capsule Assistant endpoint
router.post("/capsule-assistant", async (req, res) => {
  try {
    const { content, title, category, type } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Content is required for AI analysis" });
    }

    const prompt = `
You are an AI assistant specialized in optimizing truth capsules for the GUARDIANCHAIN platform. 
Analyze the following capsule and provide optimization suggestions:

Title: ${title || "Untitled"}
Content: ${content}
Category: ${category || "Uncategorized"}
Type: ${type || "STANDARD"}

Please provide suggestions for:
1. Category optimization based on content
2. Relevant tags (maximum 5)
3. Appropriate access level (public, private, restricted, premium)
4. Whether authentication should be required
5. Suggested viewing cost if premium (0-1000 USD)

Respond in JSON format with a "suggestions" object containing these fields.
`;

    const response = await anthropic.messages.create({
      model: DEFAULT_MODEL_STR,
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Parse AI response
    try {
      const aiText = (response.content[0] as any).text;
      const suggestions = JSON.parse(aiText);
      res.json({ suggestions });
    } catch (parseError: any) {
      // Fallback suggestions if JSON parsing fails
      res.json({
        suggestions: {
          category: category || "General",
          tags: ["truth", "verified"],
          accessLevel: "public",
          requiresAuth: false,
          viewingCost: 0,
        },
      });
    }
  } catch (error) {
    console.error("AI assistant error:", error);
    res.status(500).json({ error: "AI assistant temporarily unavailable" });
  }
});

// Content analysis endpoint
router.post("/analyze-content", async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    const prompt = `
Analyze this content for truth verification on GUARDIANCHAIN:

"${content}"

Provide analysis including:
1. Credibility score (0-100)
2. Truth likelihood (0-100) 
3. Evidence strength (0-100)
4. Recommended verification approach
5. Potential concerns or red flags

Respond in JSON format.
`;

    const response = await anthropic.messages.create({
      model: DEFAULT_MODEL_STR,
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const analysis = JSON.parse((response.content[0] as any).text);
    res.json({ analysis });
  } catch (error: any) {
    console.error("Content analysis error:", error);
    res.status(500).json({ error: "Content analysis failed" });
  }
});

// Viral potential analyzer
router.post("/viral-potential", async (req, res) => {
  try {
    const { content, platform } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    const prompt = `
Analyze viral potential for this content on ${platform || "social media"}:

"${content}"

Provide:
1. Viral score (0-100)
2. Engagement prediction
3. Optimal posting time
4. Platform-specific recommendations
5. Hashtag suggestions

Respond in JSON format.
`;

    const response = await anthropic.messages.create({
      model: DEFAULT_MODEL_STR,
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const analysis = JSON.parse((response.content[0] as any).text);
    res.json({ analysis });
  } catch (error: any) {
    console.error("Viral analysis error:", error);
    res.status(500).json({ error: "Viral analysis failed" });
  }
});

export default router;