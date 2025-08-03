export default function handler(_, res) {
  const nodes = [
    { id: "1", data: { label: "Mother's Story" }, position: { x: 100, y: 100 } },
    { id: "2", data: { label: "Daughter's Reply" }, position: { x: 300, y: 100 } },
    { id: "3", data: { label: "Historic Memory" }, position: { x: 200, y: 250 } }
  ];

  const edges = [
    { id: "e1-2", source: "1", target: "2", label: "Lineage" },
    { id: "e1-3", source: "1", target: "3", label: "Referenced" }
  ];

  res.status(200).json({ nodes, edges });
}
