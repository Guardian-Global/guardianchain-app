export default function handler(req, res) {
  const { wallet } = req.body;
  res.status(200).json({ message: \`Badge NFT minted to \${wallet}\` });
}
