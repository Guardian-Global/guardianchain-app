export default function handler(req, res) {
  const { id, vote } = req.body;
  console.log(\`Vote cast on \${id}: \${vote}\`);
  res.status(200).json({ success: true });
}
