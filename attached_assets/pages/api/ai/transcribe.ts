import formidable from "formidable";
import fs from "fs";
import { OpenAI } from "openai";
export const config = { api: { bodyParser: false } };

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  const form = formidable({});
  form.parse(req, async (_, fields, files) => {
    const file = files.audio[0];
    const stream = fs.createReadStream(file.filepath);
    const response = await openai.audio.transcriptions.create({
      file: stream,
      model: "whisper-1"
    });
    res.status(200).json({ text: response.text });
  });
}
