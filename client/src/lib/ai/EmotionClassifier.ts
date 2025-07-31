/**
 * Emotional AI Curation System
 * Classifies emotional content in capsules for enhanced discovery and therapeutic value
 */

export interface EmotionClassification {
  primary: EmotionLabel;
  secondary?: EmotionLabel;
  confidence: number;
  intensity: 'low' | 'medium' | 'high';
  therapeuticValue: number; // 0-100 scale
  triggers?: string[];
}

export type EmotionLabel = 
  | 'grief' 
  | 'resilience' 
  | 'anger' 
  | 'hope' 
  | 'fear' 
  | 'love' 
  | 'nostalgia' 
  | 'regret' 
  | 'peace' 
  | 'determination'
  | 'confusion'
  | 'joy'
  | 'acceptance';

/**
 * Classify emotional content using AI analysis
 */
export async function classifyEmotion(text: string): Promise<EmotionClassification> {
  try {
    // Primary API call to GuardianChain AI service
    const response = await fetch('/api/ai/emotion-classify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        text,
        includeTherapeutic: true,
        detectTriggers: true
      })
    });

    if (!response.ok) {
      throw new Error(`Emotion classification failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
    
  } catch (error) {
    console.error('AI emotion classification error:', error);
    
    // Fallback to local pattern-based classification
    return performLocalEmotionClassification(text);
  }
}

/**
 * Local fallback emotion classification using pattern matching
 */
function performLocalEmotionClassification(text: string): EmotionClassification {
  const emotionPatterns = {
    grief: [
      /lost|death|died|gone|miss|mourn|funeral|grave|cemetery/i,
      /heartbroken|devastated|shattered|empty|void/i,
      /tears|cry|weep|sob|ache/i
    ],
    resilience: [
      /overcome|survived|stronger|persevere|endure/i,
      /bounce back|rise above|triumph|prevail/i,
      /learn|grow|heal|recover|rebuild/i
    ],
    anger: [
      /furious|enraged|livid|outraged|infuriated/i,
      /hate|despise|disgusted|betrayed|violated/i,
      /unfair|injustice|corrupt|abuse|exploitation/i
    ],
    hope: [
      /hope|optimistic|bright|future|tomorrow/i,
      /believe|faith|trust|dream|aspire/i,
      /possible|chance|opportunity|potential/i
    ],
    fear: [
      /afraid|scared|terrified|anxious|worried/i,
      /panic|dread|nightmare|threat|danger/i,
      /uncertain|unknown|vulnerable|helpless/i
    ],
    love: [
      /love|adore|cherish|treasure|precious/i,
      /heart|soul|devoted|commitment|bond/i,
      /family|partner|children|beloved/i
    ],
    nostalgia: [
      /remember|memory|childhood|past|yesterday/i,
      /used to|back then|those days|long ago/i,
      /miss|reminisce|flashback|vintage|classic/i
    ],
    regret: [
      /regret|sorry|mistake|wrong|should have/i,
      /if only|wish|guilt|shame|remorse/i,
      /apologize|forgive|undo|second chance/i
    ]
  };

  let maxScore = 0;
  let primaryEmotion: EmotionLabel = 'peace';
  let secondaryEmotion: EmotionLabel | undefined;
  let matchedTriggers: string[] = [];

  // Score each emotion
  Object.entries(emotionPatterns).forEach(([emotion, patterns]) => {
    let score = 0;
    patterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        score += matches.length;
        matchedTriggers.push(...matches);
      }
    });

    if (score > maxScore) {
      secondaryEmotion = primaryEmotion !== 'peace' ? primaryEmotion : undefined;
      primaryEmotion = emotion as EmotionLabel;
      maxScore = score;
    }
  });

  // Calculate intensity based on emotional word density
  const wordCount = text.split(/\s+/).length;
  const emotionalDensity = maxScore / wordCount;
  
  let intensity: 'low' | 'medium' | 'high' = 'low';
  if (emotionalDensity > 0.1) intensity = 'high';
  else if (emotionalDensity > 0.05) intensity = 'medium';

  // Calculate therapeutic value
  const therapeuticValue = calculateTherapeuticValue(primaryEmotion, intensity, text.length);

  return {
    primary: primaryEmotion,
    secondary: secondaryEmotion,
    confidence: Math.min(0.9, maxScore * 0.2 + 0.3), // 0.3-0.9 range
    intensity,
    therapeuticValue,
    triggers: matchedTriggers.slice(0, 5) // Limit to 5 triggers
  };
}

/**
 * Calculate therapeutic value of emotional content
 */
function calculateTherapeuticValue(
  emotion: EmotionLabel, 
  intensity: 'low' | 'medium' | 'high',
  textLength: number
): number {
  const baseValues = {
    grief: 85,        // High therapeutic value for processing loss
    resilience: 90,   // Very high value for inspiring others
    anger: 60,        // Moderate value, needs careful handling
    hope: 85,         // High value for motivation
    fear: 70,         // Good value for relatability
    love: 80,         // High value for positive emotions
    nostalgia: 75,    // Good value for memory preservation
    regret: 70,       // Good value for learning
    peace: 65,        // Moderate baseline value
    determination: 85,
    confusion: 55,
    joy: 80,
    acceptance: 90
  };

  let value = baseValues[emotion] || 65;

  // Adjust for intensity
  switch (intensity) {
    case 'high': value += 10; break;
    case 'medium': value += 5; break;
    case 'low': value -= 5; break;
  }

  // Adjust for content length (longer content often more therapeutic)
  if (textLength > 1000) value += 5;
  else if (textLength < 100) value -= 10;

  return Math.max(0, Math.min(100, value));
}

/**
 * Get emotion-based recommendations for capsule curation
 */
export function getEmotionRecommendations(classification: EmotionClassification): {
  category: string;
  tags: string[];
  suggestedAudience: string;
  contentWarning?: string;
} {
  const recommendations: Record<EmotionLabel, {
    category: string;
    tags: string[];
    suggestedAudience: string;
    contentWarning?: string;
  }> = {
    grief: {
      category: 'Memory & Loss',
      tags: ['grief-support', 'memorial', 'healing', 'remembrance'],
      suggestedAudience: 'Those processing similar losses',
      contentWarning: 'Contains themes of loss and grief'
    },
    resilience: {
      category: 'Inspiration & Growth',
      tags: ['resilience', 'overcoming', 'strength', 'motivation'],
      suggestedAudience: 'Anyone facing challenges',
    },
    anger: {
      category: 'Justice & Advocacy',
      tags: ['injustice', 'advocacy', 'social-change', 'activism'],
      suggestedAudience: 'Social justice advocates',
      contentWarning: 'Contains strong emotional content'
    },
    hope: {
      category: 'Inspiration & Future',
      tags: ['hope', 'optimism', 'dreams', 'possibility'],
      suggestedAudience: 'General audience, uplifting content',
    },
    fear: {
      category: 'Vulnerability & Truth',
      tags: ['fear', 'vulnerability', 'courage', 'truth'],
      suggestedAudience: 'Those facing similar fears',
      contentWarning: 'May contain anxiety-inducing content'
    },
    love: {
      category: 'Connection & Bonds',
      tags: ['love', 'relationships', 'family', 'connection'],
      suggestedAudience: 'General audience, heartwarming content',
    },
    nostalgia: {
      category: 'Memory & Reflection',
      tags: ['nostalgia', 'memories', 'past', 'reflection'],
      suggestedAudience: 'Those who appreciate reminiscence',
    },
    regret: {
      category: 'Learning & Growth',
      tags: ['regret', 'lessons', 'growth', 'reflection'],
      suggestedAudience: 'Those seeking personal growth',
    },
    peace: {
      category: 'Serenity & Calm',
      tags: ['peace', 'calm', 'serenity', 'mindfulness'],
      suggestedAudience: 'General audience, calming content',
    },
    determination: {
      category: 'Motivation & Drive',
      tags: ['determination', 'motivation', 'goals', 'perseverance'],
      suggestedAudience: 'Those seeking motivation',
    },
    confusion: {
      category: 'Uncertainty & Questions',
      tags: ['confusion', 'uncertainty', 'questions', 'exploration'],
      suggestedAudience: 'Those navigating uncertainty',
    },
    joy: {
      category: 'Happiness & Celebration',
      tags: ['joy', 'happiness', 'celebration', 'positive'],
      suggestedAudience: 'General audience, uplifting content',
    },
    acceptance: {
      category: 'Wisdom & Understanding',
      tags: ['acceptance', 'wisdom', 'understanding', 'peace'],
      suggestedAudience: 'Those seeking wisdom and understanding',
    }
  };

  return recommendations[classification.primary] || {
    category: 'General Experience',
    tags: ['personal-story', 'life-experience'],
    suggestedAudience: 'General audience'
  };
}

/**
 * Batch classify emotions for multiple capsules
 */
export async function batchClassifyEmotions(texts: string[]): Promise<EmotionClassification[]> {
  // For efficiency, batch process up to 10 at a time
  const batchSize = 10;
  const results: EmotionClassification[] = [];
  
  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const batchPromises = batch.map(text => classifyEmotion(text));
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
  }
  
  return results;
}