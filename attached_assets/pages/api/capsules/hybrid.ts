import formidable from "formidable";
import fs from "fs";
export const config = { api: { bodyParser: false } };

export default function handler(req, res) {
  const form = formidable({ multiples: false });
  form.parse(req, async (_, fields, files) => {
    const { caption, type } = fields;
    const file = files.file[0];
    const savedPath = `/tmp/${file.originalFilename}`;
    fs.copyFileSync(file.filepath, savedPath);

    // Simulate DB entry
    console.log("💾 Saved hybrid capsule:", { caption, type, file: savedPath });
    res.status(200).json({ success: true });
  });
}
