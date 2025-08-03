import type { Request, Response } from "express";

const REPLICATE_API_PROXY = process.env.REPLICATE_API_PROXY || "https://api.replicate.com/v1/predictions";
const REPLICATE_API_KEY = process.env.REPLICATE_API_KEY;

export interface MediaRemixRequest {
  inputUrl: string;
  prompt: string;
  modelVersion?: string;
  style?: string;
  strength?: number;
}

export interface ReplicateResponse {
  id: string;
  status: "starting" | "processing" | "succeeded" | "failed" | "canceled";
  output?: string | string[];
  error?: string;
  urls?: {
    get: string;
    cancel: string;
  };
}

/**
 * AI-powered media remixing endpoint using Replicate
 * Transforms images and media based on text prompts
 */
export async function handleMediaRemix(req: Request, res: Response) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  if (!REPLICATE_API_KEY) {
    return res.status(500).json({ 
      error: "Replicate API key not configured. Please set REPLICATE_API_KEY environment variable." 
    });
  }

  const { inputUrl, prompt, modelVersion, style, strength }: MediaRemixRequest = req.body;

  if (!inputUrl || !prompt) {
    return res.status(400).json({ 
      error: "Missing required fields: inputUrl and prompt are required" 
    });
  }

  // Validate URL format
  try {
    new URL(inputUrl);
  } catch {
    return res.status(400).json({ 
      error: "Invalid inputUrl format. Must be a valid URL." 
    });
  }

  try {
    console.log("🎨 Starting media remix with Replicate...");
    console.log("📸 Input URL:", inputUrl);
    console.log("💭 Prompt:", prompt);

    // Default to img2img model for media remixing
    const defaultModelVersion = "ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4"; // stable-diffusion img2img
    const version = modelVersion || defaultModelVersion;

    const replicatePayload = {
      version: version,
      input: {
        image: inputUrl,
        prompt: prompt,
        ...(style && { style }),
        ...(strength && { prompt_strength: strength }),
        num_inference_steps: 20,
        guidance_scale: 7.5,
        scheduler: "K_EULER_ANCESTRAL"
      }
    };

    console.log("🚀 Sending request to Replicate...");
    
    const response = await fetch(REPLICATE_API_PROXY, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${REPLICATE_API_KEY}`
      },
      body: JSON.stringify(replicatePayload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Replicate API error:", response.status, errorText);
      
      return res.status(response.status).json({ 
        error: `Replicate API error: ${response.statusText}`,
        details: errorText
      });
    }

    const result: ReplicateResponse = await response.json();
    
    console.log("✅ Replicate response received:", result.id, result.status);

    // Return the prediction ID and status
    return res.status(200).json({
      success: true,
      prediction: {
        id: result.id,
        status: result.status,
        output: result.output,
        urls: result.urls
      },
      message: result.status === "succeeded" 
        ? "Media remix completed successfully" 
        : "Media remix started - check status with prediction ID"
    });

  } catch (error) {
    console.error("💥 Media remix error:", error);
    
    return res.status(500).json({ 
      error: "Failed to process media remix",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

/**
 * Check the status of a Replicate prediction
 */
export async function handleMediaRemixStatus(req: Request, res: Response) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  if (!REPLICATE_API_KEY) {
    return res.status(500).json({ 
      error: "Replicate API key not configured" 
    });
  }

  const { predictionId } = req.params;

  if (!predictionId) {
    return res.status(400).json({ 
      error: "Missing prediction ID" 
    });
  }

  try {
    console.log("🔍 Checking prediction status:", predictionId);

    const response = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
      headers: {
        "Authorization": `Token ${REPLICATE_API_KEY}`
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `Failed to check prediction status: ${response.statusText}` 
      });
    }

    const prediction: ReplicateResponse = await response.json();
    
    console.log("📊 Prediction status:", prediction.status);

    return res.status(200).json({
      id: prediction.id,
      status: prediction.status,
      output: prediction.output,
      error: prediction.error
    });

  } catch (error) {
    console.error("❌ Status check error:", error);
    
    return res.status(500).json({ 
      error: "Failed to check prediction status",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}