// Memory recall training data and pattern recognition utilities

export interface MemoryExample {
  prompt: string;
  category: string;
  summary: string;
  emotionalMarkers?: string[];
  timeFrame?: string;
  verificationLevel?: 'verified' | 'pending' | 'disputed';
}

export const memoryTrainingData: MemoryExample[] = [
  {
    prompt: "That beach trip in Miami with my daughter in 2022",
    category: "family",
    summary: "You and your daughter spent a week in Miami during summer 2022. You built sandcastles, took sunset walks on South Beach, and captured a heartfelt moment near the pier that became one of your most replayed capsules.",
    emotionalMarkers: ["joy", "connection", "love", "nostalgia"],
    timeFrame: "2022-07",
    verificationLevel: "verified"
  },
  {
    prompt: "My graduation ceremony at Texas State University",
    category: "milestone", 
    summary: "You graduated from Texas State University in 2017. Your family was present. The keynote speaker was Dr. Linda Navarro. You wore a crimson stole and the memory was encapsulated with a slow-motion video of you tossing your cap.",
    emotionalMarkers: ["achievement", "pride", "celebration", "accomplishment"],
    timeFrame: "2017-05",
    verificationLevel: "verified"
  },
  {
    prompt: "That last voicemail my grandma left",
    category: "grief",
    summary: "Your grandmother's last voicemail was recorded in 2019. She talked about being proud of you, and it ended with 'always remember who you are.' The capsule includes audio analysis and transcription, and is often recalled during memorial dates.",
    emotionalMarkers: ["grief", "love", "loss", "wisdom", "memory"],
    timeFrame: "2019-11",
    verificationLevel: "verified"
  },
  {
    prompt: "When I proposed on the rooftop in Dallas",
    category: "love",
    summary: "You proposed to your partner on a downtown Dallas rooftop during golden hour in April 2021. The capsule includes panoramic photos and a shaky but heartfelt video of the moment you went down on one knee.",
    emotionalMarkers: ["love", "commitment", "nervousness", "joy", "romance"],
    timeFrame: "2021-04",
    verificationLevel: "verified"
  },
  {
    prompt: "That fight with my brother in the garage",
    category: "conflict",
    summary: "You and your brother had an emotional confrontation in your parents' garage in 2020. The conversation was recorded and later sealed in a grief-labeled capsule for private reflection.",
    emotionalMarkers: ["anger", "frustration", "family tension", "resolution"],
    timeFrame: "2020-09",
    verificationLevel: "pending"
  }
];

export function categorizeMemoryPrompt(prompt: string): string {
  const lowercasePrompt = prompt.toLowerCase();
  
  // Family keywords
  if (lowercasePrompt.includes('family') || lowercasePrompt.includes('daughter') || 
      lowercasePrompt.includes('son') || lowercasePrompt.includes('mom') || 
      lowercasePrompt.includes('dad') || lowercasePrompt.includes('parent')) {
    return 'family';
  }
  
  // Milestone keywords
  if (lowercasePrompt.includes('graduation') || lowercasePrompt.includes('wedding') || 
      lowercasePrompt.includes('birth') || lowercasePrompt.includes('achievement')) {
    return 'milestone';
  }
  
  // Grief keywords
  if (lowercasePrompt.includes('death') || lowercasePrompt.includes('funeral') || 
      lowercasePrompt.includes('grandma') || lowercasePrompt.includes('grandpa') || 
      lowercasePrompt.includes('goodbye') || lowercasePrompt.includes('last')) {
    return 'grief';
  }
  
  // Love keywords
  if (lowercasePrompt.includes('proposal') || lowercasePrompt.includes('wedding') || 
      lowercasePrompt.includes('anniversary') || lowercasePrompt.includes('valentine')) {
    return 'love';
  }
  
  // Conflict keywords
  if (lowercasePrompt.includes('fight') || lowercasePrompt.includes('argument') || 
      lowercasePrompt.includes('conflict') || lowercasePrompt.includes('disagreement')) {
    return 'conflict';
  }
  
  // Travel keywords
  if (lowercasePrompt.includes('trip') || lowercasePrompt.includes('vacation') || 
      lowercasePrompt.includes('travel') || lowercasePrompt.includes('beach') || 
      lowercasePrompt.includes('visit')) {
    return 'travel';
  }
  
  return 'general';
}

export function getEmotionalMarkers(category: string): string[] {
  const emotionalMappings = {
    family: ['love', 'connection', 'warmth', 'bonding', 'heritage'],
    milestone: ['achievement', 'pride', 'accomplishment', 'celebration', 'progress'],
    grief: ['loss', 'sadness', 'remembrance', 'healing', 'acceptance'],
    love: ['romance', 'commitment', 'passion', 'devotion', 'intimacy'],
    conflict: ['tension', 'resolution', 'understanding', 'growth', 'reconciliation'],
    travel: ['adventure', 'discovery', 'freedom', 'exploration', 'wonder'],
    general: ['reflection', 'contemplation', 'awareness', 'insight']
  };
  
  return emotionalMappings[category] || emotionalMappings.general;
}