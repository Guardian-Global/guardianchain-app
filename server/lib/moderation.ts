// Import fix for module compatibility
const anthropicSdk = require('@anthropic-ai/sdk');
const Anthropic = anthropicSdk.default || anthropicSdk;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Enhanced content moderation with multiple AI providers
export async function moderateCapsule(content: string): Promise<{
  isAllowed: boolean;
  reason?: string;
  severity?: number;
  flags?: string[];
}> {
  try {
    // Primary moderation with Anthropic Claude
    const claudeResult = await moderateWithClaude(content);
    
    // Fallback to OpenAI if Claude fails
    if (!claudeResult.success) {
      return await moderateWithOpenAI(content);
    }
    
    return claudeResult.result;
  } catch (error) {
    console.error('Content moderation failed:', error);
    // Conservative approach: block content if moderation fails
    return {
      isAllowed: false,
      reason: 'Content moderation system unavailable',
      severity: 5
    };
  }
}

async function moderateWithClaude(content: string): Promise<{
  success: boolean;
  result: {
    isAllowed: boolean;
    reason?: string;
    severity?: number;
    flags?: string[];
  }
}> {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return { success: false, result: { isAllowed: false } };
    }

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: `You are a content moderation AI for GuardianChain, a platform for preserving important memories and testimonies. 

Analyze the following content for:
1. Harmful content (violence, self-harm, illegal activities)
2. Harassment or bullying
3. Hate speech or discrimination
4. Adult content inappropriate for general audiences
5. Spam or obvious misinformation

Response format (JSON only):
{
  "isAllowed": boolean,
  "reason": "brief explanation if blocked",
  "severity": number 1-5 (5 = most severe),
  "flags": ["flag1", "flag2"]
}

Be lenient with personal stories, emotional content, and historical accounts. The platform is for preserving truth and memory.`,
      messages: [
        {
          role: 'user',
          content: `Please moderate this capsule content: "${content}"`
        }
      ]
    });

    const contentBlock = response.content[0];
    if (contentBlock.type !== 'text') {
      throw new Error('Unexpected response format from Claude');
    }
    const result = JSON.parse(contentBlock.text);
    return { success: true, result };
  } catch (error) {
    console.error('Claude moderation failed:', error);
    return { success: false, result: { isAllowed: false } };
  }
}

async function moderateWithOpenAI(content: string): Promise<{
  isAllowed: boolean;
  reason?: string;
  severity?: number;
  flags?: string[];
}> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return {
        isAllowed: false,
        reason: 'No moderation service available',
        severity: 5
      };
    }

    const res = await fetch("https://api.openai.com/v1/moderations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ input: content })
    });

    const json = await res.json();
    const moderation = json.results[0];

    if (moderation.flagged) {
      const flags = Object.entries(moderation.categories)
        .filter(([_, flagged]) => flagged)
        .map(([category, _]) => category);

      return {
        isAllowed: false,
        reason: `Content flagged for: ${flags.join(', ')}`,
        severity: 4,
        flags
      };
    }

    return { isAllowed: true };
  } catch (error) {
    console.error('OpenAI moderation failed:', error);
    return {
      isAllowed: false,
      reason: 'Content moderation system error',
      severity: 5
    };
  }
}

// Grief score calculation based on content analysis
export async function calculateGriefScore(content: string): Promise<number> {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      // Fallback: basic grief score based on content length and keywords
      return calculateBasicGriefScore(content);
    }

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 512,
      system: `Analyze emotional content and assign a grief score from 1-5:
1 = Neutral/positive content
2 = Mild emotional content
3 = Moderate grief/loss themes
4 = Significant emotional weight
5 = Profound grief/trauma/loss

Consider: loss, trauma, injustice, emotional weight, historical significance.
Return only a number 1-5.`,
      messages: [
        {
          role: 'user',
          content: `Analyze grief level: "${content}"`
        }
      ]
    });

    const contentBlock = response.content[0];
    if (contentBlock.type !== 'text') {
      throw new Error('Unexpected response format from Claude');
    }
    const score = parseInt(contentBlock.text.trim());
    return isNaN(score) ? 3 : Math.max(1, Math.min(5, score));
  } catch (error) {
    console.error('Grief score calculation failed:', error);
    return calculateBasicGriefScore(content);
  }
}

function calculateBasicGriefScore(content: string): number {
  const griefKeywords = [
    'loss', 'death', 'grief', 'trauma', 'pain', 'suffering', 'injustice',
    'betrayal', 'abuse', 'violence', 'war', 'tragedy', 'victim', 'hurt',
    'broken', 'destroyed', 'devastated', 'heartbroken', 'murdered', 'killed'
  ];

  const lowerContent = content.toLowerCase();
  const keywordMatches = griefKeywords.filter(keyword => 
    lowerContent.includes(keyword)
  ).length;

  // Base score calculation
  let score = 1;
  
  if (keywordMatches >= 5) score = 5;
  else if (keywordMatches >= 3) score = 4;
  else if (keywordMatches >= 2) score = 3;
  else if (keywordMatches >= 1) score = 2;
  
  // Adjust for content length (longer content may have more emotional weight)
  if (content.length > 1000 && score < 3) score++;
  
  return Math.max(1, Math.min(5, score));
}