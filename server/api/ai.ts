import type { Request, Response } from "express";
import OpenAI from "openai";

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
}) : null;

export async function accountingAnalysis(req: Request, res: Response) {
  if (!openai) {
    return res.status(503).json({ 
      error: "AI service not configured: OpenAI API key required" 
    });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a professional financial analyst providing treasury analysis for a Web3 platform. Provide actionable insights based on real market conditions."
        },
        {
          role: "user",
          content: "Analyze the current treasury position and provide strategic recommendations for GTT token economics and yield distribution optimization."
        }
      ],
      max_tokens: 1000
    });

    const analysis = completion.choices[0].message.content;
    res.json({ analysis });
  } catch (error) {
    console.error('AI accounting analysis error:', error);
    res.status(500).json({ 
      error: "AI analysis failed: " + (error as Error).message 
    });
  }
}

export async function financialInsights(req: Request, res: Response) {
  if (!openai) {
    return res.status(503).json({ 
      error: "AI service not configured: OpenAI API key required" 
    });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a strategic financial advisor for a decentralized platform. Focus on practical recommendations for growth, risk management, and tokenomics optimization."
        },
        {
          role: "user",
          content: "Generate financial insights and strategic recommendations for platform growth and treasury management."
        }
      ],
      max_tokens: 1000
    });

    const insights = completion.choices[0].message.content;
    res.json({ insights });
  } catch (error) {
    console.error('AI financial insights error:', error);
    res.status(500).json({ 
      error: "Financial insights failed: " + (error as Error).message 
    });
  }
}