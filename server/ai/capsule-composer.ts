import OpenAI from "openai";

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
}) : null;

export interface CapsuleCompositionParams {
  prompt: string;
  tone: 'emotional' | 'reflective' | 'hopeful' | 'raw' | 'poetic';
  length: 'short' | 'medium' | 'long';
  emotionalIntensity: number;
  includeMetadata: boolean;
  userId?: string;
}

export interface CapsuleCompositionResult {
  generatedText: string;
  emotionalAnalysis: {
    dominantEmotion: string;
    emotionalIntensity: number;
    griefScore: number;
    truthResonance: number;
  };
  suggestedTags: string[];
  estimatedReadTime: number;
}

export async function composeCapsule(params: CapsuleCompositionParams): Promise<CapsuleCompositionResult> {
  try {
    const wordLimits = {
      short: '100-200 words',
      medium: '300-500 words', 
      long: '600-1000 words'
    };

    const toneInstructions = {
      emotional: 'Write with raw emotional honesty, vulnerability, and deep feeling',
      reflective: 'Use contemplative, thoughtful, and introspective language',
      hopeful: 'Focus on resilience, growth, and positive transformation',
      raw: 'Be unfiltered, honest, and authentically human',
      poetic: 'Use metaphor, imagery, and lyrical language'
    };

    // Generate the capsule content
    const contentResponse = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system", 
          content: `You are a master storyteller specializing in transforming personal experiences into profound truth capsules for GuardianChain's blockchain memory platform.

          Instructions:
          - Transform the user's prompt into a compelling ${wordLimits[params.length]} narrative
          - Use ${toneInstructions[params.tone]}
          - Emotional intensity level: ${params.emotionalIntensity}% (0=subtle, 100=overwhelming)
          - Create content suitable for permanent blockchain storage
          - Focus on universal human truths while honoring specific experiences
          - Write in first person when appropriate
          - Include sensory details and emotional depth`
        },
        {
          role: "user",
          content: params.prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 1500
    });

    const generatedText = contentResponse.choices[0].message.content || '';

    // Analyze the generated content
    const analysisResponse = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `Analyze this truth capsule content for emotional and thematic properties. Respond with JSON in this exact format:
          {
            "dominantEmotion": "primary emotion (happy, sad, anger, fear, grief, hope, love, neutral)",
            "emotionalIntensity": number_between_0_and_100,
            "griefScore": number_between_0_and_100_representing_grief_and_loss_themes,
            "truthResonance": number_between_0_and_100_representing_authenticity_and_universal_truth,
            "suggestedTags": ["array", "of", "relevant", "tags", "5-8 items"],
            "estimatedReadTime": number_of_minutes_to_read
          }`
        },
        {
          role: "user",
          content: `Analyze this truth capsule content: "${generatedText}"`
        }
      ],
      response_format: { type: "json_object" }
    });

    const analysis = JSON.parse(analysisResponse.choices[0].message.content || '{}');

    return {
      generatedText,
      emotionalAnalysis: {
        dominantEmotion: analysis.dominantEmotion || 'neutral',
        emotionalIntensity: analysis.emotionalIntensity || 50,
        griefScore: analysis.griefScore || 0,
        truthResonance: analysis.truthResonance || 50
      },
      suggestedTags: analysis.suggestedTags || ['memory', 'truth', 'personal'],
      estimatedReadTime: analysis.estimatedReadTime || 3
    };

  } catch (error) {
    console.error('Capsule composition failed:', error);
    throw new Error('AI composition failed');
  }
}