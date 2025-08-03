export default function handler(req, res) {
  res.status(200).json({
    offers: [
      { title: "Time Capsule #17", amount: 120 },
      { title: "Declaration: Final Oath", amount: 75 }
    ]
  });
}
