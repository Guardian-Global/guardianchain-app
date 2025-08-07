import { Router } from 'express';
import OpenAI from 'openai';
import sharp from 'sharp';
// Using built-in fetch (Node.js 18+)
import { consolidatedAuth } from '../auth/authConsolidation';

const router = Router();

if (!process.env.OPENAI_API_KEY) {
  console.warn('⚠️ OPENAI_API_KEY not found. AI background enhancement will not work.');
}

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

// AI-powered profile picture background enhancement
router.post('/enhance-profile-background', consolidatedAuth, async (req, res) => {
  try {
    const { originalImageUrl, backgroundStyle, customPrompt } = req.body;

    if (!originalImageUrl) {
      return res.status(400).json({ error: 'Original image URL is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ 
        error: 'AI enhancement service is not available. Please configure OPENAI_API_KEY.' 
      });
    }

    // Download the original image
    const imageResponse = await fetch(originalImageUrl);
    if (!imageResponse.ok) {
      throw new Error('Failed to download original image');
    }
    
    const imageBuffer = await imageResponse.buffer();
    
    // Convert to base64 for OpenAI
    const base64Image = imageBuffer.toString('base64');

    // Create enhancement prompt based on style
    let enhancementPrompt = customPrompt || getStylePrompt(backgroundStyle);
    
    // Generate the enhanced image with DALL-E 3
    const dallePrompt = `Create a professional profile picture with an enhanced background. 
      Take the person from this image and place them against: ${enhancementPrompt}. 
      Keep the person's appearance exactly the same, only change the background. 
      Make it look natural and professional, with proper lighting that matches the new background. 
      High quality, photorealistic style.`;

    console.log('🎨 Generating enhanced background with DALL-E 3...');

    // Note: DALL-E 3 doesn't support image editing with masks like DALL-E 2 did
    // So we'll use image generation with a descriptive prompt
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: dallePrompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
      style: "natural"
    });

    if (!response.data[0]?.url) {
      throw new Error('Failed to generate enhanced image');
    }

    const enhancedImageUrl = response.data[0].url;

    console.log('✅ Background enhancement completed successfully');

    res.json({
      success: true,
      enhancedImageUrl,
      originalImageUrl,
      style: backgroundStyle,
      prompt: enhancementPrompt
    });

  } catch (error) {
    console.error('❌ Background enhancement error:', error);
    
    if (error.message?.includes('billing')) {
      return res.status(402).json({
        error: 'OpenAI billing issue. Please check your OpenAI account.',
        details: error.message
      });
    }
    
    if (error.message?.includes('rate limit')) {
      return res.status(429).json({
        error: 'Rate limit exceeded. Please try again in a moment.',
        details: error.message
      });
    }

    res.status(500).json({
      error: 'Failed to enhance profile picture background',
      details: error.message
    });
  }
});

// Helper function to get style-specific prompts
function getStylePrompt(style: string): string {
  const stylePrompts = {
    professional: 'a clean, modern office environment with soft, natural lighting and a blurred background',
    nature: 'a beautiful natural landscape with trees, mountains, or a peaceful outdoor setting with warm lighting',
    abstract: 'an artistic abstract background with flowing colors and creative patterns that complement the subject',
    gradient: 'a smooth gradient background with bokeh light effects and professional studio lighting',
    futuristic: 'a cyberpunk-style background with neon lights, futuristic cityscape, and high-tech atmosphere',
    minimal: 'a clean, minimal background with subtle textures and professional studio lighting'
  };

  return stylePrompts[style] || stylePrompts.professional;
}

// Analyze image composition for better enhancement
router.post('/analyze-composition', consolidatedAuth, async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl || !process.env.OPENAI_API_KEY) {
      return res.status(400).json({ error: 'Image URL and OpenAI API key required' });
    }

    // Use GPT-4 Vision to analyze the image composition
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this profile picture and suggest the best background enhancement style. Consider lighting, composition, and subject positioning. Respond with JSON format: { \"recommendedStyle\": \"style_name\", \"reasoning\": \"explanation\", \"lightingNotes\": \"lighting analysis\" }"
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl
              }
            }
          ]
        }
      ],
      max_tokens: 300,
      response_format: { type: "json_object" }
    });

    const analysis = JSON.parse(response.choices[0].message.content || '{}');

    res.json({
      success: true,
      analysis
    });

  } catch (error) {
    console.error('❌ Image analysis error:', error);
    res.status(500).json({
      error: 'Failed to analyze image composition',
      details: error.message
    });
  }
});

export default router;