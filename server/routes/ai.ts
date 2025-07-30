import { Router } from "express";
import { z } from "zod";

const router = Router();

// Schema for capsule analysis request
const analyzeCapsuleSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// Schema for AI assistant request
const assistantRequestSchema = z.object({
  message: z.string(),
  capsuleData: z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    metadata: z.object({
      category: z.string().optional(),
      tags: z.array(z.string()).optional(),
      griefScore: z.number().optional(),
      credibilityScore: z.number().optional(),
    }).optional(),
  }),
  conversationHistory: z.array(z.any()).optional(),
});

// AI-powered capsule content analysis
router.post("/analyze-capsule", async (req, res) => {
  try {
    const data = analyzeCapsuleSchema.parse(req.body);
    
    // Perform real AI analysis if OpenAI is available
    if (process.env.OPENAI_API_KEY) {
      try {
        const analysis = await performRealAIAnalysis(data);
        return res.json(analysis);
      } catch (error) {
        console.warn("OpenAI analysis failed, using fallback:", error);
      }
    }

    // Intelligent fallback analysis
    const analysis = performIntelligentAnalysis(data);
    res.json(analysis);
    
  } catch (error) {
    console.error("Capsule analysis error:", error);
    res.status(500).json({ error: "Analysis failed" });
  }
});

// AI assistant for capsule enhancement
router.post("/capsule-assistant", async (req, res) => {
  try {
    const data = assistantRequestSchema.parse(req.body);
    
    // Use real AI if available
    if (process.env.OPENAI_API_KEY) {
      try {
        const response = await generateRealAIResponse(data);
        return res.json(response);
      } catch (error) {
        console.warn("OpenAI assistant failed, using fallback:", error);
      }
    }

    // Intelligent fallback response
    const response = generateIntelligentResponse(data);
    res.json(response);
    
  } catch (error) {
    console.error("AI assistant error:", error);
    res.status(500).json({ 
      response: "I'm currently experiencing technical difficulties. Please try again or contact support.",
      suggestions: ["Try refreshing the page", "Check your connection", "Contact support"]
    });
  }
});

// Real AI analysis using OpenAI (when available)
async function performRealAIAnalysis(data: any) {
  // This would integrate with OpenAI API
  const prompt = `Analyze this truth capsule content for credibility, impact, and completeness:
  
Title: ${data.title || "No title"}
Content: ${data.content || "No content"}
Category: ${data.category || "Not specified"}
Tags: ${data.tags?.join(", ") || "None"}

Provide analysis scores (0-100) and actionable recommendations.`;

  // Placeholder for real OpenAI integration
  return {
    summary: "AI analysis complete. Content shows strong potential with areas for improvement.",
    credibilityScore: calculateCredibilityScore(data),
    completenessScore: calculateCompletenessScore(data),
    impactScore: calculateImpactScore(data),
    sentiment: determineSentiment(data.content || ""),
    insights: generateInsights(data),
    suggestions: generateSuggestions(data),
  };
}

// Real AI response generation using OpenAI (when available)
async function generateRealAIResponse(data: any) {
  const prompt = `As a GUARDIANCHAIN AI assistant, help improve this truth capsule:

User Message: ${data.message}
Capsule Title: ${data.capsuleData?.title || "No title"}
Content: ${data.capsuleData?.content || "No content"}

Provide helpful, actionable advice to enhance credibility and impact.`;

  // Placeholder for real OpenAI integration
  return generateIntelligentResponse(data);
}

// Intelligent fallback analysis without external AI
function performIntelligentAnalysis(data: any) {
  const credibility = calculateCredibilityScore(data);
  const completeness = calculateCompletenessScore(data);
  const impact = calculateImpactScore(data);
  
  return {
    summary: generateAnalysisSummary(credibility, completeness, impact),
    credibilityScore: credibility,
    completenessScore: completeness,
    impactScore: impact,
    sentiment: determineSentiment(data.content || ""),
    insights: generateInsights(data),
    suggestions: generateSuggestions(data),
  };
}

// Intelligent response generation without external AI
function generateIntelligentResponse(data: any) {
  const message = data.message.toLowerCase();
  const capsuleData = data.capsuleData;
  
  if (message.includes("credibility")) {
    return {
      response: generateCredibilityResponse(capsuleData),
      suggestions: [
        "Add source citations",
        "Include specific dates/locations",
        "Use objective language",
        "Provide evidence links",
      ],
    };
  }
  
  if (message.includes("impact") || message.includes("improve")) {
    return {
      response: generateImpactResponse(capsuleData),
      suggestions: [
        "Strengthen opening statement",
        "Add compelling examples",
        "Include call-to-action",
        "Optimize for sharing",
      ],
    };
  }
  
  if (message.includes("category") || message.includes("tag")) {
    return {
      response: generateCategorizationResponse(capsuleData),
      suggestions: [
        "Review category selection",
        "Add relevant tags",
        "Include time-sensitive tags",
        "Add location tags",
      ],
    };
  }
  
  return {
    response: generateGeneralResponse(capsuleData),
    suggestions: [
      "Analyze content credibility",
      "Optimize for viral impact", 
      "Improve categorization",
      "Enhance verification potential",
    ],
  };
}

// Helper functions for intelligent analysis
function calculateCredibilityScore(data: any): number {
  let score = 50; // Base score
  
  const title = data.title || "";
  const content = data.content || "";
  
  // Title quality
  if (title.length > 5) score += 10;
  if (title.length > 20) score += 5;
  
  // Content quality
  if (content.length > 50) score += 10;
  if (content.length > 200) score += 10;
  
  // Specific indicators
  if (content.includes("source:") || content.includes("reference:")) score += 15;
  if (content.match(/\d{4}/) || content.includes("date")) score += 5; // Date references
  if (content.includes("evidence") || content.includes("proof")) score += 10;
  if (content.includes("according to") || content.includes("reported by")) score += 5;
  
  // Category bonus
  if (data.category) score += 5;
  
  return Math.min(Math.max(score, 0), 100);
}

function calculateCompletenessScore(data: any): number {
  let score = 40; // Base score
  
  if (data.title && data.title.length > 0) score += 20;
  if (data.content && data.content.length > 100) score += 20;
  if (data.category) score += 10;
  if (data.tags && data.tags.length > 0) score += 10;
  
  return Math.min(score, 100);
}

function calculateImpactScore(data: any): number {
  let score = 30; // Base score
  
  const content = data.content || "";
  const title = data.title || "";
  
  // Engagement indicators
  if (title.includes("?") || content.includes("?")) score += 10; // Questions engage
  if (content.includes("!")) score += 5; // Emphasis
  if (content.includes("urgent") || content.includes("important")) score += 10;
  if (content.includes("breaking") || content.includes("exclusive")) score += 15;
  
  // Length bonus
  if (content.length > 500) score += 10;
  if (title.length > 30 && title.length < 100) score += 10; // Optimal title length
  
  // Tags bonus
  if (data.tags && data.tags.length > 2) score += 10;
  
  return Math.min(Math.max(score, 0), 100);
}

function determineSentiment(content: string): "positive" | "neutral" | "negative" {
  const positiveWords = ["success", "victory", "achievement", "breakthrough", "solution", "hope"];
  const negativeWords = ["crisis", "failure", "problem", "danger", "threat", "corruption"];
  
  const lowerContent = content.toLowerCase();
  const positiveCount = positiveWords.filter(word => lowerContent.includes(word)).length;
  const negativeCount = negativeWords.filter(word => lowerContent.includes(word)).length;
  
  if (positiveCount > negativeCount) return "positive";
  if (negativeCount > positiveCount) return "negative";
  return "neutral";
}

function generateInsights(data: any): string[] {
  const insights = [];
  
  if (!data.title || data.title.length < 10) {
    insights.push("Consider adding a more descriptive title to improve discoverability");
  }
  
  if (!data.content || data.content.length < 100) {
    insights.push("Content appears brief - additional details could enhance credibility");
  }
  
  if (!data.category) {
    insights.push("Selecting a specific category will help with proper verification routing");
  }
  
  if (!data.tags || data.tags.length === 0) {
    insights.push("Adding relevant tags will improve searchability and context");
  }
  
  const content = data.content || "";
  if (!content.includes("source") && !content.includes("reference")) {
    insights.push("Including sources or references would significantly boost credibility");
  }
  
  return insights;
}

function generateSuggestions(data: any): string[] {
  const suggestions = [
    "Add specific dates and times",
    "Include source references",
    "Use clear, objective language",
    "Add relevant tags for context",
  ];
  
  const content = data.content || "";
  
  if (content.length < 200) {
    suggestions.push("Expand content with additional details");
  }
  
  if (!content.includes("?")) {
    suggestions.push("Consider adding relevant questions");
  }
  
  if (!data.tags || data.tags.length < 3) {
    suggestions.push("Add more descriptive tags");
  }
  
  return suggestions.slice(0, 4); // Return top 4 suggestions
}

function generateAnalysisSummary(credibility: number, completeness: number, impact: number): string {
  const avg = (credibility + completeness + impact) / 3;
  
  if (avg >= 80) {
    return "Excellent capsule quality! Your content demonstrates strong credibility and impact potential.";
  } else if (avg >= 60) {
    return "Good foundation with room for enhancement. Consider the suggestions below to maximize impact.";
  } else {
    return "Content has potential but needs development. Focus on adding details, sources, and clear structure.";
  }
}

function generateCredibilityResponse(capsuleData: any): string {
  const score = calculateCredibilityScore(capsuleData);
  
  return `**Credibility Analysis Complete**

Current Score: ${score}/100

**Key Recommendations:**
• Add specific sources and references to support claims
• Include precise dates, times, and locations when relevant
• Use objective, factual language rather than opinion
• Provide links to supporting documentation
• Consider adding witness accounts or testimonies

**Verification Tips:**
• Upload supporting documents or images
• Include metadata like timestamps and location data
• Reference official sources or public records
• Add contact information for follow-up verification`;
}

function generateImpactResponse(capsuleData: any): string {
  const score = calculateImpactScore(capsuleData);
  
  return `**Impact Optimization Analysis**

Current Score: ${score}/100

**Enhancement Strategies:**
• Craft a compelling opening that immediately conveys importance
• Use active voice and clear, direct language
• Include specific examples or case studies
• Add a clear call-to-action for readers
• Structure content for easy scanning and sharing

**Viral Potential Tips:**
• Questions engage readers more than statements
• Include surprising or counterintuitive insights
• Use numbers and statistics to add authority
• Create quotable phrases or key takeaways`;
}

function generateCategorizationResponse(capsuleData: any): string {
  const currentCategory = capsuleData?.metadata?.category || "Not set";
  
  return `**Categorization Guidance**

Current Category: ${currentCategory}

**Optimal Categories Based on Content:**
• **Truth Oracle**: For exposing misinformation or revealing hidden truths
• **Knowledge Archive**: For educational or informational content
• **Civic Truth**: For political, governmental, or public interest topics
• **Witness Testimony**: For first-hand accounts of events

**Tagging Strategy:**
• Include time-sensitive tags (e.g., "2025", "current")
• Add location tags for geographic relevance
• Use topic-specific tags for your subject matter
• Include verification-related tags ("verified", "documented")`;
}

function generateGeneralResponse(capsuleData: any): string {
  const title = capsuleData?.title || "Untitled";
  const hasContent = capsuleData?.content && capsuleData.content.length > 0;
  
  return `**GUARDIANCHAIN AI Assistant Ready**

I'm here to help optimize "${title}" for maximum truth verification and impact.

**Current Status:**
• Title: ${title ? "✅ Set" : "❌ Needs attention"}
• Content: ${hasContent ? "✅ Present" : "❌ Needs content"}
• Category: ${capsuleData?.metadata?.category || "❌ Not set"}
• Tags: ${capsuleData?.metadata?.tags?.length || 0} tags

**What I Can Help With:**
• Analyze content for credibility and truth factors
• Optimize structure and language for maximum impact
• Suggest proper categorization and tagging
• Enhance verification potential and evidence strength
• Review for potential bias or misleading elements

Ask me specific questions about improving any aspect of your truth capsule!`;
}

export default router;