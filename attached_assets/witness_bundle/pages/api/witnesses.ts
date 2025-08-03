let testimonies = [];

export default function handler(req, res) {
  if (req.method === "POST") {
    const t = { message: req.body.message, time: Date.now() };
    testimonies.push(t);
    return res.status(200).json(t);
  }
  res.status(200).json(testimonies);
}
