import { useEffect, useState } from "react";

export default function CitationExplorer() {
  const [citations, setCitations] = useState([]);

  useEffect(() => {
    fetch("/api/citations").then(res => res.json()).then(setCitations);
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-xl font-bold mb-4">🔍 Capsule Citation Explorer</h1>
      <ul className="space-y-3">
        {citations.map((c, i) => (
          <li key={i} className="border p-3 rounded shadow-sm bg-white text-sm">
            <strong>Capsule:</strong> {c.capsuleId}<br />
            <em>{c.citation}</em>
          </li>
        ))}
      </ul>
    </div>
  );
}
