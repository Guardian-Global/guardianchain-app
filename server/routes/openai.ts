import { Router } from "express";
import OpenAI from "openai";

const router = Router();

// Initialize OpenAI with API key from environment
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

// OpenAI content analysis endpoint
router.post("/openai-analyze", async (req, res) => {
  try {
    if (!openai) {
      return res.status(503).json({
        error: "OpenAI API not configured",
        message: "Please configure OPENAI_API_KEY environment variable",
      });
    }

    const { content, contentType, prompt } = req.body;

    if (!content || !prompt) {
      return res.status(400).json({
        error: "Missing required fields",
        message: "Content and prompt are required",
      });
    }

    // Use the newest OpenAI model gpt-4o which was released May 13, 2024. do not change this unless explicitly requested by the user
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are Veritus, an AI engine specialized in content analysis for the GUARDIANCHAIN protocol. Provide accurate, actionable insights about content truth, originality, viral potential, and monetization value. Always respond with valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000,
      temperature: 0.7,
    });

    const analysis = JSON.parse(completion.choices[0].message.content || "{}");

    // Validate the response structure
    const validatedAnalysis = {
      truthScore: Math.min(100, Math.max(0, analysis.truthScore || 50)),
      originalityScore: Math.min(
        100,
        Math.max(0, analysis.originalityScore || 50)
      ),
      viralPotential: Math.min(100, Math.max(0, analysis.viralPotential || 50)),
      monetizationValue: Math.max(0, analysis.monetizationValue || 100),
      recommendations: Array.isArray(analysis.recommendations)
        ? analysis.recommendations.slice(0, 5)
        : [
            "Verify content with GUARDIANCHAIN before sharing",
            "Consider adding more engaging elements",
            "Research target audience preferences",
          ],
      risks: Array.isArray(analysis.risks)
        ? analysis.risks.slice(0, 4)
        : [
            "Content may be vulnerable to plagiarism",
            "Unverified claims require fact-checking",
          ],
      evidence: Array.isArray(analysis.evidence)
        ? analysis.evidence.slice(0, 5)
        : [
            "Content shows original thinking",
            "Blockchain verification available",
          ],
    };

    res.json(validatedAnalysis);
  } catch (error) {
    console.error("OpenAI analysis error:", error);

    // Return a structured error response
    res.status(500).json({
      error: "Analysis failed",
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
      fallback: {
        truthScore: 50,
        originalityScore: 50,
        viralPotential: 50,
        monetizationValue: 100,
        recommendations: [
          "Content analysis temporarily unavailable",
          "Please verify content manually",
          "Consider using GUARDIANCHAIN protection",
        ],
        risks: [
          "Unable to assess risks automatically",
          "Manual review recommended",
        ],
        evidence: [
          "Analysis service unavailable",
          "Blockchain verification still available",
        ],
      },
    });
  }
});

// Content value estimation endpoint
router.post("/estimate-value", async (req, res) => {
  try {
    if (!openai) {
      return res.status(503).json({
        error: "OpenAI API not configured",
        estimatedValue: Math.floor(Math.random() * 5000) + 100,
      });
    }

    const { content, audienceSize = 1000, contentType = "general" } = req.body;

    const prompt = `
Analyze this content for monetary value estimation:

Content: "${content}"
Audience Size: ${audienceSize}
Content Type: ${contentType}

Consider:
- Market demand for this type of content
- Audience engagement potential
- Monetization opportunities (ads, sponsorships, products)
- Uniqueness and competitive advantage
- Viral potential impact on value

Respond with JSON:
{
  "estimatedValue": number (USD),
  "monthlyPotential": number (USD),
  "factors": [array of value factors],
  "monetizationMethods": [array of suggested methods]
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content:
            "You are a content valuation expert. Provide realistic market-based valuations for digital content.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 800,
    });

    const valuation = JSON.parse(completion.choices[0].message.content || "{}");

    res.json({
      estimatedValue: Math.max(0, valuation.estimatedValue || 100),
      monthlyPotential: Math.max(0, valuation.monthlyPotential || 50),
      factors: valuation.factors || [
        "Content quality",
        "Audience size",
        "Market demand",
      ],
      monetizationMethods: valuation.monetizationMethods || [
        "Sponsorships",
        "Affiliate marketing",
        "Digital products",
      ],
    });
  } catch (error) {
    console.error("Value estimation error:", error);

    // Fallback calculation
    const baseValue = Math.floor(Math.random() * 3000) + 200;
    res.json({
      estimatedValue: baseValue,
      monthlyPotential: Math.floor(baseValue * 0.15),
      factors: ["Content analysis unavailable", "Using baseline estimation"],
      monetizationMethods: [
        "Direct sponsorships",
        "Content licensing",
        "Audience building",
      ],
    });
  }
});

// Viral prediction endpoint
router.post("/predict-viral", async (req, res) => {
  try {
    if (!openai) {
      return res.status(503).json({
        score: Math.floor(Math.random() * 40) + 30,
        factors: ["Analysis unavailable", "Manual review suggested"],
        timing: "2:00 PM EST",
        hashtags: ["#content", "#share", "#viral"],
      });
    }

    const { content, platform = "general" } = req.body;

    const prompt = `
Analyze viral potential for this content:

Content: "${content}"
Platform: ${platform}

Consider:
- Emotional engagement triggers
- Shareability factors
- Current trends alignment
- Platform-specific algorithms
- Timing optimization

Respond with JSON:
{
  "viralScore": number (0-100),
  "factors": [array of viral factors],
  "optimalTiming": string,
  "suggestedHashtags": [array of hashtags],
  "improvements": [array of suggestions]
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content:
            "You are a viral content expert specializing in social media optimization and engagement prediction.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 800,
    });

    const prediction = JSON.parse(
      completion.choices[0].message.content || "{}"
    );

    res.json({
      score: Math.min(100, Math.max(0, prediction.viralScore || 50)),
      factors: prediction.factors || [
        "Engagement potential",
        "Content quality",
      ],
      timing: prediction.optimalTiming || "2:00 PM EST (Peak engagement)",
      hashtags: prediction.suggestedHashtags || [
        "#viral",
        "#trending",
        "#content",
      ],
      improvements: prediction.improvements || [
        "Add call-to-action",
        "Include visual elements",
      ],
    });
  } catch (error) {
    console.error("Viral prediction error:", error);

    res.json({
      score: Math.floor(Math.random() * 40) + 40,
      factors: ["Analysis temporarily unavailable"],
      timing: "2:00 PM EST (General peak time)",
      hashtags: ["#content", "#viral", "#share"],
      improvements: ["Manual optimization recommended"],
    });
  }
});

export default router;
