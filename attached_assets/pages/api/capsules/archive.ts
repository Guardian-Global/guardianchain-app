export default function handler(_, res) {
  const archive = [
    {
      title: "9/11 First Responder Testimony",
      date: "2001-09-12",
      description: "Recorded memory from Ground Zero witness.",
      griefScore: 10,
      chain: "Base"
    },
    {
      title: "The Lost Childhood",
      date: "1994-06-10",
      description: "A trauma record from generational abuse survivor.",
      griefScore: 9.3,
      chain: "Polygon"
    }
  ];
  res.status(200).json(archive);
}
