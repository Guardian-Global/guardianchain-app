import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing required OpenAI API key: OPENAI_API_KEY");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface CapsuleData {
  id: number;
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  verificationScore?: number;
  engagement?: {
    views: number;
    shares: number;
    verifications: number;
  };
  createdAt: string;
}

export interface UserProfile {
  id: string;
  interests?: string[];
  viewHistory?: number[];
  verificationHistory?: number[];
  preferredCategories?: string[];
}

export interface RecommendationResult {
  capsuleId: number;
  score: number;
  reasoning: string;
  category: string;
  relevanceFactors: string[];
}

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
export async function generateCapsuleRecommendations(
  userProfile: UserProfile,
  availableCapsules: CapsuleData[],
  excludeViewed: boolean = true
): Promise<RecommendationResult[]> {
  try {
    // Filter out already viewed capsules if requested
    let candidateCapsules = availableCapsules;
    if (excludeViewed && userProfile.viewHistory) {
      candidateCapsules = availableCapsules.filter(
        (capsule) => !userProfile.viewHistory!.includes(capsule.id)
      );
    }

    // Limit to top candidates for API efficiency
    const topCandidates = candidateCapsules
      .sort((a, b) => (b.verificationScore || 0) - (a.verificationScore || 0))
      .slice(0, 20);

    if (topCandidates.length === 0) {
      return [];
    }

    const prompt = `You are an AI recommendation engine for GuardianChain, a truth verification platform. 
    Analyze the user profile and recommend the most relevant capsules (truth submissions).

    User Profile:
    - Interests: ${userProfile.interests?.join(", ") || "Not specified"}
    - Preferred Categories: ${
      userProfile.preferredCategories?.join(", ") || "Not specified"
    }
    - View History: ${userProfile.viewHistory?.length || 0} capsules viewed
    - Verification History: ${
      userProfile.verificationHistory?.length || 0
    } verifications made

    Available Capsules:
    ${topCandidates
      .map(
        (capsule) => `
    ID: ${capsule.id}
    Title: ${capsule.title}
    Content: ${capsule.content.slice(0, 200)}...
    Category: ${capsule.category || "Uncategorized"}
    Tags: ${capsule.tags?.join(", ") || "None"}
    Verification Score: ${capsule.verificationScore || 0}
    Engagement: ${capsule.engagement?.views || 0} views, ${
          capsule.engagement?.shares || 0
        } shares
    `
      )
      .join("\n---\n")}

    Provide recommendations in JSON format with the following structure:
    {
      "recommendations": [
        {
          "capsuleId": number,
          "score": number (0-100),
          "reasoning": "Brief explanation of why this capsule is recommended",
          "category": "Content category",
          "relevanceFactors": ["factor1", "factor2", "factor3"]
        }
      ]
    }

    Consider:
    1. Content relevance to user interests
    2. Verification score and credibility
    3. Engagement metrics
    4. Content freshness
    5. Category preferences
    6. Diversity of recommendations

    Recommend 5-8 capsules maximum, prioritizing quality over quantity.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are an expert recommendation engine that provides personalized content recommendations based on user preferences and content quality metrics.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000,
    });

    const result = JSON.parse(
      response.choices[0].message.content || '{"recommendations": []}'
    );
    return result.recommendations || [];
  } catch (error: any) {
    console.error("Error generating recommendations:", error);
    throw new Error(`Failed to generate recommendations: ${error.message}`);
  }
}

export async function analyzeCapsuleContent(capsule: CapsuleData): Promise<{
  categories: string[];
  tags: string[];
  sentiment: string;
  credibilityIndicators: string[];
  topicSummary: string;
}> {
  try {
    const prompt = `Analyze this truth capsule content for categorization and insights:

    Title: ${capsule.title}
    Content: ${capsule.content}

    Provide analysis in JSON format:
    {
      "categories": ["category1", "category2"],
      "tags": ["tag1", "tag2", "tag3"],
      "sentiment": "positive|neutral|negative",
      "credibilityIndicators": ["indicator1", "indicator2"],
      "topicSummary": "Brief summary of main topic"
    }

    Categories should be from: Technology, Politics, Environment, Health, Science, Social, Economics, Culture, Legal, Education
    Tags should be specific keywords (3-5 max)
    Credibility indicators should note factual elements, sources mentioned, etc.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are an expert content analyzer specializing in truth verification and content categorization.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 1000,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      categories: result.categories || [],
      tags: result.tags || [],
      sentiment: result.sentiment || "neutral",
      credibilityIndicators: result.credibilityIndicators || [],
      topicSummary: result.topicSummary || "",
    };
  } catch (error: any) {
    console.error("Error analyzing capsule content:", error);
    throw new Error(`Failed to analyze content: ${error.message}`);
  }
}

export async function generateUserInterestProfile(
  viewHistory: CapsuleData[],
  verificationHistory: CapsuleData[]
): Promise<{
  interests: string[];
  preferredCategories: string[];
  behaviorPattern: string;
  recommendations: string[];
}> {
  try {
    const prompt = `Analyze user behavior to generate an interest profile:

    Viewed Capsules:
    ${viewHistory
      .map((capsule) => `- ${capsule.title} (${capsule.category})`)
      .join("\n")}

    Verified Capsules:
    ${verificationHistory
      .map((capsule) => `- ${capsule.title} (${capsule.category})`)
      .join("\n")}

    Generate a user interest profile in JSON format:
    {
      "interests": ["interest1", "interest2", "interest3"],
      "preferredCategories": ["category1", "category2"],
      "behaviorPattern": "Description of user behavior pattern",
      "recommendations": ["suggestion1", "suggestion2", "suggestion3"]
    }

    Base interests on content themes, categories should be from the available categories,
    behavior pattern should describe engagement style, and recommendations should suggest content types.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are an expert user behavior analyst specializing in content consumption patterns.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
      max_tokens: 1000,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      interests: result.interests || [],
      preferredCategories: result.preferredCategories || [],
      behaviorPattern: result.behaviorPattern || "",
      recommendations: result.recommendations || [],
    };
  } catch (error: any) {
    console.error("Error generating user profile:", error);
    throw new Error(`Failed to generate user profile: ${error.message}`);
  }
}
