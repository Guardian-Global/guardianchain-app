export default function handler(_, res) {
  const media = [
    { name: "voice_20250801.webm", cid: "bafy...xyz", status: "🔐 Encrypted" },
    { name: "grief_photo.jpg", cid: "bafy...abc", status: "🔐 Encrypted" }
  ];
  res.status(200).json(media);
}
