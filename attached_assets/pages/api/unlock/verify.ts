export default function handler(req, res) {
  const { unlockTime } = req.query;
  const currentTime = Date.now();
  const isUnlocked = currentTime >= parseInt(unlockTime);
  res.status(200).json({ unlocked: isUnlocked });
}
