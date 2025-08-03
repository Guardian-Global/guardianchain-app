export default function handler(req, res) {
  res.status(200).json([
    { user: "User1", comment: "This is an amazing capsule!", date: "2025-06-01" },
    { user: "User2", comment: "I agree! A great memory.", date: "2025-06-02" }
  ]);
}
