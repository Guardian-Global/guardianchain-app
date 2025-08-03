export default function handler(req, res) {
  const { wallet } = req.body;
  const badgeId = "badge-" + wallet.slice(-6);
  res.status(200).json({ badge: badgeId });
}
