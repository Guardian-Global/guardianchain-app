import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "No text provided" });

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "You are a truth capsule analyst. Summarize this text for witnesses." },
      { role: "user", content: text }
    ],
  });

  const summary = completion.choices[0].message.content;
  res.status(200).json({ summary });
}
