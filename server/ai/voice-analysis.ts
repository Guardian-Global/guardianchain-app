import OpenAI from "openai";
import formidable from "formidable";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export interface VoiceAnalysisResult {
  transcription: string;
  emotionalAnalysis: {
    primary: string;
    confidence: number;
    griefScore: number;
  };
}

export async function analyzeVoiceFile(audioBuffer: Buffer): Promise<VoiceAnalysisResult> {
  try {
    // Create temporary file for OpenAI Whisper
    const tempFilePath = path.join('/tmp', `voice-${Date.now()}.webm`);
    fs.writeFileSync(tempFilePath, audioBuffer);

    // Transcribe audio using Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempFilePath),
      model: "whisper-1",
      language: "en",
    });

    // Analyze emotional content with GPT-4o
    const emotionalAnalysis = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are a grief counselor and emotional analyst. Analyze the following transcribed voice message for emotional content. Respond with JSON in this exact format:
          {
            "primary": "dominant emotion (happy, sad, anger, fear, grief, hope, love, neutral)",
            "confidence": number_between_0_and_1,
            "griefScore": number_between_0_and_100_representing_grief_intensity
          }`
        },
        {
          role: "user",
          content: `Analyze this voice transcription: "${transcription.text}"`
        }
      ],
      response_format: { type: "json_object" }
    });

    const analysis = JSON.parse(emotionalAnalysis.choices[0].message.content || '{}');

    // Clean up temp file
    fs.unlinkSync(tempFilePath);

    return {
      transcription: transcription.text,
      emotionalAnalysis: {
        primary: analysis.primary || 'neutral',
        confidence: analysis.confidence || 0,
        griefScore: analysis.griefScore || 0
      }
    };

  } catch (error) {
    console.error('Voice analysis failed:', error);
    throw new Error('Voice analysis failed');
  }
}