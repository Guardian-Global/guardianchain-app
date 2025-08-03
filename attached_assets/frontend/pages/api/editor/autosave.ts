export default function handler(req, res) {
  console.log("Autosaving:", req.body.content);
  res.status(200).json({ ok: true });
}
